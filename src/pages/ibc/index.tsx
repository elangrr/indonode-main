"use client"

import {
  Box,
  Heading,
  Text,
  Grid,
  Badge,
  HStack,
  VStack,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  ButtonGroup,
  Flex,
  Icon,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react"
import { SearchIcon, ExternalLinkIcon } from "@chakra-ui/icons"
import { FaGlobe, FaTwitter, FaDiscord } from "react-icons/fa"
import Link from "next/link"
import { useState, useMemo } from "react"
import chainsData from "@/chains.json"

type NetworkType = "all" | "mainnet" | "testnet"

export default function IBCIndex() {
  const [search, setSearch] = useState("")
  const [networkFilter, setNetworkFilter] = useState<NetworkType>("all")

  const chains = useMemo(() => {
    const mainnetChains = (Array.isArray(chainsData?.mainnet) ? chainsData.mainnet : []).map((c: any) => ({
      ...c,
      networkType: "mainnet",
    }))
    const testnetChains = (Array.isArray(chainsData?.testnet) ? chainsData.testnet : []).map((c: any) => ({
      ...c,
      networkType: "testnet",
    }))
    return [...mainnetChains, ...testnetChains]
  }, [])

  const filteredChains = useMemo(() => {
    return chains.filter((chain: any) => {
      const chainId = chain?.chainId || chain?.chain_id || ""
      const title = chain?.title || chain?.name || ""
      const matchesSearch =
        title.toLowerCase().includes(search.toLowerCase()) || chainId.toLowerCase().includes(search.toLowerCase())
      const matchesNetwork = networkFilter === "all" || chain.networkType === networkFilter
      return matchesSearch && matchesNetwork
    })
  }, [chains, search, networkFilter])

  const mainnetCount = chains.filter((c: any) => c.networkType === "mainnet").length
  const testnetCount = chains.filter((c: any) => c.networkType === "testnet").length

  const cardBg = useColorModeValue("white", "gray.800")
  const cardBorder = useColorModeValue("gray.200", "gray.700")
  const hoverBg = useColorModeValue("gray.50", "gray.700")

  return (
    <Box p={{ base: 4, md: 10 }} maxW="1400px" mx="auto">
      {/* Header */}
      <VStack align="start" spacing={2} mb={8}>
        <Heading size="xl">IBC Networks</Heading>
        <Text color="gray.500">Explore Inter-Blockchain Communication channels across {chains.length} networks</Text>
      </VStack>

      {/* Stats Bar */}
      <HStack spacing={4} mb={6} flexWrap="wrap">
        <Badge colorScheme="blue" fontSize="sm" px={3} py={1} rounded="full">
          Total: {chains.length}
        </Badge>
        <Badge colorScheme="green" fontSize="sm" px={3} py={1} rounded="full">
          Mainnet: {mainnetCount}
        </Badge>
        <Badge colorScheme="orange" fontSize="sm" px={3} py={1} rounded="full">
          Testnet: {testnetCount}
        </Badge>
      </HStack>

      {/* Search and Filter */}
      <Flex direction={{ base: "column", md: "row" }} gap={4} mb={8} align={{ base: "stretch", md: "center" }}>
        <InputGroup maxW={{ base: "100%", md: "400px" }}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.400" />
          </InputLeftElement>
          <Input
            placeholder="Search by name or chain ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            bg={cardBg}
            borderColor={cardBorder}
          />
        </InputGroup>

        <ButtonGroup size="sm" isAttached variant="outline">
          <Button
            onClick={() => setNetworkFilter("all")}
            colorScheme={networkFilter === "all" ? "blue" : "gray"}
            variant={networkFilter === "all" ? "solid" : "outline"}
          >
            All
          </Button>
          <Button
            onClick={() => setNetworkFilter("mainnet")}
            colorScheme={networkFilter === "mainnet" ? "green" : "gray"}
            variant={networkFilter === "mainnet" ? "solid" : "outline"}
          >
            Mainnet
          </Button>
          <Button
            onClick={() => setNetworkFilter("testnet")}
            colorScheme={networkFilter === "testnet" ? "orange" : "gray"}
            variant={networkFilter === "testnet" ? "solid" : "outline"}
          >
            Testnet
          </Button>
        </ButtonGroup>
      </Flex>

      {/* Chain Cards Grid */}
      <Grid templateColumns="repeat(auto-fill, minmax(320px, 1fr))" gap={6}>
        {filteredChains.map((chain: any) => {
          const chainId = chain?.chainId || chain?.chain_id
          if (!chainId) return null

          const title = chain?.title || chain?.name || chainId
          const description = Array.isArray(chain?.description) ? chain.description[0] : chain?.description || ""
          const imageUrl = chain?.imageURL
          const isMainnet = chain.networkType === "mainnet"

          return (
            <Box
              key={chainId}
              p={5}
              borderWidth="1px"
              borderColor={cardBorder}
              rounded="xl"
              bg={cardBg}
              boxShadow="sm"
              transition="all 0.2s"
              _hover={{
                bg: hoverBg,
                boxShadow: "md",
                transform: "translateY(-2px)",
                borderColor: isMainnet ? "green.300" : "orange.300",
              }}
            >
              <VStack align="start" spacing={3}>
                {/* Header with Image and Title */}
                <HStack spacing={3} w="100%">
                  {imageUrl && (
                    <Image
                      src={imageUrl || "/placeholder.svg"}
                      alt={title}
                      boxSize="48px"
                      rounded="lg"
                      objectFit="cover"
                      fallbackSrc="/interconnected-blocks.png"
                    />
                  )}
                  <VStack align="start" spacing={0} flex={1}>
                    <Heading size="md" noOfLines={1}>
                      {title}
                    </Heading>
                    <HStack spacing={2}>
                      <Badge colorScheme={isMainnet ? "green" : "orange"} fontSize="xs" rounded="full">
                        {isMainnet ? "Mainnet" : "Testnet"}
                      </Badge>
                      <Text fontSize="xs" color="gray.500" noOfLines={1}>
                        {chainId}
                      </Text>
                    </HStack>
                  </VStack>
                </HStack>

                {/* Description */}
                {description && (
                  <Text fontSize="sm" color="gray.600" noOfLines={2}>
                    {description}
                  </Text>
                )}

                {/* Links Row */}
                <HStack spacing={2} pt={2}>
                  {chain?.links?.website && (
                    <Tooltip label="Website" hasArrow>
                      <a
                        href={chain.links.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon as={FaGlobe} boxSize={4} color="gray.500" _hover={{ color: "blue.500" }} />
                      </a>
                    </Tooltip>
                  )}
                  {chain?.links?.twitter && (
                    <Tooltip label="Twitter" hasArrow>
                      <a
                        href={chain.links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon as={FaTwitter} boxSize={4} color="gray.500" _hover={{ color: "cyan.500" }} />
                      </a>
                    </Tooltip>
                  )}
                  {chain?.links?.discord && (
                    <Tooltip label="Discord" hasArrow>
                      <a
                        href={chain.links.discord}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Icon as={FaDiscord} boxSize={4} color="gray.500" _hover={{ color: "purple.500" }} />
                      </a>
                    </Tooltip>
                  )}
                  {chain?.links?.explorer && (
                    <Tooltip label="Explorer" hasArrow>
                      <a
                        href={chain.links.explorer}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <ExternalLinkIcon boxSize={4} color="gray.500" _hover={{ color: "teal.500" }} />
                      </a>
                    </Tooltip>
                  )}
                </HStack>

                {/* View Channels Button */}
                <Link href={`/ibc/${chainId}`} style={{ width: "100%" }}>
                  <Button
                    w="100%"
                    size="sm"
                    colorScheme={isMainnet ? "green" : "orange"}
                    variant="outline"
                    mt={2}
                    rightIcon={<ExternalLinkIcon />}
                  >
                    View IBC Channels
                  </Button>
                </Link>
              </VStack>
            </Box>
          )
        })}
      </Grid>

      {/* Empty State */}
      {filteredChains.length === 0 && (
        <Box textAlign="center" py={12}>
          <Text color="gray.500" fontSize="lg">
            No networks found matching your search.
          </Text>
          <Button
            mt={4}
            size="sm"
            variant="outline"
            onClick={() => {
              setSearch("")
              setNetworkFilter("all")
            }}
          >
            Clear filters
          </Button>
        </Box>
      )}
    </Box>
  )
}
