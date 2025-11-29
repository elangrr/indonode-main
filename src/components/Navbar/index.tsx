import {
  Box,
  Flex,
  Text,
  IconButton,
  Stack,
  Collapse,
  Image,
  useColorModeValue,
  useDisclosure,
  HStack,
  Button,
  Icon,
  Container,
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { FiExternalLink } from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function EnhancedNavbar() {
  const { isOpen, onToggle } = useDisclosure()
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Colors
  const bgColor = useColorModeValue(
    scrolled ? 'whiteAlpha.900' : 'white',
    scrolled ? 'gray.800Alpha.900' : 'gray.800'
  )
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.700', 'gray.200')

  return (
    <Box 
      as='header' 
      position='fixed' 
      top='0'
      w='100%' 
      zIndex={999}
      transition='all 0.3s ease-in-out'
    >
      <Box
        bg={bgColor}
        backdropFilter={scrolled ? 'blur(10px)' : 'none'}
        borderBottom='1px solid'
        borderColor={scrolled ? borderColor : 'transparent'}
        boxShadow={scrolled ? 'sm' : 'none'}
        transition='all 0.3s ease-in-out'
      >
        <Container maxW='container.xl'>
          <Flex
            minH={{ base: '70px', md: scrolled ? '70px' : '80px' }}
            py={{ base: 3 }}
            align='center'
            justify='space-between'
            transition='all 0.3s ease-in-out'
          >
            {/* Logo */}
            <Link href='/'>
              <Flex align='center' cursor='pointer'>
                <Image
                  src='/logo.png'
                  alt='Logo'
                  height={{ base: '40px', md: scrolled ? '40px' : '50px' }}
                  width='auto'
                  transition='all 0.3s ease-in-out'
                />
              </Flex>
            </Link>

            {/* Desktop Navigation */}
            <HStack 
              as='nav' 
              spacing={8} 
              display={{ base: 'none', md: 'flex' }}
              align='center'
            >
              {NAV_ITEMS.map((navItem) => (
                <DesktopNavItem key={navItem.label} {...navItem} scrolled={scrolled} />
              ))}
              
              {/* CTA Button */}
              <Button
                size='md'
                colorScheme='purple'
                bgGradient='linear(to-r, purple.500, pink.500)'
                color='white'
                fontWeight='semibold'
                borderRadius='full'
                px={6}
                _hover={{
                  bgGradient: 'linear(to-r, purple.600, pink.600)',
                  transform: 'translateY(-1px)',
                  boxShadow: 'lg',
                }}
                transition='all 0.2s'
              >
                Start Staking
              </Button>
            </HStack>

            {/* Mobile menu button */}
            <Flex display={{ base: 'flex', md: 'none' }}>
              <IconButton
                onClick={onToggle}
                icon={
                  isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                }
                variant='ghost'
                aria-label='Toggle Navigation'
                color={textColor}
                _hover={{
                  bg: useColorModeValue('gray.100', 'gray.700'),
                }}
              />
            </Flex>
          </Flex>
        </Container>
      </Box>

      {/* Mobile Navigation */}
      <Collapse in={isOpen}>
        <MobileNav onToggle={onToggle} />
      </Collapse>
    </Box>
  )
}

const DesktopNavItem = ({ label, href, isExternal, scrolled }: NavItem & { scrolled: boolean }) => {
  const router = useRouter()
  const isActive = router.pathname === href || router.asPath === href
  
  const linkColor = useColorModeValue('gray.600', 'gray.300')
  const linkHoverColor = useColorModeValue('gray.900', 'white')
  const activeColor = useColorModeValue('purple.600', 'purple.400')

  return (
    <Link href={href ?? '#'} target={isExternal ? '_blank' : '_self'}>
      <HStack
        spacing={1}
        position='relative'
        cursor='pointer'
        role='group'
      >
        <Text
          fontSize='md'
          fontWeight='medium'
          color={isActive ? activeColor : linkColor}
          _groupHover={{
            color: linkHoverColor,
          }}
          transition='color 0.2s'
        >
          {label}
        </Text>
        
        {isExternal && (
          <Icon 
            as={FiExternalLink} 
            boxSize={3} 
            color={linkColor}
            _groupHover={{
              color: linkHoverColor,
            }}
            transition='color 0.2s'
          />
        )}
        
        {/* Active indicator */}
        {isActive && (
          <Box
            position='absolute'
            bottom='-12px'
            left='0'
            right='0'
            h='2px'
            bg={activeColor}
            borderRadius='full'
          />
        )}
      </HStack>
    </Link>
  )
}

const MobileNav = ({ onToggle }: { onToggle: () => void }) => {
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <Box
      bg={bgColor}
      borderBottom='1px solid'
      borderColor={borderColor}
      boxShadow='lg'
    >
      <Stack
        p={4}
        spacing={3}
      >
        {NAV_ITEMS.map((navItem) => (
          <MobileNavItem 
            key={navItem.label} 
            {...navItem} 
            onToggle={onToggle}
          />
        ))}
        
        {/* Mobile CTA Button */}
        <Button
          size='md'
          colorScheme='purple'
          bgGradient='linear(to-r, purple.500, pink.500)'
          color='white'
          fontWeight='semibold'
          borderRadius='full'
          width='full'
          mt={4}
          _hover={{
            bgGradient: 'linear(to-r, purple.600, pink.600)',
          }}
        >
          Start Staking
        </Button>
      </Stack>
    </Box>
  )
}

const MobileNavItem = ({ 
  label, 
  href, 
  isExternal, 
  onToggle 
}: NavItem & { onToggle: () => void }) => {
  const router = useRouter()
  const isActive = router.pathname === href || router.asPath === href
  const textColor = useColorModeValue('gray.700', 'gray.200')
  const activeColor = useColorModeValue('purple.600', 'purple.400')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <Link href={href ?? '#'} target={isExternal ? '_blank' : '_self'}>
      <HStack
        py={3}
        px={4}
        borderRadius='lg'
        justify='space-between'
        bg={isActive ? useColorModeValue('purple.50', 'gray.700') : 'transparent'}
        _hover={{
          bg: hoverBg,
        }}
        transition='all 0.2s'
        onClick={onToggle}
      >
        <Text
          fontWeight='medium'
          color={isActive ? activeColor : textColor}
        >
          {label}
        </Text>
        
        {isExternal && (
          <Icon 
            as={FiExternalLink} 
            boxSize={4} 
            color={textColor}
          />
        )}
      </HStack>
    </Link>
  )
}

interface NavItem {
  label: string
  href?: string
  isExternal?: boolean
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Values',
    href: '/#values',
  },
  {
    label: 'Networks',
    href: '/#networks',
  },
  {
    label: 'Services',
    href: '/services',
  },
  {
    label: 'Explorer',
    href: 'https://explorer.indonode.net',
    isExternal: true,
  },
  {
    label: 'Contact',
    href: '/#contact',
  },
    {
    label: 'IBC',
    href: '/ibc',
  },
]

