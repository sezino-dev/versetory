// /src/pages/api/auth/[...nextauth].ts
import NextAuth, { type NextAuthOptions } from 'next-auth'
import NaverProvider from 'next-auth/providers/naver'
import { createClient } from '@supabase/supabase-js'
import { v5 as uuidv5 } from 'uuid'

// 환경변수 가드
if (!process.env.AUTH_NAVER_ID || !process.env.AUTH_NAVER_SECRET) {
    throw new Error('Missing AUTH_NAVER_ID or AUTH_NAVER_SECRET')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

// Supabase 서버 클라이언트(서버 전용 키 사용 금지 주의: 클라이언트로 노출하지 말 것)
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
)

// UUID v5 네임스페이스(DNS 표준 값)
const DNS_NS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'

export const authOptions: NextAuthOptions = {
    providers: [
        NaverProvider({
            clientId: process.env.AUTH_NAVER_ID!,
            clientSecret: process.env.AUTH_NAVER_SECRET!,
            // 명시적 스코프 및 프로필 매핑(네이버는 response 내부로 내려올 수 있음)
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

    logger: {
        error(code, meta) {
            console.error('[NextAuth][ERROR]', code, meta)
        },
        warn(code) {
            console.warn('[NextAuth][WARN]', code)
        },
        debug(code, meta) {
            console.log('[NextAuth][DEBUG]', code, meta)
        },
    },

    callbacks: {
        async jwt({ token, account, profile }) {
            // 최초 로그인 시 토큰에 프로필 반영
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
            // 타입 안전을 위해 새 객체로 할당
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
        async signIn({ user, account, profile }) {
            try {
                // 네이버 공급자일 때만 처리
                if (account?.provider !== 'naver') return

                // 네이버 고유 id 확보(가장 신뢰되는 값은 providerAccountId)
                const providerAccountId = account.providerAccountId
                const uuid = uuidv5(`naver:${providerAccountId}`, DNS_NS)

                // 이메일은 user 우선, 없으면 profile에서 보완
                const r: any = (profile as any)?.response ?? profile
                const email = user?.email ?? r?.email ?? null

                // users(id uuid, email text, provider text) 저장
                const { error } = await supabaseAdmin
                    .from('users')
                    .upsert({ id: uuid, email, provider: 'naver' }, { onConflict: 'id' })

                if (error) {
                    console.error('[Naver→Supabase upsert 실패]', error.message)
                }
            } catch (e) {
                console.error('[Naver→Supabase upsert 예외]', (e as Error).message)
            }
        },
    },
}

export default NextAuth(authOptions)
