import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons'
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Box,
  Container,
  Flex,
  Heading,
  Icon,
  Image,
  Stack,
  Text,
  useColorModeValue,
  Badge,
  Divider,
  HStack,
  Tooltip,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  VStack,
} from '@chakra-ui/react'
import {
  FaHome,
  FaRegSun,
  FaCamera,
  FaWrench,
  FaBook,
  FaTwitter,
  FaDiscord,
  FaGlobe,
  FaGithub,
} from 'react-icons/fa'
import { IconType } from 'react-icons'
import { SocialButton } from '@/components/Footer'
import { Chain } from '@/utils/chains'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { useMemo } from 'react'

// Enhanced type definitions
interface SubMenuItem {
  name: string
  link: string
}

interface MenuItem {
  name: string
  link: string
  icon: IconType
  submenus: SubMenuItem[]
}

interface SidebarProps {
  chain: Chain | undefined
  isLoading?: boolean
}

export default function Sidebar({ chain, isLoading = false }: SidebarProps) {
  const router = useRouter()
  const { network, chainName } = router.query

  // Enhanced color scheme with proper dark mode support
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const subTextColor = useColorModeValue('gray.600', 'gray.400')
  const hoverBg = useColorModeValue('gray.100', 'gray.700')
  const activeBg = useColorModeValue('gray.50', 'gray.600')
  const iconColor = useColorModeValue('purple.600', 'purple.300')
  const activeIconColor = useColorModeValue('purple.800', 'purple.200')
  const imageBg = useColorModeValue('gray.50', 'gray.700')

  // Memoized active state checker for better performance
  const isActiveRoute = useMemo(() => {
    return (menuLink: string) => {
      if (!router.asPath || !network || !chainName) return false

      const basePath = `/services/${network}/${chainName}`
      const currentPath = router.asPath

      if (menuLink === '') {
        return currentPath === basePath || currentPath === `${basePath}/`
      }

      return currentPath.startsWith(`${basePath}${menuLink}`)
    }
  }, [router.asPath, network, chainName])

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <VStack spacing={4} align="stretch">
      <HStack spacing={4}>
        <SkeletonCircle size="10" />
        <VStack align="start" spacing={2} flex={1}>
          <Skeleton height="20px" width="120px" />
          <HStack spacing={2}>
            <Skeleton height="16px" width="60px" />
            <Skeleton height="16px" width="40px" />
          </HStack>
        </VStack>
      </HStack>
      <Divider />
      <SkeletonText mt="4" noOfLines={8} spacing="4" skeletonHeight="2" />
    </VStack>
  )

  return (
    <Box position="relative" w={{ base: '100%', md: '300px', lg: '380px' }}>
      {/* Desktop Sidebar */}
      <Box
        bg={cardBg}
        color={textColor}
        boxShadow="lg"
        rounded="xl"
        py={6}
        px={4}
        display={{ base: 'none', md: 'block' }}
        borderWidth="1px"
        borderColor={borderColor}
        position="sticky"
        top="20px"
        maxH="calc(100vh - 40px)"
        overflowY="auto"
      >
        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <>
            {/* Enhanced Header Section with better error handling */}
            <Flex direction="column" gap={4} mb={6}>
              <Flex alignItems="center" gap={4}>
                {chain?.imageURL ? (
                  <Image
                    src={chain.imageURL}
                    alt={`${chain.title || 'Chain'} logo`}
                    w="40px"
                    h="40px"
                    objectFit="contain"
                    borderRadius="full"
                    p={1}
                    bg={imageBg}
                    borderWidth="1px"
                    borderColor={borderColor}
                    fallback={
                      <Box
                        w="40px"
                        h="40px"
                        bg={borderColor}
                        borderRadius="full"
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Icon as={FaGlobe} color={subTextColor} />
                      </Box>
                    }
                  />
                ) : (
                  <Box
                    w="40px"
                    h="40px"
                    bg={borderColor}
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FaGlobe} color={subTextColor} />
                  </Box>
                )}
                <Box flex={1}>
                  <Heading fontSize="xl" noOfLines={2}>
                    {chain?.title || 'Unknown Chain'}
                  </Heading>
                  <HStack mt={1} spacing={2} flexWrap="wrap">
                    {chain?.chainId && (
                      <Badge
                        colorScheme="green"
                        fontSize="xs"
                        borderRadius="md"
                        px={2}
                        py={1}
                      >
                        {chain.chainId}
                      </Badge>
                    )}
                    {chain?.version && (
                      <Badge
                        colorScheme="blue"
                        fontSize="xs"
                        borderRadius="md"
                        px={2}
                        py={1}
                      >
                        v{chain.version}
                      </Badge>
                    )}
                  </HStack>
                </Box>
              </Flex>

              <Divider />
            </Flex>

            {/* Enhanced Menu Accordion */}
            <MenuAccordion
              isActiveRoute={isActiveRoute}
              hoverBg={hoverBg}
              iconColor={iconColor}
              activeIconColor={activeIconColor}
              subTextColor={subTextColor}
            />

            {/* Enhanced Social Links Section */}
            {(
              chain?.links?.website ||
              chain?.links?.github ||
              chain?.links?.twitter ||
              chain?.links?.discord
            ) && (
              <Box mt={6} pt={4} borderTopWidth="1px" borderColor={borderColor}>
                <Text
                  fontWeight="semibold"
                  color={subTextColor}
                  fontSize="sm"
                  mb={3}
                >
                  Official Resources
                </Text>
                <Flex gap={3} flexWrap="wrap">
                  {chain?.links?.website && (
                    <Tooltip label="Visit official website" hasArrow>
                      <Box>
                        <SocialButton
                          label="Visit official website"
                          href={chain.links.website || '#'}
                          aria-label="Visit official website"
                        >
                          <FaGlobe />
                        </SocialButton>
                      </Box>
                    </Tooltip>
                  )}
                  {chain?.links?.github && (
                    <Tooltip label="View source code" hasArrow>
                      <Box>
                        <SocialButton
                          label="Visit GitHub"
                          href={chain.links.github || '#'}
                          aria-label="Visit GitHub"
                        >
                          <FaGithub />
                        </SocialButton>
                      </Box>
                    </Tooltip>
                  )}
                  {chain?.links?.twitter && (
                    <Tooltip label="Follow on Twitter" hasArrow>
                      <Box>
                        <SocialButton
                          label="Visit Twitter"
                          href={chain.links.twitter || '#'}
                          aria-label="Visit Twitter"
                        >
                          <FaTwitter />
                        </SocialButton>
                      </Box>
                    </Tooltip>
                  )}
                  {chain?.links?.discord && (
                    <Tooltip label="Join Discord community" hasArrow>
                      <Box>
                        <SocialButton
                          label="Join Discord"
                          href={chain.links.discord || '#'}
                          aria-label="Join Discord"
                        >
                          <FaDiscord />
                        </SocialButton>
                      </Box>
                    </Tooltip>
                  )}
                </Flex>
              </Box>
            )}
          </>
        )}
      </Box>

      {/* Enhanced Mobile Navigation */}
      <Box
        w="100%"
        bg={cardBg}
        color={textColor}
        boxShadow="lg"
        rounded="xl"
        px={2}
        py={3}
        display={{ base: 'block', md: 'none' }}
        borderWidth="1px"
        borderColor={borderColor}
        position="sticky"
        top="0"
        zIndex="sticky"
        overflowX="auto"
        css={{
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: borderColor,
            borderRadius: '2px',
          },
        }}
      >
        <Stack direction="row" spacing={1} minW="fit-content">
          {menuList.map((menu) => {
            const isActive = isActiveRoute(menu.link)
            return (
              <Link
                key={menu.name}
                href={`/services/${network}/${chainName}${menu.link}`}
                style={{ textDecoration: 'none' }}
              >
                <Flex
                  direction="column"
                  alignItems="center"
                  justifyContent="center"
                  gap={2}
                  p={3}
                  cursor="pointer"
                  borderRadius="lg"
                  bg={isActive ? activeBg : 'transparent'}
                  _hover={{ bg: hoverBg }}
                  minW="70px"
                  minH="60px"
                  transition="all 0.2s ease"
                  role="button"
                  aria-label={`Navigate to ${menu.name}`}
                  tabIndex={0}
                >
                  <Icon
                    as={menu.icon}
                    boxSize={5}
                    color={isActive ? activeIconColor : iconColor}
                    transition="color 0.2s ease"
                  />
                  <Text
                    fontSize="xs"
                    textAlign="center"
                    fontWeight={isActive ? 'semibold' : 'medium'}
                    noOfLines={1}
                    color={isActive ? activeIconColor : textColor}
                  >
                    {menu.name}
                  </Text>
                </Flex>
              </Link>
            )
          })}
        </Stack>
      </Box>
    </Box>
  )
}

