import type { ExaminerState } from "@/types";

export const examinerState: ExaminerState = {
  name: "Examiner-01",
  hourlyBudgetCtc: 1.2,
  treasuryCtc: 84,
  candidates: [
    {
      id: "candidate-f1",
      marketName: "Morpho · rsETH",
      reference: "#f1",
      probabilityHolds: 0.91,
      evidenceAgeSeconds: 240,
      filingCostCtc: 0.031,
      bountyCtc: 50,
      decision: "file",
    },
    {
      id: "candidate-a7",
      marketName: "Morpho · weETH",
      reference: "#a7",
      probabilityHolds: 0.74,
      evidenceAgeSeconds: 1320,
      filingCostCtc: 0.048,
      bountyCtc: 50,
      decision: "file",
    },
    {
      id: "candidate-3c",
      marketName: "Compound · USDC",
      reference: "#3c",
      probabilityHolds: 0.44,
      evidenceAgeSeconds: 7200,
      filingCostCtc: 0.19,
      bountyCtc: 50,
      decision: "hold",
    },
    {
      id: "candidate-9b",
      marketName: "Aave v3 · WETH",
      reference: "#9b",
      probabilityHolds: 0.12,
      evidenceAgeSeconds: 68400,
      filingCostCtc: 2.74,
      bountyCtc: 50,
      decision: "drop",
    },
  ],
  lastRoundNote:
    "Watched Aave while rsETH broke. Missed the window and lost a 50 CTC bond.",
  attentionShift: {
    marketName: "Morpho · rsETH",
    fromCtcPerHour: 0.18,
    toCtcPerHour: 0.44,
  },
};
