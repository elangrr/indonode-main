import {
  Box,
  Flex,
  Stack,
  Text,
  useColorModeValue,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  useDisclosure,
  Heading,
  ModalHeader,
  keyframes,
  Tooltip,
  Badge,
  HStack,
  VStack,
  Icon,
  Button,
  Divider,
  useToast,
  SimpleGrid,
  IconButton,
  InputGroup,
  Input,
  InputLeftElement,
  Skeleton,
  SkeletonText,
} from '@chakra-ui/react'
import { Chain, getChains } from '@/utils/chains'
import { 
  RepeatIcon, 
  SearchIcon, 
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  TimeIcon
} from '@chakra-ui/icons'
import { 
  FaNetworkWired, 
  FaCube, 
  FaChartLine, 
  FaClock,
  FaServer,
  FaGlobe
} from 'react-icons/fa'
import Link from 'next/link'
import { ReactEventHandler, useEffect, useState, useCallback } from 'react'
import {
  SyncInfo,
  CurrentPrice,
  fetchSyncInfo,
  fetchPrice,
} from '@/utils/query'
import { useRouter } from 'next/router'

export default function ChainBar({ chain }: { chain: Chain | undefined }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()
  const { chainName } = router.query
  const toast = useToast()
  
  const [syncInfo, setSyncInfo] = useState<SyncInfo | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [price, setPrice] = useState<CurrentPrice | null>(null)
  const [isLoadedPrice, setIsLoadedPrice] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [copiedRpc, setCopiedRpc] = useState(false)

  // Enhanced color scheme
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.800', 'white')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const successColor = useColorModeValue('green.500', 'green.400')
  const errorColor = useColorModeValue('red.500', 'red.400')
  const accentBg = useColorModeValue('blue.50', 'blue.900')

  // Price change detection
  const [priceChange, setPriceChange] = useState<number | null>(null)
  const [previousPrice, setPreviousPrice] = useState<number | null>(null)

const updatePrice = useCallback(() => {
  if (!!chain?.coinGeckoId) {
    fetchPrice(chain.coinGeckoId)
      .then((data) => {
        if (data) {
          if (price?.usd && data.usd !== price.usd) {
            setPreviousPrice(price.usd)
            setPriceChange(((data.usd - price.usd) / price.usd) * 100)
          }
          setPrice(data)
        } else {
          setPrice(null)
        }
        setIsLoadedPrice(true)
        setLastUpdated(new Date())
      })
      .catch((err) => {
        console.error(err)
        setPrice(null)
        setIsLoadedPrice(true)
      })
  } else {
    setIsLoadedPrice(true)
  }
}, [chain?.coinGeckoId, price?.usd])

  const updateSyncInfo = useCallback(() => {
    if (chain && chain.name === chainName) {
      fetchSyncInfo(chain.links.rpc)
        .then((data) => {
          setSyncInfo(data)
          setIsLoaded(true)
          setLastUpdated(new Date())
        })
        .catch((err) => {
          console.error(err)
          setSyncInfo(null)
          setIsLoaded(true)
        })
    }
  }, [chain, chainName])

  // Copy RPC endpoint
  const handleCopyRpc = () => {
    if (chain?.links.rpc) {
      navigator.clipboard.writeText(chain.links.rpc)
      setCopiedRpc(true)
      toast({
        title: 'RPC endpoint copied',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
      setTimeout(() => setCopiedRpc(false), 2000)
    }
  }

  useEffect(() => {
    if (chain?.name !== chainName) {
      setSyncInfo(null)
      setIsLoaded(false)
    }

    if (!isLoaded) {
      updateSyncInfo()
    }

    const intervalId = setInterval(() => {
      updateSyncInfo()
    }, 10000)

    return () => {
      clearInterval(intervalId)
    }
  }, [chain?.name, chain?.links.rpc, chainName, isLoaded, updateSyncInfo])

  useEffect(() => {
    if (chain?.name !== chainName) {
      setPrice(null)
      setIsLoadedPrice(false)
    }

    if (!isLoadedPrice) {
      updatePrice()
    }
  }, [chain?.name, chain?.coinGeckoId, chainName, isLoadedPrice, updatePrice])

  // Enhanced animations
  const pulseGreen = keyframes`
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(72, 187, 120, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(72, 187, 120, 0); }
  `
  
  const pulseRed = keyframes`
    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 101, 101, 0.7); }
    70% { transform: scale(1); box-shadow: 0 0 0 8px rgba(245, 101, 101, 0); }
    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(245, 101, 101, 0); }
  `

  // Filter chains for search
  const filteredMainnets = getChains('mainnet').filter(chain =>
    chain.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chain.name.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  const filteredTestnets = getChains('testnet').filter(chain =>
    chain.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chain.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <>
      <Box
        w="100%"
        bg={cardBg}
        color={textColor}
        boxShadow="md"
        rounded="xl"
        px={6}
        py={4}
        borderWidth="1px"
        borderColor={borderColor}
        position="relative"
        _before={{
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '3px',
          bgGradient: 'linear(to-r, blue.400, purple.500)',
          borderTopRadius: 'xl',
        }}
      >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 3, md: 1 }}
          alignItems={{ base: 'start', md: 'center' }}
          wrap="wrap"
        >
          {/* Enhanced Chain Selector */}
          <Box pr={2}>
            <Tooltip label="Switch chain" hasArrow>
              <Flex
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="xl"
                py={3}
                px={4}
                alignItems="center"
                gap={3}
                cursor="pointer"
                bg={accentBg}
                _hover={{ 
                  bg: hoverBg,
                  transform: 'translateY(-1px)',
                  boxShadow: 'md'
                }}
                onClick={onOpen}
                transition="all 0.2s ease"
              >
                <HStack spacing={3}>
                  {chain?.imageURL ? (
                    <Image
                      src={chain.imageURL}
                      alt={chain.title || 'Chain Image'}
                      w="24px"
                      h="24px"
                      objectFit="contain"
                      borderRadius="full"
                    />
                  ) : (
                    <Icon as={FaGlobe} color={mutedColor} />
                  )}
                  <Text fontWeight="semibold" fontSize="sm">
                    {chain?.title || 'Select Chain'}
                  </Text>
                </HStack>
                <Icon as={RepeatIcon} boxSize={4} color={mutedColor} />
              </Flex>
            </Tooltip>
          </Box>

          {/* Enhanced Info Items */}
          <HStack spacing={4} flexWrap="wrap">
            {/* Chain ID */}
            <InfoItem
              icon={FaCube}
              label="Chain ID"
              value={chain?.chainId || '-'}
              color={mutedColor}
            />

            {/* Block Height */}
            <InfoItem
              icon={FaServer}
              label="Block Height"
              value={syncInfo?.latest_block_height || '-'}
              isLoading={!isLoaded}
              color={mutedColor}
            />

            {/* RPC Status with enhanced functionality */}
            <HStack spacing={2} pr={2}>
              <Icon as={FaNetworkWired} color={mutedColor} boxSize={4} />
              <Text fontWeight="semibold" fontSize="sm" color={mutedColor}>
                RPC:
              </Text>
              {isLoaded ? (
                <HStack spacing={2}>
                  <Tooltip 
                    label={syncInfo ? 'RPC Healthy' : 'RPC Unhealthy'} 
                    hasArrow
                  >
                    <Box
                      h={3}
                      w={3}
                      rounded="full"
                      bg={syncInfo ? successColor : errorColor}
                      animation={`${syncInfo ? pulseGreen : pulseRed} 2s infinite`}
                    />
                  </Tooltip>
                  <Tooltip label="Copy RPC endpoint" hasArrow>
                    <IconButton
                      aria-label="Copy RPC"
                      icon={copiedRpc ? <CheckIcon /> : <CopyIcon />}
                      size="xs"
                      variant="ghost"
                      onClick={handleCopyRpc}
                      colorScheme={copiedRpc ? "green" : "gray"}
                    />
                  </Tooltip>
                </HStack>
              ) : (
                <Skeleton height="12px" width="20px" />
              )}
            </HStack>

            {/* Enhanced Price Display */}
            <HStack spacing={2} pr={2}>
              <Icon as={FaChartLine} color={mutedColor} boxSize={4} />
              <Text fontWeight="semibold" fontSize="sm" color={mutedColor}>
                Price:
              </Text>
              {isLoadedPrice ? (
                <HStack spacing={1}>
                  <Text fontSize="sm" fontWeight="medium">
                    {price?.usd?.toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      minimumFractionDigits: 3,
                    }) || '-'}
                  </Text>
                  {priceChange !== null && (
                    <Badge
                      colorScheme={priceChange >= 0 ? 'green' : 'red'}
                      fontSize="xs"
                      px={2}
                      borderRadius="md"
                    >
                      {priceChange >= 0 ? '+' : ''}{priceChange.toFixed(2)}%
                    </Badge>
                  )}
                </HStack>
              ) : (
                <Skeleton height="16px" width="60px" />
              )}
            </HStack>

            {/* Last Updated */}
            {lastUpdated && (
              <Tooltip 
                label={`Last updated: ${lastUpdated.toLocaleTimeString()}`} 
                hasArrow
              >
                <HStack spacing={1} color={mutedColor}>
                  <Icon as={FaClock} boxSize={3} />
                  <Text fontSize="xs">
                    {new Date().getTime() - lastUpdated.getTime() < 60000 ? 'Just now' : 'Updated'}
                  </Text>
                </HStack>
              </Tooltip>
            )}
          </HStack>
        </Stack>
      </Box>

      {/* Enhanced Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay bg="blackAlpha.600" backdropFilter="blur(10px)" />
        <ModalContent 
          bg={cardBg} 
          borderRadius="2xl" 
          borderWidth="1px" 
          borderColor={borderColor}
          maxH="90vh"
          overflow="hidden"
        >
          <ModalHeader pb={2}>
            <VStack spacing={4} align="stretch">
              <Heading fontSize="2xl" color={textColor}>
                Select Chain
              </Heading>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color={mutedColor} />
                </InputLeftElement>
                <Input
                  placeholder="Search chains..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  borderRadius="lg"
                />
              </InputGroup>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={8} overflowY="auto">
            <VStack spacing={8} align="stretch">
              {/* Mainnets */}
              <Box>
                <HStack mb={4} spacing={3}>
                  <Icon as={FaNetworkWired} color={successColor} />
                  <Heading fontSize="xl" color={textColor}>
                    Mainnets ({filteredMainnets.length})
                  </Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                  {filteredMainnets.map((item) => (
                    <EnhancedChainItem
                      onClick={onClose}
                      chain={item}
                      network="mainnet"
                      key={item.name + 'mainnet'}
                      isActive={item.name === chainName}
                    />
                  ))}
                </SimpleGrid>
                {filteredMainnets.length === 0 && searchTerm && (
                  <Text color={mutedColor} textAlign="center" py={4}>
                    No mainnets found matching "{searchTerm}"
                  </Text>
                )}
              </Box>

              <Divider />

              {/* Testnets */}
              <Box>
                <HStack mb={4} spacing={3}>
                  <Icon as={FaCube} color="orange.500" />
                  <Heading fontSize="xl" color={textColor}>
                    Testnets ({filteredTestnets.length})
                  </Heading>
                </HStack>
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={3}>
                  {filteredTestnets.map((item) => (
                    <EnhancedChainItem
                      onClick={onClose}
                      chain={item}
                      network="testnet"
                      key={item.name + 'testnet'}
                      isActive={item.name === chainName}
                    />
                  ))}
                </SimpleGrid>
                {filteredTestnets.length === 0 && searchTerm && (
                  <Text color={mutedColor} textAlign="center" py={4}>
                    No testnets found matching "{searchTerm}"
                  </Text>
                )}
              </Box>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

// Enhanced Info Item Component
const InfoItem = ({ 
  icon, 
  label, 
  value, 
  isLoading = false,
  color
}: {
  icon: any
  label: string
  value: string
  isLoading?: boolean
  color: string
}) => (
  <HStack spacing={2} pr={2}>
    <Icon as={icon} color={color} boxSize={4} />
    <Text fontWeight="semibold" fontSize="sm" color={color}>
      {label}:
    </Text>
    {isLoading ? (
      <Skeleton height="16px" width="40px" />
    ) : (
      <Text fontSize="sm" fontWeight="medium">
        {value}
      </Text>
    )}
  </HStack>
)

// Enhanced Chain Item Component
export const EnhancedChainItem = ({
  chain,
  network,
  onClick,
  isActive = false,
}: {
  chain: Chain
  network: string
  onClick?: ReactEventHandler
  isActive?: boolean
}) => {
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const activeBg = useColorModeValue('blue.50', 'blue.900')
  const activeBorderColor = useColorModeValue('blue.200', 'blue.600')

  return (
    <Link href={`/services/${network.toLowerCase()}/${chain.name}`}>
      <Flex
        borderWidth="1px"
        borderColor={isActive ? activeBorderColor : borderColor}
        borderRadius="xl"
        py={3}
        px={4}
        alignItems="center"
        gap={3}
        cursor="pointer"
        bg={isActive ? activeBg : 'transparent'}
        _hover={{ 
          bg: hoverBg,
          transform: 'translateY(-1px)',
          boxShadow: 'md'
        }}
        onClick={onClick}
        transition="all 0.2s ease"
        position="relative"
      >
        {isActive && (
          <Box
            position="absolute"
            left={0}
            top="50%"
            transform="translateY(-50%)"
            width="3px"
            height="60%"
            bg="blue.500"
            borderRadius="full"
          />
        )}
        
        <Image
          src={chain.imageURL}
          alt={chain.title}
          w="32px"
          h="32px"
          objectFit="contain"
          borderRadius="full"
          fallback={
            <Box
              w="32px"
              h="32px"
              bg={borderColor}
              borderRadius="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Icon as={FaGlobe} color="gray.400" />
            </Box>
          }
        />
        
        <VStack align="start" spacing={1} flex={1}>
          <Text fontWeight="semibold" fontSize="sm" noOfLines={1}>
            {chain.title}
          </Text>
          <HStack spacing={2}>
            <Badge
              colorScheme={network === 'mainnet' ? 'green' : 'orange'}
              fontSize="xs"
              px={2}
              borderRadius="md"
              textTransform="capitalize"
            >
              {network}
            </Badge>
            {chain.chainId && (
              <Text fontSize="xs" color="gray.500">
                {chain.chainId}
              </Text>
            )}
          </HStack>
        </VStack>

        {isActive && (
          <Icon as={CheckIcon} color="blue.500" boxSize={4} />
        )}
      </Flex>
    </Link>
  )
}