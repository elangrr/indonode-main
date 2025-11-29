import Head from 'next/head'
import SplitScreen from '@/components/SplitScreen'
import Offered from '@/components/Offered'
import Networks from '@/components/Networks'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <>
      <Head>
        <title>Indonode - Highly Secured Staking Provider</title>
        <meta
          name='description'
          content='Indonode - Highly Secured Staking Provider'
        />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <SplitScreen />
        <Offered />
        <Networks />
        <Footer />
      </main>
    </>
  )
}

