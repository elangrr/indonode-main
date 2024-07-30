import ServiceLayout from '@/components/ServiceLayout'
import { Heading, Stack, Text, Tooltip } from '@chakra-ui/react'
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
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="snapshot">
            Snapshot
          </Heading>
          {snapshotInfo && (
            <Stack direction="row" wrap="wrap">
              <Stack direction="row">
                <Text>Height:</Text>
                <Text fontWeight="medium">{snapshotInfo.block_height}</Text>
              </Stack>
              <span>|</span>
              <Stack direction="row">
                <Text>Last updated:</Text>
                <Tooltip label={new Date(snapshotInfo.created_at).toString()}>
                  <Text fontWeight="medium">
                    {displayDateToNow(snapshotInfo.created_at)}
                  </Text>
                </Tooltip>
              </Stack>
              <span>|</span>
              <Stack direction="row">
                <Text>Size:</Text>
                <Text fontWeight="medium">{snapshotInfo.size}</Text>
              </Stack>
            </Stack>
          )}
          <CodeSnippet
            code={`sudo apt update
sudo apt-get install snapd lz4 -y`}
          />
          <CodeSnippet
            code={`# Stop the service and reset the data
sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
rm -rf $HOME/.${chain?.dir}/data`}
          />
          <CodeSnippet
            code={`# Download Latest Snapshot
curl -L ${snapshotInfo?.url} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}
mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json`}
          />
          <CodeSnippet
            code={`# Restart chain
sudo systemctl start ${chain?.binary} && sudo journalctl -u ${chain?.binary} -f -o cat`}
          />
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="statesync">
            Statesync
          </Heading>
          <CodeSnippet
            code={`# Stop chain and backup validator state
sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
${chain?.binary} tendermint unsafe-reset-all --keep-addr-book --home $HOME/.${chain?.dir}

# Setup variable config
STATE_SYNC_RPC=${chain?.links.rpc}:443
STATE_SYNC_PEER=${chain?.links.peer}
LATEST_HEIGHT=$(curl -s $STATE_SYNC_RPC/block | jq -r .result.block.header.height)
SYNC_BLOCK_HEIGHT=$(($LATEST_HEIGHT - 2000))
SYNC_BLOCK_HASH=$(curl -s "$STATE_SYNC_RPC/block?height=$SYNC_BLOCK_HEIGHT" | jq -r .result.block_id.hash)

# Setup chain config
sed -i \\
  -e "s|^enable *=.*|enable = true|" \\
  -e "s|^rpc_servers *=.*|rpc_servers = \\"$STATE_SYNC_RPC,$STATE_SYNC_RPC\\"|" \\
  -e "s|^trust_height *=.*|trust_height = \$SYNC_BLOCK_HEIGHT|" \\
  -e "s|^trust_hash *=.*|trust_hash = \\"$SYNC_BLOCK_HASH\\"|" \\
  -e "s|^persistent_peers *=.*|persistent_peers = \\"$STATE_SYNC_PEER\\"|" \\
  $HOME/.${chain?.dir}/config/config.toml

# Restore validator state from backup
mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json`}
          />
          {chain?.links.wasm && chain.links.wasm !== "" && (
            <CodeSnippet
              code={`# Download wasm
curl -L ${chain.links.wasm} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}`}
            />
          )}
          <CodeSnippet
            code={`# Restart chain
sudo systemctl start ${chain?.binary} && sudo journalctl -u ${chain?.binary} -f -o cat`}
          />
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
