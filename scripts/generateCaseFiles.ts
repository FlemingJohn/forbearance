import "dotenv/config";
import { writeFileSync } from "node:fs";
import { buildInterval } from "../src/chain/buildInterval";
import { createChainClients } from "../src/chain/createProviders";
import { lendingProtocols } from "../src/chain/lendingProtocols";
import {
  countContinuityHashes,
  readAttestationBounds,
  readAttestedFrontier,
  readEvidenceGrade,
} from "../src/chain/readChainInfo";

const SEARCH_WINDOW_BLOCKS = 900;
const SECONDS_PER_BLOCK = 12;

function toClock(blockHeight: number): string {
  const seconds = blockHeight * SECONDS_PER_BLOCK;
  const hours = Math.floor(seconds / 3600) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

async function run() {
  const clients = createChainClients();
  const frontier = await readAttestedFrontier(
    clients.chainInfo,
    clients.sourceChainKey,
  );

  const toBlock = frontier.height - 5;
  const fromBlock = toBlock - SEARCH_WINDOW_BLOCKS;
  const records: unknown[] = [];

  for (const protocol of lendingProtocols) {
    const logs = await clients.ethereumProvider
      .getLogs({
        address: protocol.address,
        topics: [protocol.liquidationTopic],
        fromBlock,
        toBlock,
      })
      .catch(() => []);

    for (const log of logs) {
      const interval = await buildInterval(
        clients.ethereumProvider,
        protocol,
        log,
      );

      const bounds = await readAttestationBounds(
        clients.chainInfo,
        clients.sourceChainKey,
        interval.closedAtBlock,
      );

      const reference = `0x${log.transactionHash.slice(2, 6)}…${log.transactionHash.slice(-4)}`;

      records.push({
        id: `case-${interval.closedAtBlock}-${log.transactionIndex}`,
        reference,
        marketId: interval.protocolId,
        marketName: interval.protocolName,
        finding: interval.attemptCount > 0 ? "mechanism" : "incentive",
        openedAtBlock: interval.openedAtBlock,
        closedAtBlock: interval.closedAtBlock,
        openedAtClock: toClock(interval.openedAtBlock),
        closedAtClock: toClock(interval.closedAtBlock),
        silenceSeconds: interval.silenceSeconds,
        attemptCount: interval.attemptCount,
        seizedAmount: interval.seizedAmount,
        seizedSymbol: interval.seizedSymbol,
        respondentCount: interval.respondentCount,
        evidenceGrade: readEvidenceGrade(bounds),
        continuityHashCount: countContinuityHashes(bounds),
        filedBy: "Examiner-01",
        openingFeedLabel: interval.openingFeedLabel,
        wasOpeningMeasured: interval.wasOpeningMeasured,
        exhibits: [
          ...(interval.openingTransactionHash
            ? [
                {
                  id: `${interval.openingTransactionHash}-open`,
                  role: "open",
                  blockHeight: interval.openedAtBlock,
                  transactionIndex: 0,
                  transactionHash: interval.openingTransactionHash,
                  eventName: "AnswerUpdated",
                  succeeded: true,
                  sealed: true,
                },
              ]
            : []),
          {
            id: `${log.transactionHash}-close`,
            role: "close",
            blockHeight: interval.closedAtBlock,
            transactionIndex: log.transactionIndex,
            transactionHash: interval.closingTransactionHash,
            eventName: protocol.liquidationSignature.split("(")[0],
            succeeded: true,
            sealed: true,
          },
          ...interval.attemptTransactionHashes.map((hash, index) => ({
            id: `${hash}-attempt-${index}`,
            role: "attempt",
            blockHeight: interval.closedAtBlock - 1,
            transactionIndex: 0,
            transactionHash: hash,
            eventName: protocol.liquidationSignature.split("(")[0],
            succeeded: false,
            sealed: true,
          })),
        ],
      });
    }
  }

  writeFileSync(
    "src/data/provenCaseFiles.json",
    `${JSON.stringify(records, null, 2)}\n`,
  );

  console.log(`Wrote ${records.length} case files to src/data/provenCaseFiles.json`);
  for (const record of records as { id: string; marketName: string }[]) {
    console.log(`  ${record.id}  ${record.marketName}`);
  }
}

run().catch((error) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
