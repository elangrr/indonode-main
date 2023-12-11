import chains from '@/chains.json'

export type Links = {
  repository: string
  website: string
  twitter: string
  discord: string
  peer: string
  rpc: string
  api: string
  grpc: string
  addrbook: string
  genesis: string
  snapshot: string
  explorer: string
  staking?: string
}

export type Chain = {
  title: string
  name: string
  coinGeckoId: string
  imageURL: string
  version: string
  chainId: string
  description: string[]
  binary: string
  denom: string
  dir?: string
  go?: string
  upgradever?: string
  upgrade?: string
  gasPrice: string
  links: Links
}

export function getChains(network: string): Chain[] {
  if (network === 'mainnet') {
    return chains.mainnet
  } else if (network === 'testnet') {
    return chains.testnet
  } else {
    return []
  }
}

export enum Network {
  Mainnet = 'mainnet',
  Testnet = 'testnet',
}
export function getChain(
  network: Network,
  chainName: string
): Chain | undefined {
  const chainList: Chain[] | undefined = chains[network]
  if (!chainList) {
    return
  }

  return chainList.find(
    (item) => item.name.toLowerCase() === chainName.toLowerCase()
  )
}
