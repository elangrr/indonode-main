import ServiceLayout from '@/components/ServiceLayout'
import {
  FormControl,
  FormLabel,
  Heading,
  Input,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Tooltip,
  Icon,
  Button,
  HStack,
  VStack,
  Divider,
  useColorModeValue,
  Badge,
  Alert,
  AlertIcon,
  Flex,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { InfoIcon, CopyIcon, CheckIcon } from '@chakra-ui/icons'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useState } from 'react'

export default function ServiceCheatSheet() {
  const chain = useSelector(selectChain)

  // Form state
  const [tokenValoperAddr, setTokenValoperAddr] = useState('<TO_VALOPER_ADDRESS>')
  const [tokenWalletAddr, setTokenWalletAddr] = useState('<TO_WALLET_ADDRESS>')
  const [tokenAmount, setTokenAmount] = useState(1000000)

  const [validatorMoniker, setValidatorMoniker] = useState('<MONIKER>')
  const [validatorIdentity, setValidatorIdentity] = useState('')
  const [validatorDetails, setValidatorDetails] = useState('Indonode Guide')
  const [validatorAmount, setValidatorAmount] = useState(1000000)
  const [validatorComissionRate, setValidatorComissionRate] = useState(0.05)
  const [validatorComissionMaxRate, setValidatorComissionMaxRate] = useState(0.2)
  const [validatorComissionMaxChangeRate, setValidatorComissionMaxChangeRate] = useState(0.01)

  const [govTitle, setGovTitle] = useState('')
  const [govDescription, setGovDescription] = useState('')
  const [govAmount, setGovAmount] = useState(1000000)
  const [govProposalId, setGovProposalId] = useState(1)
  const [govProposalOption, setGovProposalOption] = useState('yes')
  const [indexer, setIndexer] = useState('NULL')
  
  // Clipboard state
  const [copiedCommand, setCopiedCommand] = useState('')
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const sectionBg = useColorModeValue('gray.50', 'gray.700')
  const accentColor = useColorModeValue('blue.500', 'blue.300')
  
  // Handle copy to clipboard
  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopiedCommand(label)
    setTimeout(() => setCopiedCommand(''), 2000)
  }
  
  // Section component for better organization
  const CommandSection = ({ 
    title, 
    description, 
    code, 
    id 
  }: { 
    title: string, 
    description?: string, 
    code: string, 
    id?: string 
  }) => (
    <Box 
      bg={sectionBg}
      p={4}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      position="relative"
      mb={4}
      id={id}
    >
      <HStack justify="space-between" mb={2}>
        <Text fontWeight="bold">{title}</Text>
        <Button
          size="xs"
          leftIcon={copiedCommand === title ? <CheckIcon /> : <CopyIcon />}
          onClick={() => handleCopy(code, title)}
          colorScheme={copiedCommand === title ? "green" : "gray"}
        >
          {copiedCommand === title ? "Copied" : "Copy"}
        </Button>
      </HStack>
      {description && <Text mb={2} fontSize="sm">{description}</Text>}
      <CodeSnippet code={code} />
    </Box>
  )
  
  // Section heading component
  const SectionHeading = ({ title, id }: { title: string, id: string }) => (
    <Heading 
      fontSize={{ base: 'xl', md: '2xl' }} 
      mb={4} 
      id={id}
      color={accentColor}
      pb={2}
      borderBottomWidth="1px"
      borderColor={borderColor}
    >
      {title}
    </Heading>
  )


  return (
    <ServiceLayout>
      <Box mb={6}>
        <Heading size="xl" mb={2}>Command Cheat Sheet</Heading>
        <Text>
          A comprehensive collection of useful commands for {chain?.name} node and validator management.
          Customize parameters below to generate commands specific to your needs.
        </Text>
      </Box>
      
      <Tabs 
        isLazy 
        variant="enclosed" 
        colorScheme="blue" 
        borderColor={borderColor}
        mb={8}
      >
        <TabList overflowX="auto" overflowY="hidden" flexWrap="nowrap">
          <Tab><Text fontWeight="medium">🔑 Key Management</Text></Tab>
          <Tab><Text fontWeight="medium">⚙️ Validator</Text></Tab>
          <Tab><Text fontWeight="medium">💰 Token Management</Text></Tab>
          <Tab><Text fontWeight="medium">🗳️ Governance</Text></Tab>
          <Tab><Text fontWeight="medium">🛠️ Utility</Text></Tab>
          <Tab><Text fontWeight="medium">🔄 Services</Text></Tab>
        </TabList>

        <TabPanels mt={4}>
          {/* Keys Tab */}
          <TabPanel p={0}>
            <Box 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              mb={6}
            >
              <SectionHeading title="Key Management" id="key" />
              
              <Alert status="info" mb={4} borderRadius="md">
                <AlertIcon />
                <Text>
                  Keys are used to sign transactions. Always backup your mnemonic phrase in a safe place.
                </Text>
              </Alert>
              
              <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                <GridItem>
                  <CommandSection 
                    title="Add New Key" 
                    description="Create a new wallet" 
                    code={`${chain?.binary} keys add wallet`} 
                  />
                </GridItem>
                
                <GridItem>
                  <CommandSection 
                    title="Recover Existing Key" 
                    description="Restore wallet using seed phrase" 
                    code={`${chain?.binary} keys add wallet --recover`} 
                  />
                </GridItem>
                
                <GridItem>
                  <CommandSection 
                    title="List All Keys" 
                    description="Show all wallets in your keyring" 
                    code={`${chain?.binary} keys list`} 
                  />
                </GridItem>
                
                <GridItem>
                  <CommandSection 
                    title="Delete Key" 
                    description="Remove a wallet from your keyring" 
                    code={`${chain?.binary} keys delete wallet`} 
                  />
                </GridItem>
                
                <GridItem>
                  <CommandSection 
                    title="Export Key" 
                    description="Save key to wallet.backup file" 
                    code={`${chain?.binary} keys export wallet`} 
                  />
                </GridItem>
                
                <GridItem>
                  <CommandSection 
                    title="Import Key" 
                    description="Import key from backup file" 
                    code={`${chain?.binary} keys import wallet wallet.backup`} 
                  />
                </GridItem>
              </Grid>
              
              <Divider my={4} />
              
              <CommandSection 
                title="Query Wallet Balance" 
                description="Check tokens in your wallet" 
                code={`${chain?.binary} q bank balances $(${chain?.binary} keys show wallet -a)`} 
              />
            </Box>
          </TabPanel>

          {/* Validator Tab */}
          <TabPanel p={0}>
            <Box 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              mb={6}
            >
              <SectionHeading title="Validator Management" id="validator" />
              
              <Alert status="warning" mb={4} borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Important:</Text>
                  <Text>Make sure your node is fully synced before creating a validator.</Text>
                </Box>
              </Alert>
              
              <Text fontWeight="bold" mb={3}>Customize Validator Parameters:</Text>
              <Grid 
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }} 
                gap={4}
                mb={6}
              >
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Moniker</Text>
                      <Tooltip label="The public name of your validator">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="<MONIKER>"
                    value={validatorMoniker}
                    onChange={(e) => setValidatorMoniker(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Identity</Text>
                      <Tooltip label="Keybase ID for profile verification">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="<KEYBASE_ID>"
                    value={validatorIdentity}
                    onChange={(e) => setValidatorIdentity(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Details</Text>
                      <Tooltip label="Description of your validator">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="text"
                    value={validatorDetails}
                    onChange={(e) => setValidatorDetails(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Amount ({chain?.denom})</FormLabel>
                  <NumberInput
                    step={1}
                    value={validatorAmount}
                    min={1}
                    onChange={(e) => setValidatorAmount(Number(e))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Commission Rate</Text>
                      <Tooltip label="Your validator commission rate">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <NumberInput
                    min={0}
                    max={1}
                    step={0.01}
                    precision={2}
                    value={validatorComissionRate}
                    onChange={(e) => setValidatorComissionRate(Number(e))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Commission Max Rate</Text>
                      <Tooltip label="Maximum commission rate">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <NumberInput
                    min={0}
                    max={1}
                    step={0.01}
                    precision={2}
                    value={validatorComissionMaxRate}
                    onChange={(e) => setValidatorComissionMaxRate(Number(e))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Commission Change Rate</Text>
                      <Tooltip label="Maximum daily commission change">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <NumberInput
                    min={0}
                    max={1}
                    step={0.01}
                    precision={2}
                    value={validatorComissionMaxChangeRate}
                    onChange={(e) => setValidatorComissionMaxChangeRate(Number(e))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </Grid>
              
              <CommandSection
                title="Create Validator"
                description="Create a new validator with the specified parameters"
                code={`${chain?.binary} tx staking create-validator \\
  --amount "${validatorAmount}${chain?.denom}" \\
  --pubkey $(${chain?.binary} tendermint show-validator) \\
  --moniker "${validatorMoniker}" \\
  --identity "${validatorIdentity}" \\
  --details "${validatorDetails}" \\
  --website "YOUR WEBSITE" \\
  --chain-id ${chain?.chainId} \\
  --commission-rate "${validatorComissionRate}" \\
  --commission-max-rate "${validatorComissionMaxRate}" \\
  --commission-max-change-rate "${validatorComissionMaxChangeRate}" \\
  --min-self-delegation "1" \\
  --gas-prices ${chain?.gasPrice} \\
  --gas "auto" \\
  --gas-adjustment "1.5" \\
  --from wallet \\
  -y`}
              />
              
              <CommandSection
                title="Edit Validator"
                description="Update validator information"
                code={`${chain?.binary} tx staking edit-validator \\
--new-moniker "${validatorMoniker}" \\
--identity "${validatorIdentity}" \\
--details "${validatorDetails}" \\
--website "YOUR WEBSITE" \\
--chain-id ${chain?.chainId} \\
--commission-rate "${validatorComissionRate}" \\
--gas-prices ${chain?.gasPrice} \\
--gas "auto" \\
--gas-adjustment "1.5" \\
--from wallet \\
-y`}
              />
              
              <Divider my={4} />
              <VStack spacing={4} align="stretch">
  <CommandSection
    title="Unjail Validator"
    description="Release validator from jail after downtime"
    code={`${chain?.binary} tx slashing unjail \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
--from wallet \\
-y`}
  />

  <CommandSection
    title="Signing Info"
    description="Check validator signing information"
    code={`${chain?.binary} query slashing signing-info $(${chain?.binary} tendermint show-validator)`}
  />

  <CommandSection
    title="List Active Validators"
    description="View all bonded validators sorted by tokens"
    code={`${chain?.binary} q staking validators -oj --limit=3000 | jq '.validators[] | select(.status=="BOND_STATUS_BONDED")' | jq -r '(.tokens|tonumber/pow(10; 6)|floor|tostring) + " \\t " + .description.moniker' | sort -gr | nl`}
  />

  <CommandSection
    title="List Inactive Validators"
    description="View all unbonded validators"
    code={`${chain?.binary} q staking validators -oj --limit=3000 | jq '.validators[] | select(.status=="BOND_STATUS_UNBONDED" or .status=="BOND_STATUS_UNBONDING")' | jq -r '(.tokens|tonumber/pow(10; 6)|floor|tostring) + " \\t " + .description.moniker' | sort -gr | nl`}
  />

  <CommandSection
    title="View Validator Details"
    description="Check your validator's current state"
    code={`${chain?.binary} q staking validator $(${chain?.binary} keys show wallet --bech val -a)`}
  />
</VStack>
              <CommandSection
                title="View Validator Details"
                description="Check your validator's current state"
                code={`${chain?.binary} q staking validator $(${chain?.binary} keys show wallet --bech val -a)`}
              />
            </Box>
          </TabPanel>

          {/* Token Management Tab */}
          <TabPanel p={0}>
            <Box 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              mb={6}
            >
              <SectionHeading title="Token Management" id="token" />
              
              <Text fontWeight="bold" mb={3}>Customize Token Parameters:</Text>
              <Grid 
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} 
                gap={4}
                mb={6}
              >
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Validator Address</Text>
                      <Tooltip label="The valoper address to delegate to">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="<TO_VALOPER_ADDRESS>"
                    value={tokenValoperAddr}
                    onChange={(e) => setTokenValoperAddr(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>
                    <HStack>
                      <Text>Wallet Address</Text>
                      <Tooltip label="The wallet address to send tokens to">
                        <InfoIcon color="gray.500" boxSize={3} />
                      </Tooltip>
                    </HStack>
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="<TO_WALLET_ADDRESS>"
                    value={tokenWalletAddr}
                    onChange={(e) => setTokenWalletAddr(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Amount ({chain?.denom})</FormLabel>
                  <NumberInput
                    step={1}
                    min={1}
                    value={tokenAmount}
                    onChange={(e) => setTokenAmount(Number(e))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Grid>
              
              <Tabs variant="soft-rounded" colorScheme="blue" size="sm" mb={6}>
                <TabList mb={4}>
                  <Tab>Rewards</Tab>
                  <Tab>Staking</Tab>
                  <Tab>Transfers</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                      <GridItem>
                        <CommandSection
                          title="Withdraw All Rewards"
                          description="Claim rewards from all validators"
                          code={`${chain?.binary} tx distribution withdraw-all-rewards \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
                        />
                      </GridItem>
                      
                      <GridItem>
                        <CommandSection
                          title="Withdraw Validator Rewards"
                          description="Claim rewards and commission from your validator"
                          code={`${chain?.binary} tx distribution withdraw-rewards \\
$(${chain?.binary} keys show wallet --bech val -a) \\
--commission \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
                        />
                      </GridItem>
                    </Grid>
                  </TabPanel>
                  
                  <TabPanel px={0}>
                    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                      <GridItem>
                        <CommandSection
                          title="Delegate to Your Validator"
                          description="Stake tokens with your own validator"
                          code={`${chain?.binary} tx staking delegate \\
$(${chain?.binary} keys show wallet --bech val -a) \\
${tokenAmount}${chain?.denom} \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
                        />
                      </GridItem>
                      
                      <GridItem>
                        <CommandSection
                          title="Delegate to Other Validator"
                          description="Stake tokens with another validator"
                          code={`${chain?.binary} tx staking delegate \\
${tokenValoperAddr} \\
${tokenAmount}${chain?.denom} \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
                        />
                      </GridItem>
                      
                      <GridItem>
                        <CommandSection
                          title="Redelegate Stake"
                          description="Move staked tokens to another validator"
                          code={`${chain?.binary} tx staking redelegate \\
$(${chain?.binary} keys show wallet --bech val -a) \\
${tokenValoperAddr} \\
${tokenAmount}${chain?.denom} \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
                        />
                      </GridItem>
                      
                      <GridItem>
                        <CommandSection
                          title="Unbond Stake"
                          description="Undelegate tokens (subject to unbonding period)"
                          code={`${chain?.binary} tx staking unbond \\
$(${chain?.binary} keys show wallet --bech val -a) \\
${tokenAmount}${chain?.denom} \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
                        />
                      </GridItem>
                    </Grid>
                  </TabPanel>
                  
                  <TabPanel px={0}>
                    <CommandSection
                      title="Send Tokens"
                      description="Transfer tokens to another wallet"
                      code={`${chain?.binary} tx bank send \\
wallet ${tokenWalletAddr} \\
${tokenAmount}${chain?.denom} \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
                    />
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </TabPanel>

          {/* Governance Tab */}
          <TabPanel p={0}>
            <Box 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              mb={6}
            >
              <SectionHeading title="Governance" id="governance" />
              
              <Alert status="info" mb={4} borderRadius="md">
                <AlertIcon />
                <Text>
                  Participate in on-chain governance by creating and voting on proposals.
                </Text>
              </Alert>
              
              <Text fontWeight="bold" mb={3}>Create Proposal:</Text>
              <Grid 
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }} 
                gap={4}
                mb={6}
              >
                <FormControl>
                  <FormLabel>Title</FormLabel>
                  <Input
                    type="text"
                    placeholder="Proposal Title"
                    value={govTitle}
                    onChange={(e) => setGovTitle(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Description</FormLabel>
                  <Input
                    type="text"
                    placeholder="Proposal Description"
                    value={govDescription}
                    onChange={(e) => setGovDescription(e.target.value)}
                  />
                </FormControl>
                
                <FormControl>
                  <FormLabel>Deposit Amount ({chain?.denom})</FormLabel>
                  <NumberInput
                    step={1}
                    value={govAmount}
                    min={1}
                    onChange={(e) => setGovAmount(Number(e))}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </FormControl>
              </Grid>
              
              <CommandSection
                title="Submit Text Proposal"
                description="Create new on-chain governance proposal"
                code={`${chain?.binary} tx gov submit-proposal \\
--title "${govTitle}" \\
--description "${govDescription}" \\
--deposit "${govAmount}${chain?.denom}" \\
--type "Text" \\
--from wallet \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
              />
              
              <CommandSection
                title="List All Proposals"
                description="View active and past governance proposals"
                code={`${chain?.binary} query gov proposals`}
              />
              
              <Divider my={4} />
              
              <Text fontWeight="bold" mb={3}>Vote on Proposal:</Text>
              <Grid 
                templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} 
                gap={4}
                mb={6}
              >
                <FormControl>
                  <FormLabel>Proposal ID</FormLabel>
                  <NumberInput
                    value={govProposalId}
                    min={1}
                    onChange={(e) => setGovProposalId(Number(e))}
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
                
                <FormControl>
                  <FormLabel>Vote Option</FormLabel>
                  <RadioGroup
                    onChange={setGovProposalOption}
                    value={govProposalOption}
                  >
                    <HStack spacing={4} h="40px">
                      <Radio value="yes">Yes</Radio>
                      <Radio value="no">No</Radio>
                      <Radio value="no_with_veto">No with veto</Radio>
                      <Radio value="abstain">Abstain</Radio>
                    </HStack>
                  </RadioGroup>
                </FormControl>
              </Grid>
              
              <CommandSection
                title="Vote on Proposal"
                description="Cast your vote on an active proposal"
                code={`${chain?.binary} tx gov vote ${govProposalId} ${govProposalOption} \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y`}
              />
            </Box>
          </TabPanel>

          {/* Utility Tab */}
          <TabPanel p={0}>
            <Box 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
              boxShadow="sm"
              mb={6}
            >
              <SectionHeading title="Utility Commands" id="utility" />
              
              <Tabs variant="soft-rounded" colorScheme="blue" size="sm" mb={6}>
                <TabList mb={4}>
                  <Tab>Node Configuration</Tab>
                  <Tab>Node Status</Tab>
                  <Tab>Node Management</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel px={0}>
                    <Stack spacing={4}>
                      <Box>
                        <FormControl mb={4}>
                          <FormLabel>Set Indexer Type</FormLabel>
                          <RadioGroup
                            onChange={(value) => setIndexer(value)}
                            value={indexer}
                          >
                            <HStack spacing={4}>
                              <Radio value="NULL">Null (Disabled)</Radio>
                              <Radio value="KV">KV (Enabled)</Radio>
                            </HStack>
                          </RadioGroup>
                        </FormControl>
                        
                        <CommandSection
                          title="Change Indexer Settings"
                          description="Modify blockchain indexer configuration"
                          code={`sed -i 's|^indexer *=.*|indexer = "${indexer.toLowerCase()}"|' $HOME/.${chain?.dir}/config/config.toml`}
                        />
                        </Box>
                      
                      <CommandSection
                        title="Set Custom Port"
                        description="Change default ports for your node"
                        code={`CUSTOM_PORT=13
sed -i.bak -e "s%^proxy_app = \\"tcp://127.0.0.1:26658\\"%proxy_app = \\"tcp://127.0.0.1:\${CUSTOM_PORT}658\"%; s%^laddr = \\"tcp://127.0.0.1:26657\\"%laddr = \\"tcp://127.0.0.1:\${CUSTOM_PORT}657\"%; s%^pprof_laddr = \\"localhost:6060\\"%pprof_laddr = \\"localhost:\${CUSTOM_PORT}060\"%; s%^laddr = \\"tcp://0.0.0.0:26656\\"%laddr = \\"tcp://0.0.0.0:\${CUSTOM_PORT}656\"%; s%^prometheus_listen_addr = \\":26660\\"%prometheus_listen_addr = \":\${CUSTOM_PORT}660\"%" $HOME/.${chain?.dir}/config/config.toml
sed -i.bak -e "s%^address = \\"tcp://0.0.0.0:1317\\"%address = \\"tcp://0.0.0.0:\${CUSTOM_PORT}317\"%; s%^address = \\":8080\\"%address = \":\${CUSTOM_PORT}080\"%; s%^address = \\"0.0.0.0:9090\\"%address = \\"0.0.0.0:\${CUSTOM_PORT}090\"%; s%^address = \\"0.0.0.0:9091\\"%address = \\"0.0.0.0:\${CUSTOM_PORT}091\"%; s%^address = \\"0.0.0.0:8545\\"%address = \\"0.0.0.0:\${CUSTOM_PORT}545\"%; s%^ws-address = \\"0.0.0.0:8546\\"%ws-address = \\"0.0.0.0:\${CUSTOM_PORT}546\"%" $HOME/.${chain?.dir}/config/app.toml`}
                      />
                    </Stack>
                  </TabPanel>
                  <TabPanel px={0}>
                    <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                      <GridItem>
                        <CommandSection
                          title="Get Validator Info"
                          description="View information about your validator node"
                          code={`${chain?.binary} status 2>&1 | jq .ValidatorInfo`}
                        />
                      </GridItem>
                      
                      <GridItem>
                        <CommandSection
                          title="Get Denom Info"
                          description="View token denomination metadata"
                          code={`${chain?.binary} q bank denom-metadata -oj | jq`}
                        />
                      </GridItem>
                      
                      <GridItem>
                        <CommandSection
                          title="Check Sync Status"
                          description="Verify if your node is synced with the network"
                          code={`${chain?.binary} status 2>&1 | jq .SyncInfo.catching_up`}
                        />
                      </GridItem>
                      
                      <GridItem>
                        <CommandSection
                          title="Get Latest Block Height"
                          description="Check the current block height of your node"
                          code={`${chain?.binary} status 2>&1 | jq .SyncInfo.latest_block_height`}
                        />
                      </GridItem>
                    </Grid>
                  </TabPanel>
                  
                  <TabPanel px={0}>
                    <CommandSection
                      title="Reset Node"
                      description="Reset node data while keeping address book"
                      code={`${chain?.binary} tendermint unsafe-reset-all --home $HOME/.${chain?.dir} --keep-addr-book`}
                    />
                    
                    <Alert status="warning" my={4} borderRadius="md">
                      <AlertIcon />
                      <Box>
                        <Text fontWeight="bold">Caution - Destructive Action</Text>
                        <Text>The following command will completely remove your node and all data. Use with extreme caution.</Text>
                      </Box>
                    </Alert>
                    
                    <CommandSection
                      title="Delete Node"
                      description="Completely remove node and all data"
                      code={`cd $HOME && sudo systemctl stop ${chain?.binary} && sudo systemctl disable ${chain?.binary} && sudo rm /etc/systemd/system/${chain?.binary}.service && sudo systemctl daemon-reload && sudo rm -rf $(which ${chain?.binary}) && sudo rm -rf $HOME/.${chain?.dir} && sudo rm -rf $(which ${chain?.binary})`}
                    />
                  </TabPanel>
                  </TabPanels>
                </Tabs>
              </Box>
            </TabPanel>

            {/* Services Tab */}
            <TabPanel p={0}>
              <Box 
                bg={bgColor} 
                p={6} 
                borderRadius="lg" 
                borderWidth="1px" 
                borderColor={borderColor}
                boxShadow="sm"
                mb={6}
              >
                <SectionHeading title="Service Management" id="services" />
                
                <Alert status="info" mb={4} borderRadius="md">
                  <AlertIcon />
                  <Text>
                    These commands help you manage the systemd service for your node.
                  </Text>
                </Alert>
                
                <Grid templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(2, 1fr)" }} gap={4}>
                  <GridItem>
                    <CommandSection
                      title="Reload Service Daemon"
                      description="Load new service configurations"
                      code={`sudo systemctl daemon-reload`}
                    />
                  </GridItem>
                  
                  <GridItem>
                    <CommandSection
                      title="Enable Service"
                      description="Set service to start on boot"
                      code={`sudo systemctl enable ${chain?.binary}`}
                    />
                  </GridItem>
                  
                  <GridItem>
                    <CommandSection
                      title="Disable Service"
                      description="Prevent service from starting on boot"
                      code={`sudo systemctl disable ${chain?.binary}`}
                    />
                  </GridItem>
                  
                  <GridItem>
                    <CommandSection
                      title="Start Service"
                      description="Start the node service"
                      code={`sudo systemctl start ${chain?.binary}`}
                    />
                  </GridItem>
                  
                  <GridItem>
                    <CommandSection
                      title="Stop Service"
                      description="Stop the node service"
                      code={`sudo systemctl stop ${chain?.binary}`}
                    />
                  </GridItem>
                  
                  <GridItem>
                    <CommandSection
                      title="Restart Service"
                      description="Restart the node service"
                      code={`sudo systemctl restart ${chain?.binary}`}
                    />
                  </GridItem>
                </Grid>
                
                <Divider my={4} />
                
                <CommandSection
                  title="Check Service Status"
                  description="View service status details"
                  code={`sudo systemctl status ${chain?.binary}`}
                />
                
                <CommandSection
                  title="Check Service Logs"
                  description="View and follow node logs in real-time"
                  code={`sudo journalctl -u ${chain?.binary} -f --no-hostname -o cat`}
                />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
        
        <Alert status="success" borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="bold">Quick Tip:</Text>
            <Text>Use the copy button next to each command to easily copy commands to your clipboard.</Text>
          </Box>
        </Alert>
      </ServiceLayout>
    )
}
