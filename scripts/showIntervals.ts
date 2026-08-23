import "dotenv/config";
import { collectCandidates } from "../src/agent/collectCandidates";
import { createChainClients } from "../src/chain/createProviders";

async function run() {
  const clients = createChainClients();
  const candidates = await collectCandidates(clients, 4);

  console.log("Intervals built from real liquidations:", candidates.length);

  for (const candidate of candidates) {
    console.log(`\n${candidate.id}  ${candidate.marketName}`);
    console.log(`  opened  block ${candidate.openedAtBlock}`);
    console.log(`  closed  block ${candidate.closedAtBlock}`);
    console.log(`  silence ${candidate.silenceSeconds}s`);
    console.log(
      `  seized ${candidate.seizedAmount.toFixed(4)} ${candidate.seizedSymbol}`,
    );
    console.log(`  failed attempts ${candidate.attemptCount}`);
    console.log(`  respondents ${candidate.respondentCount}`);
    console.log(
      `  diagnosis ${candidate.attemptCount > 0 ? "MECHANISM" : "INCENTIVE"}`,
    );
    console.log(`  exhibits ${candidate.transactionHashes.length}`);
    for (const hash of candidate.transactionHashes) {
      console.log(`    ${hash}`);
    }
  }
}

run().catch((error) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
