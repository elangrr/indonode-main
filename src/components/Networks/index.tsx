import { Box, Flex, Heading, Icon, Stack } from '@chakra-ui/react'
import CardNetwork from '@/components/CardNetwork'
import { ChevronRightIcon } from '@chakra-ui/icons'
import { MouseEventHandler, useState } from 'react'
import { FaGlobe } from 'react-icons/fa'
import { GoGlobe } from 'react-icons/go'
import { getChains } from '@/utils/chains'

interface CategoryNetworkProps {
  category: string
  isSelected: boolean
  onClick: MouseEventHandler
}

function CategoryNetwork({
  category,
  isSelected,
  onClick,
}: CategoryNetworkProps) {
  return (
    <Flex
      boxShadow={isSelected ? 'lg' : 'none'}
      border={isSelected ? '1px' : 'none'}
      borderColor='gray.100'
      rounded={'lg'}
      p={4}
      w={64}
      flexDirection={'row'}
      alignItems={'center'}
      justifyContent={{ base: 'center' }}
      cursor={'pointer'}
      onClick={onClick}
      _hover={!isSelected ? { background: 'gray.100' } : {}}
    >
      <Flex alignItems={'center'} gap={4} flexDirection={{ base: 'column' }}>
        <Icon
          as={category.toLowerCase() === 'mainnet' ? FaGlobe : GoGlobe}
          boxSize={10}
          p={2}
          color={'white'}
          bg={category.toLowerCase() === 'mainnet' ? 'green.500' : 'yellow.500'}
          rounded={'md'}
        />
        <Heading
          fontSize={{ base: 'lg', md: 'lg', lg: 'xl' }}
          textAlign={'center'}
        >
          {category}
        </Heading>
      </Flex>
      {isSelected && (
        <ChevronRightIcon boxSize={6} display={{ base: 'none' }} />
      )}
    </Flex>
  )
}

export default function Networks() {
  const [categoryNetwork, setCategoryNetwork] = useState('Mainnet')

  // ✅ HARD SAFETY: Always force array
  const chains = Array.isArray(getChains(categoryNetwork.toLowerCase()))
    ? getChains(categoryNetwork.toLowerCase())
    : []

  return (
    <Box id='networks' p={6} mb={36}>
      <Heading
        fontSize={{ base: '3xl', md: '4xl', lg: '5xl' }}
        textAlign={'center'}
        mb={'60px'}
      >
        Networks
      </Heading>

      <Stack
        direction={{ base: 'column' }}
        w={{ base: '100%', md: '100%', lg: '90%' }}
        mx={'auto'}
        spacing={10}
      >
        <Flex
          w={{ base: 'full' }}
          flexDirection={{ base: 'row' }}
          justifyContent={{ base: 'center' }}
          gap={4}
        >
          <CategoryNetwork
            category='Mainnet'
            isSelected={categoryNetwork === 'Mainnet'}
            onClick={() => setCategoryNetwork('Mainnet')}
          />
          <CategoryNetwork
            category='Testnet'
            isSelected={categoryNetwork === 'Testnet'}
            onClick={() => setCategoryNetwork('Testnet')}
          />
        </Flex>

        <Flex w={'full'}>
          <Flex
            gap={8}
            flexWrap={'wrap'}
            justifyContent={{ base: 'center' }}
            w={'full'}
          >
            {chains.map((item: any) => (
              <CardNetwork
                key={`${item?.chainId || item?.name || Math.random()}-${categoryNetwork}`}
                title={item?.title || item?.name || 'Unknown Chain'}
                name={item?.name || 'unknown'}
                imageURL={item?.imageURL || '/networks/default.png'}
                network={categoryNetwork}
                explorer={item?.links?.explorer || '#'}
                staking={item?.links?.staking || '#'}
              />
            ))}
          </Flex>
        </Flex>
      </Stack>
    </Box>
  )
}
