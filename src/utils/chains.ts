import chains from '@/chains.json'

export type Links = {
  repository?: string
  binary?: string
  website?: string
  twitter?: string
  discord?: string
  peer?: string
  rpc?: string
  api?: string
  grpc?: string
  addrbook?: string
  genesis?: string
  snapshot?: string
  explorer?: string
  staking?: string
  wasm?: string
  github?: string
}

export type Chain = {
  title?: string                // ✅ now optional
  name?: string                 // ✅ now optional
  coinGeckoId?: string
  imageURL?: string
  version?: string
  chainId?: string              // ✅ support standard
  chain_id?: string             // ✅ support Noble-style
  description?: string[]
  binary?: string
  denom?: string
  dir?: string
  go?: string
  upgradever?: string
  upgrade?: string
  gasPrice?: string
  links?: Links                 // ✅ now optional
  network?: string
}

// ✅ Safe accessor for mainnet & testnet
export function getChains(network: string): Chain[] {
  if (network === 'mainnet' && Array.isArray(chains.mainnet)) {
    return chains.mainnet as Chain[]
  }

  if (network === 'testnet' && Array.isArray(chains.testnet)) {
    return chains.testnet as Chain[]
  }

  return []
}

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}

// ✅ Safe single-chain getter
export function getChain(
  network: Network,
  chainName: string
): Chain | undefined {
  const chainList = getChains(network)

  return chainList.find((item) =>
    item?.name?.toLowerCase() === chainName.toLowerCase()
  )
}
