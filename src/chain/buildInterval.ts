import { formatUnits } from "ethers";
import type { JsonRpcProvider, Log } from "ethers";
import { decodeLiquidation } from "./decodeLiquidation";
import { findFailedAttempts } from "./findFailedAttempts";
import type { LendingProtocol } from "./lendingProtocols";
import { readTokenDetail } from "./readTokenDecimals";

const SECONDS_PER_BLOCK = 12;
const ATTEMPT_SCAN_BLOCKS = 6;

export interface ProvenInterval {
  protocolId: string;
  protocolName: string;
  closedAtBlock: number;
  openedAtBlock: number;
  silenceSeconds: number;
  closingTransactionHash: string;
  attemptTransactionHashes: string[];
  attemptCount: number;
  seizedAmount: number;
  seizedSymbol: string;
  hadBadDebt: boolean;
  respondentCount: number;
}

export async function buildInterval(
  ethereumProvider: JsonRpcProvider,
  protocol: LendingProtocol,
  liquidationLog: Log,
  openedAtBlock: number,
): Promise<ProvenInterval> {
  const detail = decodeLiquidation(protocol.id, liquidationLog);
  const closedAtBlock = liquidationLog.blockNumber;

  const token = await readTokenDetail(
    ethereumProvider,
    detail.collateralAsset,
  );

  const scanFrom = Math.max(openedAtBlock, closedAtBlock - ATTEMPT_SCAN_BLOCKS);
  const attempts = await findFailedAttempts(
    ethereumProvider,
    protocol.address,
    scanFrom,
    closedAtBlock - 1,
  );

  const respondents = new Set(attempts.map((attempt) => attempt.sender));

  if (detail.liquidator) {
    respondents.add(detail.liquidator);
  }

  return {
    protocolId: protocol.id,
    protocolName: `${protocol.protocol} · ${protocol.asset}`,
    closedAtBlock,
    openedAtBlock,
    silenceSeconds: (closedAtBlock - openedAtBlock) * SECONDS_PER_BLOCK,
    closingTransactionHash: liquidationLog.transactionHash,
    attemptTransactionHashes: attempts.map((attempt) => attempt.transactionHash),
    attemptCount: attempts.length,
    seizedAmount: Number(formatUnits(detail.seizedAmount, token.decimals)),
    seizedSymbol: token.symbol,
    hadBadDebt: detail.badDebtAmount > 0n,
    respondentCount: respondents.size,
  };
}

export function diagnoseInterval(
  interval: ProvenInterval,
): "incentive" | "mechanism" {
  return interval.attemptCount > 0 ? "mechanism" : "incentive";
}
