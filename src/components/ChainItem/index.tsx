import {
  Box,
  Flex,
  Text,
  useColorModeValue,
  Image,
  Link,
  BoxProps,
  Skeleton,
  Tooltip,
} from '@chakra-ui/react'
import { Chain } from '@/utils/chains'
import { ReactEventHandler, useState } from 'react'
import NextLink from 'next/link'

interface ChainItemProps extends BoxProps {
  chain: Chain
  network: string
  onClick?: ReactEventHandler
  variant?: 'card' | 'compact'
  isLoading?: boolean
}

const ChainImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  return (
    <Skeleton isLoaded={!isLoading} borderRadius="md">
      <Image
        src={src}
        alt={alt}
        w="auto"
        h={12}
        mb={4}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setError(true)
          setIsLoading(false)
        }}
        fallbackSrc="/placeholder-chain.png"
      />
    </Skeleton>
  )
}

export const ChainItem = ({
  chain,
  network,
  onClick,
  variant = 'card',
  isLoading = false,
  ...props
}: ChainItemProps) => {
  const cardVariant = (
    <Box
      bg={useColorModeValue('white', 'gray.800')}
      boxShadow={'sm'}
      rounded={'lg'}
      p={6}
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
      }}
      transition="all 0.2s"
      role="group"
      {...props}
    >
      <Flex direction="column" align="center" textAlign="center">
        <ChainImage src={chain.imageURL} alt={chain.title} />
        <Skeleton isLoaded={!isLoading} width="100%">
          <Text fontWeight="bold" fontSize="lg" mb={2}>
            {chain.title}
          </Text>
        </Skeleton>
        <Skeleton isLoaded={!isLoading} width="100%">
          <Text color={useColorModeValue('gray.600', 'gray.400')} fontSize="sm">
            {chain.description[0] || 'No description available'}
          </Text>
        </Skeleton>
      </Flex>
    </Box>
  )

  const compactVariant = (
    <Flex
      borderWidth={'thin'}
      borderRadius={'xl'}
      py={2}
      px={4}
      alignItems={'center'}
      gap={4}
      cursor={'pointer'}
      _hover={{ bgColor: 'gray.50' }}
      role="group"
      {...props}
    >
      <Skeleton isLoaded={!isLoading} borderRadius="full">
        <Image
          src={chain.imageURL}
          alt={chain.title}
          w={'auto'}
          objectFit={'contain'}
          h={6}
          fallbackSrc="/placeholder-chain.png"
        />
      </Skeleton>
      <Skeleton isLoaded={!isLoading} width="100%">
        <Text fontWeight={'medium'}>{chain.title}</Text>
      </Skeleton>
    </Flex>
  )

  return (
    <NextLink
      href={`/services/${network.toLowerCase()}/${chain.name}`}
      passHref
      legacyBehavior
    >
      <Link
        _hover={{ textDecoration: 'none' }}
        onClick={onClick}
        aria-label={`View ${chain.title} ${network} services`}
      >
        {variant === 'card' ? cardVariant : compactVariant}
      </Link>
    </NextLink>
  )
} 