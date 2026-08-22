export type ExaminerDecision = "file" | "hold" | "drop";

export interface DocketCandidate {
  id: string;
  marketName: string;
  reference: string;
  probabilityHolds: number;
  evidenceAgeSeconds: number;
  filingCostCtc: number;
  bountyCtc: number;
  decision: ExaminerDecision;
}

export interface AttentionShift {
  marketName: string;
  fromCtcPerHour: number;
  toCtcPerHour: number;
}

export interface ExaminerState {
  name: string;
  hourlyBudgetCtc: number;
  treasuryCtc: number;
  candidates: DocketCandidate[];
  lastRoundNote: string;
  attentionShift: AttentionShift;
}
