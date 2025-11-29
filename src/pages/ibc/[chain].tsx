"use client"

import {
  Box,
  Heading,
  Text,
  Badge,
  HStack,
  Circle,
  Stack,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  ButtonGroup,
  Skeleton,
  Tooltip,
  useColorModeValue,
  Grid,
  GridItem,
  VStack,
} from "@chakra-ui/react"
import type { GetServerSideProps } from "next"
import { useState, useEffect } from "react"
import chainsData from "@/chains.json"

const allChains = [
  ...(Array.isArray(chainsData?.mainnet) ? chainsData.mainnet : []),
  ...(Array.isArray(chainsData?.testnet) ? chainsData.testnet : []),
]

const chainApiMap: Record<string, { api: string; title: string }> = {}
allChains.forEach((c: any) => {
  const id = c?.chainId || c?.chain_id
  const api = c?.links?.api?.replace(/\/+$/, "")
  if (id && api) {
    chainApiMap[id] = { api, title: c.title || c.name || id }
  }
})

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const chain = ctx.params?.chain as string
  const chainInfo = allChains.find((c: any) => c.chainId === chain || c.chain_id === chain)
  const apiBase = chainInfo?.links?.api?.replace(/\/+$/, "")
  if (!apiBase) return { notFound: true }

  let channels: any[] = []
  try {
    const res = await fetch(`${apiBase}/ibc/core/channel/v1/channels`)
    const data = await res.json()
    channels = data?.channels || []
  } catch (e) {
    console.error("IBC Fetch Error:", e)
  }

  return {
    props: {
      chainTitle: chainInfo.title || chainInfo.name || chain,
      channels,
      api: apiBase,
    },
  }
}

function CounterpartyChainBadge({
  channelId,
  portId,
  counterpartyChannelId,
  apiBase,
}: {
  channelId: string
  portId: string
  counterpartyChannelId: string
  apiBase: string
}) {
  const [chainId, setChainId] = useState<string | null>(null)
  const [chainTitle, setChainTitle] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function resolveCounterpartyChain() {
      try {
        // Step 1: Get the channel details to find connection_hops
        const channelRes = await fetch(`${apiBase}/ibc/core/channel/v1/channels/${channelId}/ports/${portId}`)
        const channelData = await channelRes.json()
        const connectionId = channelData?.channel?.connection_hops?.[0]

        if (!connectionId) {
          setLoading(false)
          return
        }

        // Step 2: Get the connection to find client_id
        const connectionRes = await fetch(`${apiBase}/ibc/core/connection/v1/connections/${connectionId}`)
        const connectionData = await connectionRes.json()
        const clientId = connectionData?.connection?.client_id

        if (!clientId) {
          setLoading(false)
          return
        }

        // Step 3: Get the client state to find chain_id
        const clientRes = await fetch(`${apiBase}/ibc/core/client/v1/client_states/${clientId}`)
        const clientData = await clientRes.json()
        const resolvedChainId = clientData?.client_state?.chain_id

        if (resolvedChainId) {
          setChainId(resolvedChainId)
          // Look up friendly name from our chains map
          const known = chainApiMap[resolvedChainId]
          if (known) {
            setChainTitle(known.title)
          }
        }
      } catch (e) {
        console.error("Error resolving counterparty chain:", e)
      } finally {
        setLoading(false)
      }
    }

    resolveCounterpartyChain()
  }, [channelId, portId, apiBase])

  if (loading) {
    return <Skeleton height="20px" width="100px" borderRadius="md" />
  }

  if (chainId) {
    return (
      <Tooltip label={chainId} placement="top" hasArrow>
        <Badge colorScheme="orange" fontSize="xs">
          {chainTitle || chainId}
        </Badge>
      </Tooltip>
    )
  }

  return (
    <Badge colorScheme="gray" fontSize="xs">
      Unknown
    </Badge>
  )
}

