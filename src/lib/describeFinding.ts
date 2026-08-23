import type { TagTone } from "@/components/Tag/Tag";
import type { Finding, FindingDescription } from "@/types";

interface FindingPresentation extends FindingDescription {
  tone: TagTone;
  glyph: string;
}

const descriptions: Record<Finding, FindingPresentation> = {
  healthy: {
    label: "Healthy",
    plainLanguage: "Liquidators arrive quickly and their calls succeed.",
    isFailure: false,
    tone: "calm",
    glyph: "●",
  },
  thinning: {
    label: "Thinning",
    plainLanguage: "Fewer liquidators are competing than this market needs.",
    isFailure: false,
    tone: "neutral",
    glyph: "◐",
  },
  incentive: {
    label: "Incentive",
    plainLanguage: "Nobody even tried. The reward was not worth claiming.",
    isFailure: true,
    tone: "watch",
    glyph: "○",
  },
  mechanism: {
    label: "Mechanism",
    plainLanguage: "They tried and kept failing. The call itself is broken.",
    isFailure: true,
    tone: "alarm",
    glyph: "✕",
  },
};

export function describeFinding(finding: Finding): FindingPresentation {
  return descriptions[finding];
}

export function isFailureFinding(finding: Finding): boolean {
  return descriptions[finding].isFailure;
}
