// /src/components/Comments.tsx

'use client'

import { useEffect, useState } from 'react'
import { useSession, useUser } from '@supabase/auth-helpers-react'
import { useSession as useNaverSession } from 'next-auth/react'
import { createClient } from '@supabase/supabase-js'

// Supabase 클라이언트(토큰 획득용)
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Comment = {
    id: number
    user_id: string
    content: string
    created_at: string
    users?: {
        email: string
        provider: string
    }
}

export default function Comments({ songId }: { songId: string }) {
    // Supabase 세션
    const sbSession = useSession()
    const sbUser = useUser()
    // Naver(NextAuth) 세션
    const { data: naverSession, status: naverStatus } = useNaverSession()

    const [comments, setComments] = useState<Comment[]>([])
    const [content, setContent] = useState('')
    const [loading, setLoading] = useState(false)

    const isLoggedIn = !!sbSession || naverStatus === 'authenticated'

    // 댓글 불러오기
    async function fetchComments() {
        try {
            const res = await fetch(`/api/comments?songId=${encodeURIComponent(songId)}`)
            const data = await res.json()
            setComments(Array.isArray(data) ? data : [])
        } catch (err) {
            console.error('댓글 불러오기 실패:', err)
            setComments([])
        }
    }

    useEffect(() => {
        if (songId) fetchComments()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [songId])

    // 댓글 등록
    async function handleSubmit() {
        if (!isLoggedIn) {
            alert('로그인이 필요합니다.')
            return
        }
        if (!content.trim()) return

        setLoading(true)
        try {
            // Supabase 로그인자의 경우 access_token을 Authorization 헤더로 전달
            const { data } = await supabase.auth.getSession()
            const accessToken = data.session?.access_token
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (accessToken) headers.Authorization = `Bearer ${accessToken}`

            const res = await fetch('/api/comments', {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    songId,
                    content,
                }),
            })

            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error ?? '댓글 저장 실패')
            }

            setContent('')
            await fetchComments()
        } catch (e) {
            console.error(e)
            alert('댓글 저장 중 오류가 발생했습니다.')
        } finally {
            setLoading(false)
        }
    }

    // 댓글 삭제
    async function handleDelete(id: number) {
        if (!isLoggedIn) {
            return alert('로그인이 필요합니다.')
        }

        try {
            // Supabase 로그인자는 토큰 헤더 전달
            const { data } = await supabase.auth.getSession()
            const accessToken = data.session?.access_token
            const headers: Record<string, string> = { 'Content-Type': 'application/json' }
            if (accessToken) headers.Authorization = `Bearer ${accessToken}`

            const res = await fetch('/api/comments', {
                method: 'DELETE',
                headers,
                body: JSON.stringify({ id }),
            })
            if (!res.ok) {
                const err = await res.json().catch(() => ({}))
                throw new Error(err.error ?? '댓글 삭제 실패')
            }
            await fetchComments()
        } catch (e) {
            console.error(e)
            alert('댓글 삭제 중 오류가 발생했습니다.')
        }
    }

    // 본인 댓글 여부 판단: Supabase는 user_id 비교, Naver는 email 비교
    function isOwner(c: Comment) {
        if (sbUser?.id && c.user_id === sbUser.id) return true
        const naverEmail = naverSession?.user?.email
        if (naverEmail && c.users?.email && naverEmail === c.users.email) return true
        return false
    }

    return (
        <div className="space-y-6">
            {/* 입력창 */}
            <div>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={isLoggedIn ? '댓글을 입력하세요...' : '로그인 후 댓글 작성 가능'}
                    className="w-full min-h-[80px] p-3 border rounded-md text-black"
                    disabled={!isLoggedIn || loading}
                />
                <div className="flex justify-end mt-2">
                    <button
                        onClick={handleSubmit}
                        disabled={!isLoggedIn || loading || !content.trim()}
                        className="px-4 py-2 bg-black text-white rounded-md disabled:opacity-50"
                    >
                        {loading ? '등록 중...' : '등록'}
                    </button>
                </div>
            </div>

            {/* 댓글 목록 */}
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500">아직 댓글이 없습니다.</p>
                ) : (
                    comments.map((c) => (
                        <div key={c.id} className="border rounded-md p-3 bg-white">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {c.users?.provider ? `${c.users.provider}_${c.user_id.slice(0, 5)}` : c.user_id}
                                </span>
                                <span className="text-xs text-gray-400">
                                    {new Date(c.created_at).toLocaleString('ko-KR', {
                                        timeZone: 'Asia/Seoul',
                                    })}
                                </span>
                            </div>
                            <p className="text-black mt-2 whitespace-pre-wrap">{c.content}</p>
                            {isOwner(c) && (
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="text-xs text-red-500 hover:underline mt-2"
                                >
                                    삭제
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}
