import { Network, getChain } from '@/utils/chains'
import { useQuery } from 'react-query'
import { fetchSnapshotInfo } from '@/utils/query'

export function useChain(network: string, chain: string) {
  return useQuery({
    queryKey: ['chain', network, chain],
    queryFn: () => getChain(network as Network, chain),
    enabled: !!network && !!chain,
  })
}

export function useSnapshotInfo(snapshotUrl: string) {
  return useQuery({
    queryKey: ['snapshot_info', snapshotUrl],
    queryFn: () => fetchSnapshotInfo(snapshotUrl),
    enabled: !!snapshotUrl,
  })
}
