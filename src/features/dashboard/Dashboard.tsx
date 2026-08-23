import { StatTile } from "@/components/StatTile/StatTile";
import { TabBar } from "@/components/TabBar/TabBar";
import { Tag } from "@/components/Tag/Tag";
import { CaseFileWindow } from "@/features/caseFile/CaseFileWindow";
import { ExaminerPanel } from "@/features/examiner/ExaminerPanel";
import { describeFinding } from "@/lib/describeFinding";
import { formatWaitClock } from "@/lib/formatDuration";
import { formatCount, formatRatio } from "@/lib/formatNumber";
import type { CaseFile, ExaminerState, Market } from "@/types";
import type { WalletState } from "@/types/wallet";
import "./Dashboard.css";

export type DashboardTab = "evidence" | "examiner";

interface DashboardProps {
  market: Market | undefined;
  caseFiles: CaseFile[];
  examiner: ExaminerState;
  wallet: WalletState;
  currentTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  onFileEvidence: () => void;
}

export function Dashboard({
  market,
  caseFiles,
  examiner,
  wallet,
  currentTab,
  onSelectTab,
  onFileEvidence,
}: DashboardProps) {
  if (!market) {
    return null;
  }

  const finding = describeFinding(market.finding);
  const filingCount = examiner.candidates.filter(
    (candidate) => candidate.decision === "file",
  ).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <span className="dashboard-market">
          {market.protocol} · {market.asset}
        </span>
        <Tag isInverted={finding.isFailure}>{finding.label}</Tag>
      </div>

      <p className="text-small">{finding.plainLanguage}</p>

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
          isAlert={finding.isFailure}
        />
        <StatTile
          label="Attempt ratio"
          value={formatRatio(market.attemptRatio)}
          note={
            market.attemptRatio === 0
              ? "nobody tried at all"
              : "tries per opportunity"
          }
        />
      </div>

      <TabBar
        tabs={[
          {
            id: "evidence",
            label: "Evidence",
            count: formatCount(caseFiles.length),
          },
          {
            id: "examiner",
            label: "Examiner",
            count: `${filingCount} to file`,
          },
        ]}
        currentTabId={currentTab}
        onSelectTab={(tabId) => onSelectTab(tabId as DashboardTab)}
      />

      <div className="dashboard-panel">
        {currentTab === "evidence" &&
          (caseFiles.length > 0 ? (
            caseFiles.map((caseFile) => (
              <CaseFileWindow key={caseFile.id} caseFile={caseFile} />
            ))
          ) : (
            <div className="dashboard-empty">
              <h3>No case files filed</h3>
              <p className="text-small">
                Liquidators arrive fast enough here that no interval crossed the
                filing threshold. Pick Morpho rsETH or Morpho weETH to read a
                filed case.
              </p>
            </div>
          ))}

        {currentTab === "examiner" && (
          <ExaminerPanel
            examiner={examiner}
            wallet={wallet}
            onFileEvidence={onFileEvidence}
          />
        )}
      </div>
    </div>
  );
}
