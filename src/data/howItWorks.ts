import type { StepIconName } from "@/components/StepIcon/StepIcon";

export interface WorkStep {
  icon: StepIconName;
  ordinal: string;
  title: string;
  detail: string;
}

export const workSteps: WorkStep[] = [
  {
    icon: "watch",
    ordinal: "01",
    title: "Watch",
    detail:
      "Follow real lending positions on Ethereum and record when each one is finally closed.",
  },
  {
    icon: "prove",
    ordinal: "02",
    title: "Prove",
    detail:
      "Send those transactions to Creditcoin as one cryptographic proof, failed attempts included.",
  },
  {
    icon: "verify",
    ordinal: "03",
    title: "Verify",
    detail:
      "Creditcoin checks each proof itself. No oracle operator is trusted at any point.",
  },
  {
    icon: "score",
    ordinal: "04",
    title: "Rate",
    detail:
      "The AI analyst weighs the proven delays and issues a grade from AAA down to D.",
  },
  {
    icon: "act",
    ordinal: "05",
    title: "Lend",
    detail:
      "Lenders size their exposure from proven behaviour instead of a protocol's own promises.",
  },
];
