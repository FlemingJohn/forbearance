export type TourPanel = "assumption" | "silence" | "attempts" | "docket";

export interface TourStep {
  panel: TourPanel;
  title: string;
  summary: string;
  detail: string;
}

export interface ChainStatus {
  networkName: string;
  chainKey: number;
  attestedFrontier: number;
  secondsSinceFrontier: number;
  isLive: boolean;
}
