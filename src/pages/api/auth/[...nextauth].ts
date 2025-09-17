// /src/pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import NaverProvider from 'next-auth/providers/naver'
import { createClient } from '@supabase/supabase-js'
import { v5 as uuidv5 } from 'uuid'

// env guards
if (!process.env.AUTH_NAVER_ID || !process.env.AUTH_NAVER_SECRET) {
    throw new Error('Missing AUTH_NAVER_ID or AUTH_NAVER_SECRET')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

// Supabase server client (service role key, server-only)
const admin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// UUID v5 namespace (DNS standard)
const NS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

function mergeProviders(prev: string | null | undefined, next: string) {
    const set = new Set((prev ?? '').split(',').map(s => s.trim()).filter(Boolean))
    set.add(next)
    return Array.from(set).join(',')
}

export const authOptions: NextAuthOptions = {
    providers: [
        NaverProvider({
            clientId: process.env.AUTH_NAVER_ID!,
            clientSecret: process.env.AUTH_NAVER_SECRET!,
            authorization: { params: { scope: 'name email' } },
            profile(profile) {
                const r: any = (profile as any)?.response ?? profile
                return {
                    id: String(r?.id ?? ''),
                    name: r?.name ?? r?.nickname ?? null,
                    email: r?.email ?? null,
                    image: r?.profile_image ?? null,
                }
            },
        }),
    ],

    session: { strategy: 'jwt' },
    debug: process.env.NODE_ENV !== 'production',

    callbacks: {
        async jwt({ token, account, profile }) {
            if (account && profile) {
                const r: any = (profile as any)?.response ?? profile
                token.sub = (r?.id ?? token.sub)?.toString()
                token.name = r?.name ?? r?.nickname ?? token.name
                token.email = r?.email ?? token.email
                    ; (token as any).picture = r?.profile_image ?? (token as any).picture ?? token.picture
                    ; (token as any).provider = 'naver'
            }
            return token
        },

        async session({ session, token }) {
            const prev = session.user ?? {}
            session.user = {
                ...(prev as any),
                id: (token.sub as string | undefined) ?? (prev as any).id,
                name: token.name ?? prev.name,
                email: (token.email as string | undefined) ?? prev.email,
                image: ((token as any).picture as string | undefined) ?? prev.image,
            } as typeof session.user
                ; (session as any).provider = (token as any).provider ?? 'naver'
            return session
        },
    },

    events: {
        // 네이버 로그인 성공 시 users 테이블에 Google/Facebook과 동일하게 저장
        async signIn({ user, account, profile }) {
            try {
                if (account?.provider !== 'naver') return

                const r: any = (profile as any)?.response ?? profile
                const email = user?.email ?? r?.email ?? null
                const avatar = r?.profile_image ?? null
                const providerId = account.providerAccountId
                const naverIdUuid = uuidv5(`naver:${providerId}`, NS)

                if (email) {
                    // 1) 이메일로 기존 사용자 찾기
                    const { data: existing, error: selErr } = await admin
                        .from('users')
                        .select('id, provider')
                        .eq('email', email)
                        .maybeSingle()

                    if (selErr) {
                        console.error('[users select by email failed]', selErr.message)
                        return
                    }

                    if (existing) {
                        // 2-a) 이미 있으면 provider 병합, 아바타 갱신
                        const { error: updErr } = await admin
                            .from('users')
                            .update({
                                provider: mergeProviders(existing.provider as string, 'naver'),
                                avatar_url: avatar, // 컬럼 없으면 제거
                            })
                            .eq('id', existing.id)

                        if (updErr) {
                            console.error('[users update failed]', updErr.message)
                        }
                        return
                    }

                    // 2-b) 없으면 새로 insert (새 UUID로)
                    const { error: insErr } = await admin.from('users').insert({
                        id: naverIdUuid,
                        email,
                        provider: 'naver',
                        avatar_url: avatar, // 컬럼 없으면 제거
                    })
                    if (insErr) {
                        console.error('[users insert failed]', insErr.message)
                    }
                } else {
                    // 이메일을 못 받는 경우에도 최소한 id/provider만 기록
                    const { error: insNoEmail } = await admin
                        .from('users')
                        .upsert(
                            { id: naverIdUuid, email: null, provider: 'naver', avatar_url: avatar },
                            { onConflict: 'id' }
                        )
                    if (insNoEmail) {
                        console.error('[users upsert(no email) failed]', insNoEmail.message)
                    }
                }
            } catch (e) {
                console.error('[Naver→Supabase persist error]', (e as Error).message)
            }
        },
    },
}

export default NextAuth(authOptions)
