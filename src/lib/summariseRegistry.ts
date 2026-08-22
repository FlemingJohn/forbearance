import { isFailureFinding } from "./describeFinding";
import type { Market } from "@/types";

export interface RegistrySummary {
  marketCount: number;
  failingMarketCount: number;
  slowestMarketName: string;
  slowestWaitSeconds: number;
  marketsWithoutAttempts: number;
}

const emptySummary: RegistrySummary = {
  marketCount: 0,
  failingMarketCount: 0,
  slowestMarketName: "none",
  slowestWaitSeconds: 0,
  marketsWithoutAttempts: 0,
};

export function summariseRegistry(markets: Market[]): RegistrySummary {
  const firstMarket = markets[0];

  if (!firstMarket) {
    return emptySummary;
  }

  const slowest = markets.reduce(
    (worst, market) =>
      market.worstCaseWaitSeconds > worst.worstCaseWaitSeconds ? market : worst,
    firstMarket,
  );

  return {
    marketCount: markets.length,
    failingMarketCount: markets.filter((market) =>
      isFailureFinding(market.finding),
    ).length,
    slowestMarketName: `${slowest.protocol} ${slowest.asset}`,
    slowestWaitSeconds: slowest.worstCaseWaitSeconds,
    marketsWithoutAttempts: markets.filter(
      (market) => market.attemptRatio === 0,
    ).length,
  };
}
