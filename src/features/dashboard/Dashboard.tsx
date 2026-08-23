import { GradeCard } from "@/components/GradeCard/GradeCard";
import { Panel } from "@/components/Panel/Panel";
import { EvidenceList } from "@/features/evidence/EvidenceList";
import { ExaminerPanel } from "@/features/examiner/ExaminerPanel";
import { ExposurePanel } from "@/features/exposure/ExposurePanel";
import { describeRating, listRatingReasons } from "@/lib/describeRating";
import type { CaseFile, ExaminerState, Market } from "@/types";
import type { ExposureReport, WalletState } from "@/types/exposure";
import "./Dashboard.css";

interface DashboardProps {
  market: Market | undefined;
  caseFiles: CaseFile[];
  examiner: ExaminerState;
  wallet: WalletState;
  exposure: ExposureReport;
  onConnectWallet: () => void;
}

export function Dashboard({
  market,
  caseFiles,
  examiner,
  wallet,
  exposure,
  onConnectWallet,
}: DashboardProps) {
  if (!market) {
    return null;
  }

  const rating = describeRating(market);
  const reasons = listRatingReasons(market, caseFiles);
  const marketName = `${market.protocol} · ${market.asset}`;

  return (
    <div className="dashboard" key={market.id}>
      <GradeCard rating={rating} marketName={marketName} />

      <div className="dashboard-reasons">
        {reasons.map((reason) => (
          <div key={reason.label} className="dashboard-reason">
            <span className="dashboard-reason-label">{reason.label}</span>
            <span className="dashboard-reason-detail">{reason.detail}</span>
          </div>
        ))}
      </div>

      <div className="dashboard-split">
        <div className="dashboard-column">
          {caseFiles.length > 0 ? (
            <EvidenceList caseFiles={caseFiles} />
          ) : (
            <Panel title="Nothing filed against this market">
              <p className="text-small">
                No position stayed open long enough to be worth recording.
                Markets rated C or D have filed evidence to read.
              </p>
            </Panel>
          )}
        </div>

        <div className="dashboard-column">
          <ExposurePanel
            wallet={wallet}
            report={exposure}
            onConnect={onConnectWallet}
          />
          <span className="dashboard-section-label">Who rated it</span>
          <ExaminerPanel examiner={examiner} />
        </div>
      </div>
    </div>
  );
}
