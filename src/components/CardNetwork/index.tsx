import {
  Flex,
  useColorModeValue,
  Image,
  Text,
  Heading,
  Box,
  Button,
  keyframes,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

interface CardNetworkProps {
  title: string
  name: string
  imageURL: string
  network: string
  explorer: string
  staking?: string
}
export default function CardNetwork({
  title,
  name,
  imageURL,
  network,
  explorer,
  staking,
}: CardNetworkProps) {
  const router = useRouter()
  const animation = keyframes`
    to {
      background-position: 200% center;
    } 
  `

  return (
    <Flex
      w={'231px'}
      bg={useColorModeValue('white', 'gray.900')}
      color={useColorModeValue('gray.900', 'white')}
      border="1px"
      borderColor="gray.300"
      rounded={'xl'}
      px={6}
      py={4}
      alignItems={'center'}
      flexDirection={'column'}
    >
      <Image
        src={imageURL}
        w={'auto'}
        objectFit={'contain'}
        h={16}
        mb={4}
      ></Image>
      <Heading fontSize={'lg'} textAlign={'center'}>
        {title}
      </Heading>
      <Flex alignItems={'center'} gap={1} mb={6}>
        <Box
          w={2}
          h={2}
          bgColor={
            network.toLowerCase() === 'mainnet' ? 'green.500' : 'yellow.500'
          }
          rounded={'full'}
        ></Box>
        <Text>{network}</Text>
      </Flex>
      <Flex gap={1}>
        <Button
          colorScheme="purple"
          variant="outline"
          size="sm"
          onClick={() =>
            router.push(`/services/${network.toLowerCase()}/${name}`)
          }
        >
          Service
        </Button>
        <Button
          as={'a'}
          colorScheme="purple"
          variant="outline"
          size="sm"
          href={explorer}
          target={'_blank'}
        >
          Explorer
        </Button>
      </Flex>
      {network.toLocaleLowerCase() === 'mainnet' && (
        <Box
          as="a"
          display={'flex'}
          w={'full'}
          justifyContent={'center'}
          href={staking}
          mt={4}
          alignItems={'center'}
          fontSize={'sm'}
          _hover={{ color: 'purple.500', font: 'md' }}
          target={'_blank'}
        >
          <Text
            fontWeight="bold"
            animation={`${animation} 1s linear infinite`}
            bgGradient="linear(to-l, purple.500, red.500)"
            bgClip="text"
            backgroundSize="200% auto"
          >
            Stake with Us
          </Text>
        </Box>
      )}
    </Flex>
  )
}
