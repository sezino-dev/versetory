// /src/pages/copyright.tsx
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function CopyrightPolicy() {
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
                <title>Copyright Policy | Verse’tory</title>
                <meta name="description" content="Copyright Policy of Verse’tory" />
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
                        {isKo ? '저작권 정책' : 'Copyright Policy'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Copyright Policy of Verse'tory (한/영 전환)
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {isKo ? (
                    <>
                        {/* meta */}
                        <section className="max-w-screen-xl mx-auto px-6 py-6">
                            <div className="text-gray-700 leading-relaxed">
                                <p>시행일: 2025-00-00 (KST)</p>
                                <p>연락처: tpwls0831@naver.com</p>
                            </div>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">1. 개요</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Verse’tory(이하 “서비스”)에는 (1) 제 3자 저작물(가사, 노래 메타데이터 등), (2) 서비스가 생성하는
                                번역·해설·요약 등 텍스트, (3) <strong>이용자 작성 콘텐츠(댓글·피드백 등)</strong>가 공존합니다.
                                본 정책은 각 범주의 권리 귀속, 사용 원칙, 신고·게시중단 절차를 명확히 합니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">2. 권리 귀속</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>서비스 소유 저작물:</strong> 소스코드, 화면 구성(UI), 편집 텍스트·설명문·해설문, 데이터베이스
                                    구조·정렬 방식 등은 서비스가 저작권을 보유합니다.
                                </li>
                                <li>
                                    <strong>브랜드·디자인 자산:</strong> 로고, 워드마크, 아이콘 등 브랜드 자산의 무단 사용·변형·출처 오인
                                    (제휴/보증 암시 포함)을 금지합니다.
                                </li>
                                <li>
                                    <strong>오픈소스·외부 구성요소:</strong> 포함된 라이브러리/툴은 각 라이선스를 따릅니다(해당 고지·표시
                                    존중).
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">3. 제 3자 저작물(가사, 노래 메타데이터 등)</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>출처:</strong> 곡 정보·가사·설명 일부는 제 3자 제공처(API/데이터 소스)를 통해 전달됩니다.
                                </li>
                                <li>
                                    <strong>소유권:</strong> 가사, 앨범 아트, 아티스트 사진 등 관련 권리는 각 권리자에게 있으며, 서비스는
                                    소유권을 주장하지 않습니다.
                                </li>
                                <li>
                                    <strong>표시 범위:</strong> 서비스는 음원 스트리밍/재생을 제공하지 않으며, 번역·주석·맥락 설명 등
                                    텍스트 중심의 이해를 위해 필요한 범위에서만 표시·가공합니다.
                                </li>
                                <li>
                                    <strong>정당한 이용:</strong> 인용·요약·주석은 비평·연구·교육 목적의 <strong>정당한 이용</strong>을
                                    지향하며, 권리자 합리적 요청 시 가시성 축소·비공개·삭제 등 조치를 취할 수 있습니다.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">4. 서비스 생성물(번역·해설·요약 등)</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>파생물 성격:</strong> 번역·해설은 원저작물에 대한 파생적 표현일 수 있습니다. 번역·해설의
                                    저작권은 서비스 또는 해당 작성자에게 있으나, 원저작물의 권리는 원저작권자에게 존속합니다.
                                </li>
                                <li>
                                    <strong>사용 허용 범위:</strong> 이용자는 서비스 내 제공되는 기능 범위에서 열람·공유할 수 있으며, 사전
                                    허가 없는 상업적 재배포·대량 스크래핑·2차 배포는 금지됩니다.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">5. 이용자 콘텐츠(댓글·피드백)</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>권리 보유:</strong> 이용자는 자신이 작성한 콘텐츠에 대한 저작권을 보유합니다.
                                </li>
                                <li>
                                    <strong>이용 허락:</strong> 서비스 운영·표시·품질 개선·연구·보안을 위해, 이용자는 자신의 콘텐츠를 전
                                    세계적·비독점·로열티 없는 이용 허락(저장·복제·수정·표시·하위 라이선스 포함)합니다.
                                </li>
                                <li>
                                    <strong>책임:</strong> 제 3자 권리를 침해하지 않는 콘텐츠만 게시해야 하며, 위반 시 게시중단·계정 제한
                                    등 조치가 이뤄질 수 있습니다.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">6. 임시저장·캐싱</h2>
                            <p className="text-gray-700 leading-relaxed">
                                성능·안정성 확보(시연 데모 포함)를 위해 검색 결과·번역/해설 결과 등을 일시적으로 캐싱할 수 있습니다.
                                보존 기간·갱신 주기는 운영 정책과 기술적 제약에 따라 달라질 수 있습니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">7. 신고·게시중단(Notice &amp; Takedown)</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                권리 침해가 의심되는 자료가 서비스 내 표시·링크·가공되어 노출된 경우, 아래 내용을 포함하여 신고해 주세요.
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>권리자/대리인 성명 및 연락처</li>
                                <li>침해 주장 자료의 정확한 위치(페이지 주소, 화면 캡처 등)</li>
                                <li>권리 보유 사실 및 무단 이용에 대한 소명</li>
                                <li>필요 시 권리 보유 증빙(등록번호·계약서 등)</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                확인 후 신속히 임시 비공개·삭제·복제 방지 등의 조치를 검토·실행합니다. 연락처 : tpwls0831@naver.com
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 8 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">8. 금지 행위</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>제 3자 저작물의 무단 다운로드·대량 추출·재배포</li>
                                <li>서비스 생성물(번역·해설)의 무단 상업적 이용·2차 배포</li>
                                <li>브랜드 자산의 무단 사용·변형·출처 오인 유발</li>
                                <li>자동화 수단에 의한 과도한 수집(스크래핑/크롤링)·리버스 엔지니어링</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 9 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">9. 법적 고지</h2>
                            <p className="text-gray-700 leading-relaxed">
                                본 정책은 법률 자문을 대체하지 않으며, 적용은 관할 법령에 따라 달라질 수 있습니다. 서비스는
                                권리자·이용자·플랫폼의 정당한 권리를 균형 있게 존중합니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 10 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">10. 정책 개정</h2>
                            <p className="text-gray-700 leading-relaxed">
                                운영상·법령상 필요에 따라 본 정책을 개정할 수 있으며, 중요한 변경은 서비스 내 공지 등 합리적 수단으로
                                알립니다.
                            </p>
                        </section>
                    </>
                ) : (
                    <>
                        {/* meta */}
                        <section className="max-w-screen-xl mx-auto px-6 py-6">
                            <div className="text-gray-700 leading-relaxed">
                                <p>Effective Date: 2025-00-00 (KST)</p>
                                <p>Connect: tpwls0831@naver.com</p>
                            </div>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">1. Overview</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Verse’tory (the “Service”) comprises (1) third-party materials (e.g., lyrics and song metadata), (2)
                                Service-generated outputs (translations, annotations, summaries), and (3) user content (comments/feedback).
                                This policy clarifies ownership, permitted use, and notice-and-takedown procedures.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">2. Ownership</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>Service-owned works:</strong> Source code, UI, editorial text/explanations, and database
                                    structure/arrangement are protected by copyright owned by the Service.
                                </li>
                                <li>
                                    <strong>Brand &amp; design assets:</strong> Unauthorized use, alteration, or confusing uses (implying
                                    affiliation/endorsement) of the logo, wordmark, and icons are prohibited.
                                </li>
                                <li>
                                    <strong>Open-source / third-party components:</strong> Components remain subject to their respective
                                    licenses and required notices.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">3. Third-party materials (lyrics, song metadata, etc.)</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>Sources:</strong> Certain song information, lyrics, and notes are provided via third-party APIs/data providers.
                                </li>
                                <li>
                                    <strong>Ownership:</strong> Copyrights/trademarks in lyrics, album art, and artist photos belong to their
                                    rightsholders; the Service does not claim ownership.
                                </li>
                                <li>
                                    <strong>Display scope:</strong> The Service does not provide audio streaming/playback and processes/displays
                                    text only to support translation, commentary, and contextual understanding.
                                </li>
                                <li>
                                    <strong>Fair/legitimate use:</strong> Quotations, excerpts, and annotations are offered under principles of
                                    fair (legitimate) use for criticism, research, and education; upon valid rightsholder request, access may be
                                    limited or content removed.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">4. Service-generated outputs (translations/annotations)</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>
                                    <strong>Derivative nature:</strong> Translations/annotations may constitute derivative expressions. Copyright
                                    in these outputs belongs to the Service or the relevant author, while underlying works remain owned by their
                                    rightsholders.
                                </li>
                                <li>
                                    <strong>Permitted use:</strong> Users may view/share within features provided by the Service; commercial
                                    redistribution, bulk scraping, or re-publishing without prior permission is prohibited.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">5. User content (comments/feedback)</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><strong>Retention of rights:</strong> Users retain copyright in their submissions.</li>
                                <li>
                                    <strong>License to Service:</strong> Users grant the Service a worldwide, non-exclusive, royalty-free license
                                    to store, reproduce, modify, display, and sublicense their content for operation, display, quality improvement,
                                    research, and security.
                                </li>
                                <li>
                                    <strong>Responsibility:</strong> Users must ensure their content does not infringe third-party rights;
                                    violations may result in removal or account restrictions.
                                </li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">6. Caching &amp; temporary storage</h2>
                            <p className="text-gray-700 leading-relaxed">
                                For performance and demo stability, some data (e.g., search results, translations) may be temporarily cached.
                                Retention/refresh cycles depend on operational needs and technical constraints.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">7. Notice &amp; Takedown</h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                If you believe material displayed/linked/processed by the Service infringes your rights, please include:
                            </p>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Name and contact info of the rightsholder/agent</li>
                                <li>Precise location of the material (URL, screenshots)</li>
                                <li>Statement of ownership and unauthorized use</li>
                                <li>Supporting evidence (e.g., registration numbers, agreements), if applicable</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-4">
                                We will review and, where appropriate, promptly disable access or remove the material. Contact : tpwls0831@naver.com
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 8 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">8. Prohibited conduct</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Unauthorized downloading, mass extraction, or redistribution of third-party materials</li>
                                <li>Unauthorized commercial use or re-distribution of Service-generated outputs</li>
                                <li>Unauthorized use/alteration of brand assets; confusion or implied endorsement</li>
                                <li>Excessive automated collection (scraping/crawling) or reverse engineering</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 9 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">9. Legal notice</h2>
                            <p className="text-gray-700 leading-relaxed">
                                This policy does not constitute legal advice. Application may vary by jurisdiction. We strive to respect the
                                lawful interests of rightsholders, users, and platforms.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 10 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8 text-left">
                            <h2 className="text-3xl font-bold mb-4 text-black">10. Changes to this Policy</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We may update this policy for operational or legal reasons. Material changes will be announced within the
                                Service or via reasonable means.
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
