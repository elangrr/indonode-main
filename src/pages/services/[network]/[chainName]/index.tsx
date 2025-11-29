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
  const links = chain?.links
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
      const rpc = links?.rpc
      if (!rpc) {
        setIsLoading(false)
        return
      }

      const response = await fetch(`${rpc}/net_info`)
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
    if (links?.rpc) {
      fetchLivePeersCount()
      const interval = setInterval(fetchLivePeersCount, 10 * 60 * 1000) // Fetch peers every 10 minutes
      return () => clearInterval(interval)
    }
  }, [links?.rpc])

  const peersCommand = `PEERS="$(curl -sS ${links?.rpc}/net_info | jq -r '.result.peers[] | "\\(.node_info.id)@\\(.remote_ip):\\(.node_info.listen_addr)"' | awk -F ':' '{print $1":"$(NF)}' | sed -z 's|\\n|,|g;s|.$||')"
sed -i -e 's|^persistent_peers *=.*|persistent_peers = "$PEERS"|' $HOME/.${chain?.dir}/config/config.toml`

  // Handle copy function
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedText(label)
    setTimeout(() => setCopiedText(''), 2000)
  }

  // Enhanced Section component with better layout
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
      transition="all 0.3s ease"
      _hover={{
        boxShadow: "md",
      }}
    >
      <Heading 
        fontSize={{ base: 'xl', md: '2xl' }} 
        mb={4} 
        pb={3} 
        borderBottomWidth="1px" 
        borderColor={borderColor}
        color={accentColor}
        position="relative"
        _after={{
          content: '""',
          position: 'absolute',
          bottom: '-1px',
          left: 0,
          width: '50px',
          height: '2px',
          bg: accentColor,
        }}
      >
        {title}
      </Heading>
      {children}
    </Box>
  )

  return (
    <ServiceLayout>
      <Stack spacing={8}>
        {/* Enhanced Hero Section with better layout */}
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
          <Flex direction={{ base: 'column', md: 'row' }} align="center" gap={8}>
            <Box flex={{ base: '1', md: '2' }}>
              <HStack mb={4} spacing={4} align="center">
                <Heading 
                  color={textColor} 
                  size="xl"
                  position="relative"
                >
                  {chain?.title || 'Chain Information'}
                </Heading>
                <Badge 
                  colorScheme="green" 
                  fontSize="md" 
                  borderRadius="md"
                  px={3}
                  py={1}
                >
                  {chain?.network}
                </Badge>
              </HStack>
              
              <Box mt={4}>
                {chain?.description.map((item, index) => (
                  <Text 
                    key={index} 
                    mb={3} 
                    fontSize="md" 
                    color={textColor}
                    lineHeight="tall"
                  >
                    {item}
                  </Text>
                ))}
              </Box>
              
              <HStack spacing={4} mt={8}>
                <NextLink href="#installation" passHref>
                  <Button 
                    colorScheme="blue" 
                    size="md"
                    px={6}
                  >
                    Installation Guide
                  </Button>
                </NextLink>
                <NextLink href="#endpoints" passHref>
                  <Button 
                    variant="outline" 
                    colorScheme="blue" 
                    size="md"
                    px={6}
                  >
                    Network Endpoints
                  </Button>
                </NextLink>
              </HStack>
            </Box>
            
            <Flex 
              flex={{ base: '1', md: '1' }} 
              justify="center" 
              align="center"
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

        {/* Enhanced Network Stats with better layout */}
        <Section title="Network Information" id="info">
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }} gap={6}>
            {[
              { label: "Chain ID", value: chain?.chainId },
              { label: "Version", value: chain?.version },
              { label: "Live Peers", value: isLoading ? "Loading..." : livePeersCount },
              { label: "Recommended GO", value: chain?.go }
            ].map((stat, index) => (
              <GridItem key={index}>
                <Stat 
                  bg={cardBg} 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                >
                  <StatLabel fontSize="sm" opacity={0.8}>{stat.label}</StatLabel>
                  <StatNumber 
                    fontSize="xl" 
                    fontWeight="bold" 
                    color={accentColor}
                  >
                    {stat.value}
                  </StatNumber>
                </Stat>
              </GridItem>
            ))}
          </Grid>

          <HStack mt={8} spacing={4} flexWrap="wrap">
            {[
              { label: "Explorer", href: chain?.links.explorer },
              { label: "Website", href: chain?.links.website },
              { label: "GitHub", href: chain?.links.github }
            ].map((link, index) => (
              link.href && (
                <Link key={index} href={link.href} isExternal _hover={{ textDecoration: 'none' }}>
                  <Button 
                    rightIcon={<ExternalLinkIcon />} 
                    variant="outline" 
                    size="sm"
                    px={4}
                  >
                    {link.label}
                  </Button>
                </Link>
              )
            ))}
          </HStack>
        </Section>

        {/* Enhanced Endpoints Section */}
        <Section title="Network Endpoints" id="endpoints">
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
            {[
              { label: "RPC Endpoint", value: links?.rpc },
              { label: "API Endpoint", value: links?.api },
              { label: "gRPC Endpoint", value: links?.grpc },
              { label: "Seed Node", value: links?.peer }
            ].map((endpoint, index) => (
              endpoint.value && (
                <GridItem key={index}>
                  <Box 
                    bg={cardBg} 
                    p={4} 
                    borderRadius="md" 
                    borderWidth="1px" 
                    borderColor={borderColor}
                  >
                    <HStack justify="space-between" mb={2}>
                      <Text fontWeight="bold">{endpoint.label}</Text>
                      <Button 
                        size="xs" 
                        leftIcon={copiedText === endpoint.label.toLowerCase() ? <CheckIcon /> : <CopyIcon />}
                        onClick={() => handleCopy(endpoint.value || '', endpoint.label.toLowerCase())}
                        colorScheme={copiedText === endpoint.label.toLowerCase() ? "green" : "gray"}
                      >
                        {copiedText === endpoint.label.toLowerCase() ? "Copied" : "Copy"}
                      </Button>
                    </HStack>
                    <Text 
                      fontFamily="mono" 
                      fontSize="sm" 
                      p={2} 
                      bg={useColorModeValue('gray.100', 'gray.600')} 
                      borderRadius="md"
                      overflowX="auto"
                    >
                      {endpoint.value}
                    </Text>
                  </Box>
                </GridItem>
              )
            ))}
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
          
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
            {links?.genesis && (
              <GridItem>
                <Text fontWeight="bold" mb={2}>Genesis File</Text>
                <CodeSnippet code={links?.genesis} />
              </GridItem>
            )}
            
            {links?.addrbook && (
              <GridItem>
                <Text fontWeight="bold" mb={2}>Address Book (updated hourly)</Text>
                <CodeSnippet code={links?.addrbook} />
              </GridItem>
            )}
          </Grid>
        </Section>
        
        {/* Enhanced Quick Setup Section */}
        <Section title="Quick Setup Reference" id="installation">
          <Alert status="info" mb={6} borderRadius="md">
            <AlertIcon />
            <Text>For detailed installation instructions, visit the Installation page.</Text>
          </Alert>
          
          <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={6}>
            {[
              {
                title: "Binary Installation",
                code: `# Install ${chain?.name}\n${chain?.binary} version # Check version after install`
              },
              {
                title: "Node Initialization",
                code: `# Initialize node\n${chain?.binary} init <your_moniker> --chain-id ${chain?.chainId}`
              },
              {
                title: "Download Genesis",
                code: `# Get genesis file\ncurl -Ls ${links?.genesis} > $HOME/.${chain?.dir}/config/genesis.json`
              },
              {
                title: "Start Node Service",
                code: `# Start service\nsudo systemctl start ${chain?.binary} && journalctl -fu ${chain?.binary} -o cat`
              }
            ].map((step, index) => (
              <GridItem key={index}>
                <Box 
                  bg={cardBg} 
                  p={4} 
                  borderRadius="md" 
                  borderWidth="1px" 
                  borderColor={borderColor}
                >
                  <Text fontWeight="bold" mb={2}>{step.title}</Text>
                  <CodeSnippet code={step.code} />
                </Box>
              </GridItem>
            ))}
          </Grid>
          
          <Flex justify="center" mt={8}>
            <NextLink href="/services/installation" passHref>
              <Button colorScheme="blue" size="md" px={6}>
                View Full Installation Guide
              </Button>
            </NextLink>
          </Flex>
        </Section>
      </Stack>
    </ServiceLayout>
  )
}
