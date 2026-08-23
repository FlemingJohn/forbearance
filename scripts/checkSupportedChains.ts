import "dotenv/config";
import { createChainClients } from "../src/chain/createProviders";
import {
  listSupportedChains,
  readAttestedFrontier,
} from "../src/chain/readChainInfo";

async function run() {
  const clients = createChainClients();

  console.log("Creditcoin RPC:", (await clients.creditcoinProvider.getNetwork()).chainId);

  const chains = await listSupportedChains(clients.chainInfo);

  console.log("\nSupported source chains");
  for (const chain of chains) {
    console.log(
      `  chainKey ${chain.chainKey}  chainId ${chain.chainId}  ${chain.chainName}  encoding ${chain.chainEncoding}`,
    );
  }

  const configured = chains.find(
    (chain) => chain.chainKey === clients.sourceChainKey,
  );

  if (!configured) {
    console.log(
      `\nConfigured chainKey ${clients.sourceChainKey} is NOT supported on this network`,
    );
    return;
  }

  console.log(
    `\nConfigured chainKey ${clients.sourceChainKey} resolves to ${configured.chainName}`,
  );

  const frontier = await readAttestedFrontier(
    clients.chainInfo,
    clients.sourceChainKey,
  );

  console.log("Attested frontier:", frontier.height);
  console.log("Is attestation:", frontier.isAttestation);
  console.log("Exists:", frontier.exists);

  const latestSourceBlock = await clients.ethereumProvider.getBlockNumber();
  console.log("Source chain head:", latestSourceBlock);
  console.log("Blocks behind head:", latestSourceBlock - frontier.height);
}

run().catch((error) => {
  console.error("Check failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
