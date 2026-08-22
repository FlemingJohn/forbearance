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
      "Track every position on Ethereum mainnet that becomes liquidatable, and the moment someone finally closes it.",
  },
  {
    icon: "prove",
    ordinal: "02",
    title: "Prove",
    detail:
      "Bundle up to ten transactions into a single proof and send it to Creditcoin. Failed attempts are proven too.",
  },
  {
    icon: "verify",
    ordinal: "03",
    title: "Verify",
    detail:
      "A contract checks every proof against the BlockProver precompile and asserts each receipt. It trusts nobody.",
  },
  {
    icon: "score",
    ordinal: "04",
    title: "Score",
    detail:
      "Turn proven intervals into a liveness record per market, and separate a broken reward from a broken mechanism.",
  },
  {
    icon: "act",
    ordinal: "05",
    title: "Act",
    detail:
      "Lenders read the record and price risk from proof instead of assumption. Late responders lose their bond.",
  },
];
