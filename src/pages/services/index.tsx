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
  SimpleGrid
} from '@chakra-ui/react'
import { FaServer, FaNetworkWired } from 'react-icons/fa'
import { getChains } from '@/utils/chains'
import { ChainItem } from '@/components/ChainBar'

export default function Services() {
  // Colors
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const textColor = useColorModeValue('gray.700', 'gray.300')
  
  // Get chains
  const mainnetChains = getChains('mainnet')
  const testnetChains = getChains('testnet')

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
          
          <Tabs 
            variant="soft-rounded" 
            colorScheme="blue" 
            isLazy
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
                  columns={{ base: 1, sm: 2, md: 2, lg: 3 }} 
                  spacing={8}
                  mb={8}
                >
                  {mainnetChains.map((item) => (
                    <Box 
                      key={item.name + 'mainnet'} 
                      transform="scale(1)" 
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.03)" }}
                    >
                      <ChainItem
                        chain={item}
                        network={'mainnet'}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>
              
              <TabPanel p={0}>
                <SimpleGrid 
                  columns={{ base: 1, sm: 2, md: 2, lg: 3 }} 
                  spacing={8}
                  mb={8}
                >
                  {testnetChains.map((item) => (
                    <Box 
                      key={item.name + 'testnet'} 
                      transform="scale(1)" 
                      transition="transform 0.2s"
                      _hover={{ transform: "scale(1.03)" }}
                    >
                      <ChainItem
                        chain={item}
                        network={'testnet'}
                      />
                    </Box>
                  ))}
                </SimpleGrid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Container>
        
        <Footer />
      </Box>
    </>
  )
}