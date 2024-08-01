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
} from 'react-icons/fa'
import { SocialButton } from '@/components/Footer'
import { Chain } from '@/utils/chains'
import { useRouter } from 'next/router'
import Link from 'next/link'

export default function Sidebar({ chain }: { chain: Chain | undefined }) {
  const router = useRouter()
  const { network, chainName } = router.query
  return (
    <Box position={'relative'} w={{ base: '100%', md: '300px', lg: '380px' }}>
      <Box
        bg={useColorModeValue('white', 'gray.900')}
        color={useColorModeValue('gray.900', 'white')}
        boxShadow={'sm'}
        rounded={'lg'}
        py={6}
        px={4}
        display={{ base: 'none', md: 'block' }}
      >
        <Flex direction={'row'} gap={4} alignItems={'center'} mb={6}>
          <Image
            src={chain?.imageURL}
            w={'auto'}
            objectFit={'contain'}
            h={8}
          ></Image>
          <Heading fontSize={'lg'}>{chain?.title}</Heading>
        </Flex>
        <MenuAccordion />
        <Flex mt={4} direction={'column'} gap={2}>
          <Text fontWeight={400} color={'gray.500'} fontSize={'sm'}>
            Official Resources
          </Text>
          <Flex gap={1}>
            {chain?.links.website && (
              <SocialButton label={'Web'} href={chain.links.website}>
                <FaGlobe />
              </SocialButton>
            )}
            {chain?.links.twitter && (
              <SocialButton label={'Twitter'} href={chain.links.twitter}>
                <FaTwitter />
              </SocialButton>
            )}
            {chain?.links.discord && (
              <SocialButton label={'Discord'} href={chain.links.discord}>
                <FaDiscord />
              </SocialButton>
            )}
          </Flex>
        </Flex>
      </Box>
      <Box
        w={'100%'}
        bg={useColorModeValue('white', 'gray.900')}
        color={useColorModeValue('gray.900', 'white')}
        boxShadow={'sm'}
        rounded={'lg'}
        px={4}
        py={2}
        display={{ base: 'block', md: 'none' }}
        overflowX={'auto'}
      >
        <Stack direction={'row'} justifyContent={'space-between'}>
          {menuList.map((menu) => (
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
                _hover={{ bgColor: 'gray.200' }}
              >
                <Icon as={menu.icon} boxSize={4} color={'purple.800'} />
                <Text fontSize='sm' textAlign={'center'}>
                  {menu.name}
                </Text>
              </Flex>
            </Link>
          ))}
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
