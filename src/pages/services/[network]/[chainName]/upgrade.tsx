import ServiceLayout from '@/components/ServiceLayout'
import { 
  Heading, 
  Stack, 
  Box, 
  Text, 
  Alert, 
  AlertIcon, 
  AlertTitle, 
  AlertDescription, 
  Badge, 
  Divider,
  HStack,
  Icon,
  Button,
  useColorModeValue,
  Tooltip
} from '@chakra-ui/react'
import { InfoIcon, WarningIcon, TimeIcon, CheckCircleIcon } from '@chakra-ui/icons'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useState } from 'react'

export default function ServiceUpgrade() {
  const chain = useSelector(selectChain)
  const [copiedCommand, setCopiedCommand] = useState(false)
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  
  // Handle copy
  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCommand(true)
    setTimeout(() => setCopiedCommand(false), 2000)
  }
  
  // Upgrade commands
  const upgradeCommands = `# Stop binary
sudo systemctl stop ${chain?.binary}

# Download and install new binary
cd $HOME
sudo rm -rf ${chain?.name}/
git clone ${chain?.links.repository}
cd ${chain?.name}/
git fetch --all
git checkout ${chain?.upgradever}
make install

# Restart your node
sudo systemctl restart ${chain?.binary} && journalctl -fu ${chain?.binary} -o cat`

  return (
    <ServiceLayout>
      <Stack spacing={8}>
        <Box mb={4}>
          <Heading size="xl">Upgrade Guide</Heading>
          <Text mt={2} color="gray.500">
            Follow these steps to safely upgrade your {chain?.name} node
          </Text>
        </Box>
        
        <Box 
          bg={bgColor}
          p={6}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="sm"
        >
          <Alert status="warning" borderRadius="md" mb={6}>
            <AlertIcon as={WarningIcon} />
            <Box>
              <AlertTitle fontSize="lg" display="flex" alignItems="center">
                <Icon as={TimeIcon} mr={2} />
                Upgrade Height: <Badge colorScheme="red" fontSize="md" ml={2} p={1}>{chain?.upgrade}</Badge>
              </AlertTitle>
              <AlertDescription>
                Only perform this upgrade after the specified block height has been reached.
                Upgrading too early can result in your node being forked from the network.
              </AlertDescription>
            </Box>
          </Alert>
          
          <Box mb={6}>
            <Heading size="md" mb={4} color={accentColor} pb={2} borderBottomWidth="1px" borderColor={borderColor}>
              Preparation Steps
            </Heading>
            
            <Stack spacing={4}>
              <HStack>
                <Badge bg={accentColor} color="white" borderRadius="full" px={2}>1</Badge>
                <Text>Verify your node is synced to the latest block</Text>
              </HStack>
              <HStack>
                <Badge bg={accentColor} color="white" borderRadius="full" px={2}>2</Badge>
                <Text>Backup your validator's private key and config files</Text>
              </HStack>
              <HStack>
                <Badge bg={accentColor} color="white" borderRadius="full" px={2}>3</Badge>
                <Text>Wait until the block height {chain?.upgrade} is reached</Text>
              </HStack>
            </Stack>
            
            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md" mt={4}>
              <HStack>
                <InfoIcon color="blue.500" />
                <Text fontWeight="medium">Check current block height:</Text>
              </HStack>
              <CodeSnippet code={`${chain?.binary} status 2>&1 | jq .SyncInfo.latest_block_height`} />
            </Box>
          </Box>
          
          <Divider my={6} />
          
          <Box mb={6}>
            <Heading size="md" mb={4} color={accentColor} pb={2} borderBottomWidth="1px" borderColor={borderColor}>
              Upgrade Commands
            </Heading>
            
            <Alert status="info" mb={4} borderRadius="md">
              <AlertIcon />
              <Text>
                Run these commands after block height <strong>{chain?.upgrade}</strong> is reached.
                These steps will stop your node, install the new binary version, and restart the service.
              </Text>
            </Alert>
            
            <Box position="relative">
              <CodeSnippet code={upgradeCommands} />
              <Button
                position="absolute"
                top={2}
                right={2}
                size="sm"
                colorScheme={copiedCommand ? "green" : "blue"}
                onClick={() => handleCopy(upgradeCommands)}
              >
                {copiedCommand ? "Copied!" : "Copy All"}
              </Button>
            </Box>
          </Box>
          
          <Box>
            <Heading size="md" mb={4} color={accentColor} pb={2} borderBottomWidth="1px" borderColor={borderColor}>
              Verification Steps
            </Heading>
            
            <Stack spacing={4}>
              <HStack align="flex-start">
                <Icon as={CheckCircleIcon} color="green.500" mt={1} />
                <Box>
                  <Text fontWeight="medium">Verify the binary version:</Text>
                  <CodeSnippet code={`${chain?.binary} version`} />
                  <Text fontSize="sm" color="gray.500" mt={1}>
                    Should show: {chain?.upgradever}
                  </Text>
                </Box>
              </HStack>
              
              <HStack align="flex-start">
                <Icon as={CheckCircleIcon} color="green.500" mt={1} />
                <Box>
                  <Text fontWeight="medium">Check node status:</Text>
                  <CodeSnippet code={`${chain?.binary} status 2>&1 | jq .SyncInfo`} />
                </Box>
              </HStack>
              
              <HStack align="flex-start">
                <Icon as={CheckCircleIcon} color="green.500" mt={1} />
                <Box>
                  <Text fontWeight="medium">Monitor logs for any errors:</Text>
                  <CodeSnippet code={`sudo journalctl -u ${chain?.binary} -f --no-hostname -o cat`} />
                </Box>
              </HStack>
            </Stack>
          </Box>
        </Box>
        
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Box>
            <AlertTitle>Need Help?</AlertTitle>
            <AlertDescription>
              If you encounter any issues during the upgrade process, check the official documentation
              or reach out to the community for support.
            </AlertDescription>
          </Box>
        </Alert>
      </Stack>
    </ServiceLayout>
  )
}