import {
  Box,
  chakra,
  Container,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  Image,
  Input,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react'
import { ReactNode } from 'react'
import { FaTwitter, FaGithub } from 'react-icons/fa'
import { BiMailSend } from 'react-icons/bi'
import { FiMail } from 'react-icons/fi'

export const SocialButton = ({
  children,
  label,
  href,
}: {
  children: ReactNode
  label: string
  href: string
}) => {
  return (
    <chakra.button
      bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
      rounded={'full'}
      w={8}
      h={8}
      cursor={'pointer'}
      as={'a'}
      href={href}
      display={'inline-flex'}
      alignItems={'center'}
      justifyContent={'center'}
      transition={'background 0.3s ease'}
      _hover={{
        bg: useColorModeValue('blackAlpha.200', 'whiteAlpha.200'),
      }}
      target='_blank'
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  )
}

const ListHeader = ({ children }: { children: ReactNode }) => {
  return (
    <Text fontWeight={'500'} fontSize={'lg'} mb={2}>
      {children}
    </Text>
  )
}

export default function Footer() {
  return (
    <Box
      id='contact'
      bg={useColorModeValue('gray.50', 'gray.900')}
      color={useColorModeValue('gray.700', 'gray.200')}
    >
      <Container as={Stack} maxW={'6xl'} py={10}>
        <SimpleGrid
          templateColumns={{ sm: '1fr 1fr', md: '2fr 1fr 1fr 2fr' }}
          spacing={8}
        >
          <Stack spacing={6}>
            <Box>
              <Image
                src='/logo.png'
                alt='Logo'
                width='auto'
                height={'46px'}
              ></Image>
            </Box>
            <Text fontSize={'sm'}>
              © {new Date().getFullYear()} Indonode. All rights reserved
            </Text>
            <Stack direction={'row'} spacing={6}>
              <SocialButton
                label={'Twitter'}
                href={'https://twitter.com/indonodev'}
              >
                <FaTwitter />
              </SocialButton>
              <SocialButton
                label={'Github'}
                href={'https://github.com/elangrr'}
              >
                <FaGithub />
              </SocialButton>
              <SocialButton label={'Mail'} href={'mailto:contact@indonode.net'}>
                <FiMail />
              </SocialButton>
            </Stack>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Services</ListHeader>
            <Box as='a' href={'#'}>
              Staking
            </Box>
            <Box as='a' href={'#'}>
              Infrastructure
            </Box>
            <Box as='a' href={'#'}>
              Monitoring
            </Box>
            <Box as='a' href={'#'}>
              RPC Endpoints
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Company</ListHeader>
            <Box as='a' href={'#'}>
              About us
            </Box>
            <Box as='a' href={'#'}>
              Terms
            </Box>
            <Box as='a' href={'#'}>
              Cookies
            </Box>
            <Box as='a' href={'#'}>
              Privacy
            </Box>
          </Stack>
          <Stack align={'flex-start'}>
            <ListHeader>Stay up to date</ListHeader>
            <Stack direction={'row'}>
              <Input
                placeholder={'Your email address'}
                bg={useColorModeValue('blackAlpha.100', 'whiteAlpha.100')}
                border={0}
                _focus={{
                  bg: 'whiteAlpha.300',
                }}
              />
              <IconButton
                bg={useColorModeValue('purple.400', 'purple.800')}
                color={useColorModeValue('white', 'gray.800')}
                _hover={{
                  bg: 'purple.600',
                }}
                aria-label='Subscribe'
                icon={<BiMailSend />}
              />
            </Stack>
          </Stack>
        </SimpleGrid>
      </Container>
    </Box>
  )
}

