import type { Finding, FindingDescription } from "@/types";

const descriptions: Record<Finding, FindingDescription> = {
  healthy: {
    label: "OK",
    plainLanguage: "Liquidators arrive quickly and their calls succeed.",
    isFailure: false,
  },
  thinning: {
    label: "THINNING",
    plainLanguage: "Fewer liquidators are competing than this market needs.",
    isFailure: false,
  },
  incentive: {
    label: "INCENTIVE",
    plainLanguage: "Nobody even tried. The reward was not worth claiming.",
    isFailure: true,
  },
  mechanism: {
    label: "MECHANISM",
    plainLanguage: "They tried and kept failing. The call itself is broken.",
    isFailure: true,
  },
};

export function describeFinding(finding: Finding): FindingDescription {
  return descriptions[finding];
}

export function isFailureFinding(finding: Finding): boolean {
  return descriptions[finding].isFailure;
}
