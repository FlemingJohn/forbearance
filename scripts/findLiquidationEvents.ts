import "dotenv/config";
import { createChainClients } from "../src/chain/createProviders";
import { findLiquidationsAcrossProtocols } from "../src/chain/findLiquidations";
import { lendingProtocols } from "../src/chain/lendingProtocols";
import { readAttestedFrontier } from "../src/chain/readChainInfo";

const SEARCH_WINDOW_BLOCKS = 900;

async function run() {
  const clients = createChainClients();

  const frontier = await readAttestedFrontier(
    clients.chainInfo,
    clients.sourceChainKey,
  );

  const toBlock = frontier.height - 5;
  const fromBlock = toBlock - SEARCH_WINDOW_BLOCKS;

  console.log("Attested frontier:", frontier.height);
  console.log("Searching blocks", fromBlock, "to", toBlock);
  console.log("Protocols:", lendingProtocols.map((p) => p.protocol).join(", "));

  const events = await findLiquidationsAcrossProtocols(
    clients.ethereumProvider,
    lendingProtocols,
    fromBlock,
    toBlock,
  );

  console.log("\nLiquidations found:", events.length);
  for (const event of events.slice(0, 12)) {
    console.log(
      `  block ${event.blockHeight}  ${event.protocolName}  ${event.transactionHash}`,
    );
  }
}

run().catch((error) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
