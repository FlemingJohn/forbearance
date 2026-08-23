export const BLOCK_PROVER_ADDRESS =
  "0x0000000000000000000000000000000000000FD2";

export const CHAIN_INFO_ADDRESS =
  "0x0000000000000000000000000000000000000fD3";

export const CREDITCOIN_TESTNET_CHAIN_ID = 102031;

export const MAX_PROOFS_PER_BATCH = 10;

export const MAX_BLOCK_SPAN_PER_BATCH = 1000;

export const BASE_PROOF_COST_CTC = 0.000023;

export const COST_PER_CONTINUITY_HASH_CTC = 0.00000029;

interface ChainSettings {
  creditcoinRpcUrl: string;
  ethereumRpcUrl: string;
  proofBuilderUrl: string;
  sourceChainKey: number;
}

function readSetting(key: string, fallback: string): string {
  const fromVite =
    typeof import.meta !== "undefined" ? import.meta.env?.[key] : undefined;

  if (typeof fromVite === "string" && fromVite.length > 0) {
    return fromVite;
  }

  const fromNode =
    typeof process !== "undefined" ? process.env?.[key] : undefined;

  if (typeof fromNode === "string" && fromNode.length > 0) {
    return fromNode;
  }

  return fallback;
}

export function readChainSettings(): ChainSettings {
  return {
    creditcoinRpcUrl: readSetting(
      "VITE_CREDITCOIN_RPC_URL",
      "https://rpc.cc3-testnet.creditcoin.network",
    ),
    ethereumRpcUrl: readSetting(
      "VITE_ETHEREUM_RPC_URL",
      "https://ethereum-rpc.publicnode.com",
    ),
    proofBuilderUrl: readSetting(
      "VITE_PROOF_BUILDER_URL",
      "https://prover.cc3-testnet.creditcoin.network",
    ),
    sourceChainKey: Number(readSetting("VITE_SOURCE_CHAIN_KEY", "3")),
  };
}

export function estimateProofCostCtc(continuityHashCount: number): number {
  return (
    BASE_PROOF_COST_CTC + COST_PER_CONTINUITY_HASH_CTC * continuityHashCount
  );
}
