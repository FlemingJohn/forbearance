const attestedPointType =
  "(uint64 height, bytes32 hash, bool isAttestation, bool exists)";

const boundsType =
  "(uint64 parentHeight, bytes32 parentHash, bool parentIsAttestation, uint64 childHeight, bytes32 childHash, bool childIsAttestation, bool isAttested)";

const chainInfoType =
  "((uint64 chainKey, uint64 chainId, bytes chainName, uint8 chainEncoding) info, bool exists)";

export const chainInfoAbi = [
  "function is_height_attested(uint64 chainKey, uint64 targetHeight) view returns (bool isAttested)",
  `function get_attestation_bounds(uint64 chainKey, uint64 targetHeight) view returns (${boundsType} result)`,
  `function get_latest_attestation_height_and_hash(uint64 chainKey) view returns (${attestedPointType} result)`,
  `function get_latest_checkpoint_height_and_hash(uint64 chainKey) view returns (${attestedPointType} result)`,
  `function find_highest_attested_before(uint64 chainKey, uint64 targetHeight) view returns (${attestedPointType} result)`,
  `function find_lowest_attested_after(uint64 chainKey, uint64 targetHeight) view returns (${attestedPointType} result)`,
  "function get_attestation_genesis_height(uint64 chainKey) view returns (uint64 genesisHeight)",
  "function get_attestation_height_for_digest(uint64 chainKey, bytes32 digest) view returns ((uint64 height, bool exists))",
  "function get_checkpoint_for_height(uint64 chainKey, uint64 height) view returns ((bytes32 hash, bool exists))",
  `function get_chain_by_key(uint64 chainKey) view returns (${chainInfoType} result)`,
  "function get_supported_chains() view returns ((uint64 chainKey, uint64 chainId, bytes chainName, uint8 chainEncoding)[] chains)",
];
