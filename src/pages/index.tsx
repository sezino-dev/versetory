
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import GeniusAutocomplete from '@/components/GeniusAutocomplete'


export default function Home() {
  return (
    <>
      <Header />

      <main className="bg-white text-gray-800">
        {/* 타이틀 + 서브텍스트 */}
        <section className="max-w-screen-xl mx-auto px-6 py-40 text-left">
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Interpreting<br />
            English Verses in Korean
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            AI-powered cultural interpretation and translation<br />
            with smooth explanations and contextual annotations
          </p>
        </section>

        {/* 검색창 */}
        <section className="flex justify-center mb-60">
          <div className="relative w-full max-w-3xl px-6">
            <GeniusAutocomplete />
          </div>
        </section>

        {/* 구분선 (Trending 위) */}
        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-20" />

        {/* Trending */}
        <section className="max-w-screen-xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold mb-20">Trending</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="overflow-hidden transition bg-white"
              >
                <Image
                  src="/no-image.png"
                  alt="Album Cover"
                  width={400}
                  height={400}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">Title</h3>
                  <p className="text-sm text-gray-500">Artist</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 구분선 (Trending 아래) */}
        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-20" />

        {/* Verse’tory 소개 블럭 */}
        <section className="max-w-screen-xl mx-auto px-6 text-left py-40">
          <h2 className="text-4xl font-bold mb-6">Verse’tory</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Understand the meaning behind international<br />
            pop & hip-hop lyrics<br />
            with accurate translations and cultural context<br />
            powered by AI
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}
