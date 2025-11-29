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
  Divider,
  useToast,
  SimpleGrid,
  IconButton,
  InputGroup,
  Input,
  InputLeftElement,
  Skeleton
} from '@chakra-ui/react'

import { Chain, getChains } from '@/utils/chains'
import {
  RepeatIcon,
  SearchIcon,
  CopyIcon,
  CheckIcon
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
import { useEffect, useState, useCallback } from 'react'
import {
  SyncInfo,
  CurrentPrice,
  fetchSyncInfo,
  fetchPrice
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

  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const mutedColor = useColorModeValue('gray.600', 'gray.400')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')
  const successColor = useColorModeValue('green.500', 'green.400')
  const errorColor = useColorModeValue('red.500', 'red.400')

  const [priceChange, setPriceChange] = useState<number | null>(null)

  // ✅ SAFE PRICE UPDATE
  const updatePrice = useCallback(() => {
    if (!chain?.coinGeckoId) {
      setIsLoadedPrice(true)
      return
    }

    fetchPrice(chain.coinGeckoId)
      .then((data) => {
        if (price?.usd && data?.usd && data.usd !== price.usd) {
          setPriceChange(((data.usd - price.usd) / price.usd) * 100)
        }
        setPrice(data || null)
        setIsLoadedPrice(true)
        setLastUpdated(new Date())
      })
      .catch(() => {
        setIsLoadedPrice(true)
      })
  }, [chain?.coinGeckoId, price?.usd])

  // ✅ ✅ FIXED SYNTAX + SAFE LINKS
  const updateSyncInfo = useCallback(() => {
    if (!chain?.links?.rpc) return

    fetchSyncInfo(links?.rpc)
      .then((data) => {
        setSyncInfo(data)
        setIsLoaded(true)
        setLastUpdated(new Date())
      })
      .catch(() => {
        setSyncInfo(null)
        setIsLoaded(true)
      })
  }, [chain])

  const handleCopyRpc = () => {
    if (chain?.links?.rpc) {
      navigator.clipboard.writeText(links?.rpc)
      setCopiedRpc(true)
      toast({
        title: 'RPC endpoint copied',
        status: 'success',
        duration: 2000,
        isClosable: true
      })
      setTimeout(() => setCopiedRpc(false), 2000)
    }
  }

  useEffect(() => {
    updateSyncInfo()
    const intervalId = setInterval(updateSyncInfo, 10000)
    return () => clearInterval(intervalId)
  }, [updateSyncInfo])

  useEffect(() => {
    updatePrice()
  }, [updatePrice])

  const filteredMainnets = getChains('mainnet').filter((c) => {
    const title = (c?.title || '').toLowerCase()
    const name = (c?.name || '').toLowerCase()
    return title.includes(searchTerm.toLowerCase()) || name.includes(searchTerm.toLowerCase())
  })

  const filteredTestnets = getChains('testnet').filter((c) => {
    const title = (c?.title || '').toLowerCase()
    const name = (c?.name || '').toLowerCase()
    return title.includes(searchTerm.toLowerCase()) || name.includes(searchTerm.toLowerCase())
  })

  return (
    <>
      <Box w="100%" bg={cardBg} border="1px solid" borderColor={borderColor} rounded="xl" px={6} py={4}>
        <HStack spacing={4} flexWrap="wrap">
          <Flex onClick={onOpen} cursor="pointer" align="center" gap={2}>
            <Image
              src={chain?.imageURL || "/networks/default.png"}
              alt={chain?.title || "Unknown"}
              w="32px"
              h="32px"
              borderRadius="full"
            />
            <Text fontWeight="bold">{chain?.title || chain?.name || "Select Chain"}</Text>
            <RepeatIcon />
          </Flex>

          <HStack>
            <Text>Chain ID:</Text>
            <Badge>{chain?.chainId || '-'}</Badge>
          </HStack>

          <HStack>
            <Text>Block:</Text>
            {isLoaded ? <Badge>{syncInfo?.latest_block_height || '-'}</Badge> : <Skeleton w="40px" h="14px" />}
          </HStack>

          <HStack>
            <Box w="8px" h="8px" rounded="full" bg={syncInfo ? successColor : errorColor} />
            <IconButton aria-label="Copy RPC" size="xs" icon={copiedRpc ? <CheckIcon /> : <CopyIcon />} onClick={handleCopyRpc} />
          </HStack>

          <HStack>
            <Text>Price:</Text>
            {isLoadedPrice ? (
              <Text>{price?.usd ? `$${price.usd.toFixed(3)}` : '-'}</Text>
            ) : (
              <Skeleton w="50px" h="14px" />
            )}
          </HStack>

          {lastUpdated && (
            <HStack>
              <FaClock />
              <Text fontSize="xs">Updated</Text>
            </HStack>
          )}
        </HStack>
      </Box>

      {/* ✅ ✅ ✅ MODAL */}
      <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Select Chain</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup mb={4}>
              <InputLeftElement>
                <SearchIcon />
              </InputLeftElement>
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search chain..." />
            </InputGroup>

            <Heading fontSize="lg" mb={2}>Mainnets</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              {filteredMainnets.map((item) => (
                <EnhancedChainItem key={item.name} chain={item} network="mainnet" onClick={onClose} />
              ))}
            </SimpleGrid>

            <Divider my={6} />

            <Heading fontSize="lg" mb={2}>Testnets</Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={3}>
              {filteredTestnets.map((item) => (
                <EnhancedChainItem key={item.name} chain={item} network="testnet" onClick={onClose} />
              ))}
            </SimpleGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

/* ✅ SAFE CHAIN ITEM */
export function EnhancedChainItem({
  chain,
  network,
  onClick
}: {
  chain: Chain
  network: string
  onClick?: () => void
}) {
  return (
    <Link href={`/services/${network}/${chain?.name || 'unknown'}`}>
      <Flex p={3} border="1px solid" borderColor="gray.200" rounded="lg" align="center" gap={3} onClick={onClick}>
        <Image src={chain?.imageURL || "/networks/default.png"} alt={chain?.title || 'Unknown'} w="28px" />
        <Box>
          <Text fontWeight="bold">{chain?.title || chain?.name || 'Unknown'}</Text>
          <Badge colorScheme={network === 'mainnet' ? 'green' : 'orange'}>{network}</Badge>
        </Box>
      </Flex>
    </Link>
  )
}