// Enhanced menu list with better organization
const menuList: MenuItem[] = [
  {
    name: 'Overview',
    link: '',
    icon: FaHome,
    submenus: [
      {
        name: 'Chain Overview',
        link: '#overview',
      },
      {
        name: 'Public Endpoints',
        link: '#endpoints',
      },
      {
        name: 'Network Stats',
        link: '#stats',
      },
    ],
  },
  {
    name: 'Installation',
    link: '/installation',
    icon: FaRegSun,
    submenus: [
      {
        name: 'Server Setup',
        link: '/installation#setup',
      },
      {
        name: 'Install Dependencies',
        link: '/installation#dependencies',
      },
      {
        name: 'Node Installation',
        link: '/installation#node',
      },
      {
        name: 'Validator Setup',
        link: '/installation#validator',
      },
    ],
  },
  {
    name: 'Sync',
    link: '/sync',
    icon: FaCamera,
    submenus: [
      {
        name: 'Snapshot Sync',
        link: '/sync#snapshot',
      },
      {
        name: 'State Sync',
        link: '/sync#statesync',
      },
      {
        name: 'Archive Node',
        link: '/sync#archive',
      },
    ],
  },
  {
    name: 'Upgrade',
    link: '/upgrade',
    icon: FaWrench,
    submenus: [
      {
        name: 'Upgrade Guide',
        link: '/upgrade#guide',
      },
      {
        name: 'Backup & Recovery',
        link: '/upgrade#backup',
      },
    ],
  },
  {
    name: 'Cheatsheet',
    link: '/cheatsheet',
    icon: FaBook,
    submenus: [
      {
        name: 'Key Management',
        link: '/cheatsheet#key',
      },
      {
        name: 'Validator Management',
        link: '/cheatsheet#validator',
      },
      {
        name: 'Token Management',
        link: '/cheatsheet#token',
      },
      {
        name: 'Governance',
        link: '/cheatsheet#governance',
      },
      {
        name: 'Utility Commands',
        link: '/cheatsheet#utility',
      },
      {
        name: 'Service Management',
        link: '/cheatsheet#services',
      },
    ],
  },
]

