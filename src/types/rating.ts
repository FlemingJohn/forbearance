export type Grade = "AAA" | "AA" | "A" | "BBB" | "BB" | "C" | "D";

export type RatingBand = "safe" | "caution" | "unsafe";

export interface Rating {
  grade: Grade;
  band: RatingBand;
  verdict: string;
  summary: string;
  ringPercent: number;
}

export interface RatingReason {
  label: string;
  detail: string;
}
