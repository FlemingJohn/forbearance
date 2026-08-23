import type { JsonRpcProvider } from "ethers";
import {
  ANSWER_UPDATED_TOPIC,
  priceFeeds,
  resolveAggregator,
} from "./priceFeeds";

const MAX_LOOKBACK_BLOCKS = 600;

export interface OpeningEvent {
  blockHeight: number;
  transactionHash: string;
  transactionIndex: number;
  feedLabel: string;
  wasMeasured: boolean;
}

export async function findOpeningEvent(
  ethereumProvider: JsonRpcProvider,
  closedAtBlock: number,
): Promise<OpeningEvent> {
  const fromBlock = closedAtBlock - MAX_LOOKBACK_BLOCKS;

  const searches = priceFeeds.map(async (feed) => {
    const aggregator = await resolveAggregator(ethereumProvider, feed);

    if (!aggregator) {
      return { feed, logs: [] };
    }

    const logs = await ethereumProvider
      .getLogs({
        address: aggregator,
        topics: [ANSWER_UPDATED_TOPIC],
        fromBlock,
        toBlock: closedAtBlock - 1,
      })
      .catch(() => []);

    return { feed, logs };
  });

  const results = await Promise.all(searches);
  let latest: OpeningEvent | null = null;

  for (const { feed, logs } of results) {
    for (const log of logs) {
      if (!latest || log.blockNumber > latest.blockHeight) {
        latest = {
          blockHeight: log.blockNumber,
          transactionHash: log.transactionHash,
          transactionIndex: log.transactionIndex,
          feedLabel: feed.label,
          wasMeasured: true,
        };
      }
    }
  }

  if (latest) {
    return latest;
  }

  return {
    blockHeight: closedAtBlock,
    transactionHash: "",
    transactionIndex: 0,
    feedLabel: "no price update found",
    wasMeasured: false,
  };
}
