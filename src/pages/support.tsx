// /src/pages/support.tsx
// 250913
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function Support() {
    // false: EN (default), true: KO
    const [isKo, setIsKo] = useState(false)

    const KOFI_URL = 'https://ko-fi.com/sezino' // Ko-fi 페이지
    const KOFI_ICON = 'https://storage.ko-fi.com/cdn/cup-border.png' // Ko-fi 컵 아이콘

    const toggleLang = () => setIsKo(v => !v)
    const onTitleKey = (e: KeyboardEvent<HTMLHeadingElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleLang()
        }
    }

    return (
        <>
            <Head>
                <title>Support Verse’tory</title>
                <meta name="description" content="Support the Verse’tory project" />
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
                        {isKo ? 'Verse’tory 후원하기' : 'Support Verse’tory'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Verse’tory Project Support (한/영 전환)
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {isKo ? (
                    <>
                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">소개</h2>
                            <p className="text-gray-700 leading-relaxed">
                                영감은 무료지만, API는 유료입니다. Verse’tory는 가사 속 문화적 뉘양스를 해설하는 실험적 졸업작품으로,
                                OpenAI·Rapid API 호출과 안정적인 데모 인프라에 비용이 듭니다. 여러분의 응원은 더 정확하고 빠른 해석으로 돌아갑니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Ko-fi로 응원하기</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                                <li>1회 후원: 커피 한 잔이 여러 번의 API 호출이 됩니다.</li>
                                <li>월간 후원: 계획적인 운영과 지속적인 개선을 뒷받침합니다.</li>
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={KOFI_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900"
                                >
                                    <img src={KOFI_ICON} alt="" width={18} height={18} className="block" />
                                    Ko-fi로 커피 한 잔 응원하기
                                </a>
                                <a
                                    href={KOFI_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900"
                                >
                                    <img src={KOFI_ICON} alt="" width={18} height={18} className="block" />
                                    Ko-fi에서 월간 후원 시작하기
                                </a>
                            </div>

                            <div className="text-gray-600 leading-relaxed mt-6 space-y-1">
                                <p>후원금 사용처: AI 크레딧 및 제3자 API 이용료, DB 서버 이용료.</p>
                                <p>결제 안내: Ko-fi를 통해 결제가 처리되며, 국가별로 세액공제 대상이 아닐 수 있습니다.</p>
                                <p>※ 꼭 금전적 지원이 아니어도 큰 도움이 됩니다. 하지만 금전적 지원이 가장 큰 도움이 많이 됩니다.</p>
                            </div>
                        </section>
                    </>
                ) : (
                    <>
                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Overview</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Inspiration is free; API calls aren’t. Verse’tory interprets cultural nuance in lyrics, which incurs
                                costs for OpenAI/Rapid API and stable demo infrastructure. Your support becomes faster, sharper explanations.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-10">
                            <h2 className="text-3xl font-bold mb-4 text-black">Support via Ko-fi</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2 mb-6">
                                <li>One-time: Turn one coffee into multiple API calls.</li>
                                <li>Monthly: Provide stability for responsible planning and iteration.</li>
                            </ul>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <a
                                    href={KOFI_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900"
                                >
                                    <img src={KOFI_ICON} alt="" width={18} height={18} className="block" />
                                    Buy us a coffee on Ko-fi
                                </a>
                                <a
                                    href={KOFI_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg shadow hover:bg-gray-900"
                                >
                                    <img src={KOFI_ICON} alt="" width={18} height={18} className="block" />
                                    Start a monthly on Ko-fi
                                </a>
                            </div>

                            <div className="text-gray-600 leading-relaxed mt-6 space-y-1">
                                <p>Use of funds: AI credits &amp; third-party API fees, DB server costs.</p>
                                <p>Payment note: Processed by Ko-fi; may not be tax-deductible depending on your jurisdiction.</p>
                                <p>※ Support that isn’t money is wonderful—money, however, helps the most.</p>
                            </div>
                        </section>
                    </>
                )}

                <div className="h-36" />
            </main>

            <Footer />
        </>
    )
}
