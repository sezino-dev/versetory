// /src/pages/developers.tsx

import Head from 'next/head'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { useState, KeyboardEvent } from 'react'

export default function Developers() {
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
                <title>Developers | Verse’tory</title>
                <meta name="description" content="Verse’tory Developers" />
                <meta name="robots" content="noindex" />
            </Head>

            <Header />

            <main className="bg-white text-gray-800">
                {/* Hero */}
                <section className="max-w-screen-xl mx-auto px-6 py-20 text-left">
                    <h1
                        className="text-4xl md:text-5xl font-bold leading-tight mb-4 text-black cursor-pointer select-none"
                        onClick={toggleLang}
                        onKeyDown={onTitleKey}
                        tabIndex={0}
                        aria-label="Click to toggle language"
                    >
                        {isKo ? 'Developers' : 'Developers'}
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600">
                        {isKo
                            ? '시연용으로 제한된 공개 엔드포인트와 샘플 SDK를 제공합니다.'
                            : 'Limited public endpoints and a sample SDK for demo purposes.'}
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12" />

                {/* Quickstart */}
                <section className="max-w-screen-xl mx-auto px-6 py-10">
                    <h2 className="text-3xl font-bold mb-4 text-black">{isKo ? 'Quickstart (3분)' : 'Quickstart (3min)'}</h2>
                    <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                        <li>{isKo ? 'SDK 파일을 추가: /lib/versetory-sdk.ts' : 'Add the SDK file: /lib/versetory-sdk.ts'}</li>
                        <li>{isKo ? '기본 설정(baseURL, 선택적 x-api-key) 입력' : 'Set baseURL (optional x-api-key)'}</li>
                        <li>{isKo ? '첫 호출로 응답 확인' : 'Make your first request'}</li>
                    </ol>

                    {/* 코드블록 너비: 모바일 100%, md 이상 50vw 한도 */}
                    <div className="w-full md:w-1/2 max-w-[50vw] mt-4">
                        <pre className="bg-black text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">{`import { VersetoryClient } from "@/lib/versetory-sdk";

const client = new VersetoryClient({
  baseURL: "https://your-domain.example",
  timeoutMs: 10000
});

const songs = await client.searchSongs("kendrick");
if (songs[0]) {
  const song = await client.getSongById(songs[0].id);
  const lines = await client.getInterpretations(songs[0].id);
}`}</pre>
                    </div>

                    <p className="text-gray-600 mt-2">
                        {isKo
                            ? '개발 단계에서 네트워크 없이 확인하려면 mock: true 옵션을 사용하세요.'
                            : 'Use mock: true to test locally without network calls.'}
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                {/* Reference (요약 표) */}
                <section className="max-w-screen-xl mx-auto px-6 py-10">
                    <h2 className="text-3xl font-bold mb-4 text-black">{isKo ? 'API Reference (요약)' : 'API Reference (Brief)'}</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="border px-3 py-2 text-left">Method</th>
                                    <th className="border px-3 py-2 text-left">Path</th>
                                    <th className="border px-3 py-2 text-left">Query/Body</th>
                                    <th className="border px-3 py-2 text-left">Returns</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="border px-3 py-2">GET</td>
                                    <td className="border px-3 py-2"><code>/api/search</code></td>
                                    <td className="border px-3 py-2"><code>q</code> or <code>id</code></td>
                                    <td className="border px-3 py-2"><code>Song[]</code> or <code>Song</code></td>
                                </tr>
                                <tr>
                                    <td className="border px-3 py-2">GET</td>
                                    <td className="border px-3 py-2"><code>/api/interpretations</code></td>
                                    <td className="border px-3 py-2"><code>songId</code></td>
                                    <td className="border px-3 py-2"><code>InterpretationLine[]</code></td>
                                </tr>
                                <tr>
                                    <td className="border px-3 py-2">GET</td>
                                    <td className="border px-3 py-2"><code>/api/comments</code></td>
                                    <td className="border px-3 py-2"><code>songId</code></td>
                                    <td className="border px-3 py-2"><code>Comment[]</code></td>
                                </tr>
                                <tr>
                                    <td className="border px-3 py-2">POST</td>
                                    <td className="border px-3 py-2"><code>/api/comments</code></td>
                                    <td className="border px-3 py-2"><code>songId, content, interpretationId?</code></td>
                                    <td className="border px-3 py-2"><code>Comment</code></td>
                                </tr>
                                <tr>
                                    <td className="border px-3 py-2">POST</td>
                                    <td className="border px-3 py-2"><code>/api/feedback</code></td>
                                    <td className="border px-3 py-2"><code>content</code></td>
                                    <td className="border px-3 py-2"><code>Feedback</code></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {isKo
                            ? '오류 포맷: {"error": {"code": "...", "message": "..."}} · 리밋 예시: 60 req/min/IP (키 사용 시 120)'
                            : 'Error format: {"error": {"code": "...", "message": "..."}} · Rate limit example: 60 req/min/IP (120 with key)'}
                    </p>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                {/* SDK & Samples */}
                <section className="max-w-screen-xl mx-auto px-6 py-10">
                    <h2 className="text-3xl font-bold mb-4 text-black">{isKo ? 'SDK & 샘플' : 'SDK & Samples'}</h2>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li>/lib/versetory-sdk.ts</li>
                        <li>/public/devkit/Versetory.postman_collection.json</li>
                        <li>/public/devkit/samples/search.json, /public/devkit/samples/interpretations.json</li>
                    </ul>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                {/* Downloads */}
                <section className="max-w-screen-xl mx-auto px-6 py-10">
                    <h2 className="text-3xl font-bold mb-4 text-black">{isKo ? '다운로드' : 'Downloads'}</h2>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li>
                            Postman/Insomnia:{' '}
                            <a
                                className="text-gray-500 hover:text-black transition-colors"
                                href="/devkit/Versetory.postman_collection.json"
                                download
                            >
                                /devkit/Versetory.postman_collection.json
                            </a>
                        </li>
                        <li>
                            Samples:{' '}
                            <a
                                className="text-gray-500 hover:text-black transition-colors"
                                href="/devkit/samples/search.json"
                                download
                            >
                                /devkit/samples/search.json
                            </a>
                            {', '}
                            <a
                                className="text-gray-500 hover:text-black transition-colors"
                                href="/devkit/samples/interpretations.json"
                                download
                            >
                                /devkit/samples/interpretations.json
                            </a>
                        </li>
                        <li>
                            ZIP Bundle:{' '}
                            <a
                                className="text-gray-500 hover:text-black transition-colors"
                                href="/api/devkit.zip"
                            >
                                /api/devkit.zip
                            </a>
                        </li>
                    </ul>
                </section>

                <hr className="border-t border-[#E6E6E6] max-w-screen-xl mx-auto my-12" />

                {/* Policies */}
                <section className="max-w-screen-xl mx-auto px-6 py-10">
                    <h2 className="text-3xl font-bold mb-4 text-black">{isKo ? '정책' : 'Policies'}</h2>

                    <h3 className="text-xl font-semibold text-black mb-2">{isKo ? '범위 & 제한' : 'Scope & Limitations'}</h3>
                    <p className="text-gray-600 mb-4">
                        {isKo
                            ? '본 샘플은 시연·학습용입니다. 안정성, 가용성, 호환성은 보장되지 않습니다. 레이트 리밋, 데이터 범위, 정책 변경은 예고 없이 조정될 수 있습니다.'
                            : 'This sample is for demo/educational use. Stability, availability, and compatibility are not guaranteed. Rate limits, data scope, and policies may change without notice.'}
                    </p>

                    <h3 className="text-xl font-semibold text-black mb-2">{isKo ? '보안' : 'Security'}</h3>
                    <p className="text-gray-600">
                        {isKo
                            ? '필요 시 x-api-key 헤더를 사용할 수 있습니다. 키 공유 금지. 민감정보 전송 금지. 클라이언트에 비공개 키 하드코딩 금지.'
                            : 'Use x-api-key when required. Do not share keys. Do not send sensitive data. Do not hardcode private keys in clients.'}
                    </p>
                </section>

                {/* Contact */}
                <section className="max-w-screen-xl mx-auto px-6 py-10">
                    <h2 className="text-3xl font-bold mb-4 text-black">{isKo ? '문의' : 'Contact'}</h2>
                    <ul className="list-disc pl-6 text-gray-600 space-y-2">
                        <li>tpwls0831@naver.com</li>
                    </ul>
                </section>

                <div className="h-36" />
            </main>

            <Footer />
        </>
    )
}
