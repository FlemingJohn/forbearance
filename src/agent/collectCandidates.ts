import { buildInterval } from "@/chain/buildInterval";
import type { ChainClients } from "@/chain/createProviders";
import { lendingProtocols } from "@/chain/lendingProtocols";
import { readAttestedFrontier } from "@/chain/readChainInfo";
import type { IntervalCandidate } from "@/types/examiner";

const SEARCH_WINDOW_BLOCKS = 900;
const BLOCKS_BEHIND_FRONTIER = 5;
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
  const candidates: IntervalCandidate[] = [];

  for (const protocol of lendingProtocols) {
    if (candidates.length >= wantedCount) {
      break;
    }

    const logs = await clients.ethereumProvider
      .getLogs({
        address: protocol.address,
        topics: [protocol.liquidationTopic],
        fromBlock,
        toBlock,
      })
      .catch(() => []);

    for (const log of logs) {
      if (candidates.length >= wantedCount) {
        break;
      }

      const interval = await buildInterval(
        clients.ethereumProvider,
        protocol,
        log,
      );

      candidates.push({
        id: `interval-${interval.closedAtBlock}-${log.transactionIndex}`,
        marketId: interval.protocolId,
        marketName: interval.protocolName,
        openedAtBlock: interval.openedAtBlock,
        closedAtBlock: interval.closedAtBlock,
        silenceSeconds: interval.silenceSeconds,
        attemptCount: interval.attemptCount,
        seizedAmount: interval.seizedAmount,
        seizedSymbol: interval.seizedSymbol,
        respondentCount: interval.respondentCount,
        evidenceGrade: "attestation",
        continuityHashCount: 0,
        filingCostCtc: 0,
        bountyCtc: BOUNTY_CTC,
        transactionHashes: [
          interval.closingTransactionHash,
          ...interval.attemptTransactionHashes,
        ],
      });
    }
  }

  return candidates;
}
