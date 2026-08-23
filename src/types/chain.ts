export interface MerkleProofEntry {
  hash: string;
  isLeft: boolean;
}

export interface MerkleProof {
  root: string;
  siblings: MerkleProofEntry[];
}

export interface ContinuityProof {
  lowerEndpointDigest: string;
  roots: string[];
}

export interface TransactionProof {
  chainKey: number;
  blockHeight: number;
  transactionIndex: number;
  transactionHash: string;
  encodedTransaction: string;
  merkleProof: MerkleProof;
  continuityProof: ContinuityProof;
  wasCached: boolean;
}

export interface BatchProof {
  chainKey: number;
  blockHeights: number[];
  encodedTransactions: string[];
  merkleProofs: MerkleProof[];
  sharedContinuityProof: ContinuityProof;
}

export interface SupportedChain {
  chainKey: number;
  chainId: number;
  chainName: string;
  chainEncoding: number;
}

export interface AttestationBounds {
  parentHeight: number;
  parentHash: string;
  parentIsAttestation: boolean;
  childHeight: number;
  childHash: string;
  childIsAttestation: boolean;
  isAttested: boolean;
}

export interface AttestationFrontier {
  height: number;
  hash: string;
  isAttestation: boolean;
  exists: boolean;
}
