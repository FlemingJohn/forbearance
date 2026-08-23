import type { BatchProof, MerkleProof, TransactionProof } from "@/types/chain";
import { verifyBatchSignature, verifySingleSignature } from "./blockProverAbi";
import type {
  BlockProverContract,
  ContinuityTuple,
  MerkleTuple,
  VerifyBatchCall,
  VerifySingleCall,
} from "./contractTypes";

function toMerkleTuple(merkleProof: MerkleProof): MerkleTuple {
  return [
    merkleProof.root,
    merkleProof.siblings.map((sibling) => [sibling.hash, sibling.isLeft]),
  ];
}

function toContinuityTuple(proof: {
  lowerEndpointDigest: string;
  roots: string[];
}): ContinuityTuple {
  return [proof.lowerEndpointDigest, proof.roots];
}

export async function verifyTransaction(
  blockProver: BlockProverContract,
  proof: TransactionProof,
): Promise<boolean> {
  const verify = blockProver[verifySingleSignature] as unknown as VerifySingleCall;

  return verify(
    proof.chainKey,
    proof.blockHeight,
    proof.encodedTransaction,
    toMerkleTuple(proof.merkleProof),
    toContinuityTuple(proof.continuityProof),
  );
}

export async function verifyBatch(
  blockProver: BlockProverContract,
  batch: BatchProof,
): Promise<boolean> {
  const verify = blockProver[verifyBatchSignature] as unknown as VerifyBatchCall;

  return verify(
    batch.chainKey,
    batch.blockHeights,
    batch.encodedTransactions,
    batch.merkleProofs.map(toMerkleTuple),
    toContinuityTuple(batch.sharedContinuityProof),
  );
}

export async function calculateTransactionIndex(
  blockProver: BlockProverContract,
  merkleProof: MerkleProof,
): Promise<number> {
  const index = await blockProver.calculateTxIndex(toMerkleTuple(merkleProof));
  return Number(index);
}
