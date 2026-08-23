import { formatWaitClock } from "./formatDuration";
import { formatCount } from "./formatNumber";
import type { CaseFile, Market } from "@/types";
import type { Grade, Rating, RatingBand, RatingReason } from "@/types/rating";

const gradeByScore: Grade[] = ["D", "D", "D", "C", "BB", "BBB", "A", "AA", "AAA"];

const bandByGrade: Record<Grade, RatingBand> = {
  AAA: "safe",
  AA: "safe",
  A: "safe",
  BBB: "caution",
  BB: "caution",
  C: "unsafe",
  D: "unsafe",
};

const verdictByBand: Record<RatingBand, string> = {
  safe: "Safe to lend",
  caution: "Lend with caution",
  unsafe: "Unsafe to lend",
};

const ringByGrade: Record<Grade, number> = {
  AAA: 100,
  AA: 88,
  A: 74,
  BBB: 58,
  BB: 44,
  C: 28,
  D: 14,
};

function readSummary(market: Market): string {
  if (market.finding === "mechanism") {
    return "Liquidators try here and their calls keep failing.";
  }

  if (market.finding === "incentive") {
    return "Liquidators do not arrive here. Bad positions sit open.";
  }

  if (market.finding === "thinning") {
    return "Fewer liquidators compete here than this market needs.";
  }

  return "Liquidators arrive quickly and close bad positions.";
}

export function describeRating(market: Market): Rating {
  const grade = gradeByScore[Math.min(market.livenessScore, 8)] ?? "D";
  const band = bandByGrade[grade];

  return {
    grade,
    band,
    verdict: verdictByBand[band],
    summary: readSummary(market),
    ringPercent: ringByGrade[grade],
  };
}

export function listRatingReasons(
  market: Market,
  marketCaseFiles: CaseFile[],
): RatingReason[] {
  const exhibitCount = marketCaseFiles.reduce(
    (total, caseFile) => total + caseFile.exhibits.length,
    0,
  );

  return [
    {
      label: `${formatWaitClock(market.medianWaitSeconds)} median delay`,
      detail: "time a bad position stayed open before anyone closed it",
    },
    {
      label:
        market.attemptRatio === 0
          ? "No liquidator even tried"
          : `${market.attemptRatio.toFixed(1)} attempts per opportunity`,
      detail:
        market.attemptRatio === 0
          ? "the reward was not worth claiming"
          : "how hard liquidators compete for this collateral",
    },
    {
      label: `${formatCount(exhibitCount)} proven transactions`,
      detail: "every number above comes from Ethereum mainnet, not a survey",
    },
  ];
}
