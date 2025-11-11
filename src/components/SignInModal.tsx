// /src/components/SignInModal.tsx
'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'
import TermsModal from '@/components/TermsModal'
import { signIn as naverSignIn } from 'next-auth/react'

interface SignInModalProps {
    onClose: () => void
}

const NAVER_DEMO_DISABLED =
    process.env.NEXT_PUBLIC_NAVER_DEMO_DISABLED === '1'

export default function SignInModal({ onClose }: SignInModalProps) {
    const [agreed, setAgreed] = useState(false)
    const [showTerms, setShowTerms] = useState(false)

    // Supabase OAuth (Google, Facebook)
    const handleOAuth = async (provider: 'google' | 'facebook') => {
        if (!agreed) return

        const scopes = provider === 'facebook' ? 'email' : 'openid email profile'
        const redirectTo = window.location.href
        const { error } = await supabase.auth.signInWithOAuth({
            provider,
            options: { scopes, redirectTo },
        })
        if (error) {
            console.error('OAuth 로그인 실패:', error.message)
        }
    }

    // Naver (Auth.js) — 데모 모드에서는 비활성화
    const handleNaver = async () => {
        if (!agreed || NAVER_DEMO_DISABLED) return
        await naverSignIn('naver', { callbackUrl: window.location.href })
    }

    const naverDisabled = !agreed || NAVER_DEMO_DISABLED
    const naverHoverMsg = NAVER_DEMO_DISABLED
        ? '네이버 Sign In기능은 정식 사업자 등록 후에만 활성화 가능해요, 현재는 네이버 테스터 계정만 사용할 수 있어요.'
        : ''

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
            <div
                className="relative w-[480px] h-[720px] bg-white rounded-lg p-8 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Logo & Description */}
                <div className="flex flex-col items-center mb-6">
                    <Image src="/Versetory_Logo.svg" alt="Verse’tory Logo" width={200} height={60} />
                    <p className="mt-4 text-base font-bold text-zinc-700 leading-relaxed text-center">
                        Sign in with your social account
                        <br />
                        to share comments and feedback
                    </p>
                </div>

                {/* Terms of Service Agreement */}
                <div className="flex items-start gap-2 mb-4">
                    <input
                        id="tos"
                        type="checkbox"
                        checked={agreed}
                        onChange={() => setAgreed((prev) => !prev)}
                        className="mt-0.5 w-5 h-5 border-gray-400"
                    />
                    <label htmlFor="tos" className="text-sm text-gray-500 select-none">
                        I agree to the{' '}
                        <button
                            type="button"
                            onClick={() => setShowTerms(true)}
                            className="underline text-gray-500 hover:text-black focus:outline-none"
                            title="Open Terms"
                        >
                            Terms of Service
                        </button>
                        .
                    </label>
                </div>

                {/* Divider */}
                <hr className="border-neutral-200 mt-[80px]" />

                {/* OAuth Buttons */}
                <div className="flex flex-col gap-3 mt-6">
                    <button
                        onClick={() => handleOAuth('google')}
                        disabled={!agreed}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md shadow outline outline-1 outline-neutral-200 ${agreed ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                            }`}
                    >
                        <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
                        <span className="text-base font-semibold text-gray-700">Sign in with Google</span>
                    </button>

                    <button
                        onClick={() => handleOAuth('facebook')}
                        disabled={!agreed}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md shadow outline outline-1 outline-neutral-200 ${agreed ? 'hover:bg-gray-50 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                            }`}
                    >
                        <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
                        <span className="text-base font-semibold text-gray-700">Sign in with Facebook</span>
                    </button>

                    {/* Naver — 항상 데모 플래그가 우선 */}
                    <button
                        onClick={handleNaver}
                        disabled={naverDisabled}
                        aria-disabled={naverDisabled}
                        title={naverHoverMsg}
                        className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-md shadow outline outline-1 outline-neutral-200 ${naverDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'
                            }`}
                    >
                        <Image src="/icons/naver.svg" alt="Naver" width={24} height={24} />
                        <span className="text-base font-semibold text-gray-700">Sign in with Naver</span>
                    </button>
                </div>

                {/* Divider */}
                <hr className="border-neutral-200 mt-[80px]" />

                {/* Bottom Spacer */}
                <div className="flex-1" />

                {/* Terms Modal */}
                <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
            </div>
        </div>
    )
}
