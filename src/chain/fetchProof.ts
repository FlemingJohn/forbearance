import type { BatchProof, TransactionProof } from "@/types/chain";
import { MAX_BLOCK_SPAN_PER_BATCH, MAX_PROOFS_PER_BATCH } from "./chainSettings";

interface ProofBuilderPayload {
  chainKey: number;
  headerNumber: number;
  txIndex: number;
  txHash: string;
  txBytes: string;
  merkleProof: {
    root: string;
    siblings: { hash: string; isLeft: boolean }[];
  };
  continuityProof: {
    lowerEndpointDigest: string;
    roots: string[];
  };
  cached: boolean;
  generatedAt: string;
}

function buildEndpoint(proofBuilderUrl: string, path: string): string {
  return `${proofBuilderUrl.replace(/\/$/, "")}/api/v1/${path}`;
}

export async function readAttestedHeight(
  proofBuilderUrl: string,
  chainKey: number,
): Promise<number> {
  const response = await fetch(
    buildEndpoint(proofBuilderUrl, `attested-height/${chainKey}`),
  );

  if (!response.ok) {
    throw new Error(`Proof builder returned ${response.status}`);
  }

  const payload = (await response.json()) as { attestedHeight: number };
  return payload.attestedHeight;
}

export async function fetchTransactionProof(
  proofBuilderUrl: string,
  chainKey: number,
  transactionHash: string,
): Promise<TransactionProof> {
  const response = await fetch(
    buildEndpoint(proofBuilderUrl, `proof-by-tx/${chainKey}/${transactionHash}`),
  );

  if (!response.ok) {
    throw new Error(
      `Proof builder returned ${response.status} for ${transactionHash}`,
    );
  }

  const payload = (await response.json()) as ProofBuilderPayload;

  return {
    chainKey: payload.chainKey,
    blockHeight: payload.headerNumber,
    transactionIndex: payload.txIndex,
    transactionHash: payload.txHash,
    encodedTransaction: payload.txBytes,
    merkleProof: payload.merkleProof,
    continuityProof: payload.continuityProof,
    wasCached: payload.cached,
  };
}

export function combineProofsIntoBatch(proofs: TransactionProof[]): BatchProof {
  const firstProof = proofs[0];

  if (!firstProof) {
    throw new Error("A batch needs at least one proof");
  }

  if (proofs.length > MAX_PROOFS_PER_BATCH) {
    throw new Error(
      `A batch holds at most ${MAX_PROOFS_PER_BATCH} proofs, received ${proofs.length}`,
    );
  }

  const heights = proofs.map((proof) => proof.blockHeight);
  const span = Math.max(...heights) - Math.min(...heights);

  if (span > MAX_BLOCK_SPAN_PER_BATCH) {
    throw new Error(
      `A batch spans at most ${MAX_BLOCK_SPAN_PER_BATCH} blocks, received ${span}`,
    );
  }

  return {
    chainKey: firstProof.chainKey,
    blockHeights: heights,
    encodedTransactions: proofs.map((proof) => proof.encodedTransaction),
    merkleProofs: proofs.map((proof) => proof.merkleProof),
    sharedContinuityProof: firstProof.continuityProof,
  };
}
