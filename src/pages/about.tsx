// /src/pages/about.tsx
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function About() {
    // false: EN (default), true: KO
    const [isKo, setIsKo] = useState(false)

    const toggleLang = () => setIsKo((v) => !v)
    const onTitleKey = (e: KeyboardEvent<HTMLHeadingElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleLang()
        }
    }

    return (
        <>
            <Head>
                <title>About Verse’tory</title>
                <meta name="description" content="About Verse’tory / Verse’tory에 관하여" />
            </Head>

            <Header />

            <main className="bg-white text-gray-800">
                {/* 0 */}
                <section className="max-w-screen-xl mx-auto px-6 py-20 text-left">
                    <h1
                        className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-black cursor-pointer select-none"
                        onClick={toggleLang}
                        onKeyDown={onTitleKey}
                        tabIndex={0}
                        aria-label="Click to toggle language"
                    >
                        {isKo ? 'Verse’tory 소개' : 'About Verse’tory'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Verse’tory Project (한/영 전환)
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {/* 1 */}
                <section className="max-w-screen-xl mx-auto px-6 py-10 text-left">
                    {isKo ? (
                        <div className="text-gray-700 leading-relaxed space-y-6 text-lg">
                            <p>
                                Verse’tory는 단순한 번역 도구가 아닙니다. 이 프로젝트는 졸업 작품이라는 학문적 실험에서 출발해,
                                기존 가사 번역의 한계를 넘어 문화적 맥락까지 함께 풀어내는 창의적 시도를 담고 있습니다.
                                음악 속에 살아 숨 쉬는 거리의 슬랭, 세대를 아우르는 밈, 그리고 장르를 형성해온 역사적 배경까지
                                Verse’tory는 직역으로는 담을 수 없는 층위를 세심하게 해석해냅니다.
                            </p>
                            <p>
                                AI의 정밀함과 문화 연구의 호기심이 만나, 한 줄의 가사가 하나의 이야기로 다시 태어납니다.
                                Verse’tory는 단순한 서비스가 아니라 선언에 가깝습니다. 음악은 단순히 들리는 소리가 아니라,
                                해석되고 맥락화되며, 문화를 넘어 공유되는 ‘살아 있는 이야기’임을 증명하는 시도이기 때문입니다.
                                그 여정 속에서 우리는 음악을 단순한 청취 대상이 아닌, 세대를 잇는 문화적 대화로 재발견하고자 합니다.
                            </p>
                        </div>
                    ) : (
                        <div className="text-gray-700 leading-relaxed space-y-6 text-lg">
                            <p>
                                Verse’tory is not just a translation tool—it is an experiment in creative technology. Born as a capstone
                                project, it dares to go beyond the limits of conventional lyric translation by weaving in the cultural
                                threads that make music truly alive. From slang that carries the pulse of the streets to memes and
                                historical contexts that shape entire genres, Verse’tory decodes the hidden layers of meaning often lost
                                in direct translation.
                            </p>
                            <p>
                                By combining the precision of AI with the curiosity of cultural study, we transform each lyric into a
                                narrative that resonates across borders. Verse’tory stands as both a service and a statement: that music
                                is not merely heard, but also interpreted, contextualized, and shared as a living story between cultures.
                            </p>
                        </div>
                    )}
                </section>

                {/* bottom spacing */}
                <div className="h-36" />
            </main>

            <Footer />
        </>
    )
}
