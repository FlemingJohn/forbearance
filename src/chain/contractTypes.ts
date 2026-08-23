type MerkleTuple = [string, [string, boolean][]];
type ContinuityTuple = [string, string[]];
type AttestedPointResult = [bigint, string, boolean, boolean];

export interface ChainInfoContract {
  is_height_attested(chainKey: number, targetHeight: number): Promise<boolean>;

  get_attestation_bounds(
    chainKey: number,
    targetHeight: number,
  ): Promise<[bigint, string, boolean, bigint, string, boolean, boolean]>;

  get_latest_attestation_height_and_hash(
    chainKey: number,
  ): Promise<AttestedPointResult>;

  get_latest_checkpoint_height_and_hash(
    chainKey: number,
  ): Promise<AttestedPointResult>;

  find_highest_attested_before(
    chainKey: number,
    targetHeight: number,
  ): Promise<AttestedPointResult>;

  find_lowest_attested_after(
    chainKey: number,
    targetHeight: number,
  ): Promise<AttestedPointResult>;

  get_attestation_genesis_height(chainKey: number): Promise<bigint>;

  get_supported_chains(): Promise<[bigint, bigint, string, bigint][]>;
}

export interface BlockProverContract {
  calculateTxIndex(merkleProof: MerkleTuple): Promise<bigint>;

  [signature: string]: (...args: never[]) => Promise<unknown>;
}

export interface VerifySingleCall {
  (
    chainKey: number,
    height: number,
    encodedTransaction: string,
    merkleProof: MerkleTuple,
    continuityProof: ContinuityTuple,
  ): Promise<boolean>;
}

export interface VerifyBatchCall {
  (
    chainKey: number,
    heights: number[],
    encodedTransactions: string[],
    merkleProofs: MerkleTuple[],
    sharedContinuityProof: ContinuityTuple,
  ): Promise<boolean>;
}

export type { ContinuityTuple, MerkleTuple };
