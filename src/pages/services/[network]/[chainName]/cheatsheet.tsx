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
} from '@chakra-ui/react'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useState } from 'react'

export default function ServiceCheatSheet() {
  const chain = useSelector(selectChain)

  const [tokenValoperAddr, setTokenValoperAddr] = useState(
    '<TO_VALOPER_ADDRESS>'
  )
  const [tokenWalletAddr, setTokenWalletAddr] = useState('<TO_WALLET_ADDRESS>')
  const [tokenAmount, setTokenAmount] = useState(1000000)

  const [validatorMoniker, setValidatorMoniker] = useState('<MONIKER>')
  const [validatorIdentity, setValidatorIdentity] = useState('')
  const [validatorDetails, setValidatorDetails] = useState('Indonode Guide')
  const [validatorAmount, setValidatorAmount] = useState(1000000)
  const [validatorComissionRate, setValidatorComissionRate] = useState(0.01)
  const [validatorComissionMaxRate, setValidatorComissionMaxRate] =
    useState(0.2)
  const [validatorComissionMaxChangeRate, setValidatorComissionMaxChangeRate] =
    useState(0.01)

  const [govTitle, setGovTitle] = useState('')
  const [govDescription, setGovDescription] = useState('')
  const [govAmount, setGovAmount] = useState(1000000)
  const [govProposalId, setGovProposalId] = useState(1)
  const [govProposalOption, setGovProposalOption] = useState('yes')
  const [indexer, setIndexer] = useState('NULL');


  return (
    <ServiceLayout>
      <Stack spacing={6}>
        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="key">
            Key Management
          </Heading>
          <Stack>
            <Text>Add new key</Text>
            <CodeSnippet
              code={`${chain?.binary} keys add wallet`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Recover existing key</Text>
            <CodeSnippet
              code={`${chain?.binary} keys add wallet --recover`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>List All key</Text>
            <CodeSnippet code={`${chain?.binary} keys list`}></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Delete key</Text>
            <CodeSnippet
              code={`${chain?.binary} keys delete wallet`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Export Key (save to wallet.backup)</Text>
            <CodeSnippet
              code={`${chain?.binary} keys export wallet`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Import key</Text>
            <CodeSnippet
              code={`${chain?.binary} keys import wallet wallet.backup`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Query Wallet Balance</Text>
            <CodeSnippet
              code={`${chain?.binary} q bank balances $(${chain?.binary} keys show wallet -a)`}
            ></CodeSnippet>
          </Stack>
        </Stack>

        <Stack spacing={4}>
          <Heading
            fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
            id="validator"
          >
            Validator Management
          </Heading>
          <Stack direction={'row'} spacing={2} wrap={'wrap'}>
            <FormControl maxW={'sm'}>
              <FormLabel>Moniker</FormLabel>
              <Input
                type={'text'}
                placeholder="<MONIKER>"
                onChange={(e) => setValidatorMoniker(e.target.value)}
              />
            </FormControl>
            <FormControl maxW={'sm'}>
              <FormLabel>Identity</FormLabel>
              <Input
                type={'text'}
                placeholder="<KEYBASE_ID>"
                onChange={(e) => setValidatorIdentity(e.target.value)}
              />
            </FormControl>
            <FormControl maxW={'sm'}>
              <FormLabel>Details</FormLabel>
              <Input
                type={'text'}
                value={validatorDetails}
                onChange={(e) => setValidatorDetails(e.target.value)}
              />
            </FormControl>
            <FormControl maxW={{ base: 'sm', md: 64 }}>
              <FormLabel>Amount, {chain?.denom}</FormLabel>
              <NumberInput
                step={1}
                value={validatorAmount}
                min={0}
                onChange={(e) => setValidatorAmount(Number(e))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <FormControl maxW={{ base: 'sm', md: 64 }}>
              <FormLabel>Commission rate</FormLabel>
              <NumberInput
                min={0}
                value={validatorComissionRate}
                onChange={(e) => setValidatorComissionRate(Number(e))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl maxW={{ base: 'sm', md: 64 }}>
              <FormLabel>Commission max rate</FormLabel>
              <NumberInput
                min={0}
                value={validatorComissionMaxRate}
                onChange={(e) => setValidatorComissionMaxRate(Number(e))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl maxW={{ base: 'sm', md: 64 }}>
              <FormLabel>Commission max change rate</FormLabel>
              <NumberInput
                min={0}
                value={validatorComissionMaxChangeRate}
                onChange={(e) => setValidatorComissionMaxChangeRate(Number(e))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
          </Stack>
          <Stack>
            <Text>Create Validator</Text>
            <CodeSnippet
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
  -y
`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Edit Validator</Text>
            <CodeSnippet
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
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Unjail Validator</Text>
            <CodeSnippet
              code={`${chain?.binary} tx slashing unjail \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5\\
--gas "auto" \\
--from wallet \\
-y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Signing Info</Text>
            <CodeSnippet
              code={`${chain?.binary} query slashing signing-info $(${chain?.binary} tendermint show-validator) `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>List all active validators</Text>
            <CodeSnippet
              code={`${chain?.binary} q staking validators -oj --limit=3000 | jq '.validators[] | select(.status=="BOND_STATUS_BONDED")' | jq -r '(.tokens|tonumber/pow(10; 6)|floor|tostring) + " \t " + .description.moniker' | sort -gr | nl `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>List all inactive validators</Text>
            <CodeSnippet
              code={`${chain?.binary} q staking validators -oj --limit=3000 | jq '.validators[] | select(.status=="BOND_STATUS_UNBONDED") or .status=="BOND_STATUS_UNBONDING")' | jq -r '(.tokens|tonumber/pow(10; 6)|floor|tostring) + " \t " + .description.moniker' | sort -gr | nl `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>View validators details</Text>
            <CodeSnippet
              code={`${chain?.binary} q staking validator $(${chain?.binary} keys show wallet --bech val -a) `}
            ></CodeSnippet>
          </Stack>
        </Stack>

        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="token">
            Token Management
          </Heading>
          <Stack direction={'row'} spacing={2} wrap={'wrap'}>
            <FormControl maxW={'sm'}>
              <FormLabel>To valoper address</FormLabel>
              <Input
                type={'text'}
                placeholder="<TO_VALOPER_ADDRESS>"
                onChange={(e) => setTokenValoperAddr(e.target.value)}
              />
            </FormControl>
            <FormControl maxW={'sm'}>
              <FormLabel>To wallet address</FormLabel>
              <Input
                type={'text'}
                placeholder="<TO_WALLET_ADDRESS>"
                onChange={(e) => setTokenWalletAddr(e.target.value)}
              />
            </FormControl>
            <FormControl maxW={{ base: 'sm', md: 64 }}>
              <FormLabel>Amount, {chain?.denom}</FormLabel>
              <NumberInput
                step={1}
                min={0}
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
          </Stack>
          <Stack>
            <Text>Withdraw rewards from all validators</Text>
            <CodeSnippet
              code={`${chain?.binary} tx distribution withdraw-all-rewards --from wallet --chain-id ${chain?.chainId} --gas-prices ${chain?.gasPrice} \ --gas-adjustment 1.5 --gas "auto" -y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Withdraw comission and rewards from your validator</Text>
            <CodeSnippet
              code={`${chain?.binary} tx distribution withdraw-rewards $(${chain?.binary} keys show wallet --bech val -a) --commission --from wallet --chain-id ${chain?.chainId} --gas-prices ${chain?.gasPrice} \ --gas-adjustment 1.5 --gas "auto" -y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Delegate to your validator</Text>
            <CodeSnippet
              code={`${chain?.binary} tx staking delegate $(${chain?.binary} keys show wallet --bech val -a) 1000000${chain?.denom} --from wallet --chain-id ${chain?.chainId} --gas-prices ${chain?.gasPrice} \ --gas-adjustment 1.5 --gas "auto" -y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Delegate to other</Text>
            <CodeSnippet
              code={`c4ed tx staking delegate ${tokenValoperAddr} 1000000${chain?.denom} --from wallet --chain-id ${chain?.chainId} --gas-prices ${chain?.gasPrice} \ --gas-adjustment 1.5 --gas "auto" -y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Redelegate your stake to other validators</Text>
            <CodeSnippet
              code={`${chain?.binary} tx staking redelegate $(${chain?.binary} keys show wallet --bech val -a) ${tokenValoperAddr} ${tokenAmount}${chain?.denom} --from wallet --chain-id ${chain?.chainId} --gas-prices ${chain?.gasPrice} \ --gas-adjustment 1.5 --gas "auto" -y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Unbond stake</Text>
            <CodeSnippet
              code={`${chain?.binary} tx staking unbond $(${chain?.binary} keys show wallet --bech val -a) ${tokenAmount}${chain?.denom} --from wallet --chain-id ${chain?.chainId} --gas-prices ${chain?.gasPrice} \ --gas-adjustment 1.5 --gas "auto" -y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Send tokens</Text>
            <CodeSnippet
              code={`${chain?.binary} tx bank send wallet ${tokenWalletAddr} ${tokenAmount}${chain?.denom} --from wallet --chain-id ${chain?.chainId} --gas-prices ${chain?.gasPrice} \ --gas-adjustment 1.5 --gas "auto" -y `}
            ></CodeSnippet>
          </Stack>
        </Stack>

        <Stack spacing={4}>
          <Heading
            fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
            id="governance"
          >
            Governance
          </Heading>
          <Stack direction={'row'} spacing={2} wrap={'wrap'}>
            <FormControl maxW={'sm'}>
              <FormLabel>Title</FormLabel>
              <Input
                type={'text'}
                onChange={(e) => setGovTitle(e.target.value)}
              />
            </FormControl>
            <FormControl maxW={'sm'}>
              <FormLabel>Description</FormLabel>
              <Input
                type={'text'}
                onChange={(e) => setGovDescription(e.target.value)}
              />
            </FormControl>
            <FormControl maxW={{ base: 'sm', md: 64 }}>
              <FormLabel>Deposit Amount, {chain?.denom}</FormLabel>
              <NumberInput
                step={1}
                value={govAmount}
                min={0}
                onChange={(e) => setGovAmount(Number(e))}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
          </Stack>
          <Stack>
            <Text>Create new text proposal</Text>
            <CodeSnippet
              code={`${chain?.binary} tx gov submit-proposal \\
--title "${govTitle}" \\
--description "${govDescription}" \\
--deposit "${govAmount}${chain?.denom}" \\
--type "Text" \\
--from wallet \\
--gas-prices ${chain?.gasPrice} \\ 
--gas-adjustment 1.5 \\
--gas "auto" \\
-y `}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>List all proposals</Text>
            <CodeSnippet
              code={`${chain?.binary} query gov proposals`}
            ></CodeSnippet>
          </Stack>
          <Stack direction={'row'} spacing={4} wrap={'wrap'}>
            <FormControl maxW={{ base: 'sm', md: 64 }}>
              <FormLabel>Proposal ID</FormLabel>
              <NumberInput
                value={govProposalId}
                min={1}
                onChange={(e) => setGovProposalId(Number(e))}
              >
                <NumberInputField />
              </NumberInput>
            </FormControl>
            <FormControl maxW={'lg'}>
              <FormLabel>Proposal option</FormLabel>
              <RadioGroup
                onChange={setGovProposalOption}
                value={govProposalOption}
              >
                <Stack direction="row" h={'40px'}>
                  <Radio value="yes">Yes</Radio>
                  <Radio value="no">No</Radio>
                  <Radio value="no_with_veto">No with veto</Radio>
                  <Radio value="abstain">Abstain</Radio>
                </Stack>
              </RadioGroup>
            </FormControl>
          </Stack>
          <Stack>
            <Text>Vote</Text>
            <CodeSnippet
              code={`${chain?.binary} tx gov vote ${govProposalId} ${govProposalOption} \\
--from wallet \\
--chain-id ${chain?.chainId} \\
--gas-prices ${chain?.gasPrice} \\
--gas-adjustment 1.5 \\
--gas "auto" \\
-y `}
            ></CodeSnippet>
          </Stack>
        </Stack>

        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="utility">
            Utility
          </Heading>
          <Stack direction={'row'} spacing={4} wrap={'wrap'}>
  <FormControl maxW={'sm'}>
    <FormLabel>Set Indexer</FormLabel>
    <RadioGroup onChange={(value) => setIndexer(value)} value={indexer}>
      <Stack direction="row">
        <Radio value="NULL">NULL</Radio>
        <Radio value="KV">KV</Radio>
      </Stack>
    </RadioGroup>
  </FormControl>
</Stack>
<CodeSnippet
  code={`sed -i 's|^indexer *=.*|indexer = "${indexer.toLowerCase()}"|' $HOME/.${chain?.name}/config/config.toml`}
></CodeSnippet>
          <Stack>
            <Text>Set Custom Port</Text>
            <CodeSnippet
              code={`CUSTOM_PORT=13
sed -i.bak -e "s%^proxy_app = \"tcp://127.0.0.1:26658\"%proxy_app = \"tcp://127.0.0.1:\${CUSTOM_PORT}658\"%; s%^laddr = \"tcp://127.0.0.1:26657\"%laddr = \"tcp://127.0.0.1:\${CUSTOM_PORT}657\"%; s%^pprof_laddr = \"localhost:6060\"%pprof_laddr = \"localhost:\${CUSTOM_PORT}060\"%; s%^laddr = \"tcp://0.0.0.0:26656\"%laddr = \"tcp://0.0.0.0:\${CUSTOM_PORT}656\"%; s%^prometheus_listen_addr = \":26660\"%prometheus_listen_addr = \":\${CUSTOM_PORT}660\"%" $HOME/.${chain?.name}/config/config.toml
sed -i.bak -e "s%^address = \"tcp://0.0.0.0:1317\"%address = \"tcp://0.0.0.0:\${CUSTOM_PORT}317\"%; s%^address = \":8080\"%address = \":\${CUSTOM_PORT}080\"%; s%^address = \"0.0.0.0:9090\"%address = \"0.0.0.0:\${CUSTOM_PORT}090\"%; s%^address = \"0.0.0.0:9091\"%address = \"0.0.0.0:\${CUSTOM_PORT}091\"%; s%^address = \"0.0.0.0:8545\"%address = \"0.0.0.0:\${CUSTOM_PORT}545\"%; s%^ws-address = \"0.0.0.0:8546\"%ws-address = \"0.0.0.0:\${CUSTOM_PORT}546\"%" $HOME/.${chain?.name}/config/app.toml`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Get Validator info</Text>
            <CodeSnippet
              code={`${chain?.binary} status 2>&1 | jq .ValidatorInfo`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Get denom info</Text>
            <CodeSnippet
              code={`${chain?.binary} q bank denom-metadata -oj | jq`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Get sync status</Text>
            <CodeSnippet
              code={`${chain?.binary} status 2>&1 | jq .SyncInfo.catching_up`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Get latest height</Text>
            <CodeSnippet
              code={`${chain?.binary} status 2>&1 | jq .SyncInfo.latest_block_height`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Reset Node</Text>
            <CodeSnippet
              code={`${chain?.binary} tendermint unsafe-reset-all --home $HOME/.${chain?.name} --keep-addr-book`}
            ></CodeSnippet>
          </Stack>
          <Stack>
            <Text>Delete Node</Text>
            <CodeSnippet
              code={`cd $HOME && sudo systemctl stop ${chain?.binary} && sudo systemctl disable ${chain?.binary} && sudo rm /etc/systemd/system/${chain?.binary}.service && sudo systemctl daemon-reload && sudo rm -rf $(which ${chain?.name}) && sudo rm -rf $HOME/.${chain?.name} && sudo rm -rf $(which ${chain?.binary}) `}
            ></CodeSnippet>
          </Stack>
        </Stack>

        <Stack spacing={4}>
          <Heading
            fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }}
            id="services"
          >
            Services Management
          </Heading>
          <Stack>
    <Text>Reload Service</Text>
    <CodeSnippet
      code={`sudo systemctl daemon-reload`}
    ></CodeSnippet>
  </Stack>

  {/* Enable Service */}
  <Stack>
    <Text>Enable Service</Text>
    <CodeSnippet
      code={`sudo systemctl enable ${chain?.binary}`}
    ></CodeSnippet>
  </Stack>

  {/* Disable Service */}
  <Stack>
    <Text>Disable Service</Text>
    <CodeSnippet
      code={`sudo systemctl disable ${chain?.binary}`}
    ></CodeSnippet>
  </Stack>

  {/* Start Service */}
  <Stack>
    <Text>Start Service</Text>
    <CodeSnippet
      code={`sudo systemctl start ${chain?.binary}`}
    ></CodeSnippet>
  </Stack>

  {/* Stop Service */}
  <Stack>
    <Text>Stop Service</Text>
    <CodeSnippet
      code={`sudo systemctl stop ${chain?.binary}`}
    ></CodeSnippet>
  </Stack>

  {/* Restart Service */}
  <Stack>
    <Text>Restart Service</Text>
    <CodeSnippet
      code={`sudo systemctl restart ${chain?.binary}`}
    ></CodeSnippet>
  </Stack>

  {/* Check Service Status */}
  <Stack>
    <Text>Check Service Status</Text>
    <CodeSnippet
      code={`sudo systemctl status ${chain?.binary}`}
    ></CodeSnippet>
  </Stack>

  {/* Check Service Logs */}
  <Stack>
    <Text>Check Service Logs</Text>
    <CodeSnippet
      code={`sudo journalctl -u ${chain?.binary} -f --no-hostname -o cat`}
    ></CodeSnippet>
  </Stack>
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
