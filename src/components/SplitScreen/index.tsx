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
  SimpleGrid,
  VStack,
  Circle,
  Divider,
} from '@chakra-ui/react'
import { FaShieldAlt, FaCoins, FaServer, FaChartLine } from 'react-icons/fa'
import { BsLightningChargeFill } from 'react-icons/bs'
import { MdSecurity } from 'react-icons/md'

export default function EnhancedHomepage() {
  // Colors
  const headingColor = useColorModeValue('gray.800', 'white')
  const accentColor = useColorModeValue('purple.600', 'purple.400')
  const gradientStart = useColorModeValue('purple.500', 'purple.400')
  const gradientEnd = useColorModeValue('pink.500', 'pink.400')
  
  return (
    <Box 
      w="100%" 
      pt={{ base: "70px", md: "80px" }}
      bg={useColorModeValue('gray.50', 'gray.900')}
      overflow="hidden"
      position="relative"
    >
      {/* Gradient Background */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="600px"
        bgGradient={`linear(to-br, ${gradientStart}10, ${gradientEnd}10)`}
        zIndex="0"
      />
      
      {/* Geometric Pattern */}
      <Box
        position="absolute"
        top="10%"
        right="-10%"
        width="400px"
        height="400px"
        opacity="0.1"
        zIndex="0"
      >
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
          <path fill={accentColor} d="M47.5,-57.7C59.3,-46.8,65.1,-30.3,67.4,-13.2C69.7,3.9,68.5,21.6,60.8,36.1C53.1,50.6,38.9,61.9,22.5,66.8C6.1,71.7,-12.5,70.2,-29.4,63.9C-46.3,57.6,-61.5,46.5,-69.1,31.5C-76.7,16.5,-76.7,-2.4,-71.1,-19.4C-65.5,-36.4,-54.3,-51.5,-40.2,-61.9C-26.1,-72.3,-9.1,-78,3.4,-82C15.9,-86,35.7,-68.5,47.5,-57.7Z" transform="translate(100 100)" />
        </svg>
      </Box>
      
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
                <HStack mb={4} spacing={3}>
                  <Badge 
                    colorScheme="purple" 
                    fontSize={{ base: 'xs', md: 'sm' }}
                    px={3}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    COSMOS ECOSYSTEM
                  </Badge>
                  <Badge 
                    colorScheme="green" 
                    fontSize={{ base: 'xs', md: 'sm' }}
                    px={3}
                    py={1}
                    borderRadius="full"
                    textTransform="uppercase"
                    letterSpacing="wide"
                  >
                    99.9% UPTIME
                  </Badge>
                </HStack>
                
                <Heading 
                  fontSize={{ base: '3xl', md: '4xl', lg: '6xl' }}
                  lineHeight="1.1"
                  fontWeight="extrabold"
                  color={headingColor}
                  bgGradient={`linear(to-r, ${gradientStart}, ${gradientEnd})`}
                  bgClip="text"
                >
                  Your Trusted <br />
                  <Box as="span" color={headingColor}>Non-Custodial</Box> PoS Validator
                </Heading>
                
                <Text 
                  fontSize={{ base: 'lg', lg: 'xl' }} 
                  color={useColorModeValue('gray.600', 'gray.400')}
                  mt={6}
                  lineHeight="1.8"
                  maxW="500px"
                >
                  Invest your assets with our Proof-of-Stake Validator for
                  unparalleled security, minimal fees, and round-the-clock
                  surveillance. Join thousands of delegators who trust us.
                </Text>
              </Box>
              
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} width="full">
                <StatCard
                  title="Total Assets Staked"
                  value="$4,231,224"
                  icon={FaCoins}
                  change="+12.5%"
                  gradient="linear(to-br, blue.400, purple.600)"
                />
                <StatCard
                  title="Active Networks"
                  value="20"
                  icon={FaShieldAlt}
                  subtitle="Blockchain Networks"
                  gradient="linear(to-br, green.400, teal.600)"
                />
              </SimpleGrid>

              {/* Feature Pills */}
              <HStack spacing={3} flexWrap="wrap">
                <FeaturePill icon={BsLightningChargeFill} text="Instant Rewards" />
                <FeaturePill icon={MdSecurity} text="Enterprise Security" />
                <FeaturePill icon={FaChartLine} text="Real-time Analytics" />
              </HStack>
            </Stack>
          </Flex>
          
          <Flex 
            flex={1} 
            justify="center" 
            align="center"
            position="relative"
          >
            {/* Decorative Elements */}
            <Box
              position="absolute"
              top="-20px"
              right="-20px"
              width="100px"
              height="100px"
              borderRadius="full"
              bg={gradientStart}
              opacity="0.1"
              filter="blur(40px)"
            />
            
            <Box 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="3xl"
              boxShadow="2xl"
              p={{ base: 2, md: 3 }}
              borderWidth="1px"
              borderColor={useColorModeValue('gray.200', 'gray.700')}
              width="100%" 
              maxW="550px"
              position="relative"
              overflow="hidden"
            >
              {/* Gradient Border Effect */}
              <Box
                position="absolute"
                top="-2px"
                left="-2px"
                right="-2px"
                bottom="-2px"
                borderRadius="3xl"
                bgGradient={`linear(to-br, ${gradientStart}, ${gradientEnd})`}
                opacity="0.2"
                zIndex="-1"
              />
              
              <Image
                alt="Validator Dashboard"
                src="/home.png"
                w="full"
                h="auto"
                borderRadius="2xl"
                objectFit="cover"
              />
              
              {/* Overlay Stats */}
              <HStack
                position="absolute"
                bottom="4"
                left="4"
                right="4"
                bg={useColorModeValue('whiteAlpha.900', 'blackAlpha.800')}
                backdropFilter="blur(10px)"
                p={4}
                borderRadius="xl"
                justify="space-around"
              >
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                    99.9%
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                    Uptime
                  </Text>
                </VStack>
                <Divider orientation="vertical" h="40px" />
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                    2.5K+
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                    Delegators
                  </Text>
                </VStack>
                <Divider orientation="vertical" h="40px" />
                <VStack spacing={0}>
                  <Text fontSize="2xl" fontWeight="bold" color={accentColor}>
                    24/7
                  </Text>
                  <Text fontSize="xs" color={useColorModeValue('gray.600', 'gray.400')}>
                    Monitoring
                  </Text>
                </VStack>
              </HStack>
            </Box>
          </Flex>
        </Stack>
      </Container>
    </Box>
  )
}

