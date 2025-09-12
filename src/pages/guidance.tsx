// /src/pages/guidance.tsx
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function Guidance() {
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
                <title>Guidance | Verse’tory</title>
                <meta name="description" content="Verse’tory 사용 안내 / Guidance" />
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
                        {isKo ? '사용안내' : 'Guidance'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Verse’tory 사용 안내 (한/영 전환)
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {isKo ? (
                    <>
                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">빠른 시작 (3단계)</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>검색:</strong> 곡명 또는 아티스트를 입력하고 자동완성에서 선택합니다.</li>
                                <li><strong>보기 선택:</strong> Translate &amp; Interpretation 또는 Translate를 눌러 결과를 확인합니다.</li>
                                <li><strong>깊이 읽기:</strong> 가사 줄에 마우스를 올리거나(모바일은 탭) 문화·언어 해설 툴팁을 확인합니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Verse’tory가 하는 일</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>영어 가사를 한국어로 자연스럽게 번역합니다.</li>
                                <li>슬랭·밈·레퍼런스·시대적 맥락 등을 요약해 해설합니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">화면별 사용법</h2>

                            <h3 className="text-xl font-semibold text-black mb-2">검색 영역</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>자동완성에서 원하는 곡을 클릭해 상세 페이지로 이동합니다.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">상단 버튼</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li><strong>Translate &amp; Interpretation:</strong> 번역 + 전체 해설 요약을 함께 확인</li>
                                <li><strong>Translate:</strong> 번역만 빠르게 확인</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">가사/해석 뷰</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>줄 단위로 원문과 번역이 대응합니다.</li>
                                <li>줄에 호버/탭하면 문화·언어 해설 툴팁이 열립니다.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">About / Q&amp;A 섹션</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>곡의 맥락, 뒷이야기, 레퍼런스 단서를 요약 제공합니다.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">평가 &amp; 댓글</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>별점으로 해석 품질을 평가할 수 있습니다.</li>
                                <li>로그인 후 댓글로 오역 제보나 보완 의견을 남길 수 있습니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">트렌딩(Trending) 기준</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>최근 서비스 내 검색·조회가 활발한 가사를 기준으로 집계합니다.</li>
                                <li>시점별 관심도 변화를 반영하므로 목록은 수시로 바뀔 수 있습니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">품질·한계 안내 (베타 고지)</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>응답 속도:</strong> 외부 API 호출 상황에 따라 지연이 있을 수 있습니다.</li>
                                <li><strong>정확도:</strong> 번역·해설은 모델 기반 추정으로 100% 사실 일치가 보장되진 않습니다. 논쟁적·중의적 표현은 가능한 근거를 덧붙입니다.</li>
                                <li><strong>데이터:</strong> 가사·메타데이터는 제3자 API를 통해 취득하며, 필요한 범위에서만 저장/캐싱합니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">계정 &amp; 개인정보</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>소셜 로그인:</strong> Google 등 지원(베타). 로그인 시 댓글/평가/피드백 기능이 열립니다.</li>
                                <li><strong>개인정보 처리:</strong> 필수 정보만 사용합니다. 자세한 내용은 Privacy Policy에서 확인하세요.</li>
                                <li><strong>로그아웃/세션:</strong> 쿠키·세션 만료 시 재로그인이 필요할 수 있습니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">피드백 보내기</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>오역/미번역 신고:</strong> 문제가 된 줄을 복사해 댓글로 알려 주세요. 근거(링크, 맥락)를 주시면 반영이 빠릅니다.</li>
                                <li><strong>해설 보완 제안:</strong> “이 레퍼런스도 검토해 주세요” 같은 추가 단서를 환영합니다.</li>
                                <li><strong>버그 제보/개선 요청:</strong> 화면, 속도, 접근성 등 무엇이든 자유롭게 남겨 주세요.</li>
                                <li><strong>연락처:</strong> tpwls0831@naver.com</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 8 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">법적 고지 &amp; 출처</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>저작권:</strong> 가사 저작권은 각 권리자에게 있습니다. Verse’tory는 번역·해설을 제공하며 원문·음원을 재배포하지 않습니다.</li>
                                <li><strong>출처 표기:</strong> 곡 정보·가사/메타데이터는 제3자 API 기반이며, 가능한 범위에서 출처를 명시합니다.</li>
                            </ul>
                        </section>
                    </>
                ) : (
                    <>
                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Quick Start (3 Steps)</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Search:</strong> Type a song title or artist and pick from autocomplete.</li>
                                <li><strong>Choose a View:</strong> Select Translate &amp; Interpretation or Translate to see results.</li>
                                <li><strong>Read Deeply:</strong> Hover (or tap on mobile) a lyric line to open cultural/linguistic notes.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">What Verse’tory Does</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Delivers natural Korean translations of English lyrics.</li>
                                <li>Summarizes slang, memes, references, and historical/cultural context.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">How to Use Each Screen</h2>

                            <h3 className="text-xl font-semibold text-black mb-2">Search Area</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>Pick a result from autocomplete to open the detail page.</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">Top Buttons</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li><strong>Translate &amp; Interpretation:</strong> Translation plus a concise interpretation overview</li>
                                <li><strong>Translate:</strong> Translation-only, fast reading</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">Lyrics / Interpretation View</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>One-to-one alignment between original lines and translations</li>
                                <li>Hover/Tap a line to reveal cultural/linguistic tooltips</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">About / Q&amp;A Section</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-6">
                                <li>Curated background, context, and reference leads</li>
                            </ul>

                            <h3 className="text-xl font-semibold text-black mb-2">Ratings &amp; Comments</h3>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Rate interpretation quality with stars</li>
                                <li>After login, report mistranslations or suggest improvements via comments</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Trending Criteria</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li>Aggregated from recent in-service searches and views.</li>
                                <li>Reflects time-sensitive interest; entries may change frequently.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Quality &amp; Limitations (Beta Notice)</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Latency:</strong> Third-party API calls may cause occasional delays.</li>
                                <li><strong>Accuracy:</strong> Translations/notes are model-based inferences and may not be perfectly factual; we add reasoning where expressions are ambiguous or disputed.</li>
                                <li><strong>Data:</strong> Lyrics/metadata come from third-party APIs; we store/cache only what’s necessary.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Account &amp; Privacy</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Social Login:</strong> Google and more (beta). Unlocks comments, ratings, and feedback features.</li>
                                <li><strong>Personal Data:</strong> We use only essential information. See the Privacy Policy for details.</li>
                                <li><strong>Logout/Session:</strong> You may need to log in again when cookies or sessions expire.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Send Feedback</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Report Issues:</strong> Copy the problematic line and comment; include links/context if possible.</li>
                                <li><strong>Enrich Interpretations:</strong> Share references we should consider.</li>
                                <li><strong>Bug Reports / Improvements:</strong> UI, performance, accessibility—anything helps.</li>
                                <li><strong>Contact:</strong> tpwls0831@naver.com</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 8 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Legal Notices &amp; Attribution</h2>
                            <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                <li><strong>Copyright:</strong> Lyrics are owned by their respective rightsholders. Verse’tory provides translations/interpretations and does not redistribute original lyrics or audio.</li>
                                <li><strong>Attribution:</strong> Song info and lyrics/metadata rely on third-party APIs; sources are cited where feasible.</li>
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
