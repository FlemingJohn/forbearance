import { Contract, formatUnits } from "ethers";
import type { JsonRpcProvider } from "ethers";
import { lendingProtocols } from "./lendingProtocols";
import type { MarketExposure } from "@/types/exposure";

const aavePoolAbi = [
  "function getUserAccountData(address user) view returns (uint256 totalCollateralBase, uint256 totalDebtBase, uint256 availableBorrowsBase, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
];

const compoundAbi = [
  "function balanceOf(address account) view returns (uint256)",
];

async function readAaveExposure(
  ethereumProvider: JsonRpcProvider,
  poolAddress: string,
  address: string,
): Promise<string | null> {
  try {
    const pool = new Contract(poolAddress, aavePoolAbi, ethereumProvider);
    const data = (await pool.getUserAccountData!(address)) as bigint[];
    const collateralBase = data[0] ?? 0n;

    if (collateralBase === 0n) {
      return null;
    }

    return `$${Number(formatUnits(collateralBase, 8)).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })} supplied`;
  } catch {
    return null;
  }
}

async function readCompoundExposure(
  ethereumProvider: JsonRpcProvider,
  marketAddress: string,
  address: string,
): Promise<string | null> {
  try {
    const market = new Contract(marketAddress, compoundAbi, ethereumProvider);
    const balance = (await market.balanceOf!(address)) as bigint;

    if (balance === 0n) {
      return null;
    }

    return `$${Number(formatUnits(balance, 6)).toLocaleString("en-US", {
      maximumFractionDigits: 0,
    })} supplied`;
  } catch {
    return null;
  }
}

export async function readExposure(
  ethereumProvider: JsonRpcProvider,
  address: string,
): Promise<MarketExposure[]> {
  const readings = lendingProtocols.map(async (protocol) => {
    const marketName = `${protocol.protocol} · ${protocol.asset}`;
    let suppliedLabel: string | null = null;

    if (protocol.id === "aave-v3-pool") {
      suppliedLabel = await readAaveExposure(
        ethereumProvider,
        protocol.address,
        address,
      );
    }

    if (protocol.id === "compound-v3-usdc") {
      suppliedLabel = await readCompoundExposure(
        ethereumProvider,
        protocol.address,
        address,
      );
    }

    return {
      marketId: protocol.id,
      marketName,
      suppliedLabel: suppliedLabel ?? "no position",
      hasPosition: suppliedLabel !== null,
    };
  });

  return Promise.all(readings);
}
