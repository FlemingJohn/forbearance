import { GradeCard } from "@/components/GradeCard/GradeCard";
import { Panel } from "@/components/Panel/Panel";
import { CaseFileWindow } from "@/features/caseFile/CaseFileWindow";
import { ExaminerPanel } from "@/features/examiner/ExaminerPanel";
import { describeRating, listRatingReasons } from "@/lib/describeRating";
import type { CaseFile, ExaminerState, Market } from "@/types";
import "./Dashboard.css";

interface DashboardProps {
  market: Market | undefined;
  caseFiles: CaseFile[];
  examiner: ExaminerState;
}

export function Dashboard({ market, caseFiles, examiner }: DashboardProps) {
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
          <span className="dashboard-section-label">The evidence</span>

          {caseFiles.length > 0 ? (
            caseFiles.map((caseFile) => (
              <CaseFileWindow key={caseFile.id} caseFile={caseFile} />
            ))
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
          <span className="dashboard-section-label">Who rated it</span>
          <ExaminerPanel examiner={examiner} />
        </div>
      </div>
    </div>
  );
}
