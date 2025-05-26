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
  Flex,
  Divider,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { FaServer, FaNetworkWired, FaShieldAlt, FaCube } from 'react-icons/fa'
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
    lg: 3,
    xl: 4
  })

  const tabBg = useColorModeValue('white', 'gray.800')
  const selectedTabBg = useColorModeValue('blue.50', 'blue.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  if (error) {
    return (
      <Alert 
        status="error" 
        variant="left-accent" 
        borderRadius="xl"
        bg={useColorModeValue('red.50', 'red.900')}
        borderColor={useColorModeValue('red.200', 'red.700')}
        py={6}
      >
        <AlertIcon boxSize={6} />
        <Box>
          <AlertTitle fontSize="lg" fontWeight="bold">Error loading chains</AlertTitle>
          <AlertDescription fontSize="md" mt={1}>{error.message}</AlertDescription>
        </Box>
      </Alert>
    )
  }

  return (
    <Box 
      bg={useColorModeValue('white', 'gray.800')} 
      borderRadius="2xl" 
      p={8}
      shadow="xl"
      border="1px"
      borderColor={borderColor}
    >
      <Tabs 
        variant="unstyled" 
        isLazy
        defaultIndex={0}
      >
        <TabList 
          bg={useColorModeValue('gray.100', 'gray.700')} 
          borderRadius="xl" 
          p={2}
          mb={10}
          gap={2}
        >
          <Tab 
            fontWeight="semibold" 
            fontSize="lg" 
            py={4} 
            px={8}
            borderRadius="lg"
            color={useColorModeValue('gray.600', 'gray.300')}
            _selected={{
              bg: useColorModeValue('white', 'gray.600'),
              color: useColorModeValue('blue.600', 'blue.300'),
              shadow: 'md'
            }}
            _hover={{
              bg: useColorModeValue('gray.50', 'gray.650'),
            }}
          >
            <HStack spacing={3}>
              <Icon as={FaShieldAlt} />
              <Text>Mainnet</Text>
              <Badge 
                colorScheme="green" 
                borderRadius="full" 
                px={3} 
                py={1}
                fontSize="sm"
                fontWeight="bold"
              >
                {mainnetChains.length}
              </Badge>
            </HStack>
          </Tab>
          <Tab 
            fontWeight="semibold" 
            fontSize="lg" 
            py={4} 
            px={8}
            borderRadius="lg"
            color={useColorModeValue('gray.600', 'gray.300')}
            _selected={{
              bg: useColorModeValue('white', 'gray.600'),
              color: useColorModeValue('purple.600', 'purple.300'),
              shadow: 'md'
            }}
            _hover={{
              bg: useColorModeValue('gray.50', 'gray.650'),
            }}
          >
            <HStack spacing={3}>
              <Icon as={FaCube} />
              <Text>Testnet</Text>
              <Badge 
                colorScheme="purple" 
                borderRadius="full" 
                px={3} 
                py={1}
                fontSize="sm"
                fontWeight="bold"
              >
                {testnetChains.length}
              </Badge>
            </HStack>
          </Tab>
        </TabList>
        
        <TabPanels>
          <TabPanel p={0}>
            <SimpleGrid 
              columns={columns} 
              spacing={6}
              mb={8}
            >
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
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
                  <Box key={item.name + 'mainnet'}>
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
              spacing={6}
              mb={8}
            >
              {isLoading ? (
                Array(8).fill(0).map((_, i) => (
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
                  <Box key={item.name + 'testnet'}>
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
    </Box>
  )
}

export default function Services() {
  // Enhanced color scheme
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.600', 'gray.300')
  const headingColor = useColorModeValue('gray.800', 'white')
  
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
        <title>Indonode - Validator Services</title>
        <meta name='description' content='Professional validator node services and setup guides for Cosmos ecosystem chains' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      
      <Box as="main" bg={bgColor} minH="100vh">
        <Container maxW="container.xl" pt={{ base: '100px', md: '120px' }} pb="80px">
          {/* Enhanced Header Section */}
          <VStack spacing={8} mb={12} align="stretch">
            <Box textAlign="center" maxW="4xl" mx="auto">
              <Heading 
                fontSize={{ base: '4xl', md: '5xl', lg: '6xl' }} 
                fontWeight="bold"
                lineHeight="1.1"
                color={headingColor}
                mb={6}
              >
                Validator{' '}
                <Box
                  as="span"
                  bgGradient="linear(to-r, blue.400, purple.500, cyan.400)"
                  bgClip="text"
                >
                  Services
                </Box>
              </Heading>
              
              <Text 
                fontSize={{ base: 'xl', md: '2xl' }} 
                color={textColor}
                lineHeight="1.6"
                fontWeight="medium"
                maxW="3xl"
                mx="auto"
              >
                Professional node setup guides, installation instructions, and comprehensive tooling for Cosmos ecosystem chains
              </Text>
            </Box>

            {/* Stats Section */}
            <Flex
              justify="center"
              wrap="wrap"
              gap={8}
              mt={8}
            >
              <VStack spacing={2}>
                <HStack>
                  <Icon as={FaShieldAlt} color="green.500" boxSize={5} />
                  <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                    {mainnetChains.length}
                  </Text>
                </HStack>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  Mainnet Chains
                </Text>
              </VStack>
              
              <Box height="50px" width="1px" bg={useColorModeValue('gray.300', 'gray.600')} />
              
              <VStack spacing={2}>
                <HStack>
                  <Icon as={FaCube} color="purple.500" boxSize={5} />
                  <Text fontSize="2xl" fontWeight="bold" color={headingColor}>
                    {testnetChains.length}
                  </Text>
                </HStack>
                <Text fontSize="sm" color={textColor} fontWeight="medium">
                  Testnet Chains
                </Text>
              </VStack>
            </Flex>
          </VStack>
          
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