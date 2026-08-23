import { lendingProtocols } from "@/chain/lendingProtocols";
import { caseFiles } from "./caseFiles";
import type { CaseFile, Finding, Market, RegistryTotals } from "@/types";

const HEALTHY_WAIT_SECONDS = 120;
const THINNING_WAIT_SECONDS = 420;

function readMedian(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }

  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted[middle] ?? 0;
}

function scoreLiveness(medianWaitSeconds: number, sampleCount: number): number {
  if (sampleCount === 0) {
    return 5;
  }

  if (medianWaitSeconds <= HEALTHY_WAIT_SECONDS) {
    return 8;
  }

  if (medianWaitSeconds <= THINNING_WAIT_SECONDS) {
    return 5;
  }

  return 2;
}

function readFinding(marketCaseFiles: CaseFile[]): Finding {
  if (marketCaseFiles.length === 0) {
    return "healthy";
  }

  const hasMechanismFailure = marketCaseFiles.some(
    (caseFile) => caseFile.finding === "mechanism",
  );

  if (hasMechanismFailure) {
    return "mechanism";
  }

  const hasIncentiveFailure = marketCaseFiles.some(
    (caseFile) => caseFile.finding === "incentive",
  );

  return hasIncentiveFailure ? "incentive" : "thinning";
}

function buildMarket(protocolId: string, protocol: string, asset: string): Market {
  const marketCaseFiles = caseFiles.filter(
    (caseFile) => caseFile.marketId === protocolId,
  );

  const waits = marketCaseFiles.map((caseFile) => caseFile.silenceSeconds);
  const medianWaitSeconds = readMedian(waits);
  const worstCaseWaitSeconds = waits.length > 0 ? Math.max(...waits) : 0;

  const totalAttempts = marketCaseFiles.reduce(
    (total, caseFile) => total + caseFile.attemptCount,
    0,
  );

  return {
    id: protocolId,
    protocol,
    asset,
    livenessScore: scoreLiveness(medianWaitSeconds, marketCaseFiles.length),
    medianWaitSeconds,
    worstCaseWaitSeconds,
    attemptRatio:
      marketCaseFiles.length > 0 ? totalAttempts / marketCaseFiles.length : 0,
    finding: readFinding(marketCaseFiles),
  };
}

export const markets: Market[] = lendingProtocols.map((protocol) =>
  buildMarket(protocol.id, protocol.protocol, protocol.asset),
);

export const registryTotals: RegistryTotals = {
  caseFileCount: caseFiles.length,
  exhibitCount: caseFiles.reduce(
    (total, caseFile) => total + caseFile.exhibits.length,
    0,
  ),
  gasSpentCtc: caseFiles.reduce(
    (total, caseFile) => total + caseFile.continuityHashCount * 0.00000029,
    0,
  ),
  attestationGradeShare:
    caseFiles.length === 0
      ? 0
      : caseFiles.filter((caseFile) => caseFile.evidenceGrade === "attestation")
          .length / caseFiles.length,
};
