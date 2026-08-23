import { Panel } from "@/components/Panel/Panel";
import { Tag } from "@/components/Tag/Tag";
import { formatEvidenceAge } from "@/lib/formatDuration";
import { formatCtc, formatProbability } from "@/lib/formatNumber";
import type { ExaminerState } from "@/types";
import "./ExaminerPanel.css";

const rules = [
  { term: "Knowing is free", detail: "verifying a proof is a view call" },
  { term: "Evidence ages", detail: "gas rises tenfold once pruned" },
  { term: "All or none", detail: "one bad exhibit voids the batch" },
];

interface ExaminerPanelProps {
  examiner: ExaminerState;
}

export function ExaminerPanel({ examiner }: ExaminerPanelProps) {
  const filings = examiner.candidates.filter(
    (candidate) => candidate.decision === "file",
  );

  return (
    <Panel
      title="Examiner"
      action={<span className="examiner-model">LangGraph · GPT-4o</span>}
    >
      <div className="examiner">
        <div className="examiner-purse">
          <span className="examiner-purse-item">
            <span className="examiner-purse-label">Treasury</span>
            <span className="examiner-purse-value">
              {formatCtc(examiner.treasuryCtc, 0)}
            </span>
          </span>
          <span className="examiner-purse-item">
            <span className="examiner-purse-label">Budget per hour</span>
            <span className="examiner-purse-value">
              {formatCtc(examiner.hourlyBudgetCtc)}
            </span>
          </span>
        </div>

        <div className="examiner-rules">
          {rules.map((rule) => (
            <span key={rule.term} className="examiner-rule">
              <b>{rule.term}</b>
              <span>{rule.detail}</span>
            </span>
          ))}
        </div>

        <div className="examiner-candidates">
          {examiner.candidates.map((candidate) => (
            <div key={candidate.id} className="examiner-candidate">
              <span className="examiner-candidate-name">
                <span className="examiner-candidate-market">
                  {candidate.marketName}
                </span>
                <span className="examiner-candidate-meta">
                  {formatEvidenceAge(candidate.evidenceAgeSeconds)} old ·{" "}
                  {formatCtc(candidate.filingCostCtc, 3)}
                </span>
              </span>
              <span className="examiner-candidate-score">
                {formatProbability(candidate.probabilityHolds)}
              </span>
              {candidate.decision === "file" ? (
                <Tag tone="accent">file</Tag>
              ) : (
                <Tag tone="neutral">{candidate.decision}</Tag>
              )}
            </div>
          ))}
        </div>

        <div className="examiner-action">
          <span className="examiner-action-count">
            {filings.length} filed this round
          </span>
          <span className="text-caption">
            The Examiner signs its own filings from its treasury. Nothing here
            asks you for a wallet.
          </span>
        </div>

        <div className="examiner-learning">
          <span className="examiner-learning-label">Last round</span>
          <p>{examiner.lastRoundNote}</p>
          <span className="examiner-shift">
            {examiner.attentionShift.marketName} ·{" "}
            {formatCtc(examiner.attentionShift.fromCtcPerHour)} →{" "}
            {formatCtc(examiner.attentionShift.toCtcPerHour)} per hour
          </span>
        </div>
      </div>
    </Panel>
  );
}
