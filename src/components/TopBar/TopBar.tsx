import { WalletButton } from "@/components/WalletButton/WalletButton";
import { formatBlockHeight } from "@/lib/formatNumber";
import type { ChainStatus } from "@/types";
import type { WalletState } from "@/types/wallet";
import "./TopBar.css";

interface TopBarProps {
  status: ChainStatus;
  wallet: WalletState;
  isPanelVisible: boolean;
  onTogglePanel: () => void;
  onConnectWallet: () => void;
  onSwitchNetwork: () => void;
}

export function TopBar({
  status,
  wallet,
  isPanelVisible,
  onTogglePanel,
  onConnectWallet,
  onSwitchNetwork,
}: TopBarProps) {
  return (
    <header className="top-bar">
      <button
        type="button"
        className="top-bar-toggle"
        onClick={onTogglePanel}
        aria-label={isPanelVisible ? "Hide the markets" : "Show the markets"}
        aria-expanded={isPanelVisible}
      >
        <span />
        <span />
        <span />
      </button>

      <span className="top-bar-live">
        <span className="top-bar-pip" aria-hidden="true" />
        {status.isLive ? "LIVE" : "CACHED"}
      </span>

      <span className="top-bar-meta">
        {status.networkName} · block{" "}
        {formatBlockHeight(status.attestedFrontier)} · proven on CC3 Testnet
      </span>

      <div className="top-bar-actions">
        <WalletButton
          wallet={wallet}
          onConnect={onConnectWallet}
          onSwitchNetwork={onSwitchNetwork}
        />
      </div>
    </header>
  );
}
