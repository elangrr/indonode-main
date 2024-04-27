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
            Your Trusted Non Custodial PoS Validator
          </Heading>
          <Text fontSize={{ base: 'md', lg: 'lg' }} color={'gray.500'}>
            Invest your assets with our Proof-of-Stake Validator for 
              unparalleled security, minimal fees, and round-the-clock surveillance.
          </Text>
          <CardInfo title={'Total Assets Staked & Secured'} info={'$4,231,224'} />
          <CardInfo title={'Supported Chains'} info={'20'} />
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
