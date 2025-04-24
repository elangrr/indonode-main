import ServiceLayout from '@/components/ServiceLayout'
import {
  Heading,
  Stack,
  Image,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Box,
  Flex,
  Badge,
  HStack,
  VStack,
  Divider,
  useColorModeValue,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  Grid,
  GridItem,
  Link,
  Button,
  Tooltip,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { ExternalLinkIcon, CopyIcon, CheckIcon } from '@chakra-ui/icons'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useState, useEffect } from 'react'
import NextLink from 'next/link'

export default function Service() {
  const chain = useSelector(selectChain)
  const [livePeersCount, setLivePeersCount] = useState(0)
  const [copiedText, setCopiedText] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  // Colors
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const cardBg = useColorModeValue('gray.50', 'gray.700')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const textColor = useColorModeValue('gray.800', 'white')

  const fetchLivePeersCount = async () => {
    setIsLoading(true)
    try {
      if (!chain?.links.rpc) {
        setIsLoading(false)
        return
      }
      
      const response = await fetch(`${chain.links.rpc}/net_info`)
      const data = await response.json()
      const count = data.result.peers.length
      setLivePeersCount(count)
      setIsLoading(false)
    } catch (error) {
      console.error('Error fetching live peers count:', error)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (chain?.links.rpc) {
      fetchLivePeersCount()
      const interval = setInterval(fetchLivePeersCount, 10 * 60 * 1000) // Fetch peers every 10 minutes
      return () => clearInterval(interval)
    }
  }, [chain?.links.rpc])

  const peersCommand = `PEERS="$(curl -sS ${chain?.links.rpc}/net_info | jq -r '.result.peers[] | "\\(.node_info.id)@\\(.remote_ip):\\(.node_info.listen_addr)"' | awk -F ':' '{print $1":"$(NF)}' | sed -z 's|\\n|,|g;s|.$||')"
sed -i -e 's|^persistent_peers *=.*|persistent_peers = "$PEERS"|' $HOME/.${chain?.dir}/config/config.toml`

  // Handle copy function
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(''), 2000)
  }

  // Section component for consistency
  const Section = ({ children, title, id }: { children: React.ReactNode, title: string, id: string }) => (
    <Box 
      bg={bgColor} 
      p={6} 
      borderRadius="lg" 
      borderWidth="1px" 
      borderColor={borderColor}
      boxShadow="sm"
      mb={6}
      id={id}
    >
      <Heading 
        fontSize={{ base: 'xl', md: '2xl' }} 
        mb={4} 
        pb={3} 
        borderBottomWidth="1px" 
        borderColor={borderColor}
        color={accentColor}
      >
        {title}
      </Heading>
      {children}
    </Box>
  )

  return (
    <ServiceLayout>
      <Stack spacing={8}>
        {/* Hero Section */}
        <Box 
          bg={bgColor} 
          p={6} 
          borderRadius="lg" 
          borderWidth="1px" 
          borderColor={borderColor}
          boxShadow="md"
          position="relative"
          overflow="hidden"
        >
          <Flex direction={{ base: 'column', md: 'row' }} align="center">
            <Box flex={{ base: '1', md: '2' }} pr={{ md: 8 }}>
              <HStack mb={4}>
                <Heading color={textColor} size="xl">{chain?.title || 'Chain Information'}</Heading>
                <Badge colorScheme="green" fontSize="md" borderRadius="md">
                  {chain?.network}
                </Badge>
              </HStack>
              
              <Box mt={4}>
                {chain?.description.map((item, index) => (
                  <Text key={index} mb={3} fontSize="md" color={textColor}>
                    {item}
                  </Text>
                ))}
              </Box>
              
              <HStack spacing={4} mt={6}>
                <NextLink href="#installation" passHref>
                  <Button colorScheme="blue" size="md">
                    Installation Guide
                  </Button>
                </NextLink>
                <NextLink href="#endpoints" passHref>
                  <Button variant="outline" colorScheme="blue" size="md">
                    Network Endpoints
                  </Button>
                </NextLink>
              </HStack>
            </Box>
            
            <Flex 
              flex={{ base: '1', md: '1' }} 
              justify="center" 
              align="center" 
              mt={{ base: 6, md: 0 }}
            >
              <Image
                src={chain?.imageURL}
                alt={chain?.title || 'Chain Image'}
                maxW={{ base: '180px', md: '220px' }}
                objectFit="contain"
                borderRadius="lg"
                p={4}
                bg={cardBg}
                borderWidth="1px"
                borderColor={borderColor}
              />
            </Flex>
          </Flex>
        </Box>

        {/* Network Stats */}
        <Section title="Network Information" id="info">
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
            <GridItem>
              <Stat bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="sm">Chain ID</StatLabel>
                <StatNumber fontSize="xl" fontWeight="bold" color={accentColor}>
                  {chain?.chainId}
                </StatNumber>
              </Stat>
            </GridItem>
            
            <GridItem>
              <Stat bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="sm">Version</StatLabel>
                <StatNumber fontSize="xl" fontWeight="bold" color={accentColor}>
                  {chain?.version}
                </StatNumber>
              </Stat>
            </GridItem>
            
            <GridItem>
              <Stat bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="sm">Live Peers</StatLabel>
                <StatNumber fontSize="xl" fontWeight="bold" color={accentColor}>
                  {isLoading ? "Loading..." : livePeersCount}
                </StatNumber>
              </Stat>
            </GridItem>
            
            <GridItem>
              <Stat bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <StatLabel fontSize="sm">Recommended GO</StatLabel>
                <StatNumber fontSize="xl" fontWeight="bold" color={accentColor}>
                  {chain?.go}
                </StatNumber>
              </Stat>
            </GridItem>
          </Grid>

          <HStack mt={6} spacing={4} flexWrap="wrap">
            {chain?.links.explorer && (
              <Link href={chain.links.explorer} isExternal _hover={{ textDecoration: 'none' }}>
                <Button rightIcon={<ExternalLinkIcon />} variant="outline" size="sm">
                  Explorer
                </Button>
              </Link>
            )}
            
            {chain?.links.website && (
              <Link href={chain.links.website} isExternal _hover={{ textDecoration: 'none' }}>
                <Button rightIcon={<ExternalLinkIcon />} variant="outline" size="sm">
                  Website
                </Button>
              </Link>
            )}
            
            {chain?.links.github && (
              <Link href={chain.links.github} isExternal _hover={{ textDecoration: 'none' }}>
                <Button rightIcon={<ExternalLinkIcon />} variant="outline" size="sm">
                  GitHub
                </Button>
              </Link>
            )}
          </HStack>
        </Section>

        {/* Public Endpoints */}
        <Section title="Network Endpoints" id="endpoints">
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
            {chain?.links.rpc && (
              <GridItem>
                <Box 
                  bg={cardBg} 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">RPC Endpoint</Text>
                    <Button 
                      size="xs" 
                      leftIcon={copiedText === 'rpc' ? <CheckIcon /> : <CopyIcon />}
                      onClick={() => handleCopy(chain.links.rpc || '', 'rpc')}
                      colorScheme={copiedText === 'rpc' ? "green" : "gray"}
                    >
                      {copiedText === 'rpc' ? "Copied" : "Copy"}
                    </Button>
                  </HStack>
                  <Text fontFamily="mono" fontSize="sm" p={2} bg={useColorModeValue('gray.100', 'gray.600')} borderRadius="md">
                    {chain.links.rpc}
                  </Text>
                </Box>
              </GridItem>
            )}
            
            {chain?.links.api && (
              <GridItem>
                <Box 
                  bg={cardBg} 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">API Endpoint</Text>
                    <Button 
                      size="xs" 
                      leftIcon={copiedText === 'api' ? <CheckIcon /> : <CopyIcon />}
                      onClick={() => handleCopy(chain.links.api || '', 'api')}
                      colorScheme={copiedText === 'api' ? "green" : "gray"}
                    >
                      {copiedText === 'api' ? "Copied" : "Copy"}
                    </Button>
                  </HStack>
                  <Text fontFamily="mono" fontSize="sm" p={2} bg={useColorModeValue('gray.100', 'gray.600')} borderRadius="md">
                    {chain.links.api}
                  </Text>
                </Box>
              </GridItem>
            )}
            
            {chain?.links.grpc && (
              <GridItem>
                <Box 
                  bg={cardBg} 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">gRPC Endpoint</Text>
                    <Button 
                      size="xs" 
                      leftIcon={copiedText === 'grpc' ? <CheckIcon /> : <CopyIcon />}
                      onClick={() => handleCopy(chain.links.grpc || '', 'grpc')}
                      colorScheme={copiedText === 'grpc' ? "green" : "gray"}
                    >
                      {copiedText === 'grpc' ? "Copied" : "Copy"}
                    </Button>
                  </HStack>
                  <Text fontFamily="mono" fontSize="sm" p={2} bg={useColorModeValue('gray.100', 'gray.600')} borderRadius="md">
                    {chain.links.grpc}
                  </Text>
                </Box>
              </GridItem>
            )}
            
            {chain?.links.peer && (
              <GridItem>
                <Box 
                  bg={cardBg} 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontWeight="bold">Seed Node</Text>
                    <Button 
                      size="xs" 
                      leftIcon={copiedText === 'peer' ? <CheckIcon /> : <CopyIcon />}
                      onClick={() => handleCopy(chain.links.peer || '', 'peer')}
                      colorScheme={copiedText === 'peer' ? "green" : "gray"}
                    >
                      {copiedText === 'peer' ? "Copied" : "Copy"}
                    </Button>
                  </HStack>
                  <Text fontFamily="mono" fontSize="sm" p={2} bg={useColorModeValue('gray.100', 'gray.600')} borderRadius="md" overflowX="auto">
                    {chain.links.peer}
                  </Text>
                </Box>
              </GridItem>
            )}
          </Grid>

          {/* Live Peers Command */}
          <Box 
            mt={6}
            bg={cardBg} 
            p={4} 
            borderRadius="md" 
            borderWidth="1px" 
            borderColor={borderColor}
          >
            <HStack justify="space-between" mb={2}>
              <Text fontWeight="bold">Live Peers Command ({isLoading ? "Loading..." : livePeersCount})</Text>
              <Button 
                size="xs" 
                leftIcon={copiedText === 'peersCommand' ? <CheckIcon /> : <CopyIcon />}
                onClick={() => handleCopy(peersCommand, 'peersCommand')}
                colorScheme={copiedText === 'peersCommand' ? "green" : "gray"}
              >
                {copiedText === 'peersCommand' ? "Copied" : "Copy"}
              </Button>
            </HStack>
            <CodeSnippet code={peersCommand} />
          </Box>
          
          <Divider my={6} />
          
          <HStack spacing={6} flexWrap="wrap">
            {chain?.links.genesis && (
              <Box flex="1" minW={{ base: "100%", md: "45%" }}>
                <Text fontWeight="bold" mb={2}>Genesis File</Text>
                <CodeSnippet code={chain.links.genesis} />
              </Box>
            )}
            
            {chain?.links.addrbook && (
              <Box flex="1" minW={{ base: "100%", md: "45%" }}>
                <Text fontWeight="bold" mb={2}>Address Book (updated hourly)</Text>
                <CodeSnippet code={chain.links.addrbook} />
              </Box>
            )}
          </HStack>
        </Section>
        
        {/* Quick Setup Guide */}
        <Section title="Quick Setup Reference" id="installation">
          <Alert status="info" mb={4} borderRadius="md">
            <AlertIcon />
            <Text>For detailed installation instructions, visit the Installation page.</Text>
          </Alert>
          
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
            <GridItem>
              <Box bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <Text fontWeight="bold" mb={2}>Binary Installation</Text>
                <CodeSnippet 
                  code={`# Install ${chain?.name}
${chain?.binary} version # Check version after install`} 
                />
              </Box>
            </GridItem>
            
            <GridItem>
              <Box bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <Text fontWeight="bold" mb={2}>Node Initialization</Text>
                <CodeSnippet 
                  code={`# Initialize node
${chain?.binary} init <your_moniker> --chain-id ${chain?.chainId}`} 
                />
              </Box>
            </GridItem>
            
            <GridItem>
              <Box bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <Text fontWeight="bold" mb={2}>Download Genesis</Text>
                <CodeSnippet 
                  code={`# Get genesis file
curl -Ls ${chain?.links.genesis} > $HOME/.${chain?.dir}/config/genesis.json`} 
                />
              </Box>
            </GridItem>
            
            <GridItem>
              <Box bg={cardBg} p={4} borderRadius="md" borderWidth="1px" borderColor={borderColor}>
                <Text fontWeight="bold" mb={2}>Start Node Service</Text>
                <CodeSnippet 
                  code={`# Start service
sudo systemctl start ${chain?.binary} && journalctl -fu ${chain?.binary} -o cat`} 
                />
              </Box>
            </GridItem>
          </Grid>
          
          <Flex justify="center" mt={6}>
            <NextLink href="/services/installation" passHref>
              <Button colorScheme="blue" size="md">
                View Full Installation Guide
              </Button>
            </NextLink>
          </Flex>
        </Section>
      </Stack>
    </ServiceLayout>
  )
}