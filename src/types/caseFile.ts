import type { EvidenceGrade, Finding } from "./finding";

export type ExhibitRole = "open" | "attempt" | "close";

export interface Exhibit {
  id: string;
  role: ExhibitRole;
  blockHeight: number;
  transactionIndex: number;
  transactionHash: string;
  eventName: string;
  succeeded: boolean;
  sealed: boolean;
}

export interface CaseFile {
  id: string;
  reference: string;
  marketId: string;
  marketName: string;
  finding: Finding;
  openedAtBlock: number;
  closedAtBlock: number;
  openedAtClock: string;
  closedAtClock: string;
  silenceSeconds: number;
  attemptCount: number;
  seizedAmount: number;
  seizedSymbol: string;
  respondentCount: number;
  evidenceGrade: EvidenceGrade;
  continuityHashCount: number;
  filedBy: string;
  exhibits: Exhibit[];
}
