// /src/pages/service.tsx
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function Service() {
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
                <title>Our Service | Verse’tory</title>
                <meta name="description" content="Verse’tory Service Overview" />
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
                        {isKo ? '서비스 소개' : 'Our Service'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Service of Verse'tory (한/영 전환)
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {isKo ? (
                    <>
                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">한 줄 소개</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>
                                    Verse’tory는 영어 가사를 맥락 중심 한국어로 번역하고, 슬랭·레퍼런스를 간결한 주석으로 설명하는 해설 서비스입니다.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">무엇을 제공하나요</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>원문 줄바꿈을 보존한 자연스러운 번역</li>
                                <li>슬랭 / 밈 / 고유명사 줄단위 주석</li>
                                <li>원문 · 번역 · 해설 병렬 보기</li>
                                <li>곡 단위 핵심 요약과 개선을 위한 피드백 입력</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-6 text-black">서비스 아키텍처 · 처리 파이프라인</h2>

                            <h3 className="text-xl font-semibold text-black mb-2">검색 &amp; 메타데이터 수집</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>곡명/아티스트 입력 → Genius API로 후보 랭킹 및 곡 메타 정보 확보</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">가사 취득</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>허용된 가사 제공 API(예: Musixmatch via RapidAPI)에서 원문 가사 요청</li>
                                <li>[Verse], [Chorus] 등 섹션 라벨과 줄바꿈 정규화</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">번역 &amp; 해설 생성 (LLM)</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>OpenAI API에 특화 프롬프트로 요청</li>
                                <li>라벨은 보존, 괄호 안 가사는 번역, 줄-대-줄 정렬 유지</li>
                                <li>슬랭/레퍼런스는 짧은 주석으로 생성 → 경미한 후처리(정렬/오탈자/토큰 초과 대응)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">저장 &amp; 제공</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Supabase에 songs / interpretations / comments 저장·버전 관리</li>
                                <li>Next.js UI에서 병렬 보기 렌더링, 긴 응답은 스트리밍 표시</li>
                                <li>동일 곡 반복 요청은 캐시(TTL) 로 가속</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">문의 &amp; 지원</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>tpwls0831@naver.com</li>
                                <li>Ko-fi로 인프라 (LLM 크레딧/제3자 API/DB) 비용을 응원할 수 있어요.</li>
                                <li>금전이 아니어도 버그 제보·번역 피드백은 큰 도움이 됩니다.</li>
                            </ul>
                        </section>
                    </>
                ) : (
                    <>
                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">One-liner</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>
                                    Verse’tory delivers context-aware Korean translations of English lyrics with concise line-by-line cultural notes.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">What you get</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Natural translation with original line breaks preserved</li>
                                <li>Per-line annotations for slang/memes/proper nouns</li>
                                <li>Parallel view: original · translation · notes</li>
                                <li>Song-level summary and feedback to improve quality</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-6 text-black">Service Architecture &amp; Processing Pipeline</h2>

                            <h3 className="text-xl font-semibold text-black mb-2">Search &amp; Metadata</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>Title/artist input → rank candidates via the Genius API, fetch song metadata</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">Lyrics Retrieval</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>Request lyrics from permitted lyrics APIs (e.g., Musixmatch via RapidAPI)</li>
                                <li>Normalize section labels ([Verse], [Chorus]) and line breaks</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">Translation &amp; Notes (LLM)</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>Call the OpenAI API with a tailored prompt</li>
                                <li>Keep labels as-is, translate text in parentheses, enforce line-to-line alignment</li>
                                <li>Generate concise notes for slang/references → light post-processing (alignment/typos/token limits)</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">Store &amp; Serve</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Persist songs / interpretations / comments in Supabase with versioning</li>
                                <li>Render a parallel view in Next.js; stream long responses</li>
                                <li>Speed up repeated requests with cache (TTL)</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Contact &amp; Support</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>tpwls0831@naver.com</li>
                                <li>Support via Ko-fi (AI credits / third-party APIs / DB).</li>
                                <li>Non-monetary help is welcome—bug reports &amp; translation feedback matter.</li>
                            </ul>
                        </section>
                    </>
                )}

                {/* bottom spacing */}
                <div className="h-36" />
            </main>

            <Footer />
        </>
    )
}
