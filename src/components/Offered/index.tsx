import {
  Box,
  Heading,
  SimpleGrid,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react'
import CardOffer from '@/components/CardOffer'
import { FaSeedling, FaLock, FaUserFriends, FaKey } from 'react-icons/fa'

const offerList = [
  {
    title: 'High Security',
    description:
      'Indonode Staking Service is highly secure with 24/7 Monitoring',
    icon: FaLock,
  },
  {
    title: 'Low Fees and Commission',
    description:
      'We offer staking with commissions between 5-10% on all chains',
    icon: FaSeedling,
  },
  {
    title: 'Community Friendly',
    description: 'We actively engage and support our community',
    icon: FaUserFriends,
  },
  {
    title: 'Non-custodial',
    description: 'You have full control over your funds!',
    icon: FaKey,
  },
]

export default function Offered() {
  return (
    <Box
      id='values'
      bg={useColorModeValue('purple.900', 'white')}
      color={useColorModeValue('white', 'gray.800')}
      minH={800}
      py={'225px'}
      position={'relative'}
      zIndex={10}
      mt={0}
    >
      <Box
        mx={'auto'}
        height={'100%'}
        width={'100%'}
        maxWidth="1200px"  // Added max width for better large screen appearance
        p={{ base: 4, md: 6 }}  // Responsive padding
        position={'relative'}
        zIndex={11}
      >
        <Stack spacing={6} w={'full'} align={'center'}>
          <Heading
            fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
            textAlign={'center'}
            mb={{ base: 10, md: 12 }}  // More space below heading
            letterSpacing="tight"  // Tighter letter spacing for modern look
          >
            What We Offer
          </Heading>
          <SimpleGrid
            columns={{ base: 1, md: 2, lg: 4 }}
            spacingY={{ base: 8, md: 16, lg: 20 }}  // Responsive vertical spacing
            spacingX={{ base: 4, md: 6, lg: 8 }}  // Responsive horizontal spacing
            width="100%"  // Ensure grid takes full width
          >
            {offerList.map((offer) => (
              <CardOffer
                key={offer.title}
                title={offer.title}
                description={offer.description}
                icon={offer.icon}
              />
            ))}
          </SimpleGrid>
        </Stack>
      </Box>
      <Box
        bgImage="url('/wave.svg')"
        bgPosition='center top'
        bgRepeat='no-repeat'
        bgSize='cover'
        position={'absolute'}
        w={'100%'}
        h={'100%'}
        zIndex={9}
        top={0}
      ></Box>
    </Box>
  )
}