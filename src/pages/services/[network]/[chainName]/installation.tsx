import { useCallback } from 'react'
import ServiceLayout from '@/components/ServiceLayout'
import React, { ChangeEvent, useState, useEffect } from 'react'
import {
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Input,
  FormControl,
  FormLabel,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Box,
  Divider,
  useColorModeValue,
  Badge,
  Tooltip,
  Button,
  HStack,
  Icon,
  VStack,
  Grid,
  GridItem,
  Progress,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  List,
  ListItem,
  ListIcon,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from '@chakra-ui/react'
import { InfoIcon, CopyIcon, CheckIcon, ChevronRightIcon, WarningIcon, TimeIcon, CheckCircleIcon } from '@chakra-ui/icons'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useRouter } from 'next/router'
import { useSnapshotInfo } from '@/hooks/use-query'

export default function ServiceInstallation() {
  const chain = useSelector(selectChain)
  const router = useRouter()
  const { network } = router.query
  const { data: snapshotInfo, isLoading: snapshotLoading } = useSnapshotInfo(chain?.links.snapshot ?? '')

  // Add loading state
  const isLoading = !chain || !network

  // Steps configuration
  const steps = [
    { title: 'Server Setup', description: 'System requirements and dependencies' },
    { title: 'Go Installation', description: 'Install Go programming language' },
    { title: 'Node Setup', description: 'Install and configure node' },
    { title: 'Validator Setup', description: 'Create validator' },
    { title: 'Useful Commands', description: 'Common commands' }
  ]

  // Replace useSteps with useState
  const [activeStep, setActiveStep] = useState(0)

  // State for form inputs
  const [moniker, setMoniker] = useState('MyNode')
  const [port, setPort] = useState('26')
  const [walletName, setWalletName] = useState('wallet')
  const [peersCommand, setPeersCommand] = useState('')
  const [livePeersCount, setLivePeersCount] = useState(0)
  const [copiedSteps, setCopiedSteps] = useState<{[key: string]: boolean}>({})

  // Color mode values
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const cardBg = useColorModeValue('gray.50', 'gray.700')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  const textColor = useColorModeValue('gray.800', 'white')

  // Memoized input handlers
  const handleMonikerChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMoniker(e.target.value)
  }, [])

  const handlePortChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (/^\d{0,2}$/.test(value)) {
      setPort(value)
    }
  }, [])

  const handleWalletNameChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setWalletName(e.target.value)
  }, [])

  interface Peer {
    node_info: {
      id: string
      listen_addr: string
    }
    remote_ip: string
  }

