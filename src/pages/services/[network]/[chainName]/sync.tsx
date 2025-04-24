import ServiceLayout from '@/components/ServiceLayout'
import { 
  Heading, 
  Stack, 
  Text, 
  Tooltip, 
  Box,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  Badge,
  Divider,
  useColorModeValue,
  Icon
} from '@chakra-ui/react'
import { InfoIcon, DownloadIcon } from '@chakra-ui/icons'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useSnapshotInfo } from '@/hooks/use-query'
import { displayDateToNow } from '@/utils/date'

export default function ServiceSnapshot() {
  const chain = useSelector(selectChain)
  const { data: snapshotInfo, isLoading } = useSnapshotInfo(chain?.links.snapshot ?? '')
  
  // Color mode values
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const headingColor = useColorModeValue('blue.600', 'blue.300')
  
  // Section components
  const SectionHeading = ({ id, title, badge }: { id: string, title: string, badge?: string }) => (
    <HStack spacing={3} id={id}>
      <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} color={headingColor}>
        {title}
      </Heading>
      {badge && (
        <Badge colorScheme="blue" fontSize="md" borderRadius="md" px={2}>
          {badge}
        </Badge>
      )}
    </HStack>
  );

  const Section = ({ children }: { children: React.ReactNode }) => (
    <Box 
      bg={bgColor} 
      p={5} 
      borderRadius="md" 
      borderWidth={1} 
      borderColor={borderColor}
      boxShadow="sm"
      mb={6}
    >
      {children}
    </Box>
  );

  return (
    <ServiceLayout>
      <Stack spacing={8}>
        {/* Snapshot Section */}
        <Section>
          <SectionHeading id="snapshot" title="Quick Sync with Snapshot" badge="Fast" />
          
          {snapshotInfo ? (
            <Box mt={4} p={3} borderRadius="md" borderWidth={1} borderColor={borderColor}>
              <HStack spacing={6} flexWrap="wrap">
                <HStack>
                  <Icon as={InfoIcon} color="blue.500" />
                  <Text fontWeight="medium">Height:</Text>
                  <Badge colorScheme="green" fontSize="md">{snapshotInfo.block_height}</Badge>
                </HStack>
                
                <HStack>
                  <Text fontWeight="medium">Updated:</Text>
                  <Tooltip label={new Date(snapshotInfo.created_at).toString()}>
                    <Text>{displayDateToNow(snapshotInfo.created_at)}</Text>
                  </Tooltip>
                </HStack>
                
                <HStack>
                  <Icon as={DownloadIcon} color="blue.500" />
                  <Text fontWeight="medium">Size:</Text>
                  <Text>{snapshotInfo.size}</Text>
                </HStack>
              </HStack>
            </Box>
          ) : (
            <Alert status="info" mt={4}>
              <AlertIcon />
              <AlertDescription>
                {isLoading ? "Loading snapshot information..." : "No snapshot information available"}
              </AlertDescription>
            </Alert>
          )}
          
          <Text mt={4} mb={3}>Follow these steps to quickly sync your node using our latest snapshot:</Text>
          
          <CodeSnippet
            code={`# Install required packages
sudo apt update
sudo apt-get install snapd lz4 -y`}
          />
          
          <CodeSnippet
            code={`# Stop the service and backup validator state
sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
rm -rf $HOME/.${chain?.dir}/data`}
          />
          
          <CodeSnippet
            code={`# Download and extract the latest snapshot
curl -L ${snapshotInfo?.url} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}
mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json`}
          />
          
          <CodeSnippet
            code={`# Restart your node and view logs
sudo systemctl start ${chain?.binary} && sudo journalctl -u ${chain?.binary} -f -o cat`}
          />
          
          <Alert status="warning" mt={4} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                The snapshot restoration process might take several minutes depending on your server's hardware. Wait for the node to start processing blocks before checking its status.
              </AlertDescription>
            </Box>
          </Alert>
        </Section>
        
        {/* StateSync Section */}
        <Section>
          <SectionHeading id="statesync" title="State Sync" badge="Advanced" />
          
          <Text mt={4} mb={3}>
            State sync allows you to quickly synchronize with the network by downloading only the most recent state, rather than processing all historical blocks:
          </Text>
          
          <CodeSnippet
            code={`# Stop chain and backup validator state
sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
${chain?.binary} tendermint unsafe-reset-all --keep-addr-book --home $HOME/.${chain?.dir}`}
          />
          
          <CodeSnippet
            code={`# Setup configuration variables
STATE_SYNC_RPC=${chain?.links.rpc}:443
STATE_SYNC_PEER=${chain?.links.peer}
LATEST_HEIGHT=$(curl -s $STATE_SYNC_RPC/block | jq -r .result.block.header.height)
SYNC_BLOCK_HEIGHT=$(($LATEST_HEIGHT - 2000))
SYNC_BLOCK_HASH=$(curl -s "$STATE_SYNC_RPC/block?height=$SYNC_BLOCK_HEIGHT" | jq -r .result.block_id.hash)`}
          />
          
          <CodeSnippet
            code={`# Configure state sync in config.toml
sed -i \\
  -e "s|^enable *=.*|enable = true|" \\
  -e "s|^rpc_servers *=.*|rpc_servers = \\"$STATE_SYNC_RPC,$STATE_SYNC_RPC\\"|" \\
  -e "s|^trust_height *=.*|trust_height = $SYNC_BLOCK_HEIGHT|" \\
  -e "s|^trust_hash *=.*|trust_hash = \\"$SYNC_BLOCK_HASH\\"|" \\
  -e "s|^persistent_peers *=.*|persistent_peers = \\"$STATE_SYNC_PEER\\"|" \\
  $HOME/.${chain?.dir}/config/config.toml

# Restore validator state from backup
mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json`}
          />
          
          {chain?.links.wasm && chain.links.wasm !== '' && (
            <>
              <Text mt={4} fontWeight="medium">Download WASM data (required for this chain):</Text>
              <CodeSnippet
                code={`# Download wasm files
curl -L ${chain.links.wasm} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}`}
              />
            </>
          )}
          
          <CodeSnippet
            code={`# Restart your node and check logs
sudo systemctl start ${chain?.binary} && sudo journalctl -u ${chain?.binary} -f -o cat`}
          />
          
          <Alert status="info" mt={4} borderRadius="md">
            <AlertIcon />
            <Box>
              <AlertTitle>Verify Sync Progress</AlertTitle>
              <AlertDescription>
                You can check your sync status with the following command:<br/>
                <code>{`${chain?.binary} status 2>&1 | jq .SyncInfo`}</code>
              </AlertDescription>
            </Box>
          </Alert>
        </Section>
        
        {/* Troubleshooting Section */}
        <Section>
          <SectionHeading id="troubleshooting" title="Troubleshooting" />
          
          <Text mt={4} mb={3}>
            If you encounter any issues during the sync process, try these common solutions:
          </Text>
          
          <Box p={4} borderRadius="md" borderWidth={1} borderColor={borderColor}>
            <Stack spacing={4}>
              <Text fontWeight="bold">1. Reset and try again</Text>
              <CodeSnippet
                code={`# Complete reset (use with caution)
sudo systemctl stop ${chain?.binary}
${chain?.binary} tendermint unsafe-reset-all --home $HOME/.${chain?.dir}
# Then try the snapshot or state sync process again`}
              />
              
              <Divider />
              
              <Text fontWeight="bold">2. Check for sufficient disk space</Text>
              <CodeSnippet
                code={`# Check available disk space
df -h`}
              />
              
              <Divider />
              
              <Text fontWeight="bold">3. Monitor resource usage</Text>
              <CodeSnippet
                code={`# Install and use htop to monitor system resources
sudo apt install htop -y
htop`}
              />
            </Stack>
          </Box>
        </Section>
      </Stack>
    </ServiceLayout>
  )
}