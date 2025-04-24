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
  Tooltip
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
  FaGithub
} from 'react-icons/fa'
import { SocialButton } from '@/components/Footer'
import { Chain } from '@/utils/chains'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Sidebar({ chain }: { chain: Chain | undefined }) {
  const router = useRouter()
  const { network, chainName } = router.query
  
  // Color scheme
  const cardBg = useColorModeValue('white', 'gray.800')
  const textColor = useColorModeValue('gray.800', 'white')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const subTextColor = useColorModeValue('gray.600', 'gray.400')

  return (
    <Box position={'relative'} w={{ base: '100%', md: '300px', lg: '380px' }}>
      {/* Desktop Sidebar */}
      <Box
        bg={cardBg}
        color={textColor}
        boxShadow={'sm'}
        rounded={'lg'}
        py={6}
        px={4}
        display={{ base: 'none', md: 'block' }}
        borderWidth="1px"
        borderColor={borderColor}
      >
        {/* Enhanced Header Section */}
        <Flex direction="column" gap={4} mb={6}>
          <Flex alignItems="center" gap={4}>
            {chain?.imageURL && (
              <Image
                src={chain.imageURL}
                w="auto"
                objectFit="contain"
                h={10}
                borderRadius="full"
                p={1}
                bg={useColorModeValue('gray.50', 'gray.700')}
                borderWidth="1px"
                borderColor={borderColor}
              />
            )}
            <Box>
              <Heading fontSize="xl">{chain?.title}</Heading>
              <HStack mt={1}>
                <Badge colorScheme="green" fontSize="xs">
                  {chain?.chainId}
                </Badge>
                {chain?.version && (
                  <Badge colorScheme="blue" fontSize="xs">
                    {chain.version}
                  </Badge>
                )}
              </HStack>
            </Box>
          </Flex>
          
          <Divider />
        </Flex>
        
        {/* Keep Your Original Menu Accordion */}
        <MenuAccordion />
        
        {/* Enhanced Social Links Section */}
        <Flex mt={4} direction={'column'} gap={2}>
          <Text fontWeight={500} color={subTextColor} fontSize={'sm'}>
            Official Resources
          </Text>
          <Flex gap={2} flexWrap="wrap">
  {chain?.links.website && (
    <Tooltip label="Website">
      <Box>
        <SocialButton label={'Web'} href={chain.links.website}>
          <FaGlobe />
        </SocialButton>
      </Box>
    </Tooltip>
  )}
  {chain?.links.github && (
    <Tooltip label="GitHub">
      <Box>
        <SocialButton label={'GitHub'} href={chain.links.github}>
          <FaGithub />
        </SocialButton>
      </Box>
    </Tooltip>
  )}
  {chain?.links.twitter && (
    <Tooltip label="Twitter">
      <Box>
        <SocialButton label={'Twitter'} href={chain.links.twitter}>
          <FaTwitter />
        </SocialButton>
      </Box>
    </Tooltip>
  )}
  {chain?.links.discord && (
    <Tooltip label="Discord">
      <Box>
        <SocialButton label={'Discord'} href={chain.links.discord}>
          <FaDiscord />
        </SocialButton>
      </Box>
    </Tooltip>
  )}
</Flex>
        </Flex>
      </Box>

      {/* Mobile Navigation - Enhanced */}
      <Box
        w={'100%'}
        bg={cardBg}
        color={textColor}
        boxShadow={'sm'}
        rounded={'lg'}
        px={4}
        py={2}
        display={{ base: 'block', md: 'none' }}
        overflowX={'auto'}
        borderWidth="1px"
        borderColor={borderColor}
        position="sticky"
        top="0"
        zIndex="10"
      >
        <Stack direction={'row'} justifyContent={'space-between'}>
          {menuList.map((menu) => {
            const isActive = router.asPath.includes(menu.link);
            return (
              <Link
                key={menu.name}
                href={`/services/${network}/${chainName}${menu.link}`}
              >
                <Flex
                  direction={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                  gap={1}
                  p={2}
                  cursor={'pointer'}
                  borderRadius="md"
                  bg={isActive ? useColorModeValue('gray.100', 'gray.700') : 'transparent'}
                  _hover={{ bgColor: useColorModeValue('gray.100', 'gray.700') }}
                  minW="60px"
                >
                  <Icon as={menu.icon} boxSize={4} color={isActive ? 'purple.800' : 'gray.500'} />
                  <Text fontSize='xs' textAlign={'center'} fontWeight={isActive ? "medium" : "normal"}>
                    {menu.name}
                  </Text>
                </Flex>
              </Link>
            );
          })}
        </Stack>
      </Box>
    </Box>
  )
}

const menuList = [
  {
    name: 'Overview',
    link: '',
    icon: FaHome,
    submenus: [
      {
        name: 'Overview',
        link: '#overview',
      },
      {
        name: 'Public Endpoints',
        link: '#rpc',
      },
    ],
  },
  {
    name: 'Installation',
    link: '/installation',
    icon: FaRegSun,
    submenus: [
      {
        name: 'Setup Server',
        link: '/installation#setup',
      },
      {
        name: 'Install Go',
        link: '/installation#go',
      },
      {
        name: 'Node Installation',
        link: '/installation#node',
      },
      {
        name: 'Setup Validator',
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
        name: 'Snapshot',
        link: '/sync#snapshot',
      },
      {
        name: 'Statesync',
        link: '/sync#statesync',
      },
    ],
  },
  {
    name: 'Upgrade',
    link: '/upgrade',
    icon: FaWrench,
    submenus: [
      {
        name: 'Guide',
        link: '/upgrade#guide',
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
        name: 'Utility',
        link: '/cheatsheet#utility',
      },
      {
        name: 'Services Management',
        link: '/cheatsheet#services',
      },
    ],
  },
]

// Keeping your original MenuAccordion implementation
const MenuAccordion = () => {
  const router = useRouter()
  const { network, chainName } = router.query

  return (
    <Flex>
      <Container p={0}>
        <Accordion allowMultiple width='100%' maxW='lg' rounded='lg'>
          {menuList.map((menu) => (
            <AccordionItem key={menu.name}>
              <AccordionButton
                display='flex'
                alignItems='center'
                justifyContent='space-between'
                p={2}
              >
                <Flex alignItems={'center'} gap={2}>
                  <Icon as={menu.icon} boxSize={4} color={'purple.800'} />
                  <Text fontSize='md'>{menu.name}</Text>
                </Flex>
                <ChevronDownIcon fontSize='24px' />
              </AccordionButton>
              <AccordionPanel pb={4}>
                {menu.submenus.map((submenu) => (
                  <Link
                    key={menu.name + submenu.name}
                    href={`/services/${network}/${chainName}${submenu.link}`}
                  >
                    <Flex
                      alignItems={'center'}
                      gap={1}
                      _hover={{ background: 'gray.200' }}
                      py={2}
                      px={1}
                      rounded={'lg'}
                    >
                      <ChevronRightIcon fontSize='20px' />
                      <Text color='gray.600'>{submenu.name}</Text>
                    </Flex>
                  </Link>
                ))}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      </Container>
    </Flex>
  )
}