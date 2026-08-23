import { Contract, id } from "ethers";
import type { JsonRpcProvider } from "ethers";

export interface PriceFeed {
  id: string;
  label: string;
  proxyAddress: string;
}

export const ANSWER_UPDATED_TOPIC = id("AnswerUpdated(int256,uint256,uint256)");

const proxyAbi = ["function aggregator() view returns (address)"];

export const priceFeeds: PriceFeed[] = [
  {
    id: "eth-usd",
    label: "ETH / USD",
    proxyAddress: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  },
  {
    id: "btc-usd",
    label: "BTC / USD",
    proxyAddress: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
  },
  {
    id: "usdc-usd",
    label: "USDC / USD",
    proxyAddress: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
  },
];

const aggregatorCache = new Map<string, string>();

export async function resolveAggregator(
  ethereumProvider: JsonRpcProvider,
  feed: PriceFeed,
): Promise<string | null> {
  const cached = aggregatorCache.get(feed.id);

  if (cached) {
    return cached;
  }

  try {
    const proxy = new Contract(feed.proxyAddress, proxyAbi, ethereumProvider);
    const aggregator = (await proxy.aggregator!()) as string;
    aggregatorCache.set(feed.id, aggregator);
    return aggregator;
  } catch {
    return null;
  }
}
