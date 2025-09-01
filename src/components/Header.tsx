'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useSession, useUser } from '@supabase/auth-helpers-react'
import { supabase } from '@/lib/supabaseClient'
import GeniusAutocomplete from './GeniusAutocomplete'
import SignInModal from './SignInModal'

export default function Header() {
  const session = useSession()
  const user = useUser()
  const [showModal, setShowModal] = useState(false)

  // Sign In 버튼 클릭 시 모달 열기
  const handleSignIn = () => {
    setShowModal(true)
  }

  // Sign Out 처리
  const handleSignOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <>
      <header className="w-full bg-[#828282] border-b shadow-sm py-4 px-6">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          {/* 로고 */}
          <h1 className="text-xl font-bold text-black">Verse’tory</h1>

          {/* 우측: 네비게이션, 인증 상태, 검색창 */}
          <div className="flex items-center gap-6">
            {/* 네비게이션 메뉴 */}
            <nav className="flex gap-4 text-sm font-medium text-black">
              <Link href="/about" className="hover:text-gray-700">
                About Verse’tory
              </Link>
              <Link href="/feedback" className="hover:text-gray-700">
                Send Feedback
              </Link>
            </nav>

            {/* 로그인 상태에 따른 버튼/정보 */}
            {session ? (
              // 로그인된 상태: 아바타, 이메일, 로그아웃 버튼 표시
              <div className="flex items-center gap-2 text-sm text-black">
                {user?.user_metadata?.avatar_url && (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="User Avatar"
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span>{user?.email}</span>
                <button
                  onClick={handleSignOut}
                  className="ml-2 px-2 py-1 text-xs border border-black rounded hover:bg-black hover:text-white transition"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              // 비로그인 상태: Sign In 버튼 표시
              <button
                onClick={handleSignIn}
                className="px-3 py-1 text-sm text-black rounded hover:text-gray-700 transition"
              >
                Sign In
              </button>
            )}

            {/* 검색창 (md 이상에서만 표시) */}
            <div className="w-48 hidden md:block">
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
