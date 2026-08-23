import "dotenv/config";
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ContractFactory, JsonRpcProvider, Wallet, formatEther } from "ethers";
import { readChainSettings } from "../src/chain/chainSettings";

const ARTIFACT_PATH = join("contracts", "out", "ForbearanceRegistry.json");
const DEPLOYMENT_PATH = join("contracts", "deployment.json");

async function run() {
  const privateKey = process.env.EXAMINER_PRIVATE_KEY;

  if (!privateKey) {
    console.error(
      "Set EXAMINER_PRIVATE_KEY in .env. Fund it from the Creditcoin testnet faucet first.",
    );
    process.exitCode = 1;
    return;
  }

  const settings = readChainSettings();
  const provider = new JsonRpcProvider(settings.creditcoinRpcUrl);
  const wallet = new Wallet(privateKey, provider);

  const balance = await provider.getBalance(wallet.address);
  console.log("Deployer:", wallet.address);
  console.log("Balance:", formatEther(balance), "CTC");

  if (balance === 0n) {
    console.error("The deployer has no CTC. Use the testnet faucet.");
    process.exitCode = 1;
    return;
  }

  const artifact = JSON.parse(readFileSync(ARTIFACT_PATH, "utf8")) as {
    abi: unknown[];
    bytecode: string;
  };

  console.log("\nDeploying ForbearanceRegistry");
  const factory = new ContractFactory(artifact.abi, artifact.bytecode, wallet);
  const contract = await factory.deploy();

  console.log("Transaction:", contract.deploymentTransaction()?.hash);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  const network = await provider.getNetwork();

  console.log("Deployed at:", address);
  console.log(
    "Explorer:",
    `https://creditcoin-testnet.blockscout.com/address/${address}`,
  );

  writeFileSync(
    DEPLOYMENT_PATH,
    `${JSON.stringify(
      {
        address,
        chainId: Number(network.chainId),
        deployer: wallet.address,
        transactionHash: contract.deploymentTransaction()?.hash ?? null,
      },
      null,
      2,
    )}\n`,
  );

  console.log("\nWrote", DEPLOYMENT_PATH);
}

run().catch((error) => {
  console.error("Deploy failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
