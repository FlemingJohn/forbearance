import { DataTable } from "@/components/DataTable/DataTable";
import { LivenessMeter } from "@/components/LivenessMeter/LivenessMeter";
import { Tag } from "@/components/Tag/Tag";
import { Window } from "@/components/Window/Window";
import { describeFinding } from "@/lib/describeFinding";
import { formatWaitClock } from "@/lib/formatDuration";
import {
  formatCount,
  formatCtc,
  formatPercent,
  formatRatio,
} from "@/lib/formatNumber";
import type { Market, RegistryTotals } from "@/types";
import "./RegistryWindow.css";

const headings = [
  "Market",
  "Record",
  "Median wait",
  "Worst wait",
  "Attempts",
  "Finding",
];

interface RegistryWindowProps {
  markets: Market[];
  totals: RegistryTotals;
  selectedMarketId: string | null;
  onSelectMarket: (marketId: string) => void;
}

export function RegistryWindow({
  markets,
  totals,
  selectedMarketId,
  onSelectMarket,
}: RegistryWindowProps) {
  return (
    <Window fileName="liveness.registry">
      <h3>Which markets can you trust to liquidate?</h3>
      <p className="text-small">
        One row per market. A high record means liquidators arrive fast. Choose a
        row to open its case files.
      </p>

      <DataTable headings={headings} caption="Liveness record by market">
        {markets.map((market) => {
          const finding = describeFinding(market.finding);
          const isSelected = market.id === selectedMarketId;

          return (
            <tr
              key={market.id}
              className={`is-selectable ${isSelected ? "is-selected" : ""}`}
              onClick={() => onSelectMarket(market.id)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  onSelectMarket(market.id);
                }
              }}
              tabIndex={0}
              aria-selected={isSelected}
            >
              <td className="registry-market-name">
                {market.protocol} · {market.asset}
              </td>
              <td>
                <LivenessMeter score={market.livenessScore} />
              </td>
              <td className="is-numeric">
                {formatWaitClock(market.medianWaitSeconds)}
              </td>
              <td className="is-numeric">
                {formatWaitClock(market.worstCaseWaitSeconds)}
              </td>
              <td className="is-numeric">{formatRatio(market.attemptRatio)}</td>
              <td>
                <Tag isInverted={finding.isFailure}>{finding.label}</Tag>
              </td>
            </tr>
          );
        })}
      </DataTable>

      <p className="registry-totals">
        <span>
          <b>{formatCount(totals.caseFileCount)}</b> case files
        </span>
        <span>
          <b>{formatCount(totals.exhibitCount)}</b> exhibits sealed
        </span>
        <span>
          <b>{formatCtc(totals.gasSpentCtc)}</b> spent proving
        </span>
        <span>
          <b>{formatPercent(totals.attestationGradeShare)}</b> attestation grade
        </span>
      </p>
    </Window>
  );
}
