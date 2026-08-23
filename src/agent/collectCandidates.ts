import type { ChainClients } from "@/chain/createProviders";
import { findLiquidationsAcrossProtocols } from "@/chain/findLiquidations";
import { lendingProtocols } from "@/chain/lendingProtocols";
import { readAttestedFrontier } from "@/chain/readChainInfo";
import type { IntervalCandidate } from "@/types/examiner";

const SEARCH_WINDOW_BLOCKS = 900;
const BLOCKS_BEHIND_FRONTIER = 5;
const SECONDS_PER_BLOCK = 12;
const ASSUMED_OPPORTUNITY_BLOCKS = 40;
const BOUNTY_CTC = 50;

export async function collectCandidates(
  clients: ChainClients,
  wantedCount: number,
): Promise<IntervalCandidate[]> {
  const frontier = await readAttestedFrontier(
    clients.chainInfo,
    clients.sourceChainKey,
  );

  const toBlock = frontier.height - BLOCKS_BEHIND_FRONTIER;
  const fromBlock = toBlock - SEARCH_WINDOW_BLOCKS;

  const liquidations = await findLiquidationsAcrossProtocols(
    clients.ethereumProvider,
    lendingProtocols,
    fromBlock,
    toBlock,
  );

  return liquidations.slice(0, wantedCount).map((liquidation, index) => ({
    id: `interval-${liquidation.blockHeight}-${liquidation.transactionIndex}`,
    marketId: liquidation.protocolId,
    marketName: liquidation.protocolName,
    openedAtBlock: liquidation.blockHeight - ASSUMED_OPPORTUNITY_BLOCKS,
    closedAtBlock: liquidation.blockHeight,
    silenceSeconds: ASSUMED_OPPORTUNITY_BLOCKS * SECONDS_PER_BLOCK,
    attemptCount: 0,
    rewardUsd: 0,
    respondentCount: 0,
    evidenceGrade: "attestation",
    continuityHashCount: 0,
    filingCostCtc: 0,
    bountyCtc: BOUNTY_CTC + index * 0,
    transactionHashes: [liquidation.transactionHash],
  }));
}
