import { ReactNode, useEffect } from 'react'
import Sidebar from '@/components/Sidebar'
import ChainBar from '@/components/ChainBar'
import { Box, Flex, Heading, calc, useColorModeValue } from '@chakra-ui/react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { setChain, setIsFetched, selectChain } from '@/store/chainSlice'
import { useChain } from '@/hooks/use-query'
import Head from 'next/head'
import Footer from '@/components/Footer'

export default function ServiceLayout({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const router = useRouter()
  const { network, chainName } = router.query
  const chain = useSelector(selectChain)
  const { data, isFetched } = useChain(network as string, chainName as string)

  useEffect(() => {
    dispatch(setChain(data))
    dispatch(setIsFetched(isFetched))
  }, [data, isFetched, dispatch]) // Ensure dispatch is included

  const bgColor = useColorModeValue('white', 'gray.900')
  const color = useColorModeValue('gray.900', 'white')

  return (
    <>
      <Head>
        <title>{chain?.title} - Services</title>
        <meta name='description' content={`${chain?.title} - Services`} />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main style={{ background: '#F1F1F1' }}>
        {chain ? (
          <Box w={'100%'} minH={'100vh'} pt={'60px'}>
            <Flex
              direction={{ base: 'column', md: 'row' }}
              p={6}
              w={'100%'}
              gap={6}
            >
              <Sidebar chain={chain} />
              <Flex
                direction={'column'}
                w={{ md: 'calc(100% - 300px)', lg: 'calc(100% - 380px)' }}
                gap={4}
              >
                <ChainBar chain={chain} />
                <Box
                  bg={bgColor}
                  color={color}
                  boxShadow={'sm'}
                  rounded={'lg'}
                  px={6}
                  py={4}
                >
                  {children}
                </Box>
              </Flex>
            </Flex>
          </Box>
        ) : (
          isFetched && (
            <Box w={'100%'} minH={'80vh'} pt={'60px'}>
              <Heading textAlign={'center'} p={12}>
                Not Found
              </Heading>
            </Box>
          )
        )}
      </main>
      <Footer />
    </>
  )
}
