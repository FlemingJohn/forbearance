import { describeMarketGlyph } from "@/lib/describeMarketGlyph";
import {
  formatBlockHeight,
  formatCount,
  formatCtc,
  formatPercent,
} from "@/lib/formatNumber";
import type { ChainStatus, Market, RegistryTotals } from "@/types";
import "./SidePanel.css";

export type ScreenName = "dashboard" | "tour" | "about";

interface SidePanelProps {
  status: ChainStatus;
  markets: Market[];
  totals: RegistryTotals;
  currentScreen: ScreenName;
  selectedMarketId: string;
  onOpenScreen: (screen: ScreenName) => void;
  onSelectMarket: (marketId: string) => void;
}

export function SidePanel({
  status,
  markets,
  totals,
  currentScreen,
  selectedMarketId,
  onOpenScreen,
  onSelectMarket,
}: SidePanelProps) {
  return (
    <nav className="side-panel">
      <div className="side-panel-brand">
        <span className="side-panel-mark" aria-hidden="true">
          <span />
        </span>
        <span className="side-panel-name">Forbearance</span>
      </div>

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
        <button
          type="button"
          className={`side-panel-item ${currentScreen === "dashboard" ? "is-current" : ""}`}
          onClick={() => onOpenScreen("dashboard")}
        >
          Dashboard
          <span className="side-panel-item-count">
            {formatCount(totals.caseFileCount)}
          </span>
        </button>
        <button
          type="button"
          className={`side-panel-item ${currentScreen === "tour" ? "is-current" : ""}`}
          onClick={() => onOpenScreen("tour")}
        >
          Guided tour
          <span className="side-panel-item-count">3 min</span>
        </button>
        <button
          type="button"
          className={`side-panel-item ${currentScreen === "about" ? "is-current" : ""}`}
          onClick={() => onOpenScreen("about")}
        >
          About
        </button>
      </div>

      <div className="side-panel-section side-panel-markets">
        <span className="side-panel-heading">Markets</span>
        {markets.map((market) => (
          <button
            key={market.id}
            type="button"
            className={`side-panel-market ${market.id === selectedMarketId ? "is-current" : ""}`}
            onClick={() => {
              onSelectMarket(market.id);
              onOpenScreen("dashboard");
            }}
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
