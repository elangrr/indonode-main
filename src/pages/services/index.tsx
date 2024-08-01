import Head from 'next/head'
import Footer from '@/components/Footer'
import { Box, Heading, Stack, Text } from '@chakra-ui/react'
import { getChains } from '@/utils/chains'
import { ChainItem } from '@/components/ChainBar'

export default function Services() {
  return (
    <>
      <Head>
        <title>Indonode - Services</title>
        <meta name='description' content='Indonode - Services' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main>
        <Box
          mx={{ base: 6, lg: 20 }}
          minH={'100vh'}
          py={{ base: '80px', md: '120px' }}
        >
          <Heading fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} mb={2}>
            Services
          </Heading>
          <Text mb={10}>
            Pick a project from the list below to view guides and commands.
          </Text>
          <Stack spacing={4} mb={12}>
            <Heading fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
              Mainnets
            </Heading>
            <Stack direction={'row'} spacing={4} wrap={'wrap'}>
              {getChains('mainnet').map((item) => (
                <ChainItem
                  chain={item}
                  network={'mainnet'}
                  key={item.name + 'mainnet'}
                />
              ))}
            </Stack>
          </Stack>
          <Stack spacing={4} mb={12}>
            <Heading fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
              Testnets
            </Heading>
            <Stack direction={'row'} spacing={4} wrap={'wrap'}>
              {getChains('testnet').map((item) => (
                <ChainItem
                  chain={item}
                  network={'testnet'}
                  key={item.name + 'mainnet'}
                />
              ))}
            </Stack>
          </Stack>
        </Box>
        <Footer />
      </main>
    </>
  )
}
