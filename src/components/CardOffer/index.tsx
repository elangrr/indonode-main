import {
  Heading,
  Box,
  Center,
  Text,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react'

interface CardOfferProps {
  title: string
  description: string
  icon: any
}
export default function CardOffer({
  title,
  description,
  icon,
}: CardOfferProps) {
  return (
    <Center position={'relative'}>
      <Box
        borderRadius={'10px'}
        bgColor={'white'}
        boxShadow={'0px 30px 50px 0px rgba(5, 25, 69, 0.1)'}
        position={'absolute'}
        bottom={'-25px'}
        height={'100px'}
        width={'80%'}
        zIndex={1}
      ></Box>
      <Box
        maxW={'280px'}
        h={'320px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        color={useColorModeValue('gray.900', 'white')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}
        zIndex={2}
      >
        <Icon
          as={icon}
          boxSize={20}
          mb={6}
          color={useColorModeValue('purple.900', 'white')}
        />
        <Heading
          fontSize={{ base: 'lg', md: 'xl', lg: '2xl' }}
          mb={2}
          h={'70px'}
        >
          {title}
        </Heading>
        <Text>{description}</Text>
      </Box>
    </Center>
  )
}
