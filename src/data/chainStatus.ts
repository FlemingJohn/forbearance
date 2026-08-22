import { ETHEREUM_MAINNET_CHAIN_KEY } from "@/lib/chainAddresses";
import type { ChainStatus } from "@/types";

export const chainStatus: ChainStatus = {
  networkName: "Ethereum mainnet",
  chainKey: ETHEREUM_MAINNET_CHAIN_KEY,
  attestedFrontier: 21504881,
  secondsSinceFrontier: 47,
  isLive: true,
};
