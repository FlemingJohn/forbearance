import { shortenHash } from "@/lib/formatNumber";
import type { WalletState } from "@/types/wallet";
import "./WalletButton.css";

interface WalletButtonProps {
  wallet: WalletState;
  onConnect: () => void;
  onSwitchNetwork: () => void;
}

function describeLabel(wallet: WalletState): string {
  if (wallet.status === "unavailable") {
    return "No wallet found";
  }

  if (wallet.status === "connecting") {
    return "Connecting";
  }

  if (wallet.status === "wrongNetwork") {
    return "Switch to Creditcoin";
  }

  if (wallet.status === "connected" && wallet.address) {
    return `${shortenHash(wallet.address)} · ${wallet.balanceCtc} CTC`;
  }

  return "Connect wallet";
}

export function WalletButton({
  wallet,
  onConnect,
  onSwitchNetwork,
}: WalletButtonProps) {
  const isConnected = wallet.status === "connected";

  return (
    <button
      type="button"
      className={`wallet-button ${isConnected ? "is-connected" : ""}`}
      onClick={wallet.status === "wrongNetwork" ? onSwitchNetwork : onConnect}
      disabled={wallet.status === "unavailable" || wallet.status === "connecting"}
      title="A wallet is only needed to file evidence. Reading needs none."
    >
      {isConnected && <span className="wallet-button-pip" aria-hidden="true" />}
      {describeLabel(wallet)}
    </button>
  );
}
