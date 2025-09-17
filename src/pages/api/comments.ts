// /src/pages/api/comments.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth/next'
import { authOptions } from './auth/[...nextauth]'

// 조회용(anon key)
const supabaseAnon = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// 수정용(service_role key) — 서버에서만 사용
const supabaseService = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// 요청자 식별: 1) Supabase access_token, 2) NextAuth 세션(email → users.id)
async function resolveIdentity(
    req: NextApiRequest,
    res: NextApiResponse
): Promise<{ id: string; email: string | null; provider: string | null } | null> {
    // 1) Authorization: Bearer <supabase_access_token>
    const auth = req.headers.authorization
    if (auth?.startsWith('Bearer ')) {
        const token = auth.slice('Bearer '.length)
        try {
            const { data, error } = await supabaseService.auth.getUser(token)
            if (!error && data.user) {
                const u = data.user
                const provider = (u.app_metadata as any)?.provider ?? null
                return { id: u.id, email: u.email ?? null, provider }
            }
        } catch {
            // 무시하고 다음 경로로 진행
        }
    }

    // 2) NextAuth 세션(네이버 등): email 기반으로 users.id 조회
    const session = await getServerSession(req, res, authOptions)
    const email = session?.user?.email ?? null
    if (email) {
        const { data: row } = await supabaseService
            .from('users')
            .select('id')
            .eq('email', email)
            .maybeSingle()
        if (row?.id) {
            return { id: row.id, email, provider: 'naver' }
        }
    }

    return null
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // ================== 댓글 조회 (GET) ==================
    if (req.method === 'GET') {
        const { songId } = req.query
        if (!songId || typeof songId !== 'string') {
            return res.status(400).json({ error: 'songId is required' })
        }

        try {
            const songIdNum = Number(songId)

            const { data, error } = await supabaseAnon
                .from('comments')
                .select(
                    `
          id,
          content,
          created_at,
          user_id,
          users (
            provider,
            email
          )
        `
                )
                .eq('song_id', songIdNum)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('댓글 불러오기 실패:', error)
                return res.status(500).json({ error: error.message })
            }

            return res.status(200).json(data || [])
        } catch (err: any) {
            console.error('댓글 조회 에러:', err)
            return res.status(500).json({ error: '댓글을 불러오는 중 오류 발생' })
        }
    }

    // ================== 댓글 작성 (POST) ==================
    if (req.method === 'POST') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
            const { songId, content } = body ?? {}

            if (!songId || !content || !String(content).trim()) {
                return res.status(400).json({ error: 'songId, content 필수' })
            }

            const identity = await resolveIdentity(req, res)
            if (!identity) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }

            const songIdNum = Number(songId)

            // 필요 시 users upsert 보정(네이버 최초 댓글 케이스 등)
            const { data: existing } = await supabaseService
                .from('users')
                .select('id')
                .eq('id', identity.id)
                .maybeSingle()

            if (!existing) {
                const { error: upErr } = await supabaseService
                    .from('users')
                    .upsert(
                        {
                            id: identity.id,
                            email: identity.email,
                            provider: identity.provider ?? 'unknown',
                        },
                        { onConflict: 'id' }
                    )
                if (upErr) {
                    console.error('유저 upsert 실패:', upErr)
                    return res.status(500).json({ error: '유저 정보 저장 중 오류 발생' })
                }
            }

            // 댓글 저장
            const { error } = await supabaseService.from('comments').insert([
                {
                    song_id: songIdNum,
                    user_id: identity.id,
                    content: String(content).trim(),
                },
            ])

            if (error) {
                console.error('댓글 저장 실패:', error)
                return res.status(500).json({ error: error.message })
            }

            return res.status(200).json({ success: true })
        } catch (err: any) {
            console.error('댓글 작성 에러:', err)
            return res.status(500).json({ error: '댓글 저장 중 오류 발생' })
        }
    }

    // ================== 댓글 삭제 (DELETE) ==================
    if (req.method === 'DELETE') {
        try {
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body
            const { id } = body ?? {}
            if (!id) {
                return res.status(400).json({ error: 'id 필수' })
            }

            const identity = await resolveIdentity(req, res)
            if (!identity) {
                return res.status(401).json({ error: 'UNAUTHORIZED' })
            }

            // 본인 댓글만 삭제
            const { error } = await supabaseService
                .from('comments')
                .delete()
                .eq('id', id)
                .eq('user_id', identity.id)

            if (error) {
                console.error('댓글 삭제 실패:', error)
                return res.status(500).json({ error: error.message })
            }

            return res.status(200).json({ success: true })
        } catch (err: any) {
            console.error('댓글 삭제 에러:', err)
            return res.status(500).json({ error: '댓글 삭제 중 오류 발생' })
        }
    }

    return res.status(405).json({ error: 'Method not allowed' })
}
