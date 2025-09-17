// /src/components/Header.tsx
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession as useSupabaseSession, useUser } from '@supabase/auth-helpers-react'
import { useSession as useNaverSession, signOut as naverSignOut } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClient'
import GeniusAutocomplete from './GeniusAutocomplete'
import SignInModal from './SignInModal'
import { useRouter } from 'next/router'

export default function Header() {
    const sbSession = useSupabaseSession()
    const sbUser = useUser()
    const { data: naverSession, status: naverStatus } = useNaverSession()
    const router = useRouter()

    const [showModal, setShowModal] = useState(false)

    // Supabase 로그인 이벤트 리스너
    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_IN' && session?.user) {
                setShowModal(false)
            }
        })
        return () => {
            authListener?.subscription.unsubscribe()
        }
    }, [])

    // Naver(NextAuth) 로그인 후 모달 닫기
    useEffect(() => {
        if (naverStatus === 'authenticated') {
            setShowModal(false)
        }
    }, [naverStatus])

    // 현재 로그인 여부/표시값(네이버 우선, 없으면 Supabase)
    const isLoggedIn = naverStatus === 'authenticated' || !!sbSession?.user
    const displayImage =
        (naverSession?.user?.image as string | undefined) ??
        (sbUser?.user_metadata as any)?.avatar_url ??
        null
    const displayEmail =
        (naverSession?.user?.email as string | undefined) ?? sbUser?.email ?? null
    const displayName =
        (naverSession?.user?.name as string | undefined) ??
        (sbUser?.user_metadata as any)?.full_name ??
        (sbUser?.user_metadata as any)?.name ??
        null

    const handleSendFeedback = async () => {
        if (!isLoggedIn) {
            setShowModal(true)
        } else {
            router.push('/feedback')
        }
    }

    // 두 시스템 모두 로그아웃 처리
    const handleSignOut = async () => {
        await Promise.allSettled([
            supabase.auth.signOut(),
            naverSignOut({ redirect: false }),
        ])
    }

    return (
        <>
            <header className="w-full bg-[#828282] border-b shadow-sm py-4 px-6">
                <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                    {/* 로고 (클릭 시 홈으로 이동) */}
                    <a href="/" className="flex items-center">
                        <Image
                            src="/Versetory_Logo.svg"
                            alt="Verse’tory Logo"
                            width={50}
                            height={14}
                            priority
                        />
                    </a>

                    {/* 우측: 네비게이션 + 인증 + 검색 */}
                    <div className="flex items-center gap-6">
                        {/* 네비게이션 메뉴 */}
                        <nav className="flex gap-4 text-sm font-medium text-black">
                            <Link href="/about" className="hover:text-gray-700">
                                About Verse’tory
                            </Link>
                            <button
                                onClick={handleSendFeedback}
                                className="hover:text-gray-700"
                            >
                                Send Feedback
                            </button>
                        </nav>

                        {/* 로그인 상태 */}
                        {isLoggedIn ? (
                            <div className="flex items-center gap-2 text-sm text-black">
                                {displayImage && (
                                    <Image
                                        src={displayImage}
                                        alt="User Avatar"
                                        width={24}
                                        height={24}
                                        className="rounded-full"
                                    />
                                )}
                                <span>{displayEmail ?? displayName ?? ''}</span>
                                <button
                                    onClick={handleSignOut}
                                    className="ml-2 px-2 py-1 text-xs border border-black rounded hover:bg-black hover:text-white transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowModal(true)}
                                className="px-3 py-1 text-sm text-black rounded hover:text-gray-700 transition"
                            >
                                Sign In
                            </button>
                        )}

                        {/* 검색창 (md 이상에서만 표시) */}
                        <div className="w-64 hidden md:block">
                            <GeniusAutocomplete />
                        </div>
                    </div>
                </div>
            </header>

            {/* Sign In 모달 */}
            {showModal && <SignInModal onClose={() => setShowModal(false)} />}
        </>
    )
}
