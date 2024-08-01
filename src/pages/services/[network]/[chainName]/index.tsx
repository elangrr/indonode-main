import ServiceLayout from '@/components/ServiceLayout'
import {
  Heading,
  Stack,
  Image,
  Text,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
} from '@chakra-ui/react'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useState, useEffect } from 'react'

export default function Service() {
  const chain = useSelector(selectChain)
  const [livePeersCount, setLivePeersCount] = useState(0)

  const fetchLivePeersCount = async () => {
    try {
      const response = await fetch(`${chain?.links.rpc}/net_info`)
      const data = await response.json()
      const count = data.result.peers.length
      setLivePeersCount(count)
    } catch (error) {
      console.error('Error fetching live peers count:', error)
    }
  }

  useEffect(() => {
    fetchLivePeersCount()
    const interval = setInterval(fetchLivePeersCount, 10 * 60 * 1000) // Fetch peers every 10 minutes
    return () => clearInterval(interval)
  }, [chain?.links.rpc])

  const peersCommand = `PEERS="$(curl -sS ${chain?.links.rpc}/net_info | jq -r '.result.peers[] | "\\(.node_info.id)@\\(.remote_ip):\\(.node_info.listen_addr)"' | awk -F ':' '{print $1":"$(NF)}' | sed -z 's|\\n|,|g;s|.$||')"
  sed -i -e 's|^persistent_peers *=.*|persistent_peers = "$PEERS"|' $HOME/.${chain?.dir}/config/config.toml`

  return (
    <ServiceLayout>
      <Stack spacing={6}>
        <Stack>
          <Heading
            fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
            id='overview'
          >
            Overview
          </Heading>
          <Image
            src={chain?.imageURL}
            alt={chain?.title || 'Chain Image'}
            w={'auto'}
            objectFit={'contain'}
            h={32}
            my={8}
          />
          {chain?.description.map((item, index) => (
            <Text key={index}>{item}</Text>
          ))}
          <TableContainer>
            <Table variant='simple'>
              <Thead>
                <Tr>
                  <Th>Version</Th>
                  <Th>Chain ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>{chain?.version}</Td>
                  <Td>{chain?.chainId}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id='rpc'>
            Public Endpoints
          </Heading>
          {chain?.links.peer && (
            <Stack>
              <Text>Seed:</Text>
              <CodeSnippet code={chain.links.peer}></CodeSnippet>
            </Stack>
          )}
          <Stack>
            <Text>Live Peers: ({livePeersCount})</Text>
            <CodeSnippet code={peersCommand}></CodeSnippet>
          </Stack>
          {chain?.links.rpc && (
            <Stack>
              <Text>RPC:</Text>
              <CodeSnippet code={chain.links.rpc}></CodeSnippet>
            </Stack>
          )}
          {chain?.links.api && (
            <Stack>
              <Text>API:</Text>
              <CodeSnippet code={chain.links.api}></CodeSnippet>
            </Stack>
          )}
          {chain?.links.grpc && (
            <Stack>
              <Text>gRPC:</Text>
              <CodeSnippet code={chain.links.grpc}></CodeSnippet>
            </Stack>
          )}
          {chain?.links.addrbook && (
            <Stack>
              <Text>Address Book (updated every hour):</Text>
              <CodeSnippet code={chain.links.addrbook}></CodeSnippet>
            </Stack>
          )}
          {chain?.links.genesis && (
            <Stack>
              <Text>Genesis:</Text>
              <CodeSnippet code={chain.links.genesis}></CodeSnippet>
            </Stack>
          )}
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
