import type { EvidenceGrade } from "./finding";

export interface IntervalCandidate {
  id: string;
  marketId: string;
  marketName: string;
  openedAtBlock: number;
  closedAtBlock: number;
  silenceSeconds: number;
  attemptCount: number;
  seizedAmount: number;
  seizedSymbol: string;
  respondentCount: number;
  evidenceGrade: EvidenceGrade;
  continuityHashCount: number;
  filingCostCtc: number;
  bountyCtc: number;
  transactionHashes: string[];
}

export interface CandidateAssessment {
  candidateId: string;
  probabilityHolds: number;
  reasoning: string;
}

export interface FilingDecision {
  candidateId: string;
  decision: "file" | "hold" | "drop";
  expectedValueCtc: number;
}

export interface FilingOutcome {
  candidateId: string;
  wasVerified: boolean;
  spentCtc: number;
  earnedCtc: number;
  failureReason: string | null;
}

export interface ExaminerRound {
  candidates: IntervalCandidate[];
  assessments: CandidateAssessment[];
  decisions: FilingDecision[];
  outcomes: FilingOutcome[];
  budgetCtc: number;
  spentCtc: number;
  narrative: string;
}
