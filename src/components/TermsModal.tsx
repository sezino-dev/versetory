// /src/components/TermsModal.tsx
'use client'

import { useEffect, useState, KeyboardEvent, MouseEvent } from 'react'

type Props = {
    open: boolean
    onClose: () => void
}

export default function TermsModal({ open, onClose }: Props) {
    // 기본 언어: 영어
    const [isKo, setIsKo] = useState(false)
    useEffect(() => {
        if (open) setIsKo(false)
    }, [open])

    // ESC
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent | any) => {
            if (e.key === 'Escape') onClose()
        }
        document.addEventListener('keydown', onKey)
        return () => document.removeEventListener('keydown', onKey)
    }, [open, onClose])

    const stop = (e: MouseEvent) => e.stopPropagation()
    const toggleLang = () => setIsKo(v => !v)
    const onTitleKey = (e: KeyboardEvent<HTMLHeadingElement>) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            toggleLang()
        }
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div
                className="w-full max-w-3xl bg-white rounded-xl shadow-xl overflow-hidden"
                onClick={stop}
            >
                {/* 제목 아래 회색 부제목 */}
                <header className="px-6 py-5 border-b border-gray-200 flex items-start justify-between gap-4">
                    <div className="min-w-0">
                        <h2
                            className="text-2xl md:text-3xl font-bold text-black cursor-pointer select-none"
                            onClick={toggleLang}
                            onKeyDown={onTitleKey}
                            tabIndex={0}
                            aria-label="Click to toggle language"
                            title="Click to toggle language"
                        >
                            {isKo ? '이용약관' : 'Terms of Service'}
                        </h2>
                        <p className="mt-1 text-gray-600">
                            Terms of Verse’tory (한/영 전환)
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-sm text-gray-500 hover:text-black shrink-0"
                        aria-label="Close"
                        title="Close"
                    >
                        Close
                    </button>
                </header>

                {/* 본문 */}
                <div className="px-6 pt-3 pb-6 text-left">
                    <div className="max-h-[65vh] overflow-y-auto pr-2">
                        {isKo ? (
                            <div className="text-gray-700 leading-relaxed space-y-6">
                                <p>시행일: 00 00 2025 (KST)</p>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">1. 목적</h3>
                                    <p>
                                        본 문서는 Verse’tory(이하 “서비스”)의 이용 조건과 개인정보 처리 원칙을 규정합니다.
                                        서비스는 가사의 문화·언어적 맥락 해설과 번역을 제공하고, 로그인 이용자에게 댓글(Comments) 및 의견 보내기(Send Feedback) 기능을 제공합니다.
                                        본 문서는 이용자의 권리 보호와 투명한 정보 처리를 핵심 가치로 삼습니다.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">2. 계정 및 로그인(OAuth)</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>서비스는 Google, Facebook, 카카오의 OAuth 인증을 지원합니다.</li>
                                        <li>댓글·피드백 기능은 로그인 이용자에게만 제공되며, 비로그인 이용자는 열람 중심의 제한된 기능을 이용할 수 있습니다.</li>
                                        <li>로그인 시 수집되는 식별 정보는 최소한으로 유지하며, 계정 관리·악용 방지·권한 부여 목적 외로 사용하지 않습니다.</li>
                                        <li>동일 이메일로 복수 제공자 로그인 시, 서비스 고지 기준의 계정 연동 또는 분리 정책을 적용할 수 있습니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">3. 수집 항목 및 처리 근거</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>필수 항목: 이메일 주소, 로그인 제공자(provider), 생성 일시.</li>
                                        <li>이용자 생성 콘텐츠(UGC): 댓글·피드백 내용(필요 시 제목·사유 등 포함).</li>
                                        <li>기술 로그: 접속 일시, 요청·응답·오류 로그 등 보안·장애 대응 목적의 최소한 정보.</li>
                                        <li>처리는 이용자 동의, 정당한 이익, 법령 준수 등 적법한 근거에 따라 수행합니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">4. 이용 목적</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>본인 식별, 인증 세션 관리, 권한 부여 및 악용 방지.</li>
                                        <li>서비스 운영과 기능 안정화, 오류 분석 및 품질 개선.</li>
                                        <li>연구·시연(데모)·교육 목적의 통계·분석(개인 식별 불가능한 형태).</li>
                                        <li>법령 준수를 위한 기록 관리(필요한 경우에 한함).</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">5. 보관 기간 및 파기</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>본 서비스는 졸업 작품 시연을 목적으로 하는 베타이며, 시연 종료 후 장기 보관을 위한 유료 DB 운영 계획이 없습니다.</li>
                                        <li>시연 종료가 공지되면, 공지일로부터 최대 30일 이내에 계정 식별 정보 및 UGC(댓글·피드백)를 일괄 삭제합니다.</li>
                                        <li>운영 DB뿐 아니라 식별 가능한 백업·캐시·로그도 합리적 범위에서 삭제하며, 기술적으로 불가피한 경우 목적 달성 즉시 파기합니다.</li>
                                        <li>법령상 보관 의무가 있는 정보는 해당 의무 기간 동안 최소 범위로 보관 후 지체 없이 파기합니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">6. 이용자 권리와 행사 방법</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>개인정보 열람·정정·삭제·처리 정지·동의 철회 요청 가능.</li>
                                        <li>법령상 의무가 없는 한 합리적인 기간 내 처리.</li>
                                        <li>본인 확인 절차가 필요할 수 있으며, 절차와 결과 통지는 서비스 고지 기준을 따릅니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">7. 보안 조치</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>HTTPS 전송 암호화, 최소권한 부여, 접근 기록 관리.</li>
                                        <li>운영·개발 환경 분리, 비밀정보 최소 취급, 주기적 점검.</li>
                                        <li>수탁자 이용 시 동등한 수준의 안전성 확보 요구.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">8. 처리 위탁 및 국외 이전</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>인증, 저장, 분석 등 일부 처리는 외부 인프라에서 수행될 수 있습니다.</li>
                                        <li>물리 위치에 따라 국외에서 처리·저장이 이루어질 수 있으며 필요한 최소 범위로만 이전합니다.</li>
                                        <li>수탁자와는 데이터 보호조치를 계약·정책으로 의무화합니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">9. 제3자 제공 제한</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>개인정보 및 UGC는 마케팅·광고 목적으로 제3자 제공하지 않습니다.</li>
                                        <li>법령상 요구, 이용자 동의, 서비스 수행 필수 경우를 제외하고 제한합니다.</li>
                                        <li>연구·통계 목적 정보는 비식별·가명 처리해 재식별이 불가능한 형태로만 활용합니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">10. 쿠키 및 유사 기술</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>로그인 유지, 세션 관리, 보안 강화를 위한 필수 쿠키 사용 가능.</li>
                                        <li>분석 도구 도입 시 목적·항목·보관 기간 고지 및 필요한 경우 동의 획득.</li>
                                        <li>브라우저에서 쿠키 제한 가능하나 일부 기능이 제한될 수 있습니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">11. 이용자 생성 콘텐츠(UGC) 정책</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>UGC는 운영·시연·품질 개선을 위해 비독점적·무상·전세계적으로 표시·저장·분석될 수 있습니다.</li>
                                        <li>상업적 2차 활용은 하지 않습니다.</li>
                                        <li>권리 침해 또는 법령·정책 위반 UGC는 사전 통지 없이 삭제 또는 접근 제한될 수 있습니다.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">12. 금지 행위</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>저작권·상표권·초상권 등 타인의 권리 침해.</li>
                                        <li>불법·유해 정보 유통, 차별·혐오 표현, 괴롭힘·스토킹.</li>
                                        <li>자동화 수집·스크래핑, 비정상 트래픽, 리버스 엔지니어링 등 남용.</li>
                                    </ul>
                                    <p className="mt-2">위반 시 기술적 조치 및 이용 제한이 이루어질 수 있습니다.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">13. 지식재산권</h3>
                                    <p>
                                        서비스의 상표, 로고, UI, 설명문 등은 서비스 제공자 또는 정당한 권리자에게 권리가 있습니다.
                                        이용자는 서비스 콘텐츠를 무단 복제·배포·변형할 수 없으며, 외부 제공 자료는 해당 권리자 정책과 법령을 따릅니다.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">14. 법적 준수 및 책임 제한</h3>
                                    <p>
                                        서비스는 관련 법령과 플랫폼·API 약관을 준수합니다. 외부 인프라 장애, 요금 제한, 네트워크 이슈 등 합리적 통제를 벗어난 사유로 인한 지연·중단에 대해 법이 허용하는 범위 내에서 책임을 제한합니다. 베타 특성상 상업 서비스와 동일 수준의 가용성·지속성을 담보하지 않습니다.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">15. 보증의 부인(As-Is)</h3>
                                    <p>
                                        서비스와 AI 기반 결과물은 “있는 그대로(As-Is)” 제공되며, 정확성·완전성·특정 목적 적합성에 대한 어떠한 보증도 없습니다. 중요한 의사결정에는 추가 검증이 권장됩니다.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">16. 서비스 변경·중단 및 고지</h3>
                                    <p>
                                        베타 특성상 기능은 수시로 수정·추가·삭제될 수 있습니다. 중요한 변경이나 운영 중단이 필요한 경우 합리적인 사전 고지를 제공하며, 데이터 보관·삭제 등 핵심 사안은 서비스 내 공지로 투명하게 안내합니다.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">17. 아동 보호</h3>
                                    <p>
                                        서비스는 원칙적으로 만 14세 미만을 대상으로 하지 않습니다. 만 14세 미만 이용은 법정대리인의 동의가 필요하며, 확인이 불가하면 이용이 제한될 수 있습니다.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">18. 개정 및 해석</h3>
                                    <p>
                                        개정 사항은 서비스 내 공지합니다. 중요한 변경은 합리적 사전 고지 후 적용됩니다.
                                        해석상 다툼이 있을 때는 이용자 권리 보호에 유리한 방향으로 합리적으로 해석합니다.
                                        준거법은 대한민국 법령이며, 분쟁은 서비스 제공자의 소재지 관할 법원을 제1심 법원으로 합니다.
                                    </p>
                                </section>
                            </div>
                        ) : (
                            <div className="text-gray-700 leading-relaxed space-y-6">
                                <p>Effective Date: 00 ??? 2025 (KST)</p>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">1. Purpose</h3>
                                    <p>
                                        This document sets forth the terms of use and the privacy principles for Verse’tory (the “Service”).
                                        The Service offers cultural/linguistic interpretation of lyrics and provides logged-in users with Comments and Send Feedback features.
                                        We prioritize user rights and transparency.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">2. Accounts &amp; OAuth Login</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>We support OAuth login via Google, Facebook, and Kakao.</li>
                                        <li>Comments/Feedback are available to logged-in users only; non-logged-in users have limited read-only access.</li>
                                        <li>We collect the minimum identifiers necessary and use them only for account management, abuse prevention, and authorization.</li>
                                        <li>If the same email is used across multiple providers, account linking or separation may apply under our posted rules.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">3. Data We Collect &amp; Legal Basis</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Required: email address, login provider, timestamp of creation.</li>
                                        <li>UGC: comments and feedback (including title/reason where applicable).</li>
                                        <li>Technical logs: access time, request/response/error logs for security and reliability.</li>
                                        <li>Processing is grounded in consent, legitimate interests, and/or legal obligations.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">4. Purposes of Use</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Identification, session management, authorization, and abuse prevention.</li>
                                        <li>Service operation, stability, error analysis, and quality improvement.</li>
                                        <li>Research/demo/education statistics in a non-identifiable form.</li>
                                        <li>Record-keeping to satisfy legal obligations where necessary.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">5. Retention &amp; Deletion</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>This is a beta built for a graduation demo; long-term storage is not guaranteed.</li>
                                        <li>Within 30 days after the demo end is announced, account identifiers and UGC will be deleted.</li>
                                        <li>Deletion covers the operational DB and, where reasonable, identifiable backups/caches/logs; technically unavoidable remnants are removed as soon as the purpose ends.</li>
                                        <li>Where the law requires retention, we keep the minimum necessary and delete promptly after the period expires.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">6. Your Rights &amp; How to Exercise Them</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Access, rectification, deletion, restriction, and withdrawal of consent.</li>
                                        <li>Requests handled within a reasonable time unless the law requires otherwise.</li>
                                        <li>Identity verification may be required; procedures and notifications follow our posted rules.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">7. Security Measures</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>HTTPS in transit, least-privilege access, and access logging.</li>
                                        <li>Segregated ops/dev environments, minimal handling of secrets, periodic reviews.</li>
                                        <li>Processors must meet comparable security requirements.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">8. Processing by Vendors &amp; Cross-Border Transfer</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Parts of authentication, storage, and analytics may run on cloud/external infrastructure.</li>
                                        <li>Depending on location, data may be processed/stored outside your country; transfers are limited to what’s necessary.</li>
                                        <li>Vendor safeguards are enforced by contract and policy.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">9. Sharing with Third Parties</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>No sale or rental of personal data or UGC for marketing/advertising.</li>
                                        <li>Disclosure is limited except where required by law, with your consent, or essential to provide the Service.</li>
                                        <li>Research/statistics use is de-identified or pseudonymized to prevent re-identification.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">10. Cookies &amp; Similar Technologies</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Essential cookies may be used for session continuity and security.</li>
                                        <li>Analytics tools, if introduced, will be disclosed with purpose/items/retention and consent where required.</li>
                                        <li>You may limit cookies in your browser, but some features may be affected.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">11. User-Generated Content (UGC)</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>UGC may be displayed, stored, and analyzed on a non-exclusive, royalty-free, worldwide basis for operation, demo, and quality improvement.</li>
                                        <li>No secondary commercial exploitation (sale/rental).</li>
                                        <li>UGC that infringes rights or violates law/policy may be removed or restricted without prior notice.</li>
                                    </ul>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">12. Prohibited Conduct</h3>
                                    <ul className="list-disc pl-6 space-y-1">
                                        <li>Infringing copyrights, trademarks, publicity/privacy rights.</li>
                                        <li>Illegal/harmful content, hate/harassment, stalking.</li>
                                        <li>Automated scraping, abnormal traffic, reverse engineering, or other abuse.</li>
                                    </ul>
                                    <p className="mt-2">Violations may result in technical measures and usage restrictions.</p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">13. Intellectual Property</h3>
                                    <p>
                                        Marks, logos, UI, and copy on the Service belong to us or rightful owners.
                                        You may not copy, distribute, or modify Service content without permission; external materials comply with rightsholder policies and law.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">14. Compliance &amp; Limitation of Liability</h3>
                                    <p>
                                        We comply with applicable laws and platform/API terms.
                                        To the extent permitted by law, we are not liable for delays/outages beyond our reasonable control (e.g., vendor outages, network issues).
                                        As a beta, we do not guarantee commercial-grade availability or continuity.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">15. Disclaimer (As-Is)</h3>
                                    <p>
                                        The Service and AI outputs are provided “as is,” without warranties of accuracy, completeness, or fitness for a particular purpose.
                                        Use outputs for learning/research/reference and seek additional verification for important decisions.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">16. Changes, Suspension &amp; Notices</h3>
                                    <p>
                                        Features may be updated, added, or removed from time to time.
                                        Significant changes or suspension will be announced with reasonable prior notice;
                                        core matters like retention/deletion will be transparently posted within the Service.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">17. Protection of Minors</h3>
                                    <p>
                                        The Service is not intended for children under 14. If under 14, verifiable guardian consent is required; otherwise, access may be restricted.
                                    </p>
                                </section>

                                <section>
                                    <h3 className="text-xl font-semibold text-black mb-2">18. Amendments &amp; Interpretation</h3>
                                    <p>
                                        Amendments will be posted within the Service; material changes take effect after reasonable prior notice.
                                        In case of ambiguity, we interpret this document in a manner that reasonably protects user rights.
                                        Governing law is the law of the Republic of Korea; disputes are subject to the competent court at our place of business.
                                    </p>
                                </section>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
