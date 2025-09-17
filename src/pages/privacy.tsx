// /src/pages/privacy.tsx
import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function PrivacyPolicy() {
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
                <title>Privacy Policy | Verse’tory</title>
                <meta name="description" content="Privacy Policy of Verse’tory" />
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
                        {isKo ? '개인정보 처리방침' : 'Privacy Policy'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        Privacy Policy of Verse'tory (한/영 전환)
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {isKo ? (
                    <>
                        {/* meta */}
                        <section className="max-w-screen-xl mx-auto px-6 py-6">
                            <div className="text-gray-700 leading-relaxed">
                                <p>시행일: 2025-00-00 (KST)</p>
                                <p>운영자: Verse’tory (졸업작품 시연용 베타)</p>
                                <p>문의: tpwls0831@naver.com</p>
                            </div>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">1) 목적</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Verse’tory는 영어 노랫말을 한국어로 번역·해설하여 문화적 맥락을 이해하도록 돕는 웹 기반 서비스입니다.
                                본 방침은 시연용 베타 운영 중 수집·이용되는 개인정보와 그 처리 방식, 보관·파기, 안전조치 및 이용자 권리를 알리기 위해 마련되었습니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">2) 수집 항목</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><strong>계정/인증 정보:</strong> 이메일, 소셜 로그인 제공자 식별자, 계정 생성 시각(필수).</li>
                                <li><strong>서비스 이용 정보:</strong> 사용자가 검색·요청한 곡/가사 관련 입력값, 번역·해설 결과, 댓글/피드백 내용과 작성 시각, 관련 곡/해설 식별자.</li>
                                <li><strong>기술 로그:</strong> 요청 일시, 브라우저/기기 정보(User-Agent), IP 주소 등 기본 로그(보안/오류 분석 목적).</li>
                                <li><strong>선택 항목:</strong> 프로필 이미지(URL 등), 선택 입력 정보.</li>
                            </ul>
                            <p className="text-gray-500 text-sm mt-2">※ 비밀번호는 소셜 로그인 제공자 측에서 처리되며, Verse’tory는 이를 저장하지 않습니다.</p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">3) 수집 방법</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>사용자가 직접 입력(검색어, 가사 일부, 댓글/피드백 등)</li>
                                <li>OAuth 2.0 기반 소셜 로그인 과정에서 최소 식별정보 수신</li>
                                <li>제 3자 API 호출(Genius 등)로 곡 메타데이터·가사 원문을 조회</li>
                                <li>LLM/번역·해설 요청 시 제 3자 처리자(OpenAI API 등)에 텍스트 전송</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">4) 이용 목적</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>번역·해설 제공 및 화면 표시(예: 줄 단위 번역, 주석·도움말)</li>
                                <li>댓글·피드백 기능 제공 및 품질 개선</li>
                                <li>성능·안정성 확보(예: 캐시·지연 최소화)</li>
                                <li>보안 모니터링, 오남용 방지, 법령 준수</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">5) 쿠키 및 로컬 저장소</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><strong>필수 쿠키/스토리지:</strong> 로그인 유지, 세션 보안 등 서비스 제공에 필요한 항목만 사용</li>
                                <li><strong>분석/광고 쿠키:</strong> 현재 사용하지 않습니다. 향후 도입 시 목적·항목·보관 기간·동의 절차를 사전 고지합니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">6) 보관 및 파기</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>본 서비스는 졸업작품 시연용 베타입니다. 시연 종료 후 최대 30일 이내 계정·댓글·피드백·캐시 등 대부분의 개인정보를 일괄 삭제합니다.</li>
                                <li>보안 및 오류 분석을 위한 로그는 단기간 보관 후 파기합니다.</li>
                                <li>관련 법령에 따라 보관이 필요한 경우 해당 기간 동안 최소한으로 보관합니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">7) 제 3자 제공 및 처리위탁</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>데이터베이스·인증: Supabase</li>
                                <li>번역·해설 처리: OpenAI API(요청 본문 전송 포함)</li>
                                <li>가사/메타데이터: Genius 등 제 3자 API</li>
                                <li>호스팅/런타임: 예: Vercel/Node.js 등</li>
                            </ul>
                            <p className="text-gray-500 text-sm mt-2">
                                ※ 상기 제 3자는 국외에서 데이터를 처리할 수 있으며, 목적 달성에 필요한 범위 내에서만 전송·처리합니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 8 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">8) 국제 이전</h2>
                            <p className="text-gray-700 leading-relaxed">
                                제 3자 처리자의 서버 위치 또는 네트워크 경로에 따라 개인정보가 국외로 이전될 수 있습니다.
                                이 경우 안전한 전송을 위해 암호화 등 합리적인 보호조치를 적용합니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 9 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">9) 안전성 확보 조치</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>전송 구간 암호화(HTTPS), 접근 권한 최소화</li>
                                <li>인증 보호(OAuth 2.0), 키/환경변수 관리</li>
                                <li>데이터 무결성 보장을 위한 스키마 제약 및 접근 통제</li>
                                <li>보안 모니터링 및 이상 징후 대응</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 10 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">10) 아동의 개인정보</h2>
                            <p className="text-gray-700 leading-relaxed">
                                본 서비스는 만 14세 미만을 대상으로 하지 않습니다. 만 14세 미만 아동의 정보 수집 사실을 알게 된 경우 지체 없이 삭제합니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 11 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">11) 이용자 권리</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>개인정보 열람·정정·삭제·처리정지 요청</li>
                                <li>동의 철회 및 계정 삭제 요청</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-2">
                                행사 방법: tpwls0831@naver.com 으로 요청하시면 합리적인 기간 내 처리 결과를 안내드립니다.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 12 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">12) 사용자 유의사항</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>댓글/피드백에 민감정보 또는 타인의 권리를 침해할 수 있는 내용을 업로드하지 마십시오.</li>
                                <li>제 3자 저작물(가사, 노래 메타데이터 등)은 번역·해설 제공 목적 범위 내에서만 처리·표시됩니다.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 13 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">13) 변경 고지</h2>
                            <p className="text-gray-700 leading-relaxed">
                                본 방침을 변경하는 경우, 개정 내용과 시행일을 서비스 내 공지로 안내합니다.
                            </p>
                        </section>
                    </>
                ) : (
                    <>
                        {/* meta */}
                        <section className="max-w-screen-xl mx-auto px-6 py-6">
                            <div className="text-gray-700 leading-relaxed">
                                <p>Effective Date: 2025-00-00 (KST)</p>
                                <p>Controller: Verse’tory (Graduation project demo/beta)</p>
                                <p>Contect: tpwls0831@naver.com</p>
                            </div>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 1 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">1) Purpose</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Verse’tory provides Korean translations and cultural interpretations of English lyrics. This Policy explains what personal data we collect during the beta demo, how we use it, how long we retain it, how we protect it, and what rights you have.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 2 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">2) Data We Collect</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><strong>Account/Auth:</strong> Email, social login provider identifier, account creation timestamp (required).</li>
                                <li><strong>Service Use Data:</strong> Song/lyric queries you submit, input text, translation/annotation outputs, comments/feedback with timestamps and related song/interpretation identifiers.</li>
                                <li><strong>Technical Logs:</strong> Request time, device/UA, IP address (for security/debugging).</li>
                                <li><strong>Optional:</strong> Profile image URL and other optional profile fields.</li>
                            </ul>
                            <p className="text-gray-500 text-sm mt-2">※ Passwords are handled by social login providers; Verse’tory does not store them.</p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 3 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">3) How We Collect</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Direct input from you (queries, lyrics, comments/feedback)</li>
                                <li>OAuth 2.0 social sign-in (minimal identifiers)</li>
                                <li>Third-party APIs (e.g., Genius) for song metadata/lyrics</li>
                                <li>LLM processing via third-party processors (e.g., OpenAI API), which receive the text you submit</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 4 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">4) Purposes of Use</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Provide translation/interpretation and UI features (line-by-line output, notes)</li>
                                <li>Enable comments/feedback and quality improvement</li>
                                <li>Ensure performance/stability (e.g., caching, latency reduction)</li>
                                <li>Security monitoring, abuse prevention, and legal compliance</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 5 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">5) Cookies &amp; Local Storage</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li><strong>Essential only:</strong> Session/authentication to keep you signed in and secure.</li>
                                <li><strong>Analytics/Ads:</strong> Not used at this time. If introduced later, we will disclose details and obtain consent where required.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 6 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">6) Retention &amp; Deletion</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>As a demo/beta, we plan to delete most personal data (accounts, comments, feedback, caches) within 30 days after the demo ends.</li>
                                <li>Security/error logs are retained briefly, then deleted.</li>
                                <li>If a longer period is required by law, we retain only the minimum necessary.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 7 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">7) Sharing &amp; Processors</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Database/Auth: Supabase</li>
                                <li>LLM Processing: OpenAI API (includes transmission of your input text)</li>
                                <li>Lyrics/Metadata: Genius and similar third-party APIs</li>
                                <li>Hosting/Runtime: e.g., Vercel/Node.js</li>
                            </ul>
                            <p className="text-gray-500 text-sm mt-2">
                                ※ These providers may process data outside your country. Transfers are limited to what is necessary for the service.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 8 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">8) International Transfers</h2>
                            <p className="text-gray-700 leading-relaxed">
                                Your data may be processed outside your jurisdiction depending on provider locations and network paths.
                                We apply reasonable safeguards, including encryption in transit.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 9 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">9) Security Measures</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>HTTPS encryption; least-privilege access control</li>
                                <li>OAuth 2.0 authentication; secure key/env management</li>
                                <li>DB schema/constraints and access controls for integrity</li>
                                <li>Security monitoring and incident response</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 10 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">10) Children</h2>
                            <p className="text-gray-700 leading-relaxed">
                                The service is not intended for users under 14. If we learn that such data was collected, we will delete it promptly.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 11 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">11) Your Rights</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Request access, rectification, deletion, or restriction of processing</li>
                                <li>Withdraw consent and request account deletion</li>
                            </ul>
                            <p className="text-gray-700 leading-relaxed mt-2">
                                How to exercise: email tpwls0831@naver.com and we will respond within a reasonable time.
                            </p>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 12 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">12) User Responsibilities</h2>
                            <ul className="list-disc pl-6 text-gray-700 space-y-2">
                                <li>Do not post sensitive personal data or content that may infringe others’ rights in comments/feedback.</li>
                                <li>Third-party materials (lyrics, song metadata, etc.) are processed only to provide translation/interpretation.</li>
                            </ul>
                        </section>

                        <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-8" />

                        {/* 13 */}
                        <section className="max-w-screen-xl mx-auto px-6 py-8">
                            <h2 className="text-3xl font-bold mb-4 text-black">13) Changes</h2>
                            <p className="text-gray-700 leading-relaxed">
                                We will notify you in-service of any material changes and their effective date.
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
