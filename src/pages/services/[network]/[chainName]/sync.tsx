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
  Icon,
  Skeleton,
  Progress,
  useToast,
  VStack,
  Fade,
  ScaleFade
} from '@chakra-ui/react'
import { InfoIcon, DownloadIcon, WarningIcon, CheckCircleIcon } from '@chakra-ui/icons'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useSnapshotInfo } from '@/hooks/use-query'
import { displayDateToNow } from '@/utils/date'
import { useState } from 'react'

// Reusable components
const InfoCard = ({ icon, label, value, colorScheme = "blue" }: { 
  icon: any, 
  label: string, 
  value: string | number,
  colorScheme?: string 
}) => (
  <HStack 
    spacing={3} 
    p={3} 
    borderRadius="md" 
    bg={useColorModeValue('white', 'gray.800')}
    boxShadow="sm"
    borderWidth={1}
    borderColor={useColorModeValue('gray.200', 'gray.600')}
  >
    <Icon as={icon} color={`${colorScheme}.500`} boxSize={5} />
    <Text fontWeight="medium">{label}:</Text>
    <Badge colorScheme={colorScheme} fontSize="md">{value}</Badge>
  </HStack>
)

const SectionHeading = ({ id, title, badge, description }: { 
  id: string, 
  title: string, 
  badge?: string,
  description?: string 
}) => {
  const headingColor = useColorModeValue('blue.600', 'blue.300')
  const descriptionColor = useColorModeValue('gray.600', 'gray.400')
  
  return (
    <VStack align="start" spacing={2} id={id}>
      <HStack spacing={3}>
        <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} color={headingColor}>
          {title}
        </Heading>
        {badge && (
          <Badge colorScheme="blue" fontSize="md" borderRadius="md" px={2}>
            {badge}
          </Badge>
        )}
      </HStack>
      {description && (
        <Text color={descriptionColor}>
          {description}
        </Text>
      )}
    </VStack>
  )
}

const Section = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  
  return (
    <ScaleFade in={true} delay={delay}>
      <Box 
        bg={bgColor} 
        p={6} 
        borderRadius="lg" 
        borderWidth={1} 
        borderColor={borderColor}
        boxShadow="md"
        mb={6}
        transition="all 0.2s"
        _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
      >
        {children}
      </Box>
    </ScaleFade>
  )
}

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => (
  <Box mb={4}>
    <Progress 
      value={(currentStep / totalSteps) * 100} 
      size="sm" 
      colorScheme="blue" 
      borderRadius="full"
      mb={2}
    />
    <Text fontSize="sm" color={useColorModeValue('gray.600', 'gray.400')}>
      Step {currentStep} of {totalSteps}
    </Text>
  </Box>
)

