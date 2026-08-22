import type { Finding } from "@/types";

const glyphs: Record<Finding, string> = {
  healthy: "●",
  thinning: "◐",
  incentive: "✕",
  mechanism: "⚠",
};

export function describeMarketGlyph(finding: Finding): string {
  return glyphs[finding];
}
