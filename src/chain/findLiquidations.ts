import type { JsonRpcProvider, Log } from "ethers";
import type { LendingProtocol } from "./lendingProtocols";

export interface LiquidationEvent {
  protocolId: string;
  protocolName: string;
  blockHeight: number;
  transactionHash: string;
  transactionIndex: number;
  logIndex: number;
  liquidatorTopic: string | null;
}

function readLiquidatorTopic(log: Log): string | null {
  return log.topics[3] ?? log.topics[2] ?? null;
}

export async function findLiquidations(
  ethereumProvider: JsonRpcProvider,
  protocol: LendingProtocol,
  fromBlock: number,
  toBlock: number,
): Promise<LiquidationEvent[]> {
  const logs = await ethereumProvider.getLogs({
    address: protocol.address,
    topics: [protocol.liquidationTopic],
    fromBlock,
    toBlock,
  });

  return logs.map((log) => ({
    protocolId: protocol.id,
    protocolName: `${protocol.protocol} · ${protocol.asset}`,
    blockHeight: log.blockNumber,
    transactionHash: log.transactionHash,
    transactionIndex: log.transactionIndex,
    logIndex: log.index,
    liquidatorTopic: readLiquidatorTopic(log),
  }));
}

export async function findLiquidationsAcrossProtocols(
  ethereumProvider: JsonRpcProvider,
  protocols: LendingProtocol[],
  fromBlock: number,
  toBlock: number,
): Promise<LiquidationEvent[]> {
  const results = await Promise.all(
    protocols.map((protocol) =>
      findLiquidations(ethereumProvider, protocol, fromBlock, toBlock).catch(
        () => [],
      ),
    ),
  );

  return results
    .flat()
    .sort((left, right) => left.blockHeight - right.blockHeight);
}
