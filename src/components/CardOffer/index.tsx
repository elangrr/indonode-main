import {
  Heading,
  Box,
  Center,
  Text,
  useColorModeValue,
  Icon,
  VStack,
  Flex,
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
  // Enhanced color scheme
  const cardBg = useColorModeValue('white', 'gray.800')
  const shadowColor = useColorModeValue('rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.3)')
  const iconBg = useColorModeValue('blue.50', 'blue.900')
  const iconColor = useColorModeValue('blue.600', 'blue.300')
  const titleColor = useColorModeValue('gray.800', 'white')
  const descriptionColor = useColorModeValue('gray.600', 'gray.300')
  const borderColor = useColorModeValue('gray.100', 'gray.700')
  const accentGradient = useColorModeValue(
    'linear(to-br, blue.400, purple.500)', 
    'linear(to-br, blue.300, purple.400)'
  )

  return (
    <Box position="relative" w="full" maxW="320px">
      {/* Enhanced shadow/backdrop element */}
      <Box
        position="absolute"
        top="8px"
        left="8px"
        right="-8px"
        bottom="-8px"
        bg={shadowColor}
        borderRadius="2xl"
        filter="blur(20px)"
        opacity={0.6}
        zIndex={0}
      />
      
      {/* Main card */}
      <Box
        position="relative"
        w="full"
        h="360px"
        bg={cardBg}
        borderRadius="2xl"
        border="1px"
        borderColor={borderColor}
        overflow="hidden"
        zIndex={1}
        _hover={{
          transform: 'translateY(-4px)',
          transition: 'all 0.3s ease',
        }}
      >
        {/* Gradient accent bar */}
        <Box
          h="4px"
          w="full"
          bgGradient={accentGradient}
        />
        
        {/* Card content */}
        <VStack spacing={6} p={8} h="full" justify="center">
          {/* Icon container */}
          <Flex
            align="center"
            justify="center"
            w="80px"
            h="80px"
            bg={iconBg}
            borderRadius="2xl"
            border="1px"
            borderColor={useColorModeValue('blue.200', 'blue.700')}
          >
            <Icon
              as={icon}
              boxSize={10}
              color={iconColor}
            />
          </Flex>
          
          {/* Title */}
          <Heading
            fontSize={{ base: 'xl', md: '2xl' }}
            fontWeight="bold"
            color={titleColor}
            textAlign="center"
            lineHeight="1.3"
            minH="60px"
            display="flex"
            alignItems="center"
          >
            {title}
          </Heading>
          
          {/* Description */}
          <Text
            fontSize={{ base: 'md', md: 'lg' }}
            color={descriptionColor}
            textAlign="center"
            lineHeight="1.6"
            fontWeight="medium"
          >
            {description}
          </Text>
        </VStack>
      </Box>
    </Box>
  )
}