// /src/pages/_app.tsx
import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import type { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'
import SupabaseProvider from '@/components/SupabaseProvider'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps<{ session?: Session }>) {
    return (
        <SessionProvider session={pageProps.session}>
            <SupabaseProvider>
                <Head>
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                </Head>
                <Component {...pageProps} />
            </SupabaseProvider>
        </SessionProvider>
    )
}


// Design Formet

// 제목 : text-4xl md:text-5xl font-bold text-black"
// 소제목 : "text-3xl font-bold mb-4 text-black"
// 본문 : "text-gray-600 leading-relaxed"
// 구분선 : "border-t border-[#E6E6E6] max-w-screen-xl mx-auto mb-12"
