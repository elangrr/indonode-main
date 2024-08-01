import ServiceLayout from '@/components/ServiceLayout'
import { Heading, Stack } from '@chakra-ui/react'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'

export default function ServiceUpgrade() {
  const chain = useSelector(selectChain)

  return (
    <ServiceLayout>
      <Stack spacing={6}>
        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id='guide'>
            Upgrade Guide
          </Heading>
          <Heading fontSize={{ base: 'md', md: 'lg', lg: 'lg' }} color='red'>
            Upgrade Height : {chain?.upgrade} , Only upgrade after specified
            block height reached!
          </Heading>
          <CodeSnippet
            code={`# Stop binary
sudo systemctl stop ${chain?.binary}

# Download and new install binary
cd $HOME
sudo rm -rf ${chain?.name}/
git clone ${chain?.links.repository}
cd ${chain?.name}/
git fetch --all
git checkout ${chain?.upgradever}
make install

# Restart your node
sudo systemctl restart ${chain?.binary} && journalctl -fu ${chain?.binary} -o cat`}
          ></CodeSnippet>
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
