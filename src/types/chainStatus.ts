export interface ChainStatus {
  networkName: string;
  chainKey: number;
  attestedFrontier: number;
  secondsSinceFrontier: number;
  isLive: boolean;
}
