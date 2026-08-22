import type { TourStep } from "@/types";

export const tourSteps: TourStep[] = [
  {
    panel: "assumption",
    title: "The assumption nobody checks",
    summary:
      "Lending protocols assume a liquidator will show up when a loan goes bad.",
    detail:
      "That premise is never verified. When it fails, the position rots past the point where closing it is profitable and the protocol absorbs the loss as bad debt.",
  },
  {
    panel: "silence",
    title: "48 minutes of nothing",
    summary:
      "A real position on Morpho went bad. For 48 minutes nobody closed it.",
    detail:
      "This box is empty because nothing happened. Every one of 142 liquidators saw $18,400 on the table and walked past it. Both ends of the interval are real mainnet transactions you can open in Etherscan.",
  },
  {
    panel: "attempts",
    title: "The same window, full of failures",
    summary:
      "Here liquidators did try. Seven times. Every call reverted.",
    detail:
      "Identical slow response, opposite disease. Empty means the reward was too small. Full means the mechanism is broken. Only a system that can prove failed transactions can tell them apart.",
  },
  {
    panel: "docket",
    title: "Where the machine spends its money",
    summary:
      "Checking a fact is free. Putting it on the record costs gas, and gas rises as evidence ages.",
    detail:
      "The Examiner decides which case files are worth filing right now. Last round it watched the wrong market and lost a bond, so it moved its own budget. That reallocation is the whole argument for putting a model here.",
  },
];
