import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import SupabaseProvider from '@/components/SupabaseProvider'
import Head from 'next/head'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SupabaseProvider>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </SupabaseProvider>
  )
}