export default function ServiceSnapshot() {
  const chain = useSelector(selectChain)
  const { data: snapshotInfo, isLoading, error } = useSnapshotInfo(chain?.links.snapshot ?? '')
  const [currentStep, setCurrentStep] = useState(1)
  const toast = useToast()
  
  const handleStepComplete = (step: number) => {
    setCurrentStep(step)
    toast({
      title: "Step completed",
      description: `You've completed step ${step}`,
      status: "success",
      duration: 3000,
      isClosable: true,
    })
  }

  if (error) {
    return (
      <ServiceLayout>
        <Alert status="error" borderRadius="lg">
          <AlertIcon />
          <Box>
            <AlertTitle>Error loading snapshot information</AlertTitle>
            <AlertDescription>
              Please try refreshing the page or contact support if the issue persists.
            </AlertDescription>
          </Box>
        </Alert>
      </ServiceLayout>
    )
  }

  return (
    <ServiceLayout>
      <Stack spacing={8}>
        {/* Snapshot Section */}
        <Section delay={0.1}>
          <SectionHeading 
            id="snapshot" 
            title="Quick Sync with Snapshot" 
            badge="Fast"
            description="Synchronize your node quickly using our latest blockchain snapshot"
          />
          
          <StepIndicator currentStep={currentStep} totalSteps={4} />
          
          {isLoading ? (
            <Stack spacing={4}>
              <Skeleton height="20px" />
              <Skeleton height="20px" />
              <Skeleton height="20px" />
            </Stack>
          ) : snapshotInfo ? (
            <Fade in={true}>
              <HStack spacing={4} flexWrap="wrap" mb={6}>
                <InfoCard 
                  icon={InfoIcon} 
                  label="Height" 
                  value={snapshotInfo.block_height} 
                  colorScheme="green"
                />
                <InfoCard 
                  icon={InfoIcon} 
                  label="Updated" 
                  value={displayDateToNow(snapshotInfo.created_at)}
                />
                <InfoCard 
                  icon={DownloadIcon} 
                  label="Size" 
                  value={snapshotInfo.size}
                />
              </HStack>
            </Fade>
          ) : (
            <Alert status="info" mt={4} borderRadius="lg">
              <AlertIcon />
              <AlertDescription>
                No snapshot information available
              </AlertDescription>
            </Alert>
          )}
          
          <VStack spacing={4} align="stretch">
            <Text fontWeight="medium">Follow these steps to quickly sync your node:</Text>
            
            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack mb={2}>
                <Icon as={CheckCircleIcon} color="green.500" />
                <Text fontWeight="bold">1. Install Required Packages</Text>
              </HStack>
              <CodeSnippet
                code={`# Install required packages
sudo apt update
sudo apt-get install snapd lz4 -y`}
              />
            </Box>

            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack mb={2}>
                <Icon as={CheckCircleIcon} color="green.500" />
                <Text fontWeight="bold">2. Stop Service and Backup</Text>
              </HStack>
              <CodeSnippet
                code={`# Stop the service and backup validator state
sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
rm -rf $HOME/.${chain?.dir}/data`}
              />
            </Box>

            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack mb={2}>
                <Icon as={CheckCircleIcon} color="green.500" />
                <Text fontWeight="bold">3. Download and Extract Snapshot</Text>
              </HStack>
              <CodeSnippet
                code={`# Download and extract the latest snapshot
curl -L ${snapshotInfo?.url} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}
mv $HOME/.${chain?.dir}/priv_validator_state.json.backup $HOME/.${chain?.dir}/data/priv_validator_state.json`}
              />
            </Box>

            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack mb={2}>
                <Icon as={CheckCircleIcon} color="green.500" />
                <Text fontWeight="bold">4. Restart Node</Text>
              </HStack>
              <CodeSnippet
                code={`# Restart your node and view logs
sudo systemctl start ${chain?.binary} && sudo journalctl -u ${chain?.binary} -f -o cat`}
              />
            </Box>
          </VStack>
          
          <Alert status="warning" mt={6} borderRadius="lg">
            <AlertIcon />
            <Box>
              <AlertTitle>Important Note</AlertTitle>
              <AlertDescription>
                The snapshot restoration process might take several minutes depending on your server's hardware. 
                Wait for the node to start processing blocks before checking its status.
              </AlertDescription>
            </Box>
          </Alert>
        </Section>
        
        {/* StateSync Section */}
        <Section delay={0.2}>
          <SectionHeading 
            id="statesync" 
            title="State Sync" 
            badge="Advanced"
            description="Quickly synchronize with the network by downloading only the most recent state"
          />
          
          <VStack spacing={4} align="stretch">
            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack mb={2}>
                <Icon as={WarningIcon} color="orange.500" />
                <Text fontWeight="bold">1. Stop Chain and Backup</Text>
              </HStack>
              <CodeSnippet
                code={`# Stop chain and backup validator state
sudo systemctl stop ${chain?.binary}
cp $HOME/.${chain?.dir}/data/priv_validator_state.json $HOME/.${chain?.dir}/priv_validator_state.json.backup
${chain?.binary} tendermint unsafe-reset-all --keep-addr-book --home $HOME/.${chain?.dir}`}
              />
            </Box>

            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack mb={2}>
                <Icon as={WarningIcon} color="orange.500" />
                <Text fontWeight="bold">2. Configure State Sync</Text>
              </HStack>
              <CodeSnippet
                code={`# Setup configuration variables
STATE_SYNC_RPC=${links?.rpc}:443
STATE_SYNC_PEER=${links?.peer}
LATEST_HEIGHT=$(curl -s $STATE_SYNC_RPC/block | jq -r .result.block.header.height)
SYNC_BLOCK_HEIGHT=$(($LATEST_HEIGHT - 2000))
SYNC_BLOCK_HASH=$(curl -s "$STATE_SYNC_RPC/block?height=$SYNC_BLOCK_HEIGHT" | jq -r .result.block_id.hash)

# Configure state sync in config.toml
sed -i \\
  -e "s|^enable *=.*|enable = true|" \\
  -e "s|^rpc_servers *=.*|rpc_servers = \\"$STATE_SYNC_RPC,$STATE_SYNC_RPC\\"|" \\
  -e "s|^trust_height *=.*|trust_height = $SYNC_BLOCK_HEIGHT|" \\
  -e "s|^trust_hash *=.*|trust_hash = \\"$SYNC_BLOCK_HASH\\"|" \\
  -e "s|^persistent_peers *=.*|persistent_peers = \\"$STATE_SYNC_PEER\\"|" \\
  $HOME/.${chain?.dir}/config/config.toml`}
              />
            </Box>

            {chain?.links.wasm && links?.wasm !== '' && (
              <Box 
                p={4} 
                bg={useColorModeValue('white', 'gray.800')}
                borderRadius="md"
                borderWidth={1}
                borderColor={useColorModeValue('gray.200', 'gray.600')}
              >
                <HStack mb={2}>
                  <Icon as={WarningIcon} color="orange.500" />
                  <Text fontWeight="bold">3. Download WASM Data</Text>
                </HStack>
                <CodeSnippet
                  code={`# Download wasm files
curl -L ${links?.wasm} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.dir}`}
                />
              </Box>
            )}

            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <HStack mb={2}>
                <Icon as={WarningIcon} color="orange.500" />
                <Text fontWeight="bold">4. Restart Node</Text>
              </HStack>
              <CodeSnippet
                code={`# Restart your node and check logs
sudo systemctl start ${chain?.binary} && sudo journalctl -u ${chain?.binary} -f -o cat`}
              />
            </Box>
          </VStack>
          
          <Alert status="info" mt={6} borderRadius="lg">
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
        <Section delay={0.3}>
          <SectionHeading 
            id="troubleshooting" 
            title="Troubleshooting" 
            description="Common solutions for sync issues"
          />
          
          <VStack spacing={4} align="stretch">
            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <Text fontWeight="bold" mb={2}>1. Reset and try again</Text>
              <CodeSnippet
                code={`# Complete reset (use with caution)
sudo systemctl stop ${chain?.binary}
${chain?.binary} tendermint unsafe-reset-all --home $HOME/.${chain?.dir}
# Then try the snapshot or state sync process again`}
              />
            </Box>
            
            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <Text fontWeight="bold" mb={2}>2. Check disk space</Text>
              <CodeSnippet
                code={`# Check available disk space
df -h`}
              />
            </Box>
            
            <Box 
              p={4} 
              bg={useColorModeValue('white', 'gray.800')}
              borderRadius="md"
              borderWidth={1}
              borderColor={useColorModeValue('gray.200', 'gray.600')}
            >
              <Text fontWeight="bold" mb={2}>3. Monitor resources</Text>
              <CodeSnippet
                code={`# Install and use htop to monitor system resources
sudo apt install htop -y
htop`}
              />
            </Box>
          </VStack>
        </Section>
      </Stack>
    </ServiceLayout>
  )
}
