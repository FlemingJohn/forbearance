import { ShaderBackground } from "@/components/ShaderBackground/ShaderBackground";
import { formatBlockHeight } from "@/lib/formatNumber";
import type { ChainStatus } from "@/types";
import "./TopBar.css";

interface TopBarProps {
  status: ChainStatus;
  isPanelVisible: boolean;
  onTogglePanel: () => void;
}

export function TopBar({
  status,
  isPanelVisible,
  onTogglePanel,
}: TopBarProps) {
  const hasFrontier = status.attestedFrontier > 0;

  return (
    <header className="top-bar">
      <ShaderBackground className="top-bar-shader" />
      <span className="top-bar-veil" aria-hidden="true" />

      <div className="top-bar-inner">
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

        <span className="top-bar-status">
          <span className="top-bar-pip" aria-hidden="true" />
          {status.isLive ? "LIVE" : "CONNECTING"}
        </span>

        <span className="top-bar-meta">
          {status.networkName}
          {hasFrontier &&
            ` · attested block ${formatBlockHeight(status.attestedFrontier)}`}
          {hasFrontier && ` · ${status.secondsSinceFrontier}s ago`}
        </span>

        <span className="top-bar-note">Read only · no wallet needed</span>
      </div>
    </header>
  );
}
