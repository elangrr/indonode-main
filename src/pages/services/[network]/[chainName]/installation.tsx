import { useState, useEffect } from 'react'
import ServiceLayout from '@/components/ServiceLayout'
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
} from '@chakra-ui/react'
import CodeSnippet from '@/components/CodeSnippet'
import { useSelector } from 'react-redux'
import { selectChain } from '@/store/chainSlice'
import { useRouter } from 'next/router'
import { useSnapshotInfo } from '@/hooks/use-query'

export default function ServiceInstallation() {
  const chain = useSelector(selectChain)
  const router = useRouter()
  const { network } = router.query
  const { data: snapshotInfo } = useSnapshotInfo(chain?.links.snapshot ?? '')

  const [moniker, setMoniker] = useState('MyNode') // Default value for Node Name
  const [port, setPort] = useState('26') // Default value for Port
  const [walletName, setWalletName] = useState('wallet') // Default value for Wallet Name
  const [peersCommand, setPeersCommand] = useState('')
  const [livePeersCount, setLivePeersCount] = useState(0)

  const handlePortChange = (e) => {
    const value = e.target.value
    if (/^\d{0,2}$/.test(value)) {
      setPort(value)
    }
  }

  const fetchLivePeers = async () => {
    try {
      const response = await fetch(`${chain?.links.rpc}/net_info`)
      const data = await response.json()
      const peers = data.result.peers
        .map(peer => `${peer.node_info.id}@${peer.remote_ip}:${peer.node_info.listen_addr.split(':').pop()}`)
        .join(',')
      setLivePeersCount(data.result.peers.length)
      setPeersCommand(`PEERS="${peers}"\nsed -i -e "s|^persistent_peers *=.*|persistent_peers = \\"$PEERS\\"|" $HOME/.${chain?.dir}/config/config.toml`)
    } catch (error) {
      console.error('Error fetching live peers:', error)
    }
  }

  useEffect(() => {
    if (chain?.links.rpc) {
      fetchLivePeers()
      const interval = setInterval(fetchLivePeers, 3 * 60 * 1000) // Fetch peers every 3 minutes
      return () => clearInterval(interval)
    }
  }, [chain?.links.rpc])

  const hasRepository = !!chain?.links.repository
  const hasBinary = !!chain?.links.binary

  return (
    <ServiceLayout>
      <Stack spacing={6}>
        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="setup">
            Setup Server
          </Heading>
          <CodeSnippet
            code={`# Update Packages and Install Prerequisites
sudo apt update && apt upgrade -y
sudo apt install curl git jq lz4 build-essential unzip fail2ban ufw -y
`}
          />
          <CodeSnippet
            code={`# Set Firewall
sudo ufw default allow outgoing
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 9100
`}
          />
          <CodeSnippet
            code={`# Enable Firewall
sudo ufw enable
`}
          />
        </Stack>

        {/* Go Installation */}
        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="go">
            Install GO
          </Heading>
          <CodeSnippet
            code={`ver="${chain?.go}"
wget "https://golang.org/dl/go$ver.linux-amd64.tar.gz"
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf "go$ver.linux-amd64.tar.gz"
rm "go$ver.linux-amd64.tar.gz"
echo "export PATH=$PATH:/usr/local/go/bin:$HOME/go/bin" >> $HOME/.bash_profile
source $HOME/.bash_profile
go version
`}
          />
        </Stack>

        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="node">
            Node Installation
          </Heading>
          <Stack direction="row" spacing={4}>
            <FormControl width="10%">
              <FormLabel>Node Name (Moniker)</FormLabel>
              <Input
                placeholder="Node Name"
                value={moniker}
                onChange={(e) => setMoniker(e.target.value)}
                size="md"
                borderRadius="md"
                opacity={moniker ? 1 : 0.5}
                color={moniker ? 'black' : 'gray'}
              />
            </FormControl>
            <FormControl width="10%">
              <FormLabel>Port (Optional)</FormLabel>
              <Input
                placeholder="Port"
                value={port}
                onChange={handlePortChange}
                size="md"
                borderRadius="md"
                opacity={port ? 1 : 0.5}
                color={port ? 'black' : 'gray'}
                type="number"
                maxLength="2"
              />
            </FormControl>
            <FormControl width="10%">
              <FormLabel>Wallet Name</FormLabel>
              <Input
                placeholder="Wallet Name"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                size="md"
                borderRadius="md"
                opacity={walletName ? 1 : 0.5}
                color={walletName ? 'black' : 'gray'}
              />
            </FormControl>
          </Stack>
          {hasRepository || hasBinary ? (
            <Tabs size="md" variant="enclosed">
              <TabList>
                {hasRepository && <Tab>Repository</Tab>}
                {hasBinary && <Tab>Binary</Tab>}
              </TabList>
              <TabPanels borderWidth={1} borderColor={'gray.200'}>
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
`}
                    />
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          ) : (
            <p>No installation method available.</p>
          )}

          <CodeSnippet
            code={`# Set Configuration for your node
${chain?.binary} config chain-id ${chain?.chainId}
${chain?.binary} config keyring-backend file
`}
          />
          <CodeSnippet
            code={`# Init your node
${chain?.binary} init ${moniker || 'node'} --chain-id ${chain?.chainId}
`}
          />
          <CodeSnippet
            code={`# Add Genesis File and Addrbook
curl -Ls ${chain?.links.genesis} > $HOME/.${chain?.dir}/config/genesis.json
curl -Ls ${chain?.links.addrbook} > $HOME/.${chain?.dir}/config/addrbook.json
`}
          />
          <CodeSnippet
            code={`# Configure Seeds and Peers
${peersCommand}
`}
          />
          <CodeSnippet
            code={`# Set Pruning, Enable Prometheus, Gas Prices, and Indexer
sed -i \\
  -e 's|^pruning *=.*|pruning = "custom"|' \\
  -e 's|^pruning-keep-recent *=.*|pruning-keep-recent = "100"|' \\
  -e 's|^pruning-keep-every *=.*|pruning-keep-every = "0"|' \\
  -e 's|^pruning-interval *=.*|pruning-interval = "19"|' \\
$HOME/.${chain?.dir}/config/app.toml
sed -i -e 's|^indexer *=.*|indexer = "null"|' $HOME/.${chain?.dir}/config/config.toml
sed -i -e "s|^minimum-gas-prices *=.*|minimum-gas-prices = \\"${chain?.gasPrice}\\"|" $HOME/.${chain?.dir}/config/app.toml
`}
          />
          <CodeSnippet
            code={`# Set Service file
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
            code={`# Change Port
sed -i.bak -e "s%^proxy_app = \\"tcp://127.0.0.1:26658\\"%proxy_app = \\"tcp://127.0.0.1:${port}658\\"%; s%^laddr = \\"tcp://127.0.0.1:26657\\"%laddr = \\"tcp://127.0.0.1:${port}657\\"%; s%^pprof_laddr = \\"localhost:6060\\"%pprof_laddr = \\"localhost:${port}060\\"%; s%^laddr = \\"tcp://0.0.0.0:26656\\"%laddr = \\"tcp://0.0.0.0:${port}656\\"%; s%^prometheus_listen_addr = \\":26660\\"%prometheus_listen_addr = \\":${port}660\\"" $HOME/.${chain?.dir}/config/config.toml
sed -i.bak -e "s%^address = \\"tcp://localhost:1317\\"%address = \\"tcp://0.0.0.0:${port}317\\"%; s%^address = \\":8080\\"%address = \\":${port}080\\"%; s%^address = \\"localhost:9090\\"%address = \\"0.0.0.0:${port}090\\"%; s%^address = \\"0.0.0.0:9091\\"%address = \\"0.0.0.0:${port}091\\"%; s%:8545%:${port}545%; s%:8546%:${port}546%; s%:6065%:60${port}5%" $HOME/.${chain?.dir}/config/app.toml
`}
          />
          <CodeSnippet
            code={`# Download Latest Snapshot
curl -L ${snapshotInfo?.url} | tar -Ilz4 -xf - -C $HOME/.${chain?.dir}
`}
          />
          <CodeSnippet
            code={`# Start the Node
sudo systemctl restart ${chain?.binary} && sudo journalctl -fu ${chain?.binary} -o cat
`}
          />
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
