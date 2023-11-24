import { CheckIcon, CopyIcon } from '@chakra-ui/icons'
import { Flex } from '@chakra-ui/react'
import copy from 'clipboard-copy'
import { useState } from 'react'

const CopyButton = ({ code }: { code: string; theme: string }) => {
  const [isClicked, setIsClicked] = useState(false)

  const handleCopyClick = () => {
    copy(code)
    setIsClicked(true)
    setTimeout(() => {
      setIsClicked(false)
    }, 2500)
  }

  return (
    <Flex
      onClick={handleCopyClick}
      p={1}
      borderWidth={'thin'}
      borderColor={isClicked ? 'green.300' : 'gray.300'}
      bgColor={'white'}
      rounded={'md'}
      position={'absolute'}
      right={2}
      top={1}
      w={8}
      h={8}
      justifyContent={'center'}
      alignItems={'center'}
      cursor={'pointer'}
    >
      {isClicked ? (
        <CheckIcon color={'green.500'} boxSize={4} />
      ) : (
        <CopyIcon color={'gray.700'} boxSize={4} />
      )}
    </Flex>
  )
}

export default CopyButton
