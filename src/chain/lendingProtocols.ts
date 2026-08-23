import { id } from "ethers";

export interface LendingProtocol {
  id: string;
  protocol: string;
  asset: string;
  address: string;
  liquidationTopic: string;
  liquidationSignature: string;
}

const aaveLiquidationSignature =
  "LiquidationCall(address,address,address,uint256,uint256,address,bool)";

const compoundLiquidationSignature =
  "AbsorbCollateral(address,address,address,uint256,uint256)";

const morphoLiquidationSignature =
  "Liquidate(bytes32,address,address,uint256,uint256,uint256,uint256,uint256)";

export const lendingProtocols: LendingProtocol[] = [
  {
    id: "aave-v3-pool",
    protocol: "Aave v3",
    asset: "Ethereum Pool",
    address: "0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2",
    liquidationTopic: id(aaveLiquidationSignature),
    liquidationSignature: aaveLiquidationSignature,
  },
  {
    id: "morpho-blue",
    protocol: "Morpho",
    asset: "Blue",
    address: "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb",
    liquidationTopic: id(morphoLiquidationSignature),
    liquidationSignature: morphoLiquidationSignature,
  },
  {
    id: "compound-v3-usdc",
    protocol: "Compound v3",
    asset: "USDC",
    address: "0xc3d688B66703497DAA19211EEdff47f25384cdc3",
    liquidationTopic: id(compoundLiquidationSignature),
    liquidationSignature: compoundLiquidationSignature,
  },
];

export function findProtocolById(
  protocolId: string,
): LendingProtocol | undefined {
  return lendingProtocols.find((protocol) => protocol.id === protocolId);
}
