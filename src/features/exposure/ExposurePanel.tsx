import { GradeBadge } from "@/components/GradeBadge/GradeBadge";
import { Panel } from "@/components/Panel/Panel";
import { PressButton } from "@/components/PressButton/PressButton";
import { markets } from "@/data/markets";
import { describeRating } from "@/lib/describeRating";
import { shortenHash } from "@/lib/formatNumber";
import type { ExposureReport, WalletState } from "@/types/exposure";
import "./ExposurePanel.css";

interface ExposurePanelProps {
  wallet: WalletState;
  report: ExposureReport;
  onConnect: () => void;
}

export function ExposurePanel({
  wallet,
  report,
  onConnect,
}: ExposurePanelProps) {
  const isConnecting = wallet.status === "connecting";
  const isUnavailable = wallet.status === "unavailable";

  return (
    <Panel
      title="Your exposure"
      action={
        wallet.address ? (
          <span className="exposure-address">
            {shortenHash(wallet.address)}
          </span>
        ) : undefined
      }
    >
      <div className="exposure">
        {!report.isLoaded && (
          <>
            <p className="exposure-prompt">
              Check whether your own supplied balances sit in markets we rate
              unsafe. Read only, no transaction, no gas.
            </p>
            <PressButton
              onClick={onConnect}
              variant="primary"
              isFullWidth
              isDisabled={isConnecting || isUnavailable}
            >
              {isUnavailable
                ? "No wallet found"
                : isConnecting
                  ? "Connecting"
                  : "Connect wallet"}
            </PressButton>
            {wallet.errorMessage && (
              <span className="text-caption">{wallet.errorMessage}</span>
            )}
          </>
        )}

        {report.isLoaded && report.unsafeCount > 0 && (
          <div className="exposure-alert">
            <span className="exposure-alert-title">
              {report.unsafeCount} of your positions sit in unsafe markets
            </span>
            <span className="text-caption">
              Liquidators do not reliably arrive there.
            </span>
          </div>
        )}

        {report.isLoaded && report.unsafeCount === 0 && (
          <div className="exposure-clear">
            No exposure to markets we rate unsafe.
          </div>
        )}

        {report.isLoaded && (
          <div className="exposure-rows">
            {report.positions.map((position) => {
              const market = markets.find(
                (candidate) => candidate.id === position.marketId,
              );

              return (
                <div
                  key={position.marketId}
                  className={`exposure-row ${position.hasPosition ? "has-position" : ""}`}
                >
                  {market && <GradeBadge rating={describeRating(market)} />}
                  <span className="exposure-row-name">
                    {position.marketName}
                  </span>
                  <span className="exposure-row-amount">
                    {position.suppliedLabel}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Panel>
  );
}
