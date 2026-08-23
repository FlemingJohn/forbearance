const merkleProofType = "(bytes32 root, (bytes32 hash, bool isLeft)[] siblings)";
const continuityProofType = "(bytes32 lowerEndpointDigest, bytes32[] roots)";

export const blockProverAbi = [
  `function verify(uint64 chainKey, uint64 height, bytes encodedTransaction, ${merkleProofType} merkleProof, ${continuityProofType} continuityProof) view returns (bool)`,
  `function verify(uint64 chainKey, uint64[] heights, bytes[] encodedTransactions, ${merkleProofType}[] merkleProofs, ${continuityProofType} sharedContinuityProof) view returns (bool)`,
  `function verifyAndEmit(uint64 chainKey, uint64 height, bytes encodedTransaction, ${merkleProofType} merkleProof, ${continuityProofType} continuityProof) returns (bool)`,
  `function verifyAndEmit(uint64 chainKey, uint64[] heights, bytes[] encodedTransactions, ${merkleProofType}[] merkleProofs, ${continuityProofType} sharedContinuityProof) returns (bool)`,
  `function calculateTxIndex(${merkleProofType} merkleProof) view returns (uint64)`,
  "event TransactionVerified(uint64 chainKey, uint64 height, uint64 transactionIndex)",
];

export const verifySingleSignature =
  "verify(uint64,uint64,bytes,(bytes32,(bytes32,bool)[]),(bytes32,bytes32[]))";

export const verifyBatchSignature =
  "verify(uint64,uint64[],bytes[],(bytes32,(bytes32,bool)[])[],(bytes32,bytes32[]))";

export const verifyAndEmitBatchSignature =
  "verifyAndEmit(uint64,uint64[],bytes[],(bytes32,(bytes32,bool)[])[],(bytes32,bytes32[]))";
