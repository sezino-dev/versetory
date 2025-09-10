import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="ko">
      <Head>
        {/* 파비콘 */}
        <link rel="icon" href="/favicon.ico" />

        {/* 메타 태그 */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Verse’tory - AI 기반 영어 가사 해석 & 문화적 해설 서비스" />

        {/* 오픈그래프 (SNS 공유용) */}
        <meta property="og:title" content="Verse’tory" />
        <meta property="og:description" content="영어 가사를 한국어로 해석하고 문화적 맥락까지 전달하는 AI 서비스" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/Versetory_Logo.png" />
        <meta property="og:url" content="https://your-domain.com" />

        {/* 트위터 카드 */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Verse’tory" />
        <meta name="twitter:description" content="AI 기반 영어 가사 해석 & 문화적 해설 서비스" />
        <meta name="twitter:image" content="/Versetory_Logo.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