// Enhanced MenuAccordion with better props and styling
interface MenuAccordionProps {
  isActiveRoute: (link: string) => boolean
  hoverBg: string
  iconColor: string
  activeIconColor: string
  subTextColor: string
}

const MenuAccordion = ({
  isActiveRoute,
  hoverBg,
  iconColor,
  activeIconColor,
  subTextColor,
}: MenuAccordionProps) => {
  const router = useRouter()
  const { network, chainName } = router.query

  // Enhanced colors for accordion
  const accordionHoverBg = useColorModeValue('gray.50', 'gray.600')
  const submenuTextColor = useColorModeValue('gray.700', 'gray.300')

  return (
    <Box>
      <Accordion allowMultiple width="100%" rounded="lg" variant="unstyled">
        {menuList.map((menu) => {
          const isMenuActive = isActiveRoute(menu.link)

          return (
            <AccordionItem key={menu.name} border="none" mb={1}>
              <AccordionButton
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                p={3}
                borderRadius="lg"
                _hover={{ bg: accordionHoverBg }}
                bg={isMenuActive ? accordionHoverBg : 'transparent'}
                transition="all 0.2s ease"
              >
                <Flex alignItems="center" gap={3}>
                  <Icon
                    as={menu.icon}
                    boxSize={5}
                    color={isMenuActive ? activeIconColor : iconColor}
                    transition="color 0.2s ease"
                  />
                  <Text
                    fontSize="md"
                    fontWeight={isMenuActive ? 'semibold' : 'medium'}
                    color={isMenuActive ? activeIconColor : undefined}
                  >
                    {menu.name}
                  </Text>
                </Flex>
                <ChevronDownIcon fontSize="20px" color={subTextColor} />
              </AccordionButton>
              <AccordionPanel pb={2} pl={4}>
                <VStack spacing={1} align="stretch">
                  {menu.submenus.map((submenu) => {
                    const isSubmenuActive = router.asPath.includes(submenu.link)

                    return (
                      <Link
                        key={menu.name + submenu.name}
                        href={`/services/${network}/${chainName}${submenu.link}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <Flex
                          alignItems="center"
                          gap={2}
                          _hover={{ bg: hoverBg }}
                          py={2}
                          px={3}
                          rounded="md"
                          cursor="pointer"
                          bg={isSubmenuActive ? hoverBg : 'transparent'}
                          transition="all 0.2s ease"
                          role="button"
                          tabIndex={0}
                        >
                          <ChevronRightIcon
                            fontSize="16px"
                            color={isSubmenuActive ? activeIconColor : subTextColor}
                          />
                          <Text
                            color={isSubmenuActive ? activeIconColor : submenuTextColor}
                            fontSize="sm"
                            fontWeight={isSubmenuActive ? 'medium' : 'normal'}
                          >
                            {submenu.name}
                          </Text>
                        </Flex>
                      </Link>
                    )
                  })}
                </VStack>
              </AccordionPanel>
            </AccordionItem>
          )
        })}
      </Accordion>
    </Box>
  )
}
