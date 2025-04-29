import Head from 'next/head'
import Footer from '@/components/Footer'
import { 
  Box, 
  Heading, 
  Stack, 
  Text, 
  Container, 
  useColorModeValue, 
  Tab,
  Tabs,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
  Icon,
  SimpleGrid,
  useBreakpointValue,
  Skeleton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import { FaServer, FaNetworkWired } from 'react-icons/fa'
import { getChains, Chain, Network } from '@/utils/chains'
import { ChainItem } from '@/components/ChainItem'
import { useMemo, useState } from 'react'

interface NetworkTabsProps {
  mainnetChains: Chain[]
  testnetChains: Chain[]
  isLoading?: boolean
  error?: Error | null
}

const EMPTY_CHAIN: Chain = {
  title: '',
  name: '',
  coinGeckoId: '',
  imageURL: '',
  version: '',
  chainId: '',
  description: [''],
  binary: '',
  denom: '',
  gasPrice: '',
  links: {
    repository: '',
    binary: '',
    website: '',
    twitter: '',
    discord: '',
    peer: '',
    rpc: '',
    api: '',
    grpc: '',
    addrbook: '',
    genesis: '',
    snapshot: '',
    explorer: '',
  }
}

const NetworkTabs = ({ mainnetChains, testnetChains, isLoading = false, error = null }: NetworkTabsProps) => {
  const columns = useBreakpointValue({ 
    base: 1, 
    sm: 2, 
    md: 2, 
    lg: 3 
  })

  if (error) {
    return (
      <Alert status="error" variant="subtle" borderRadius="md">
        <AlertIcon />
        <AlertTitle>Error loading chains</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    )
  }

  return (
    <Tabs 
      variant="soft-rounded" 
      colorScheme="blue" 
      isLazy
      defaultIndex={0}
    >
      <TabList mb={8}>
        <Tab fontWeight="medium" fontSize="lg" py={3} px={6}>
          <Icon as={FaNetworkWired} mr={2} />
          Mainnet
          <Badge ml={2} colorScheme="green" borderRadius="full">
            {mainnetChains.length}
          </Badge>
        </Tab>
        <Tab fontWeight="medium" fontSize="lg" py={3} px={6}>
          <Icon as={FaServer} mr={2} />
          Testnet
          <Badge ml={2} colorScheme="purple" borderRadius="full">
            {testnetChains.length}
          </Badge>
        </Tab>
      </TabList>
      
      <TabPanels>
        <TabPanel p={0}>
          <SimpleGrid 
            columns={columns} 
            spacing={8}
            mb={8}
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Box key={`mainnet-skeleton-${i}`}>
                  <ChainItem
                    chain={EMPTY_CHAIN}
                    network={Network.Mainnet}
                    isLoading={true}
                  />
                </Box>
              ))
            ) : (
              mainnetChains.map((item) => (
                <Box 
                  key={item.name + 'mainnet'} 
                  transform="scale(1)" 
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.03)" }}
                >
                  <ChainItem
                    chain={item}
                    network={Network.Mainnet}
                  />
                </Box>
              ))
            )}
          </SimpleGrid>
        </TabPanel>
        
        <TabPanel p={0}>
          <SimpleGrid 
            columns={columns} 
            spacing={8}
            mb={8}
          >
            {isLoading ? (
              Array(6).fill(0).map((_, i) => (
                <Box key={`testnet-skeleton-${i}`}>
                  <ChainItem
                    chain={EMPTY_CHAIN}
                    network={Network.Testnet}
                    isLoading={true}
                  />
                </Box>
              ))
            ) : (
              testnetChains.map((item) => (
                <Box 
                  key={item.name + 'testnet'} 
                  transform="scale(1)" 
                  transition="transform 0.2s"
                  _hover={{ transform: "scale(1.03)" }}
                >
                  <ChainItem
                    chain={item}
                    network={Network.Testnet}
                  />
                </Box>
              ))
            )}
          </SimpleGrid>
        </TabPanel>
      </TabPanels>
    </Tabs>
  )
}

export default function Services() {
  // Colors
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  
  // State
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  
  // Memoize chains to prevent unnecessary recalculations
  const { mainnetChains, testnetChains } = useMemo(() => {
    try {
      return {
        mainnetChains: getChains(Network.Mainnet),
        testnetChains: getChains(Network.Testnet)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load chains'))
      return { mainnetChains: [], testnetChains: [] }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Indonode - Services</title>
        <meta name='description' content='Validator node services and setup guides for Cosmos ecosystem chains' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      
      <Box as="main" bg={bgColor} minH="100vh">
        <Container maxW="container.xl" pt={{ base: '80px', md: '100px' }} pb="50px">
          <Box mb={10}>
            <Heading 
              fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }} 
              mb={3}
              bgGradient="linear(to-r, blue.400, purple.500)"
              bgClip="text"
            >
              Validator Services
            </Heading>
            <Text 
              fontSize={{ base: 'lg', md: 'xl' }} 
              color={textColor}
              maxW="3xl"
            >
              Complete node setup guides, installation instructions, and useful commands for Cosmos ecosystem chains.
            </Text>
          </Box>
          
          <NetworkTabs 
            mainnetChains={mainnetChains}
            testnetChains={testnetChains}
            isLoading={isLoading}
            error={error}
          />
        </Container>
        
        <Footer />
      </Box>
    </>
  )
}