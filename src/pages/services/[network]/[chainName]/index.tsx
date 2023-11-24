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

export default function Service() {
  const chain = useSelector(selectChain)

  return (
    <ServiceLayout>
      <Stack spacing={6}>
        <Stack>
          <Heading
            fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
            id="overview"
          >
            Overview
          </Heading>
          <Image
            src={chain?.imageURL}
            w={'auto'}
            objectFit={'contain'}
            h={32}
            my={8}
          ></Image>
          {chain?.description.map((item, index) => (
            <Text key={index}>{item}</Text>
          ))}
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Version</Th>
                  <Th>Chain ID</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>v{chain?.version}</Td>
                  <Td>{chain?.chainId}</Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </Stack>
        <Stack>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="rpc">
            Public Endpoints
          </Heading>
          {chain?.links.peer && (
            <Stack>
              <Text>Peer:</Text>
              <CodeSnippet code={chain.links.peer}></CodeSnippet>
            </Stack>
          )}
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
              <Text>Address Book:</Text>
              <CodeSnippet code={chain.links.addrbook}></CodeSnippet>
            </Stack>
          )}
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