const StatCard = ({ 
  title, 
  value, 
  icon,
  change,
  subtitle,
  gradient
}: { 
  title: string; 
  value: string;
  icon: React.ElementType;
  change?: string;
  subtitle?: string;
  gradient: string;
}) => {
  const cardBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  return (
    <Box
      bg={cardBg}
      p={6}
      borderRadius="2xl"
      boxShadow="lg"
      borderWidth="1px"
      borderColor={borderColor}
      position="relative"
      overflow="hidden"
    >
      {/* Gradient Accent */}
      <Box
        position="absolute"
        top="0"
        left="0"
        right="0"
        height="3px"
        bgGradient={gradient}
      />
      
      <HStack justify="space-between" mb={4}>
        <Circle
          size="50px"
          bgGradient={gradient}
          color="white"
        >
          <Icon as={icon} boxSize={6} />
        </Circle>
        {change && (
          <Badge colorScheme="green" fontSize="sm" borderRadius="full">
            {change}
          </Badge>
        )}
      </HStack>
      
      <Text fontSize="sm" fontWeight="medium" color={useColorModeValue('gray.600', 'gray.400')}>
        {title}
      </Text>
      
      <Text 
        fontSize={{ base: '3xl', md: '4xl' }} 
        fontWeight="extrabold"
        bgGradient={gradient}
        bgClip="text"
        lineHeight="1"
        mt={1}
      >
        {value}
      </Text>
      
      {subtitle && (
        <Text fontSize="xs" mt={1} color={useColorModeValue('gray.500', 'gray.500')}>
          {subtitle}
        </Text>
      )}
    </Box>
  )
}

const FeaturePill = ({ icon, text }: { icon: React.ElementType; text: string }) => {
  const pillBg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  
  return (
    <HStack
      bg={pillBg}
      px={4}
      py={2}
      borderRadius="full"
      borderWidth="1px"
      borderColor={borderColor}
      spacing={2}
    >
      <Icon as={icon} color={useColorModeValue('purple.500', 'purple.400')} />
      <Text fontSize="sm" fontWeight="medium">
        {text}
      </Text>
    </HStack>
  )
}

