import { Panel } from "@/components/Panel/Panel";
import { StatTile } from "@/components/StatTile/StatTile";
import { Tag } from "@/components/Tag/Tag";
import { CaseFileWindow } from "@/features/caseFile/CaseFileWindow";
import { ExaminerPanel } from "@/features/examiner/ExaminerPanel";
import { describeFinding } from "@/lib/describeFinding";
import { formatWaitClock } from "@/lib/formatDuration";
import { formatRatio } from "@/lib/formatNumber";
import type { CaseFile, ExaminerState, Market } from "@/types";
import type { WalletState } from "@/types/wallet";
import "./Dashboard.css";

interface DashboardProps {
  market: Market | undefined;
  caseFiles: CaseFile[];
  examiner: ExaminerState;
  wallet: WalletState;
  onFileEvidence: () => void;
}

export function Dashboard({
  market,
  caseFiles,
  examiner,
  wallet,
  onFileEvidence,
}: DashboardProps) {
  if (!market) {
    return null;
  }

  const finding = describeFinding(market.finding);
  const hasCaseFiles = caseFiles.length > 0;

  return (
    <div className="dashboard" key={market.id}>
      <div className="dashboard-header">
        <span className="dashboard-market">
          {market.protocol} · {market.asset}
        </span>
        <Tag tone={finding.tone}>{finding.label}</Tag>
        <p className="dashboard-plain">{finding.plainLanguage}</p>
      </div>

      <div className="dashboard-stats">
        <StatTile
          label="Liveness"
          value={`${market.livenessScore}/10`}
          note="how reliably liquidators arrive"
        />
        <StatTile
          label="Median wait"
          value={formatWaitClock(market.medianWaitSeconds)}
          note="typical time to close a bad position"
        />
        <StatTile
          label="Worst wait"
          value={formatWaitClock(market.worstCaseWaitSeconds)}
          note="longest proven silence"
          tone={finding.isFailure ? "watch" : "neutral"}
        />
        <StatTile
          label="Attempt ratio"
          value={formatRatio(market.attemptRatio)}
          note={
            market.attemptRatio === 0
              ? "nobody tried at all"
              : "tries per opportunity"
          }
          tone={market.finding === "mechanism" ? "alarm" : "neutral"}
        />
      </div>

      <div className="dashboard-split">
        <div className="dashboard-column">
          {hasCaseFiles ? (
            caseFiles.map((caseFile) => (
              <CaseFileWindow key={caseFile.id} caseFile={caseFile} />
            ))
          ) : (
            <Panel title="No case files filed">
              <div className="dashboard-empty">
                <p className="text-small">
                  Liquidators arrive fast enough here that no interval crossed
                  the filing threshold. Pick Morpho rsETH or Morpho weETH in the
                  side panel to read a filed case.
                </p>
              </div>
            </Panel>
          )}
        </div>

        <div className="dashboard-column">
          <ExaminerPanel
            examiner={examiner}
            wallet={wallet}
            onFileEvidence={onFileEvidence}
          />
        </div>
      </div>
    </div>
  );
}
