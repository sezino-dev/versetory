import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import GeniusAutocomplete from '@/components/GeniusAutocomplete'

// 곡 타입 정의
type Song = {
  id: number
  title: string
  artist: string
  albumArt: string
}

// 서버 사이드에서 RapidAPI Genius 차트 상위 3곡 가져오기
export async function getServerSideProps() {
  try {
    const res = await fetch(
      'https://genius-song-lyrics1.p.rapidapi.com/chart/songs/?time_period=day&chart_genre=all&per_page=3&page=1',
      {
        headers: {
          'X-RapidAPI-Key': process.env.RAPIDAPI_KEY!,
          'X-RapidAPI-Host': 'genius-song-lyrics1.p.rapidapi.com',
        },
      }
    )

    const data = await res.json()
    const chartItems = data.chart_items || []

    const songs: Song[] = chartItems.map((entry: any) => {
      const item = entry.item
      return {
        id: item.id,
        title: item.title,
        artist: item.artist_names,
        albumArt: item.song_art_image_thumbnail_url,
      }
    })

    return { props: { songs } }
  } catch (e) {
    console.error('Trending 곡 불러오기 실패:', e)
    return { props: { songs: [] } }
  }
}

// 메인 페이지 컴포넌트
export default function Home({ songs = [] }: { songs?: Song[] }) {
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

        {/* Trending 섹션 */}
        <section className="max-w-screen-xl mx-auto px-6 py-24">
          <h2 className="text-3xl font-bold mb-20">Trending</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {songs.length > 0 ? (
              songs.map((song) => (
                <Link href={`/explanation/${song.id}`} key={song.id}>
                  <div className="overflow-hidden transition bg-white cursor-pointer">
                    <Image
                      src={song.albumArt || '/no-image.png'}
                      alt="Album Cover"
                      width={400}
                      height={400}
                      className="w-full aspect-square object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold">{song.title}</h3>
                      <p className="text-sm text-gray-500">{song.artist}</p>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">⚠️ 인기곡을 불러오지 못했습니다.</p>
            )}
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
