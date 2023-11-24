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
} from '@chakra-ui/react'
import { HamburgerIcon, CloseIcon } from '@chakra-ui/icons'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function WithSubnavigation() {
  const { isOpen, onToggle } = useDisclosure()
  const [scrollTop, setScrollTop] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const handleScroll = (event: Event) => {
      setScrollTop(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [router, scrollTop])

  return (
    <Box as="header" position={'fixed'} w={'100%'} zIndex={99}>
      <Flex
        bg={useColorModeValue('white', 'gray.800')}
        color={useColorModeValue('gray.600', 'white')}
        minH={{
          base: '60px',
          md: scrollTop > 0 || router.pathname !== '/' ? '60px' : '150px',
        }}
        py={{ base: 2 }}
        px={{ base: 2, lg: 24 }}
        borderBottom={scrollTop > 0 ? 1 : 0}
        borderStyle={'solid'}
        borderColor={useColorModeValue('gray.200', 'gray.900')}
        align={'center'}
      >
        <Flex flex={{ base: 1 }} justify={'space-between'}>
          <Link href="/#">
            <Image
              src="/logo.png"
              alt="Logo"
              width="auto"
              height={{
                base: '46px',
                md: scrollTop > 0 || router.pathname !== '/' ? '46px' : '86px',
              }}
            ></Image>
          </Link>
          <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        <Flex
          flex={{ base: 1, md: 'auto' }}
          ml={{ base: -2 }}
          display={{ base: 'flex', md: 'none' }}
          justify={'end'}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={'ghost'}
            aria-label={'Toggle Navigation'}
          />
        </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.700', 'gray.200')
  const linkHoverColor = useColorModeValue('gray.800', 'white')

  return (
    <Stack direction={'row'} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Link
          key={navItem.label}
          href={navItem.href ?? '#'}
          target={navItem.isExternal ? '_blank' : '_self'}
        >
          <Box
            p={2}
            fontSize={'lg'}
            fontWeight={600}
            color={linkColor}
            _hover={{
              textDecoration: 'none',
              color: linkHoverColor,
            }}
            my={'auto'}
          >
            {navItem.label}
          </Box>
        </Link>
      ))}
    </Stack>
  )
}

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  )
}

const MobileNavItem = ({ label, href, isExternal }: NavItem) => {
  return (
    <Stack spacing={4}>
      <Link href={href ?? '#'} target={isExternal ? '_blank' : '_self'}>
        <Box
          py={2}
          justifyContent="space-between"
          alignItems="center"
          _hover={{
            textDecoration: 'none',
          }}
        >
          <Text
            fontWeight={600}
            color={useColorModeValue('gray.600', 'gray.200')}
          >
            {label}
          </Text>
        </Box>
      </Link>
    </Stack>
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
]
