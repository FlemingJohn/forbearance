import { AbiCoder, Interface, getAddress } from "ethers";
import type { Log } from "ethers";

const coder = AbiCoder.defaultAbiCoder();

const aaveInterface = new Interface([
  "event LiquidationCall(address indexed collateralAsset, address indexed debtAsset, address indexed user, uint256 debtToCover, uint256 liquidatedCollateralAmount, address liquidator, bool receiveAToken)",
]);

const morphoInterface = new Interface([
  "event Liquidate(bytes32 indexed id, address indexed caller, address indexed borrower, uint256 repaidAssets, uint256 repaidShares, uint256 seizedAssets, uint256 badDebtAssets, uint256 badDebtShares)",
]);

const compoundInterface = new Interface([
  "event AbsorbCollateral(address indexed absorber, address indexed borrower, address indexed asset, uint256 collateralAbsorbed, uint256 usdValue)",
]);

export interface LiquidationDetail {
  borrower: string | null;
  liquidator: string | null;
  collateralAsset: string | null;
  repaidAmount: bigint;
  seizedAmount: bigint;
  badDebtAmount: bigint;
}

const emptyDetail: LiquidationDetail = {
  borrower: null,
  liquidator: null,
  collateralAsset: null,
  repaidAmount: 0n,
  seizedAmount: 0n,
  badDebtAmount: 0n,
};

function readAddressTopic(topic: string | undefined): string | null {
  if (!topic) {
    return null;
  }

  try {
    return getAddress(`0x${topic.slice(-40)}`);
  } catch {
    return null;
  }
}

function decodeAave(log: Log): LiquidationDetail {
  const [debtToCover, liquidatedCollateralAmount, liquidator] = coder.decode(
    ["uint256", "uint256", "address", "bool"],
    log.data,
  );

  return {
    borrower: readAddressTopic(log.topics[3]),
    liquidator: liquidator as string,
    collateralAsset: readAddressTopic(log.topics[1]),
    repaidAmount: debtToCover as bigint,
    seizedAmount: liquidatedCollateralAmount as bigint,
    badDebtAmount: 0n,
  };
}

function decodeMorpho(log: Log): LiquidationDetail {
  const [repaidAssets, , seizedAssets, badDebtAssets] = coder.decode(
    ["uint256", "uint256", "uint256", "uint256", "uint256"],
    log.data,
  );

  return {
    borrower: readAddressTopic(log.topics[3]),
    liquidator: readAddressTopic(log.topics[2]),
    collateralAsset: null,
    repaidAmount: repaidAssets as bigint,
    seizedAmount: seizedAssets as bigint,
    badDebtAmount: badDebtAssets as bigint,
  };
}

function decodeCompound(log: Log): LiquidationDetail {
  const [collateralAbsorbed, usdValue] = coder.decode(
    ["uint256", "uint256"],
    log.data,
  );

  return {
    borrower: readAddressTopic(log.topics[2]),
    liquidator: readAddressTopic(log.topics[1]),
    collateralAsset: readAddressTopic(log.topics[3]),
    repaidAmount: usdValue as bigint,
    seizedAmount: collateralAbsorbed as bigint,
    badDebtAmount: 0n,
  };
}

export function decodeLiquidation(
  protocolId: string,
  log: Log,
): LiquidationDetail {
  try {
    if (protocolId === "aave-v3-pool") {
      return decodeAave(log);
    }

    if (protocolId === "morpho-blue") {
      return decodeMorpho(log);
    }

    if (protocolId === "compound-v3-usdc") {
      return decodeCompound(log);
    }
  } catch {
    return emptyDetail;
  }

  return emptyDetail;
}

export const liquidationInterfaces = {
  aave: aaveInterface,
  morpho: morphoInterface,
  compound: compoundInterface,
};
