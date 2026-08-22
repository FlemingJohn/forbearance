import { DataTable } from "@/components/DataTable/DataTable";
import { Tag } from "@/components/Tag/Tag";
import { Window } from "@/components/Window/Window";
import { formatEvidenceAge } from "@/lib/formatDuration";
import { formatCtc, formatProbability } from "@/lib/formatNumber";
import type { ExaminerState } from "@/types";
import "./DocketWindow.css";

const headings = [
  "Candidate",
  "Holds",
  "Evidence age",
  "Filing cost",
  "Bounty",
  "Decision",
];

interface DocketWindowProps {
  examiner: ExaminerState;
}

export function DocketWindow({ examiner }: DocketWindowProps) {
  return (
    <Window fileName="the.docket">
      <h3>Where the machine spends its own money</h3>
      <p className="text-small">
        Checking a fact is free. Putting it on the record costs gas, and gas
        rises roughly tenfold as evidence ages past checkpointing. The Examiner
        decides what is worth filing right now.
      </p>

      <div className="docket-header">
        <span>{examiner.name}</span>
        <span>budget {formatCtc(examiner.hourlyBudgetCtc)} per hour</span>
        <span>treasury {formatCtc(examiner.treasuryCtc, 0)}</span>
      </div>

      <DataTable headings={headings} caption="Examiner filing decisions">
        {examiner.candidates.map((candidate) => (
          <tr key={candidate.id}>
            <td>
              {candidate.marketName} {candidate.reference}
            </td>
            <td className="is-numeric">
              {formatProbability(candidate.probabilityHolds)}
            </td>
            <td className="is-numeric">
              {formatEvidenceAge(candidate.evidenceAgeSeconds)}
            </td>
            <td className="is-numeric">
              {formatCtc(candidate.filingCostCtc, 3)}
            </td>
            <td className="is-numeric">{formatCtc(candidate.bountyCtc, 0)}</td>
            <td>
              {candidate.decision === "file" ? (
                <Tag isInverted>file</Tag>
              ) : (
                <span className="docket-decision">{candidate.decision}</span>
              )}
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="docket-note">
        <div className="docket-note-inner">
          <p className="docket-note-heading">Last round</p>
          <p className="text-small">{examiner.lastRoundNote}</p>
          <p className="docket-shift">
            Reallocating attention · {examiner.attentionShift.marketName} ·{" "}
            {formatCtc(examiner.attentionShift.fromCtcPerHour)} →{" "}
            {formatCtc(examiner.attentionShift.toCtcPerHour)} per hour
          </p>
        </div>
      </div>
    </Window>
  );
}
