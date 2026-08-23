import "dotenv/config";
import { createChainClients } from "../src/chain/createProviders";
import { readAttestedFrontier } from "../src/chain/readChainInfo";

async function run() {
  const clients = createChainClients();
  const frontier = await readAttestedFrontier(
    clients.chainInfo,
    clients.sourceChainKey,
  );

  const targetHeight = frontier.height - 20;
  const block = await clients.ethereumProvider.getBlock(targetHeight, false);

  if (!block) {
    console.error("Could not read that block");
    return;
  }

  console.log("Attested frontier:", frontier.height);
  console.log("Chosen block:", block.number);
  console.log("Transactions in block:", block.transactions.length);
  console.log("\nCandidates:");
  for (const hash of block.transactions.slice(0, 5)) {
    console.log(" ", hash);
  }
}

run().catch((error) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
});
