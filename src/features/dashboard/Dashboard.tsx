import { StatTile } from "@/components/StatTile/StatTile";
import { Window } from "@/components/Window/Window";
import { CaseFileWindow } from "@/features/caseFile/CaseFileWindow";
import { DocketWindow } from "@/features/docket/DocketWindow";
import { RegistryWindow } from "@/features/registry/RegistryWindow";
import { describeFinding } from "@/lib/describeFinding";
import { formatWaitClock } from "@/lib/formatDuration";
import { formatCount, formatPercent } from "@/lib/formatNumber";
import { summariseRegistry } from "@/lib/summariseRegistry";
import type {
  CaseFile,
  ExaminerState,
  Market,
  RegistryTotals,
} from "@/types";
import "./Dashboard.css";

interface DashboardProps {
  markets: Market[];
  totals: RegistryTotals;
  examiner: ExaminerState;
  selectedMarket: Market | undefined;
  selectedCaseFiles: CaseFile[];
  onSelectMarket: (marketId: string) => void;
}

export function Dashboard({
  markets,
  totals,
  examiner,
  selectedMarket,
  selectedCaseFiles,
  onSelectMarket,
}: DashboardProps) {
  const summary = summariseRegistry(markets);
  const hasCaseFiles = selectedCaseFiles.length > 0;

  return (
    <div className="dashboard">
      <div className="dashboard-stats">
        <StatTile
          label="Markets watched"
          value={formatCount(summary.marketCount)}
          note="on Ethereum mainnet"
        />
        <StatTile
          label="Failing now"
          value={formatCount(summary.failingMarketCount)}
          note="liquidators are not arriving"
          isAlert={summary.failingMarketCount > 0}
        />
        <StatTile
          label="Longest silence"
          value={formatWaitClock(summary.slowestWaitSeconds)}
          note={summary.slowestMarketName}
        />
        <StatTile
          label="Evidence grade"
          value={formatPercent(totals.attestationGradeShare)}
          note="proven at attestation resolution"
        />
      </div>

      <RegistryWindow
        markets={markets}
        totals={totals}
        selectedMarketId={selectedMarket?.id ?? null}
        onSelectMarket={onSelectMarket}
      />

      {selectedMarket && (
        <Window fileName={`${selectedMarket.id}.evidence`}>
          <div className="dashboard-selection">
            <span className="dashboard-selection-name">
              {selectedMarket.protocol} · {selectedMarket.asset}
            </span>
            <span className="text-caption">
              {describeFinding(selectedMarket.finding).plainLanguage}
            </span>
          </div>

          {hasCaseFiles ? (
            <p className="text-small">
              {formatCount(selectedCaseFiles.length)} case file
              {selectedCaseFiles.length === 1 ? "" : "s"} filed against this
              market. Each one names the transactions that prove it.
            </p>
          ) : (
            <div className="dashboard-empty">
              <h3>No case files filed</h3>
              <p className="text-small">
                Liquidators arrived fast enough here that no interval crossed the
                filing threshold. Choose Morpho rsETH or Morpho weETH in the side
                panel to read a filed case.
              </p>
            </div>
          )}
        </Window>
      )}

      {selectedCaseFiles.map((caseFile) => (
        <CaseFileWindow key={caseFile.id} caseFile={caseFile} />
      ))}

      <DocketWindow examiner={examiner} />
    </div>
  );
}
