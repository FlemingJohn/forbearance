import type { JsonRpcProvider } from "ethers";

export interface FailedAttempt {
  blockHeight: number;
  transactionHash: string;
  transactionIndex: number;
  sender: string;
}

async function readFailedCallsInBlock(
  ethereumProvider: JsonRpcProvider,
  blockHeight: number,
  protocolAddress: string,
): Promise<FailedAttempt[]> {
  const block = (await ethereumProvider.send("eth_getBlockByNumber", [
    `0x${blockHeight.toString(16)}`,
    true,
  ])) as {
    transactions: { hash: string; from: string; to: string | null }[];
  } | null;

  if (!block) {
    return [];
  }

  const targeted = block.transactions.filter(
    (transaction) =>
      transaction.to?.toLowerCase() === protocolAddress.toLowerCase(),
  );

  const attempts: FailedAttempt[] = [];

  for (const transaction of targeted) {
    const receipt = await ethereumProvider.getTransactionReceipt(
      transaction.hash,
    );

    if (receipt && receipt.status === 0) {
      attempts.push({
        blockHeight,
        transactionHash: transaction.hash,
        transactionIndex: receipt.index,
        sender: transaction.from,
      });
    }
  }

  return attempts;
}

export async function findFailedAttempts(
  ethereumProvider: JsonRpcProvider,
  protocolAddress: string,
  fromBlock: number,
  toBlock: number,
): Promise<FailedAttempt[]> {
  const attempts: FailedAttempt[] = [];

  for (let height = fromBlock; height <= toBlock; height += 1) {
    const found = await readFailedCallsInBlock(
      ethereumProvider,
      height,
      protocolAddress,
    );

    attempts.push(...found);
  }

  return attempts;
}
