// /src/pages/licensing.tsx
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function Licensing() {
    // false: EN (default), true: KO
    const [isKo, setIsKo] = useState(false)

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
                <title>Licensing | Verse’tory</title>
                <meta name="description" content="License of Verse’tory" />
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
                        {isKo ? '라이선스 고지' : 'Licensing'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        License of Verse'tory (한/영 전환)
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {isKo ? (
                    <>
                        {/* meta */}
                        <section className="max-w-screen-xl mx-auto px-6 py-6">
                            <p className="text-gray-700">Last updated: 2025-00-00 (KST)</p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">1. 사용 허가 (License to Use)</h2>
                            <p className="text-gray-700 leading-relaxed">
                                본 서비스와 자료는 사용자에게 개인적·비상업적 목적의 접근 및 사용을 위한 비독점적·양도 불가·취소 가능한 라이선스로 제공됩니다.
                                법에서 허용되는 범위를 제외하고, 별도 서면 허가 없이 재배포·대여·판매·재라이선스는 허용되지 않습니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">2. 지적재산권 (Intellectual Property)</h2>
                            <p className="text-gray-700 leading-relaxed">
                                서비스 내 텍스트, UI, 이미지, 디자인, 코드, 문서 등은 운영자 또는 그 라이선스 제공자의 자산이며, 모든 권리를 보유합니다.
                                서비스명, 로고, 아이콘 등 브랜드 자산은 운영자(작성자 202021026, 세진)의 소유이며, 본 고지는 어떠한 권리 이전도 의미하지 않습니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">3. 브랜드 사용 (Brand Use)</h2>
                            <p className="text-gray-700 leading-relaxed">
                                브랜드 자산(서비스명·로고·아이콘 등)을 상업적으로 사용하거나 제휴·보증·후원으로 오인될 수 있는 방식으로 사용하는 경우, 사전 서면 허가가 필요합니다.
                                학술·포트폴리오 인용은 맥락 설명과 출처 표기를 권장합니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">4. 금지 사항 (Restrictions)</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>상업적 재배포 또는 서비스 출력물의 대량 배포</li>
                                <li>제휴·보증을 암시하는 사용, 고지/표시 문구의 삭제·변조</li>
                                <li>자동화된 대량 수집(스크래핑) 및 리버스 엔지니어링(법에서 허용된 범위 제외)</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">5. 오픈소스 고지 (Open-Source Notices)</h2>
                            <p className="text-gray-700 leading-relaxed">
                                서비스에는 제3자의 오픈소스 구성요소가 포함될 수 있으며, 각 구성요소의 라이선스 조건이 우선 적용됩니다.
                                이러한 조건은 본 라이선스 고지로 변경되지 않습니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">6. AI 생성물 안내 (AI-Generated Content)</h2>
                            <p className="text-gray-700 leading-relaxed">
                                번역·해설 등 AI 생성 결과는 참고용이며, 정확성·완전성·최신성을 보증하지 않습니다. 공식 해설·전문가 자문으로 간주되지 않습니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">7. 변경 (Changes)</h2>
                            <p className="text-gray-700 leading-relaxed">
                                본 고지는 수시로 업데이트될 수 있으며, 변경 이후 서비스 이용 시 변경 사항에 동의한 것으로 간주됩니다.
                            </p>
                        </section>
                    </>
                ) : (
                    <>
                        {/* meta */}
                        <section className="max-w-screen-xl mx-auto px-6 py-6">
                            <p className="text-gray-700">Last updated: 2025-00-00 (KST)</p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">1. License to Use</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The Service and its materials are provided under a non-exclusive, non-transferable, revocable license for personal, non-commercial use.
                                Unless permitted by law, redistribution, lending, sale, or sublicensing without prior written permission is not allowed.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">2. Intellectual Property</h2>
                            <p className="text-gray-700 leading-relaxed">
                                All texts, UI, images, designs, code, and documentation within the Service are the property of the Operator or its licensors.
                                The service name, logo, and icons are owned by the Operator (author ID 202021026, Sejin), and no rights are transferred by this notice.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">3. Brand Use</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Use of brand assets (service name, logo, icons) for commercial purposes or in any manner implying endorsement, affiliation, or sponsorship requires prior written permission.
                                Academic/portfolio citation is encouraged with context and attribution.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">4. Restrictions</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Commercial redistribution or mass distribution of outputs</li>
                                <li>Uses implying endorsement; removal/modification of notices</li>
                                <li>Automated mass scraping and reverse engineering (except as permitted by law)</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">5. Open-Source Notices</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The Service may include third-party open-source components governed by their respective licenses, which take precedence and are not altered by this notice.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">6. AI-Generated Content</h2>
                            <p className="text-gray-700 leading-relaxed">
                                AI-generated translations/annotations are for reference only and are not guaranteed for accuracy, completeness, or timeliness, nor are they official commentary or professional advice.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">7. Changes</h2>
                            <p className="text-gray-700 leading-relaxed">
                                This notice may be updated from time to time; continued use after an update constitutes acceptance.
                            </p>
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
