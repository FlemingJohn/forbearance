export type WalletStatus =
  | "unavailable"
  | "disconnected"
  | "connecting"
  | "connected"
  | "failed";

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  errorMessage: string | null;
}

export interface MarketExposure {
  marketId: string;
  marketName: string;
  suppliedLabel: string;
  hasPosition: boolean;
}

export interface ExposureReport {
  isLoaded: boolean;
  positions: MarketExposure[];
  unsafeCount: number;
}
