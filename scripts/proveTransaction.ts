import "dotenv/config";
import { createChainClients } from "../src/chain/createProviders";
import { fetchTransactionProof } from "../src/chain/fetchProof";
import {
  countContinuityHashes,
  isHeightAttested,
  readAttestationBounds,
  readEvidenceGrade,
} from "../src/chain/readChainInfo";
import { estimateProofCostCtc } from "../src/chain/chainSettings";
import { verifyTransaction } from "../src/chain/verifyProof";

async function run() {
  const transactionHash = process.argv[2];

  if (!transactionHash) {
    console.error("Usage: npm run chain:prove -- <transactionHash>");
    process.exitCode = 1;
    return;
  }

  const clients = createChainClients();

  const receipt =
    await clients.ethereumProvider.getTransactionReceipt(transactionHash);

  if (!receipt) {
    console.error("Source chain does not know this transaction");
    process.exitCode = 1;
    return;
  }

  console.log("Transaction:", transactionHash);
  console.log("Block:", receipt.blockNumber);
  console.log("Receipt status:", receipt.status);
  console.log("Logs:", receipt.logs.length);

  const attested = await isHeightAttested(
    clients.chainInfo,
    clients.sourceChainKey,
    receipt.blockNumber,
  );

  console.log("\nAttested on Creditcoin:", attested);

  if (!attested) {
    console.log("Block is not attested yet. Wait for the next attestation.");
    return;
  }

  const bounds = await readAttestationBounds(
    clients.chainInfo,
    clients.sourceChainKey,
    receipt.blockNumber,
  );

  const continuityHashes = countContinuityHashes(bounds);

  console.log("Bounds:", bounds.parentHeight, "to", bounds.childHeight);
  console.log("Evidence grade:", readEvidenceGrade(bounds));
  console.log("Continuity hashes:", continuityHashes);
  console.log(
    "Estimated proof cost:",
    estimateProofCostCtc(continuityHashes).toFixed(8),
    "CTC",
  );

  console.log("\nFetching proof from the builder");
  const proof = await fetchTransactionProof(
    clients.proofBuilderUrl,
    clients.sourceChainKey,
    transactionHash,
  );

  console.log("Encoded transaction bytes:", proof.encodedTransaction.length);
  console.log("Merkle siblings:", proof.merkleProof.siblings.length);
  console.log("Continuity roots:", proof.continuityProof.roots.length);

  console.log("\nVerifying against the precompile");
  const verified = await verifyTransaction(clients.blockProver, proof);

  console.log("Verification result:", verified ? "VALID" : "INVALID");
}

run().catch((error) => {
  console.error("Prove failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
