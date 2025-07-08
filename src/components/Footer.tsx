import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="w-full bg-[#828282] text-[#454545] text-sm px-8 py-12">
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row justify-between items-start">
        {/* 상단 로고 */}
        <div className="mb-8">
          <Image
            src="/Versetory_Logo.svg"
            alt="Verse’tory Logo"
            width={120}
            height={40}
            className="object-contain"
          />
        </div>

        {/* 우측: 메뉴 + 저작권 */}
        <div className="mt-10 md:mt-0 text-left">
          <div className="grid grid-cols-2 gap-x-12 gap-y-4">
            <Link href="/about" className="hover:text-black transition">About Verse’tory</Link>
            <Link href="/licensing" className="hover:text-black transition">Licensing</Link>
            <Link href="/guidence" className="hover:text-black transition">Guidence</Link>
            <Link href="/developers" className="hover:text-black transition">Developers</Link>
            <Link href="/service" className="hover:text-black transition">Our Service</Link>
            <Link href="/copyright" className="hover:text-black transition">Copyright Policy</Link>
            <Link href="/privacy" className="hover:text-black transition">Privacy Policy</Link>
            <Link href="/support" className="hover:text-black transition">Support Us</Link>
          </div>

          <div className="text-xs leading-relaxed mt-6">
            © 2025 Verse’tory. All rights reserved.<br />
            For inquiries, please contact: tpwls0831@naver.com
          </div>
        </div>
      </div>
    </footer>
  )
}
