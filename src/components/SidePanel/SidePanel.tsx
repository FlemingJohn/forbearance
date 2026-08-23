import { describeFinding } from "@/lib/describeFinding";
import { formatCtc } from "@/lib/formatNumber";
import type { ExaminerState, Market } from "@/types";
import "./SidePanel.css";

interface SidePanelProps {
  markets: Market[];
  examiner: ExaminerState;
  selectedMarketId: string;
  isVisible: boolean;
  onSelectMarket: (marketId: string) => void;
  onOpenLanding: () => void;
  onHide: () => void;
}

export function SidePanel({
  markets,
  examiner,
  selectedMarketId,
  isVisible,
  onSelectMarket,
  onOpenLanding,
  onHide,
}: SidePanelProps) {
  const filingCount = examiner.candidates.filter(
    (candidate) => candidate.decision === "file",
  ).length;

  return (
    <>
      {isVisible && (
        <button
          type="button"
          className="side-panel-scrim"
          onClick={onHide}
          aria-label="Close the markets panel"
        />
      )}

      <nav
        className={`side-panel ${isVisible ? "" : "is-hidden"}`}
        aria-hidden={!isVisible}
      >
        <button
          type="button"
          className="side-panel-brand"
          onClick={onOpenLanding}
        >
          <span className="side-panel-mark" aria-hidden="true" />
          <span className="side-panel-name">Forbearance</span>
        </button>

        <div className="side-panel-section">
          <span className="side-panel-heading">Markets watched</span>

          {markets.map((market) => {
            const finding = describeFinding(market.finding);
            const isCurrent = market.id === selectedMarketId;

            return (
              <button
                key={market.id}
                type="button"
                className={`side-panel-market side-panel-market--${finding.tone} ${isCurrent ? "is-current" : ""}`}
                onClick={() => onSelectMarket(market.id)}
                aria-current={isCurrent}
              >
                <span className="side-panel-market-glyph" aria-hidden="true">
                  {finding.glyph}
                </span>
                <span className="side-panel-market-name">
                  {market.protocol} {market.asset}
                </span>
                <span className="side-panel-market-score">
                  {market.livenessScore}
                </span>
              </button>
            );
          })}
        </div>

        <div className="side-panel-examiner">
          <span className="side-panel-examiner-label">Examiner · GPT-4o</span>
          <span className="side-panel-examiner-row">
            <span>Treasury</span>
            <b>{formatCtc(examiner.treasuryCtc, 0)}</b>
          </span>
          <span className="side-panel-examiner-row">
            <span>Ready to file</span>
            <b>{filingCount}</b>
          </span>
        </div>
      </nav>
    </>
  );
}
