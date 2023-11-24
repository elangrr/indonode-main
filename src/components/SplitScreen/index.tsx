import {
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

export default function SplitScreen() {
  return (
    <Stack
      minH={'100vh'}
      direction={{ base: 'column-reverse', md: 'row' }}
      mx={{ base: 2, lg: 20 }}
      py={{ base: 2, md: '150px' }}
    >
      <Flex p={8} flex={1} align={'center'} justify={'center'}>
        <Stack spacing={6} w={'full'}>
          <Heading fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}>
            Trusted PoS Validator & Non Custodial
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
            Stake your funds in our Proof-of-Stake Validator for high security,
            low commission, and 24/7 monitoring
          </Text>
          <CardInfo title={'Total Assets Staked'} info={'$4,231,224'} />
          <CardInfo title={'Supported Chains'} info={'10'} />
        </Stack>
      </Flex>
      <Flex flex={1}>
        <Image
          alt={'Home Image'}
          objectFit={{ base: 'cover', lg: 'contain' }}
          src="/home.png"
        />
      </Flex>
    </Stack>
  )
}

const CardInfo = ({ title, info }: { title: string; info: string }) => {
  return (
    <Stack
      bg={useColorModeValue('blue.100', 'gray.900')}
      color={useColorModeValue('gray.900', 'white')}
      p={4}
      borderRadius={8}
      w={{ base: 'full', lg: '350px' }}
      gap={0}
    >
      <Heading fontSize={{ base: 'md', lg: 'lg' }}>{title}</Heading>
      <Text fontSize={{ base: '2xl', md: '3xl', lg: '4xl' }} fontWeight={500}>
        {info}
      </Text>
    </Stack>
  )
}