const fetchLivePeers = async () => {
  try {
    if (!links?.rpc) return;
    
    const response = await fetch(`${chain.links.rpc}/net_info`)
    const data = await response.json()
    const peers = data.result.peers
      .map(
        (peer: Peer) => {
          const id = peer.node_info.id;
          const ip = peer.remote_ip || peer.node_info.listen_addr.split(':')[1]?.replace('//', '');
          const port = peer.node_info.listen_addr.split(':').pop();
          return `${id}@${ip}:${port}`;
        }
      )
      .join(',')
    setLivePeersCount(data.result.peers.length)
    setPeersCommand(
      `PEeeERS="${peers}"\nsed -i -e "s|^persistent_peers *=.*|persistent_peers = \\"$PEERS\\"|" $HOME/.${chain?.dir}/config/config.toml`
    )
  } catch (error) {
    console.error('Error fetching live peers:', error)
  }
}

  useEffect(() => {
    if (links?.rpc) {
      fetchLivePeers()
      const interval = setInterval(fetchLivePeers, 3 * 60 * 1000) // Fetch peers every 3 minutes
      return () => clearInterval(interval)
    }
  }, [links?.rpc])

  const hasRepository = !!chain?.links.repository
  const hasBinary = !!chain?.links.binary

  // Copy function with visual feedback
  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSteps({...copiedSteps, [id]: true});
    setTimeout(() => {
      setCopiedSteps({...copiedSteps, [id]: false});
    }, 2000);
  };

  // Section components
  const SectionHeading = ({ id, title, badge }: { id: string, title: string, badge?: string }) => (
    <HStack spacing={3} id={id}>
      <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} color={accentColor}>
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
      {isLoading ? (
        <Box textAlign="center" py={10}>
          <Text>Loading...</Text>
        </Box>
      ) : (
        <Stack spacing={8}>
          {/* Introduction Card */}
          <Card bg={bgColor} borderWidth={1} borderColor={borderColor}>
            <CardHeader>
              <SectionHeading id="intro" title="Installation Guide" badge={chain?.chainId} />
            </CardHeader>
            <CardBody>
              <VStack spacing={4} align="stretch">
                <Text>
                  Follow this guide to set up your {chain?.name} node and validator. Make sure you have
                  the minimum hardware requirements: 4 CPU cores, 8GB RAM, and 200GB SSD.
                </Text>
                
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  <AlertDescription>
                    <HStack spacing={4}>
                      <Text>Current network: <strong>{network}</strong></Text>
                      <Text>Chain ID: <strong>{chain?.chainId}</strong></Text>
                      <Text>Live peers: <strong>{livePeersCount}</strong></Text>
                    </HStack>
                  </AlertDescription>
                </Alert>

                <Box>
                  <Text fontWeight="bold" mb={2}>Prerequisites:</Text>
                  <List spacing={2}>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      Ubuntu 20.04 or later
                    </ListItem>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      Root access to the server
                    </ListItem>
                    <ListItem>
                      <ListIcon as={CheckCircleIcon} color="green.500" />
                      Basic knowledge of Linux commands
                    </ListItem>
                  </List>
                </Box>
              </VStack>
            </CardBody>
          </Card>

          {/* Progress Stepper */}
          <Box bg={bgColor} p={4} borderRadius="md" borderWidth={1} borderColor={borderColor}>
            <Stepper index={activeStep} colorScheme="blue" size="md">
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                  <Box flexShrink="0">
                    <StepTitle>{step.title}</StepTitle>
                    <StepDescription>{step.description}</StepDescription>
                  </Box>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
          </Box>

          {/* Server Setup */}
          <Section>
            <SectionHeading id="setup" title="1. Server Setup" />
            <Text mt={3} mb={4}>First, update your system and install required dependencies:</Text>
            
            <Accordion defaultIndex={[0, 1]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={TimeIcon} color="blue.500" />
                      <Text fontWeight="bold">System Update & Dependencies</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <CodeSnippet
                    code={`# Update Packages and Install Prerequisites
sudo apt update && apt upgrade -y
sudo apt install curl git jq lz4 build-essential unzip fail2ban ufw -y
`}
                  />
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={WarningIcon} color="orange.500" />
                      <Text fontWeight="bold">Firewall Configuration</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <CodeSnippet
                    code={`# Set Firewall
sudo ufw default allow outgoing
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 9100
sudo ufw allow ${port}656/tcp # P2P port
sudo ufw allow ${port}657/tcp # RPC port if needed

# Enable Firewall
sudo ufw enable
`}
                  />
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Section>

          {/* Go Installation */}
          <Section>
            <SectionHeading id="go" title="2. Install Go" />
            <Text mt={3} mb={4}>
              The {chain?.name} node requires Go version {chain?.go} to be installed:
            </Text>
            
            <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
              <CardBody>
                <CodeSnippet
                  code={`ver="${chain?.go}"
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version # Should show ${chain?.go}
`}
                />
              </CardBody>
              <CardFooter>
                <Button 
                  size="sm" 
                  colorScheme="blue" 
                  leftIcon={copiedSteps['go'] ? <CheckIcon /> : <CopyIcon />}
                  onClick={() => handleCopy('go', `ver="${chain?.go}"
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version # Should show ${chain?.go}`)}
                >
                  {copiedSteps['go'] ? 'Copied!' : 'Copy Command'}
                </Button>
              </CardFooter>
            </Card>
          </Section>

          {/* Node Installation */}
          <Section>
            <SectionHeading id="node" title="3. Node Installation" />
            
            <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} gap={4} mb={6}>
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Text>Node Name (Moniker)</Text>
                    <Tooltip label="The name that will identify your node on the network">
                      <InfoIcon color="gray.500" />
                    </Tooltip>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder="Node Name"
                  value={moniker}
                  onChange={handleMonikerChange}
                  size="md"
                  borderRadius="md"
                  isDisabled={false}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Text>Port</Text>
                    <Tooltip label="Custom port for your node (default: 26)">
                      <InfoIcon color="gray.500" />
                    </Tooltip>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder="Port"
                  value={port}
                  onChange={handlePortChange}
                  size="md"
                  borderRadius="md"
                  type="number"
                  max={99}
                  isDisabled={false}
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>
                  <HStack>
                    <Text>Wallet Name</Text>
                    <Tooltip label="Name for your validator's wallet">
                      <InfoIcon color="gray.500" />
                    </Tooltip>
                  </HStack>
                </FormLabel>
                <Input
                  placeholder="Wallet Name"
                  value={walletName}
                  onChange={handleWalletNameChange}
                  size="md"
                  borderRadius="md"
                  isDisabled={false}
                />
              </FormControl>
            </Grid>
            
            {/* Binary installation methods */}
            {hasRepository || hasBinary ? (
              <>
                <Text mb={4}>Choose your preferred installation method:</Text>
                <Tabs size="md" variant="enclosed" colorScheme="blue" mb={6}>
                  <TabList>
                    {hasRepository && <Tab>Repository (Build from Source)</Tab>}
                    {hasBinary && <Tab>Binary (Quick Install)</Tab>}
                  </TabList>
                  <TabPanels borderWidth={1} borderColor={borderColor} borderRadius="md">
                    {hasRepository && (
                      <TabPanel>
                        <CodeSnippet
                          code={`# Install ${chain?.name} through repository
cd $HOME
rm -rf ${chain?.name}
git clone ${chain?.links.repository} ${chain?.name}
cd ${chain?.name}
git checkout ${chain?.version}
make install
${chain?.binary} version # Should show ${chain?.version}
`}
                        />
                      </TabPanel>
                    )}
                    {hasBinary && (
                      <TabPanel>
                        <CodeSnippet
                          code={`# Install ${chain?.name} through binary
cd $HOME
curl -L ${chain?.links.binary} | tar -xvzf - -C $HOME
sudo mv ${chain?.binary} /usr/local/bin/
${chain?.binary} version # Verify installation
`}
                        />
                      </TabPanel>
                    )}
                  </TabPanels>
                </Tabs>
              </>
            ) : (
              <Alert status="warning" mb={6}>
                <AlertIcon />
                <AlertTitle>No installation method available</AlertTitle>
                <AlertDescription>
                  Contact the team for installation instructions.
                </AlertDescription>
              </Alert>
            )}
            
            <Accordion defaultIndex={[0, 1]} allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={CheckCircleIcon} color="green.500" />
                      <Text fontWeight="bold">Node Configuration</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    <CodeSnippet
                      code={`# Set Configuration for your node
${chain?.binary} config chain-id ${chain?.chainId}
${chain?.binary} config keyring-backend file
`}
                    />
                    
                    <CodeSnippet
                      code={`# Initialize your node
${chain?.binary} init ${moniker || 'node'} --chain-id ${chain?.chainId}
`}
                    />
                    
                    <CodeSnippet
                      code={`# Add Genesis File and Addrbook
curl -Ls ${links?.genesis} > $HOME/.${chain?.dir}/config/genesis.json
curl -Ls ${links?.addrbook} > $HOME/.${chain?.dir}/config/addrbook.json
`}
                    />
                    
                    <CodeSnippet
                      code={`# Configure Peers (${livePeersCount} peers available)
${peersCommand}
`}
                    />
                  </VStack>
                </AccordionPanel>
              </AccordionItem>

              <AccordionItem>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Icon as={WarningIcon} color="orange.500" />
                      <Text fontWeight="bold">Advanced Configuration</Text>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel pb={4}>
                  <VStack spacing={4} align="stretch">
                    <CodeSnippet
                      code={`# Set Pruning, Enable Prometheus, Gas Prices, and Indexer
sed -i \\
  -e 's|^pruning *=.*|pruning = "custom"|' \\
  -e 's|^pruning-keep-recent *=.*|pruning-keep-recent = "100"|' \\
  -e 's|^pruning-keep-every *=.*|pruning-keep-every = "0"|' \\
  -e 's|^pruning-interval *=.*|pruning-interval = "10"|' \\
$HOME/.${chain?.dir}/config/app.toml

# Disable indexer
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.${chain?.dir}/config/config.toml

# Set minimum gas prices
sed -i -e "s|^minimum-gas-prices *=.*|minimum-gas-prices = \\"${chain?.gasPrice}\\"|" $HOME/.${chain?.dir}/config/app.toml
`}
                    />
                    
                    <CodeSnippet
                      code={`# Create Service file for auto-restart
sudo tee /etc/systemd/system/${chain?.binary}.service > /dev/null <<EOF
[Unit]
Description=${chain?.name} ${network} node
After=network-online.target

[Service]
User=$USER
ExecStart=$(which ${chain?.binary}) start
Restart=always
RestartSec=3
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable ${chain?.binary}
`}
                    />
                    
                    <CodeSnippet
                      code={`# Change Port (if you modified the port field above)
sed -i.bak -e "s%^proxy_app = \\"tcp://127.0.0.1:26658\\"%proxy_app = \\"tcp://127.0.0.1:${port}658\\"%; s%^laddr = \\"tcp://127.0.0.1:26657\\"%laddr = \\"tcp://127.0.0.1:${port}657\\"%; s%^pprof_laddr = \\"localhost:6060\\"%pprof_laddr = \\"localhost:${port}060\\"%; s%^laddr = \\"tcp://0.0.0.0:26656\\"%laddr = \\"tcp://0.0.0.0:${port}656\\"%; s%^prometheus_listen_addr = \\":26660\\"%prometheus_listen_addr = \\":${port}660\\"" $HOME/.${chain?.dir}/config/config.toml
sed -i.bak -e "s%^address = \\"tcp://localhost:1317\\"%address = \\"tcp://0.0.0.0:${port}317\\"%; s%^address = \\":8080\\"%address = \\":${port}080\\"%; s%^address = \\"localhost:9090\\"%address = \\"0.0.0.0:${port}090\\"%; s%^address = \\"0.0.0.0:9091\\"%address = \\"0.0.0.0:${port}091\\"%; s%:8545%:${port}545%; s%:8546%:${port}546%; s%:6065%:60${port}5%" $HOME/.${chain?.dir}/config/app.toml
`}
                    />
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
            
            {snapshotInfo ? (
              <Box mt={4}>
                <Text fontWeight="bold" mb={2}>Download Latest Snapshot ({new Date(snapshotInfo?.created_at || '').toLocaleString()})</Text>
                <CodeSnippet
                  code={`# Download Latest Snapshot
curl -L ${snapshotInfo?.url} | tar -Ilz4 -xf - -C $HOME/.${chain?.dir}
`}
                />
              </Box>
            ) : (
              <Alert status="info" mt={4}>
                <AlertIcon />
                <AlertDescription>
                  {snapshotLoading ? "Loading snapshot information..." : "No snapshot information available"}
                </AlertDescription>
              </Alert>
            )}
            
            <Box mt={4}>
              <Text fontWeight="bold" mb={2}>Start the Node</Text>
              <CodeSnippet
                code={`# Start the Node and view logs
sudo systemctl restart ${chain?.binary} && sudo journalctl -fu ${chain?.binary} -o cat
`}
              />
            </Box>
          </Section>

          {/* Validator Setup */}
          <Section>
            <SectionHeading id="validator" title="4. Validator Setup" />
            <Alert status="warning" my={4} borderRadius="md">
              <AlertIcon />
              <Box>
                <AlertTitle>Important!</AlertTitle>
                <AlertDescription>
                  Before continuing, make sure your node is fully synced with the network. You can check sync status with:<br />
                  <code>{`${chain?.binary} status 2>&1 | jq .SyncInfo`}</code>
                </AlertDescription>
              </Box>
            </Alert>
            
            <Text mb={4}>Create or recover a wallet for your validator:</Text>
            
            <Tabs size="md" variant="enclosed" colorScheme="blue" mb={6}>
              <TabList>
                <Tab>Create New Wallet</Tab>
                <Tab>Recover Existing Wallet</Tab>
              </TabList>
              <TabPanels borderWidth={1} borderColor={borderColor} borderRadius="md">
                <TabPanel>
                  <CodeSnippet
                    code={`# Create New Wallet
${chain?.binary} keys add ${walletName}

# !!!IMPORTANT!!! Save your mnemonic phrase securely
`}
                  />
                </TabPanel>
                <TabPanel>
                  <CodeSnippet
                    code={`# Recover Existing Wallet
${chain?.binary} keys add ${walletName} --recover

# Enter your mnemonic phrase when prompted
`}
                  />
                </TabPanel>
              </TabPanels>
            </Tabs>
            
            <Text mb={3}>Check your wallet list and balance:</Text>
            <CodeSnippet
              code={`# List all wallets
${chain?.binary} keys list

# Check wallet balance
${chain?.binary} q bank balances $(${chain?.binary} keys show ${walletName} -a)
`}
            />
            
            <Divider my={6} />
            
            <Stack spacing={4}>
              <Heading as="h3" size="md">Create Validator</Heading>
              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Before creating your validator:</AlertTitle>
                  <AlertDescription>
                    <List spacing={2}>
                      <ListItem>1. Make sure your node is fully synced</ListItem>
                      <ListItem>2. Ensure you have enough tokens (minimum 1 {chain?.denom})</ListItem>
                      <ListItem>3. Backup your validator key at {`$HOME/.${chain?.dir}/config/priv_validator_key.json`}</ListItem>
                    </List>
                  </AlertDescription>
                </Box>
              </Alert>
              
              <Text>Edit the validator details below before executing:</Text>
              <CodeSnippet
                code={`# Create Validator
${chain?.binary} tx staking create-validator \\
  --amount 1000000${chain?.denom} \\
  --pubkey $(${chain?.binary} tendermint show-validator) \\
  --moniker "${moniker}" \\
  --identity "YOUR_KEYBASE_ID" \\
  --details "YOUR_VALIDATOR_DETAILS" \\
  --website "YOUR_WEBSITE_URL" \\
  --chain-id ${chain?.chainId} \\
  --commission-rate 0.05 \\
  --commission-max-rate 0.20 \\
  --commission-max-change-rate 0.05 \\
  --min-self-delegation "1" \\
  --from ${walletName} \\
  --gas auto \\
  --gas-adjustment 1.4 \\
  --gas-prices ${chain?.gasPrice} \\
  -y
`}
              />
              
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Critical Security Warning!</AlertTitle>
                  <AlertDescription>
                    Save the $HOME/.{chain?.dir}/config/priv_validator_key.json file securely. 
                    This is the ONLY file you need to recover your validator if your server fails.
                  </AlertDescription>
                </Box>
              </Alert>
            </Stack>
          </Section>
          
          {/* Useful Commands */}
          <Section>
            <SectionHeading id="commands" title="5. Useful Commands" />
            <Stack spacing={4} mt={4}>
              <Text>Here are some useful commands for managing your node and validator:</Text>
              
              <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Node Management</Heading>
                  </CardHeader>
                  <CardBody>
                    <CodeSnippet
                      code={`# Check node status
${chain?.binary} status 2>&1 | jq

# Check logs
journalctl -fu ${chain?.binary} -o cat

# Restart node
sudo systemctl restart ${chain?.binary}
`}
                    />
                  </CardBody>
                </Card>

                <Card bg={cardBg} borderWidth={1} borderColor={borderColor}>
                  <CardHeader>
                    <Heading size="md">Validator Management</Heading>
                  </CardHeader>
                  <CardBody>
                    <CodeSnippet
                      code={`# Check validator status
${chain?.binary} q staking validator $(${chain?.binary} keys show ${walletName} --bech val -a)

# Check delegations
${chain?.binary} q staking delegations-to $(${chain?.binary} keys show ${walletName} --bech val -a)
`}
                    />
                  </CardBody>
                </Card>
              </Grid>
            </Stack>
          </Section>
        </Stack>
      )}
    </ServiceLayout>
  )
}