import ServiceLayout from '@/components/ServiceLayout'
import {
  Heading,
  Stack,
  Text,
  Tooltip,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from '@chakra-ui/react'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useSnapshotInfo } from '@/hooks/use-query'
import { displayDateToNow } from '@/utils/date'

export default function ServiceSnapshot() {
  const chain = useSelector(selectChain)
  const { data: snapshotInfo } = useSnapshotInfo(chain?.links.snapshot ?? '')

  return (
    <ServiceLayout>
      <Stack spacing={6}>
        <Stack>
          <Heading
            fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
            id="snapshot"
          >
            Snapshot
          </Heading>
          {snapshotInfo && (
            <Stack direction={'row'} wrap={'wrap'}>
              <Stack direction={'row'}>
                <Text>height:</Text>
                <Text fontWeight={'medium'}>{snapshotInfo.block_height}</Text>
              </Stack>
              <span>|</span>
              <Stack direction={'row'}>
                <Text>last updated:</Text>
                <Tooltip label={new Date(snapshotInfo.created_at).toString()}>
                  <Text fontWeight={'medium'}>
                    {displayDateToNow(snapshotInfo.created_at)}
                  </Text>
                </Tooltip>
              </Stack>
              <span>|</span>
              <Stack direction={'row'}>
                <Text>size:</Text>
                <Text fontWeight={'medium'}>{snapshotInfo.size}</Text>
              </Stack>
            </Stack>
          )}
          <CodeSnippet
            code={`sudo apt update
sudo apt-get install snapd lz4 -y`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Stop the service and reset the data
sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
rm -rf $HOME/.${chain?.dir}/data`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Download Latest Snapshot
curl -L ${snapshotInfo?.url} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}
mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Restart Service
sudo systemctl restart ${chain?.binary} && sudo journalctl -fu ${chain?.binary} -o cat`}
          ></CodeSnippet>
        </Stack>
        <Stack>
          <Heading
            fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
            id="statesync"
          >
            Statesync
          </Heading>
          <CodeSnippet
            code={`sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
${chain?.binary} tendermint unsafe-reset-all --keep-addr-book --home $HOME/.${chain?.dir}`}
          ></CodeSnippet>
          <CodeSnippet
            code={`STATE_SYNC_RPC=${chain?.links.rpc}
STATE_SYNC_PEER=${chain?.links.peer}
LATEST_HEIGHT=$(curl -s $STATE_SYNC_RPC/block | jq -r .result.block.header.height)
SYNC_BLOCK_HEIGHT=$(($LATEST_HEIGHT - 2000))
SYNC_BLOCK_HASH=$(curl -s "$STATE_SYNC_RPC/block?height=$SYNC_BLOCK_HEIGHT" | jq -r .result.block_id.hash)`}
          ></CodeSnippet>
          <CodeSnippet
            code={`sed -i \\
-e "s|^enable *=.*|enable = true|" \\
-e "s|^rpc_servers *=.*|rpc_servers = \"$STATE_SYNC_RPC,$STATE_SYNC_RPC\"|" \\
-e "s|^trust_height *=.*|trust_height = $SYNC_BLOCK_HEIGHT|" \\
-e "s|^trust_hash *=.*|trust_hash = \"$SYNC_BLOCK_HASH\"|" \\
-e "s|^persistent_peers *=.*|persistent_peers = \"$STATE_SYNC_PEER\"|" \\
$HOME/.${chain?.dir}/config/config.toml`}
          ></CodeSnippet>
                    <Tabs size="md" variant="enclosed">
            <TabList>
              <Tab isDisabled={!chain?.links.backup}>Backup State</Tab>
              <Tab isDisabled={!chain?.links.wasm}>Download Wasm</Tab>
            </TabList>
            <TabPanels borderWidth={1} borderColor={'gray.200'}>
              <TabPanel>
                <CodeSnippet
                  code={`mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json
`}
                ></CodeSnippet>
              </TabPanel>
              <TabPanel>
                <CodeSnippet
                  code={`mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json
curl -L ${chain?.links.wasm} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}`}
                ></CodeSnippet>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <CodeSnippet
            code={`sudo systemctl start ${chain?.binary} && sudo journalctl -u ${chain?.binary} -f`}
          ></CodeSnippet>
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
