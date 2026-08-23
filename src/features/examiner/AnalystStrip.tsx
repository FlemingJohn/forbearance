import { formatCtc, formatProbability } from "@/lib/formatNumber";
import type { ExaminerState } from "@/types";
import "./AnalystStrip.css";

interface AnalystStripProps {
  examiner: ExaminerState;
  proofCount: number;
}

export function AnalystStrip({ examiner, proofCount }: AnalystStripProps) {
  const filings = examiner.candidates.filter(
    (candidate) => candidate.decision === "file",
  );

  const topConfidence = filings.reduce(
    (highest, candidate) => Math.max(highest, candidate.probabilityHolds),
    0,
  );

  const spent = filings.reduce(
    (total, candidate) => total + candidate.filingCostCtc,
    0,
  );

  return (
    <div className="analyst-strip">
      <span className="analyst-strip-label">Rated by</span>
      <span className="analyst-strip-name">LangGraph · GPT-4o</span>

      <span className="analyst-strip-facts">
        <span>
          confidence <b>{formatProbability(topConfidence)}</b>
        </span>
        <span>
          bought <b>{proofCount}</b> proofs
        </span>
        <span>
          spent <b>{formatCtc(spent, 3)}</b>
        </span>
        <span>
          treasury <b>{formatCtc(examiner.treasuryCtc, 0)}</b>
        </span>
      </span>
    </div>
  );
}
