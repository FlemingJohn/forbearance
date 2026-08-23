import { GradeCard } from "@/components/GradeCard/GradeCard";
import { Panel } from "@/components/Panel/Panel";
import { EvidenceList } from "@/features/evidence/EvidenceList";
import { AnalystStrip } from "@/features/examiner/AnalystStrip";
import { ExposureBanner } from "@/features/exposure/ExposureBanner";
import { describeRating, listRatingMetrics } from "@/lib/describeRating";
import type { CaseFile, ExaminerState, Market } from "@/types";
import type { ExposureReport } from "@/types/exposure";
import "./Dashboard.css";

interface DashboardProps {
  market: Market | undefined;
  caseFiles: CaseFile[];
  examiner: ExaminerState;
  exposure: ExposureReport;
}

export function Dashboard({
  market,
  caseFiles,
  examiner,
  exposure,
}: DashboardProps) {
  if (!market) {
    return null;
  }

  const rating = describeRating(market);
  const marketName = `${market.protocol} · ${market.asset}`;
  const metrics = listRatingMetrics(market, caseFiles);

  const proofCount = caseFiles.reduce(
    (total, caseFile) => total + caseFile.exhibits.length,
    0,
  );

  const position = exposure.positions.find(
    (candidate) => candidate.marketId === market.id && candidate.hasPosition,
  );

  return (
    <div className="dashboard" key={market.id}>
      {position && (
        <ExposureBanner
          suppliedLabel={position.suppliedLabel}
          marketName={marketName}
          rating={rating}
        />
      )}

      <GradeCard rating={rating} marketName={marketName} metrics={metrics} />

      <AnalystStrip examiner={examiner} proofCount={proofCount} />

      {caseFiles.length > 0 ? (
        <EvidenceList caseFiles={caseFiles} />
      ) : (
        <Panel title="Nothing filed against this market">
          <p className="text-small">
            No position stayed open long enough to be worth recording. Markets
            rated C or D have filed evidence to read.
          </p>
        </Panel>
      )}
    </div>
  );
}
