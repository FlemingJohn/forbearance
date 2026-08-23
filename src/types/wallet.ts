export type WalletStatus =
  | "unavailable"
  | "disconnected"
  | "connecting"
  | "connected"
  | "wrongNetwork";

export interface WalletState {
  status: WalletStatus;
  address: string | null;
  chainId: number | null;
  balanceCtc: string | null;
  errorMessage: string | null;
}
