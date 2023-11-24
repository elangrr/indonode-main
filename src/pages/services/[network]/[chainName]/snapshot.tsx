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
          <Heading fontSize={{ base: 'xl', md: '2xl', lg: '2xl' }} id="guide">
            Snapshot Guide
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
cp $HOME/.${chain?.name}/data/priv_validator_state.json $HOME/.${chain?.name}/priv_validator_state.json.backup
rm -rf $HOME/.${chain?.name}/data`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Download Latest Snapshot
curl -L ${snapshotInfo?.url} | lz4 -dc - | tar -xf - -C $HOME/.${chain?.name}
mv $HOME/.${chain?.name}/priv_validator_state.json.backup $HOME/.${chain?.name}/data/priv_validator_state.json`}
          ></CodeSnippet>
          <CodeSnippet
            code={`# Restart Service
sudo systemctl restart ${chain?.binary} && sudo journalctl -fu ${chain?.binary} -o cat`}
          ></CodeSnippet>
        </Stack>
      </Stack>
    </ServiceLayout>
  )
}
