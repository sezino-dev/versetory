import Link from 'next/link'
import GeniusAutocomplete from './GeniusAutocomplete'

export default function Header() {
  return (
    <header className="w-full bg-[#828282] border-b shadow-sm py-4 px-6">
      <div className="w-full flex items-center justify-between">
        {/* 로고 */}
        <h1 className="text-xl font-bold text-black">Verse’tory</h1>

        {/* 오른쪽: 네비게이션 + 검색창 */}
        <div className="flex items-center gap-6">
          {/* 네비게이션 */}
          <nav className="flex gap-4 text-sm text-black font-medium">
            <Link href="/about" className="hover:text-gray-700">
              About Verse’tory
            </Link>
            <Link href="/feedback" className="hover:text-gray-700">
              Send Feedback
            </Link>
          </nav>

          {/* 검색창 (minimal) */}
          <div className="w-72 hidden md:block">
            <GeniusAutocomplete minimal />
          </div>
        </div>
      </div>
    </header>
  )
}
