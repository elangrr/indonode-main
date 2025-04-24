import {
  Flex,
  Heading,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Box,
  Container,
  HStack,
  Icon,
  Badge,
} from '@chakra-ui/react'
import { FaShieldAlt, FaCoins } from 'react-icons/fa'

export default function SplitScreen() {
  // Colors
  const headingColor = useColorModeValue('gray.800', 'white')
  const accentColor = useColorModeValue('purple.600', 'purple.400')
  
  return (
    <Box 
      w="100%" 
      pt={{ base: "70px", md: "80px" }} // Account for navbar
      bg={useColorModeValue('gray.50', 'gray.900')}
      overflow="hidden"
      position="relative"
    >
      {/* Background elements */}
      <Box
        position="absolute"
        top="20%"
        left="-5%"
        width="300px"
        height="300px"
        borderRadius="full"
        bg={useColorModeValue('purple.50', 'purple.900')}
        filter="blur(70px)"
        opacity="0.4"
        zIndex="0"
      />
      
      <Container maxW="container.xl" position="relative" zIndex="1">
        <Stack
          minH={{ base: "80vh", md: "90vh" }}
          direction={{ base: 'column-reverse', lg: 'row' }}
          spacing={{ base: 8, lg: 16 }}
          align="center"
          py={{ base: 10, md: 20 }}
        >
          <Flex flex={1} align="flex-start" justify="center">
            <Stack spacing={{ base: 8, md: 10 }} maxW="600px">
              <Box>
                <Badge 
                  colorScheme="purple" 
                  fontSize={{ base: 'xs', md: 'sm' }}
                  px={3}
                  py={1}
                  borderRadius="full"
                  mb={4}
                >
                  COSMOS ECOSYSTEM
                </Badge>
                
                <Heading 
                  fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
                  lineHeight="1.2"
                  fontWeight="bold"
                  color={headingColor}
                >
                  Your Trusted <Box as="span" color={accentColor}>Non-Custodial</Box> PoS Validator
                </Heading>
                
                <Text 
                  fontSize={{ base: 'lg', lg: 'xl' }} 
                  color={useColorModeValue('gray.600', 'gray.400')}
                  mt={5}
                  lineHeight="tall"
                >
                  Invest your assets with our Proof-of-Stake Validator for
                  unparalleled security, minimal fees, and round-the-clock
                  surveillance.
                </Text>
              </Box>
              
              <Stack 
                direction={{ base: 'column', md: 'row' }} 
                spacing={6}
                width="full"
              >
                <CardInfo
                  title="Total Assets"
                  info="$4,231,224"
                  icon={FaCoins}
                  colorScheme="blue"
                  subtitle="Staked & Secured"
                />
                <CardInfo 
                  title="Supported" 
                  info="20" 
                  icon={FaShieldAlt}
                  colorScheme="green"
                  subtitle="Blockchain Networks"
                />
              </Stack>
            </Stack>
          </Flex>
          
          <Flex 
            flex={1} 
            justify="center" 
            align="center"
          >
            <Box 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="2xl"
              boxShadow="lg"
              p={{ base: 4, md: 6 }}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              width="100%" 
              maxW="550px"
              transform={{ base: 'none', md: 'rotate(-2deg)' }}
              transition="transform 0.3s ease"
              _hover={{ transform: 'rotate(0deg)' }}
              overflow="hidden"
            >
              <Image
                alt="Home Image"
                src="/home.png"
                w="full"
                h="auto"
                borderRadius="lg"
              />
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}

const CardInfo = ({ 
  title, 
  info, 
  icon,
  colorScheme = "blue",
  subtitle
}: { 
  title: string; 
  info: string;
  icon: React.ElementType;
  colorScheme?: string;
  subtitle?: string;
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  const colorMap = {
    blue: {
      icon: useColorModeValue('blue.500', 'blue.300'),
      text: useColorModeValue('blue.600', 'blue.300')
    },
    green: {
      icon: useColorModeValue('green.500', 'green.300'),
      text: useColorModeValue('green.600', 'green.300')
    },
    purple: {
      icon: useColorModeValue('purple.500', 'purple.300'),
      text: useColorModeValue('purple.600', 'purple.300')
    }
  }
  
  return (
    <Box
      bg={cardBg}
      p={5}
      borderRadius="xl"
      boxShadow="md"
      borderWidth="1px"
      borderColor={borderColor}
      flex="1"
      transition="all 0.3s"
      _hover={{ 
        transform: 'translateY(-5px)',
        boxShadow: 'lg',
        borderColor: colorMap[colorScheme as keyof typeof colorMap].icon
      }}
    >
      <HStack mb={3}>
        <Icon as={icon} boxSize={6} color={colorMap[colorScheme as keyof typeof colorMap].icon} />
        <Text fontWeight="bold" fontSize="lg">
          {title}
        </Text>
      </HStack>
      
      <Text 
        fontSize={{ base: '3xl', md: '4xl' }} 
        fontWeight="bold"
        color={colorMap[colorScheme as keyof typeof colorMap].text}
        lineHeight="1"
      >
        {info}
      </Text>
      
      {subtitle && (
        <Text fontSize="sm" mt={1} color={useColorModeValue('gray.600', 'gray.400')}>
          {subtitle}
        </Text>
      )}
    </Box>
  )
}