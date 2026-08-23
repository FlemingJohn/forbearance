import type { ChainClients } from "@/chain/createProviders";
import { readAttestedFrontier } from "@/chain/readChainInfo";
import type { IntervalCandidate } from "@/types/examiner";

const BLOCKS_BEHIND_FRONTIER = 20;
const SECONDS_PER_BLOCK = 12;

export async function collectCandidates(
  clients: ChainClients,
  wantedCount: number,
): Promise<IntervalCandidate[]> {
  const frontier = await readAttestedFrontier(
    clients.chainInfo,
    clients.sourceChainKey,
  );

  const targetHeight = frontier.height - BLOCKS_BEHIND_FRONTIER;
  const block = await clients.ethereumProvider.getBlock(targetHeight, false);

  if (!block) {
    return [];
  }

  const hashes = block.transactions.slice(0, wantedCount);

  return hashes.map((transactionHash, index) => ({
    id: `candidate-${targetHeight}-${index}`,
    marketId: "sampled-mainnet",
    marketName: `Ethereum block ${targetHeight}`,
    openedAtBlock: targetHeight - 10,
    closedAtBlock: targetHeight,
    silenceSeconds: 10 * SECONDS_PER_BLOCK,
    attemptCount: index % 3,
    rewardUsd: 5000 + index * 2500,
    respondentCount: 100 + index,
    evidenceGrade: "attestation",
    continuityHashCount: 0,
    filingCostCtc: 0,
    bountyCtc: 50,
    transactionHashes: [transactionHash],
  }));
}
