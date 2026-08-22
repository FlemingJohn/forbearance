import { describeMarketGlyph } from "@/lib/describeMarketGlyph";
import {
  formatBlockHeight,
  formatCount,
  formatCtc,
  formatPercent,
} from "@/lib/formatNumber";
import type { ChainStatus, Market, RegistryTotals } from "@/types";
import "./SidePanel.css";

interface SidePanelProps {
  status: ChainStatus;
  markets: Market[];
  totals: RegistryTotals;
  selectedMarketId: string;
  onSelectMarket: (marketId: string) => void;
  onOpenLanding: () => void;
}

export function SidePanel({
  status,
  markets,
  totals,
  selectedMarketId,
  onSelectMarket,
  onOpenLanding,
}: SidePanelProps) {
  return (
    <nav className="side-panel">
      <button
        type="button"
        className="side-panel-brand"
        onClick={onOpenLanding}
        aria-label="Back to the overview"
      >
        <span className="side-panel-mark" aria-hidden="true">
          <span />
        </span>
        <span className="side-panel-name">Forbearance</span>
      </button>

      <div className="side-panel-status">
        <span className="side-panel-status-live">
          <span className="side-panel-status-pip" aria-hidden="true" />
          {status.isLive ? "LIVE" : "CACHED"}
        </span>
        <span>{status.networkName}</span>
        <span>frontier {formatBlockHeight(status.attestedFrontier)}</span>
        <span>{status.secondsSinceFrontier}s ago</span>
      </div>

      <div className="side-panel-section">
        <span className="side-panel-heading">Markets</span>
        {markets.map((market) => (
          <button
            key={market.id}
            type="button"
            className={`side-panel-market ${market.id === selectedMarketId ? "is-current" : ""}`}
            onClick={() => onSelectMarket(market.id)}
          >
            <span className="side-panel-market-glyph" aria-hidden="true">
              {describeMarketGlyph(market.finding)}
            </span>
            <span className="side-panel-market-name">
              {market.protocol} {market.asset}
            </span>
            <span className="side-panel-market-score">
              {market.livenessScore}
            </span>
          </button>
        ))}
      </div>

      <div className="side-panel-meters">
        <span className="side-panel-meter-row">
          <span>Case files</span>
          <b>{formatCount(totals.caseFileCount)}</b>
        </span>
        <span className="side-panel-meter-row">
          <span>Exhibits</span>
          <b>{formatCount(totals.exhibitCount)}</b>
        </span>
        <span className="side-panel-meter-row">
          <span>Gas spent</span>
          <b>{formatCtc(totals.gasSpentCtc)}</b>
        </span>
        <span className="side-panel-meter-row">
          <span>Attestation grade</span>
          <b>{formatPercent(totals.attestationGradeShare)}</b>
        </span>
      </div>
    </nav>
  );
}
