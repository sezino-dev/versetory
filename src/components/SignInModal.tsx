'use client'

import { useState } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabaseClient'

interface SignInModalProps {
  onClose: () => void
}

export default function SignInModal({ onClose }: SignInModalProps) {
  const [agreed, setAgreed] = useState(false)

  // ✅ 소셜 로그인 & users 테이블 업데이트
  const handleOAuth = async (provider: 'google' | 'facebook' | 'kakao') => {
    if (!agreed) return

    const { data, error } = await supabase.auth.signInWithOAuth({ provider })

    if (error) {
      console.error('OAuth 로그인 실패:', error.message)
      return
    }

    // ✅ 로그인 성공 후 users 테이블 업데이트
    const {
      data: { user },
      error: sessionError,
    } = await supabase.auth.getUser()

    if (sessionError) {
      console.error('세션 가져오기 실패:', sessionError.message)
      return
    }

    if (user) {
      const { error: upsertError } = await supabase.from('users').upsert(
        {
          id: user.id,
          email: user.email,
          provider: user.app_metadata?.provider || 'unknown',
          avatar_url: user.user_metadata?.avatar_url || null,
        },
        { onConflict: 'id' } // 같은 id면 업데이트
      )

      if (upsertError) {
        console.error('유저 정보 저장 실패:', upsertError.message)
      } else {
        console.log('✅ 유저 정보 저장/업데이트 완료')
      }
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="relative w-[480px] h-[720px] bg-white rounded-lg p-8 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo & Description */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/Versetory_Logo.svg"
            alt="Verse’tory Logo"
            width={200}
            height={60}
          />
          <p className="mt-4 text-base font-bold text-zinc-700 leading-relaxed text-center">
            Sign in with your social account
            <br />
            to share comments and feedback
          </p>
        </div>

        {/* Terms of Service Agreement */}
        <div className="flex items-center gap-2 mb-4">
          <input
            id="tos"
            type="checkbox"
            checked={agreed}
            onChange={() => setAgreed((prev) => !prev)}
            className="w-5 h-5 bg-zinc-500 rounded-md"
          />
          <label htmlFor="tos" className="text-sm text-slate-900/40">
            I agree to the Terms of Service.
          </label>
        </div>

        {/* Divider */}
        <hr className="border-neutral-200 mt-[80px]" />

        {/* OAuth Buttons */}
        <div className="flex flex-col gap-3 mt-6">
          <button
            onClick={() => handleOAuth('google')}
            disabled={!agreed}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-md shadow
              outline outline-1 outline-neutral-200
              ${agreed
                ? 'hover:bg-gray-50 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
              }
            `}
          >
            <Image src="/icons/google.svg" alt="Google" width={24} height={24} />
            <span className="text-base font-semibold text-gray-700">
              Sign in with Google
            </span>
          </button>

          <button
            onClick={() => handleOAuth('facebook')}
            disabled={!agreed}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-md shadow
              outline outline-1 outline-neutral-200
              ${agreed
                ? 'hover:bg-gray-50 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
              }
            `}
          >
            <Image src="/icons/facebook.svg" alt="Facebook" width={24} height={24} />
            <span className="text-base font-semibold text-gray-700">
              Sign in with Facebook
            </span>
          </button>

          <button
            onClick={() => handleOAuth('kakao')}
            disabled={!agreed}
            className={`
              flex items-center justify-center gap-2 px-4 py-2.5 rounded-md shadow
              outline outline-1 outline-neutral-200
              ${agreed
                ? 'hover:bg-gray-50 cursor-pointer'
                : 'opacity-50 cursor-not-allowed'
              }
            `}
          >
            <Image src="/icons/kakao.svg" alt="Kakao" width={24} height={24} />
            <span className="text-base font-semibold text-gray-700">
              Sign in with Kakao
            </span>
          </button>
        </div>

        {/* Divider */}
        <hr className="border-neutral-200 mt-[80px]" />

        {/* Bottom Spacer */}
        <div className="flex-1" />
      </div>
    </div>
  )
}
