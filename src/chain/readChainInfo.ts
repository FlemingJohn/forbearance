import { toUtf8String } from "ethers";
import type { ChainInfoContract } from "./contractTypes";
import type {
  AttestationBounds,
  AttestationFrontier,
  SupportedChain,
} from "@/types/chain";

export async function listSupportedChains(
  chainInfo: ChainInfoContract,
): Promise<SupportedChain[]> {
  const chains = await chainInfo.get_supported_chains();

  return chains.map(
    (chain: [bigint, bigint, string, bigint]): SupportedChain => ({
      chainKey: Number(chain[0]),
      chainId: Number(chain[1]),
      chainName: decodeChainName(chain[2]),
      chainEncoding: Number(chain[3]),
    }),
  );
}

export async function isHeightAttested(
  chainInfo: ChainInfoContract,
  chainKey: number,
  blockHeight: number,
): Promise<boolean> {
  return chainInfo.is_height_attested(chainKey, blockHeight);
}

export async function readAttestedFrontier(
  chainInfo: ChainInfoContract,
  chainKey: number,
): Promise<AttestationFrontier> {
  const result = await chainInfo.get_latest_attestation_height_and_hash(
    chainKey,
  );

  return {
    height: Number(result[0]),
    hash: result[1],
    isAttestation: result[2],
    exists: result[3],
  };
}

export async function readAttestationBounds(
  chainInfo: ChainInfoContract,
  chainKey: number,
  blockHeight: number,
): Promise<AttestationBounds> {
  const result = await chainInfo.get_attestation_bounds(chainKey, blockHeight);

  return {
    parentHeight: Number(result[0]),
    parentHash: result[1],
    parentIsAttestation: result[2],
    childHeight: Number(result[3]),
    childHash: result[4],
    childIsAttestation: result[5],
    isAttested: result[6],
  };
}

export function countContinuityHashes(bounds: AttestationBounds): number {
  return Math.max(1, bounds.childHeight - bounds.parentHeight);
}

export function readEvidenceGrade(
  bounds: AttestationBounds,
): "attestation" | "checkpoint" {
  return bounds.childIsAttestation ? "attestation" : "checkpoint";
}

function decodeChainName(encodedName: string): string {
  try {
    return toUtf8String(encodedName).replace(/\0+$/, "");
  } catch {
    return encodedName;
  }
}
