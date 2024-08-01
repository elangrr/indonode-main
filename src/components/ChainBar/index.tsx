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
} from '@chakra-ui/react'
import { Chain, getChains } from '@/utils/chains'
import { RepeatIcon } from '@chakra-ui/icons'
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
  const [syncInfo, setSyncInfo] = useState<SyncInfo | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const [price, setPrice] = useState<CurrentPrice | null>(null)
  const [isLoadedPrice, setIsLoadedPrice] = useState(false)

  const updatePrice = useCallback(() => {
    if (!!chain?.coinGeckoId) {
      fetchPrice(chain.coinGeckoId)
        .then((data) => {
          setPrice(data)
          setIsLoadedPrice(true)
        })
        .catch((err) => {
          console.error(err)
          setPrice(null)
          setIsLoadedPrice(true)
        })
    } else {
      setIsLoadedPrice(true)
    }
  }, [chain?.coinGeckoId])

  const updateSyncInfo = useCallback(() => {
    if (chain && chain.name === chainName) {
      fetchSyncInfo(chain.links.rpc)
        .then((data) => {
          setSyncInfo(data)
          setIsLoaded(true)
        })
        .catch((err) => {
          console.error(err)
          setSyncInfo(null)
          setIsLoaded(true)
        })
    }
  }, [chain, chainName])

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

  const animationGreen = keyframes`
    0% {
      transform: scale(.95);
      box-shadow: 0 0 0 0 rgba(78,220,53,.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 8px rgba(78,220,53,0);
    }
    100% {
      transform: scale(.95);
      box-shadow: 0 0 0 0 rgba(78,220,53,0);
    }
  `
  const animationRed = keyframes`
    0% {
      transform: scale(.95);
      box-shadow: 0 0 0 0 rgba(220,78,53,.7);
    }
    70% {
      transform: scale(1);
      box-shadow: 0 0 0 8px rgba(220,78,53,0);
    }
    100% {
      transform: scale(.95);
      box-shadow: 0 0 0 0 rgba(220,78,53,0);
    }
  `

  return (
    <>
      <Box
        w={'100%'}
        bg={useColorModeValue('white', 'gray.900')}
        color={useColorModeValue('gray.900', 'white')}
        boxShadow={'sm'}
        rounded={'lg'}
        px={6}
        py={4}
      >
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={1}
          alignItems={{ base: 'start', md: 'center' }}
          wrap={'wrap'}
        >
          <Box pr={2}>
            <Flex
              borderWidth={'thin'}
              borderRadius={'xl'}
              py={2}
              px={4}
              alignItems={'center'}
              gap={4}
              cursor={'pointer'}
              _hover={{ bgColor: 'gray.50' }}
              onClick={onOpen}
            >
              <Flex gap={2} alignItems={'center'}>
                <Image
                  src={chain?.imageURL}
                  alt={chain?.title || 'Chain Image'} // Add alt attribute
                  w={'auto'}
                  objectFit={'contain'}
                  h={6}
                ></Image>
                <Text fontWeight={'medium'}>{chain?.title}</Text>
              </Flex>
              <RepeatIcon />
            </Flex>
          </Box>
          <Stack direction={'row'} pr={2}>
            <Text fontWeight={'bold'}>Chain ID:</Text>
            <Text>{chain?.chainId}</Text>
          </Stack>
          <Stack direction={'row'} pr={2}>
            <Text fontWeight={'bold'}>Block Height:</Text>
            <Text>{syncInfo?.latest_block_height ?? '-'}</Text>
          </Stack>
          <Stack direction={'row'} alignItems={'center'} pr={2}>
            <Text fontWeight={'bold'}>RPC Status:</Text>
            {isLoaded && (
              <Tooltip label={syncInfo ? 'Healthy' : 'Unhealthy'}>
                <Box
                  h={3}
                  w={3}
                  rounded={'full'}
                  bgColor={syncInfo ? 'green.300' : 'red.300'}
                  animation={`${
                    syncInfo ? animationGreen : animationRed
                  } 2s infinite`}
                ></Box>
              </Tooltip>
            )}
          </Stack>
          <Stack direction={'row'} pr={2}>
            <Text fontWeight={'bold'}>Price:</Text>
            <Text>
              {isLoadedPrice
                ? price?.usd.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 3,
                  }) ?? '-'
                : '-'}
            </Text>
          </Stack>
        </Stack>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size={'5xl'}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={10}>
            <Stack spacing={4} mb={6}>
              <Heading fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
                Mainnets
              </Heading>
              <Stack direction={'row'} spacing={4} wrap={'wrap'}>
                {getChains('mainnet').map((item) => (
                  <ChainItem
                    onClick={onClose}
                    chain={item}
                    network={'mainnet'}
                    key={item.name + 'mainnet'}
                  />
                ))}
              </Stack>
            </Stack>
            <Stack spacing={4} mb={6}>
              <Heading fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}>
                Testnets
              </Heading>
              <Stack direction={'row'} spacing={4} wrap={'wrap'}>
                {getChains('testnet').map((item) => (
                  <ChainItem
                    onClick={onClose}
                    chain={item}
                    network={'testnet'}
                    key={item.name + 'mainnet'}
                  />
                ))}
              </Stack>
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export const ChainItem = ({
  chain,
  network,
  onClick,
}: {
  chain: Chain
  network: string
  onClick?: ReactEventHandler
}) => {
  return (
    <Link href={`/services/${network.toLowerCase()}/${chain.name}`}>
      <Flex
        borderWidth={'thin'}
        borderRadius={'xl'}
        py={2}
        px={4}
        alignItems={'center'}
        gap={4}
        cursor={'pointer'}
        _hover={{ bgColor: 'gray.50' }}
        onClick={onClick}
      >
        <Image
          src={chain.imageURL}
          alt={chain.title} // Add alt attribute
          w={'auto'}
          objectFit={'contain'}
          h={6}
        ></Image>
        <Text fontWeight={'medium'}>{chain.title}</Text>
      </Flex>
    </Link>
  )
}
