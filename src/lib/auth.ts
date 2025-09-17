// /src/lib/auth.ts
import { supabase } from './supabaseClient'

/** Kakao 로그인 (이메일 X) */
export function signInWithKakao(redirectTo?: string) {
    return supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
            scopes: 'profile_nickname profile_image',
            redirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
        },
    })
}

/** Facebook 로그인 (email) */
export function signInWithFacebook(redirectTo?: string) {
    return supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
            scopes: 'email',
            redirectTo: redirectTo ?? `${window.location.origin}/auth/callback`,
        },
    })
}

/** 로그아웃 */
export function signOut() {
    return supabase.auth.signOut()
}
