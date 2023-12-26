import ServiceLayout from '@/components/ServiceLayout'
import {
  Heading,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
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
          ></CodeSnippet>
          <CodeSnippet
            code={`# Set Firewall
sudo ufw default allow outgoing
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 9100
`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Enable Firewall
sudo ufw enable
`}
          ></CodeSnippet>
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
          ></CodeSnippet>
        </Stack>
        <Stack spacing={4}>
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="node">
            Node Installation
          </Heading>
          <Tabs size="md" variant="enclosed">
            <TabList>
              <Tab isDisabled={!chain?.links.repository}>Repository</Tab>
              <Tab isDisabled={!chain?.links.binary}>Binary</Tab>
            </TabList>
            <TabPanels borderWidth={1} borderColor={'gray.200'}>
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
                ></CodeSnippet>
              </TabPanel>
              <TabPanel>
                <CodeSnippet
                  code={`# Install ${chain?.name} through binary
cd $HOME
curl -L ${chain?.links.binary} | tar -xvzf - -C $HOME
sudo mv ${chain?.binary} /usr/local/bin/
`}
                ></CodeSnippet>
              </TabPanel>
            </TabPanels>
          </Tabs>
          <CodeSnippet
            code={`# Set Configuration for your node
${chain?.binary} config chain-id ${chain?.chainId}
${chain?.binary} config keyring-backend file
`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Init your node
# You can change "MyNode" to anything you like
${chain?.binary} init MyNode --chain-in ${chain?.chainId}
`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Add Genesis File and Addrbook
curl -Ls ${chain?.links.genesis} > $HOME/.${chain?.dir}/config/genesis.json
curl -Ls ${chain?.links.addrbook} > $HOME/.${chain?.dir}/config/addrbook.json
`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Configure Seeds and Peers
PEERS="$(curl -sS ${chain?.links.rpc}/net_info | jq -r '.result.peers[] | "\(.node_info.id)@\(.remote_ip):\(.node_info.listen_addr)"' | awk -F ':' '{print $1":"$(NF)}' | sed -z 's|\n|,|g;s|.$||')"
sed -i -e "s|^persistent_peers *=.*|persistent_peers = \"$PEERS\"|" $HOME/.${chain?.dir}/config/config.toml
`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Set Pruning, Enable Prometheus, Gas Prices, and Indexer
PRUNING="custom"
PRUNING_KEEP_RECENT="100"
PRUNING_INTERVAL="19"

sed -i -e "s/^pruning *=.*/pruning = \"$PRUNING\"/" $HOME/.${chain?.dir}/config/app.toml
sed -i -e "s/^pruning-keep-recent *=.*/pruning-keep-recent = \
\"$PRUNING_KEEP_RECENT\"/" $HOME/.${chain?.dir}/config/app.toml
sed -i -e "s/^pruning-interval *=.*/pruning-interval = \
\"$PRUNING_INTERVAL\"/" $HOME/.${chain?.dir}/config/app.toml
sed -i 's|^prometheus *=.*|prometheus = true|' $HOME/.${chain?.dir}/config/config.toml
`}
          ></CodeSnippet>
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
          ></CodeSnippet>
          <CodeSnippet
            code={`# Download Latest Snapshot
curl -L ${snapshotInfo?.url} | tar -Ilz4 -xf - -C $HOME/.${chain?.dir}
[[ -f $HOME/.${chain?.dir}/data/upgrade-info.json ]] && cp $HOME/.${chain?.dir}/data/upgrade-info.json $HOME/.${chain?.dir}/cosmovisor/genesis/upgrade-info.json
`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Start the Node
sudo systemctl restart ${chain?.binary}
sudo journalctl -fu ${chain?.binary} -o cat
`}
          ></CodeSnippet>
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