export default function IBCChainPage({
  chainTitle,
  channels,
  api,
}: {
  chainTitle: string
  channels: any[]
  api: string
}) {
  const [filter, setFilter] = useState<"all" | "live" | "down">("all")
  const [search, setSearch] = useState("")

  const bgCard = useColorModeValue("white", "gray.800")
  const borderColor = useColorModeValue("gray.200", "gray.700")
  const bgPage = useColorModeValue("gray.50", "gray.900")

  const filteredChannels = channels.filter((ch) => {
    const isLive = ch.state === "STATE_OPEN"
    const matchesFilter = filter === "all" || (filter === "live" && isLive) || (filter === "down" && !isLive)

    const matchesSearch =
      search === "" ||
      ch.channel_id?.toLowerCase().includes(search.toLowerCase()) ||
      ch.port_id?.toLowerCase().includes(search.toLowerCase()) ||
      ch.counterparty?.channel_id?.toLowerCase().includes(search.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const liveCount = channels.filter((ch) => ch.state === "STATE_OPEN").length
  const downCount = channels.length - liveCount

  return (
    <Box minH="100vh" bg={bgPage} p={{ base: 4, md: 8 }}>
      {/* Header */}
      <Box mb={8}>
        <Heading size="xl" mb={2}>
          {chainTitle}
        </Heading>
        <Text color="gray.500" fontSize="sm">
          IBC Channels — REST API: {api}
        </Text>
      </Box>

      {/* Stats Bar */}
      <HStack spacing={6} mb={6} flexWrap="wrap">
        <HStack>
          <Text fontWeight="semibold" color="gray.600">
            Total:
          </Text>
          <Badge colorScheme="purple" fontSize="md" px={2}>
            {channels.length}
          </Badge>
        </HStack>
        <HStack>
          <Circle size="10px" bg="green.400" />
          <Text fontWeight="semibold" color="gray.600">
            Live:
          </Text>
          <Badge colorScheme="green" fontSize="md" px={2}>
            {liveCount}
          </Badge>
        </HStack>
        <HStack>
          <Circle size="10px" bg="red.400" />
          <Text fontWeight="semibold" color="gray.600">
            Down:
          </Text>
          <Badge colorScheme="red" fontSize="md" px={2}>
            {downCount}
          </Badge>
        </HStack>
      </HStack>

      {/* Filters */}
      <Flex direction={{ base: "column", md: "row" }} gap={4} mb={6} align={{ base: "stretch", md: "center" }}>
        <InputGroup maxW={{ base: "100%", md: "300px" }}>
          <InputLeftElement pointerEvents="none">
            <Text color="gray.400">🔍</Text>
          </InputLeftElement>
          <Input
            placeholder="Search channels..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg={bgCard}
            borderColor={borderColor}
          />
        </InputGroup>

        <ButtonGroup isAttached variant="outline">
          <Button
            onClick={() => setFilter("all")}
            colorScheme={filter === "all" ? "blue" : "gray"}
            variant={filter === "all" ? "solid" : "outline"}
          >
            All
          </Button>
          <Button
            onClick={() => setFilter("live")}
            colorScheme={filter === "live" ? "green" : "gray"}
            variant={filter === "live" ? "solid" : "outline"}
          >
            Live
          </Button>
          <Button
            onClick={() => setFilter("down")}
            colorScheme={filter === "down" ? "red" : "gray"}
            variant={filter === "down" ? "solid" : "outline"}
          >
            Down
          </Button>
        </ButtonGroup>
      </Flex>

      {/* Channel List */}
      <Stack spacing={3}>
        {filteredChannels.map((ch: any) => {
          const isLive = ch.state === "STATE_OPEN"

          return (
            <Box
              key={`${ch.channel_id}-${ch.port_id}`}
              p={4}
              rounded="lg"
              border="1px solid"
              borderColor={borderColor}
              bg={bgCard}
              boxShadow="sm"
              _hover={{ boxShadow: "md", borderColor: "blue.300" }}
              transition="all 0.2s"
            >
              <Grid
                templateColumns={{
                  base: "1fr",
                  md: "100px 1fr 1fr 1fr 1fr 120px",
                }}
                gap={4}
                alignItems="center"
              >
                {/* Status */}
                <GridItem>
                  <HStack>
                    <Circle size="10px" bg={isLive ? "green.400" : "red.400"} />
                    <Badge colorScheme={isLive ? "green" : "red"} variant="subtle">
                      {isLive ? "LIVE" : "DOWN"}
                    </Badge>
                  </HStack>
                </GridItem>

                {/* Channel */}
                <GridItem>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Channel
                    </Text>
                    <Badge colorScheme="purple">{ch.channel_id}</Badge>
                  </VStack>
                </GridItem>

                {/* Port */}
                <GridItem>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Port
                    </Text>
                    <Badge colorScheme="blue">{ch.port_id}</Badge>
                  </VStack>
                </GridItem>

                {/* Counterparty Channel */}
                <GridItem>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Counterparty
                    </Text>
                    <Badge colorScheme="teal">{ch.counterparty?.channel_id || "N/A"}</Badge>
                  </VStack>
                </GridItem>

                {/* Counterparty Chain (auto-detected) */}
                <GridItem>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Chain
                    </Text>
                    <CounterpartyChainBadge
                      channelId={ch.channel_id}
                      portId={ch.port_id}
                      counterpartyChannelId={ch.counterparty?.channel_id}
                      apiBase={api}
                    />
                  </VStack>
                </GridItem>

                {/* Ordering */}
                <GridItem>
                  <VStack align="start" spacing={0}>
                    <Text fontSize="xs" color="gray.500" fontWeight="medium">
                      Ordering
                    </Text>
                    <Badge variant="outline">{ch.ordering?.replace("ORDER_", "")}</Badge>
                  </VStack>
                </GridItem>
              </Grid>
            </Box>
          )
        })}
      </Stack>

      {/* Empty State */}
      {filteredChannels.length === 0 && (
        <Box mt={8} p={8} textAlign="center" bg={bgCard} rounded="lg" border="1px solid" borderColor={borderColor}>
          <Text color="gray.500" fontSize="lg">
            {search || filter !== "all"
              ? "No channels match your filters."
              : "No IBC channels found or REST API unreachable."}
          </Text>
        </Box>
      )}
    </Box>
  )
}
