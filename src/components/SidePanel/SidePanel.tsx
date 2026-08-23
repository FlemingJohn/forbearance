import { BrandMark } from "@/components/BrandMark/BrandMark";
import { GradeBadge } from "@/components/GradeBadge/GradeBadge";
import { PressButton } from "@/components/PressButton/PressButton";
import { describeRating } from "@/lib/describeRating";
import { formatCtc, shortenHash } from "@/lib/formatNumber";
import type { ExaminerState, Market } from "@/types";
import type { ExposureReport, WalletState } from "@/types/exposure";
import "./SidePanel.css";

interface SidePanelProps {
  markets: Market[];
  examiner: ExaminerState;
  selectedMarketId: string;
  wallet: WalletState;
  exposure: ExposureReport;
  onConnectWallet: () => void;
  isVisible: boolean;
  onSelectMarket: (marketId: string) => void;
  onOpenLanding: () => void;
  onHide: () => void;
}

export function SidePanel({
  markets,
  examiner,
  selectedMarketId,
  wallet,
  exposure,
  onConnectWallet,
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
          <BrandMark size={26} />
          <span className="side-panel-name">Forbearance</span>
        </button>

        <div className="side-panel-section">
          <span className="side-panel-heading">Rated markets</span>

          {markets.map((market) => {
            const rating = describeRating(market);
            const isCurrent = market.id === selectedMarketId;

            return (
              <button
                key={market.id}
                type="button"
                className={`side-panel-market ${isCurrent ? "is-current" : ""}`}
                onClick={() => onSelectMarket(market.id)}
                aria-current={isCurrent}
              >
                <GradeBadge rating={rating} />
                <span className="side-panel-market-name">
                  {market.protocol} {market.asset}
                </span>
              </button>
            );
          })}
        </div>

        <div className="side-panel-wallet">
          {wallet.status === "connected" ? (
            <>
              <span className="side-panel-heading">Your exposure</span>
              <span className="side-panel-wallet-address">
                {shortenHash(wallet.address ?? "")}
              </span>
              <span className="side-panel-wallet-note">
                {exposure.unsafeCount > 0
                  ? `${exposure.unsafeCount} position in an unsafe market`
                  : "no unsafe exposure"}
              </span>
            </>
          ) : (
            <PressButton
              onClick={onConnectWallet}
              variant="secondary"
              isFullWidth
              isDisabled={wallet.status === "unavailable"}
            >
              {wallet.status === "unavailable"
                ? "No wallet found"
                : "Check my exposure"}
            </PressButton>
          )}
        </div>

        <div className="side-panel-examiner">
          <span className="side-panel-examiner-label">Ratings analyst</span>
          <span className="side-panel-examiner-row">
            <span>Treasury</span>
            <b>{formatCtc(examiner.treasuryCtc, 0)}</b>
          </span>
          <span className="side-panel-examiner-row">
            <span>Ratings issued</span>
            <b>{filingCount}</b>
          </span>
        </div>
      </nav>
    </>
  );
}
