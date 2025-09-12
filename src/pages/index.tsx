// /src/pages/index.tsx

import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Image from 'next/image'
import Link from 'next/link'
import GeniusAutocomplete from '@/components/GeniusAutocomplete'
import type { HTMLAttributes, ReactNode } from 'react'

type Song = {
    id: number
    title: string
    artist: string
    albumArt: string
}

/**
 * Hover 시 en → ko 전환. 두 레이어를 겹치고 opacity 전환으로 레이아웃 점프를 방지.
 */
function HoverSwap({
    en,
    ko,
    className = '',
    ...rest
}: { en: ReactNode; ko: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
    return (
        <span className={`group inline-grid ${className}`} {...rest}>
            <span className="col-start-1 row-start-1 transition-opacity duration-300 ease-out opacity-100 group-hover:opacity-0 group-focus-within:opacity-0">
                {en}
            </span>
            <span className="col-start-1 row-start-1 transition-opacity duration-300 ease-out opacity-0 group-hover:opacity-100 group-focus-within:opacity-100">
                {ko}
            </span>
        </span>
    )
}

// 서버 사이드에서 Genius 차트 상위 3곡 가져오기
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

export default function Home({ songs = [] }: { songs?: Song[] }) {
    return (
        <>
            <Header />

            <main className="bg-white text-gray-800">
                {/* 히어로: 제목/서브텍스트 각각 한 번의 호버로 전체 문장 전환 */}
                <section className="max-w-screen-xl mx-auto px-6 py-40 text-left">
                    <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
                        <HoverSwap
                            en={
                                <>
                                    Interpreting<br />
                                    English Verses in Korean
                                </>
                            }
                            ko={
                                <>
                                    영어 가사를<br />
                                    한국어 가사로 자연스럽게
                                </>
                            }
                        />
                    </h1>

                    <p className="text-lg md:text-xl text-gray-600">
                        <HoverSwap
                            en={
                                <>
                                    AI-powered cultural interpretation and translation<br />
                                    with smooth explanations and contextual annotations
                                </>
                            }
                            ko={
                                <>
                                    AI 기반의 문화적 해석과 번역으로 노래의 배경·레퍼런스·슬랭·은유를 자연스럽게 풀어내며<br />
                                    자연스럽고 매끄러운 설명과 주석으로 완성도 있는 번역을 제공합니다
                                </>
                            }
                        />
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

                {/* Trending 섹션: 제목 'Trending' ↔ '인기곡' 전환, 소제목 유지 */}
                <section className="max-w-screen-xl mx-auto px-6 py-24">
                    <h2 className="text-3xl font-bold mb-3">
                        <HoverSwap en="Trending" ko="인기곡" />
                    </h2>

                    <div className="mb-12">
                        <p className="text-gray-500">
                            <HoverSwap
                                en="The world’s most searched lyrics right now."
                                ko="지금 전 세계에서 가장 많이 검색되는 노래 가사."
                            />
                        </p>
                    </div>

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
                            <p className="text-gray-500">인기곡을 불러오지 못했습니다.</p>
                        )}
                    </div>
                </section>

                {/* 구분선 (Trending 아래) */}
                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-20" />

                {/* Verse’tory 블록: 제목 고정, 아래 4줄은 한 번의 호버로 전체 전환 */}
                <section className="max-w-screen-xl mx-auto px-6 text-left py-40">
                    <h2 className="text-4xl font-bold mb-6">Verse’tory</h2>
                    <p className="text-lg text-gray-600 leading-relaxed">
                        <HoverSwap
                            en={
                                <>
                                    Understand the meaning behind international<br />
                                    pop &amp; hip-hop lyrics<br />
                                    with accurate translations and cultural context<br />
                                    powered by AI
                                </>
                            }
                            ko={
                                <>
                                    전세계 영어 음악 가사의 숨은 의미를 이해하고<br />
                                    pop과 hip-hop 가사를 번역하며<br />
                                    문화적 맥락까지 담은 풍부하고 자연스러운 해석을<br />
                                    AI기술로 스마트하게
                                </>
                            }
                        />
                    </p>
                </section>
            </main>

            <Footer />
        </>
    )
}
