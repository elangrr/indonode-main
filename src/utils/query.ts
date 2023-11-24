import axios from 'axios'

export type SyncInfo = {
  latest_block_hash: string
  latest_app_hash: string
  latest_block_height: number
  latest_block_time: string
  earliest_block_hash: string
  earliest_app_hash: string
  earliest_block_height: number
  earliest_block_time: string
}

export const fetchSyncInfo = async (rpc: string): Promise<SyncInfo | null> => {
  const response = await axios.get(`${rpc}/status`)

  if (!response.data.result) {
    return null
  }
  return response.data.result.sync_info
}

export type CurrentPrice = {
  idr: number
  usd: number
}
export const fetchPrice = async (
  coinGeckoId: string
): Promise<CurrentPrice | null> => {
  const response = await axios.get(
    `https://api.coingecko.com/api/v3/coins/${coinGeckoId}?tickers=false&market_data=true&community_data=false&developer_data=false`
  )
  if (!response.data.market_data) {
    return null
  }
  return response.data.market_data.current_price
}

export type SnapshotInfo = {
  block_height: number
  filename: string
  size: string
  created_at: string
  url: string
}
export const fetchSnapshotInfo = async (
  snapshotUrl: string
): Promise<SnapshotInfo | null> => {
  const response = await axios.get(snapshotUrl)

  if (!response.data.snapshot_info) {
    return null
  }
  return response.data.snapshot_info
}
