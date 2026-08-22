import type { Finding } from "./finding";

export interface Market {
  id: string;
  protocol: string;
  asset: string;
  livenessScore: number;
  medianWaitSeconds: number;
  worstCaseWaitSeconds: number;
  attemptRatio: number;
  finding: Finding;
}

export interface RegistryTotals {
  caseFileCount: number;
  exhibitCount: number;
  gasSpentCtc: number;
  attestationGradeShare: number;
}
