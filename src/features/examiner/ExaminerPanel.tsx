import { DataTable } from "@/components/DataTable/DataTable";
import { PressButton } from "@/components/PressButton/PressButton";
import { Tag } from "@/components/Tag/Tag";
import { formatEvidenceAge } from "@/lib/formatDuration";
import { formatCtc, formatProbability } from "@/lib/formatNumber";
import type { ExaminerState } from "@/types";
import type { WalletState } from "@/types/wallet";
import "./ExaminerPanel.css";

const headings = [
  "Candidate",
  "Holds",
  "Evidence age",
  "Filing cost",
  "Bounty",
  "Decision",
];

interface ExaminerPanelProps {
  examiner: ExaminerState;
  wallet: WalletState;
  onFileEvidence: () => void;
}

export function ExaminerPanel({
  examiner,
  wallet,
  onFileEvidence,
}: ExaminerPanelProps) {
  const filings = examiner.candidates.filter(
    (candidate) => candidate.decision === "file",
  );

  const canFile = wallet.status === "connected";

  return (
    <div className="examiner">
      <div className="examiner-head">
        <div className="examiner-title">
          <span className="examiner-model">
            LangGraph · Azure OpenAI GPT-4o
          </span>
          <h2>The Examiner decides what is worth proving.</h2>
          <p className="text-small">
            Reading the chain is free, so it surveys every candidate at zero
            cost. Filing evidence costs gas, so it files only what pays for
            itself.
          </p>
        </div>

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
      </div>

      <div className="examiner-economics">
        <div className="examiner-economic">
          <span className="examiner-economic-term">Knowing is free</span>
          <span className="examiner-economic-detail">
            Both verify overloads are view calls, so checking a proof costs
            nothing.
          </span>
        </div>
        <div className="examiner-economic">
          <span className="examiner-economic-term">Evidence ages badly</span>
          <span className="examiner-economic-detail">
            Filing gas rises around tenfold once attestations are replaced by
            checkpoints.
          </span>
        </div>
        <div className="examiner-economic">
          <span className="examiner-economic-term">Batches are all or none</span>
          <span className="examiner-economic-detail">
            One bad exhibit reverts the whole bundle and forfeits the gas.
          </span>
        </div>
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
                <span className="examiner-decision">{candidate.decision}</span>
              )}
            </td>
          </tr>
        ))}
      </DataTable>

      <div className="row">
        <PressButton
          onClick={onFileEvidence}
          variant="primary"
          isDisabled={!canFile}
        >
          File {filings.length} case files
        </PressButton>
        <span className="text-caption">
          {canFile
            ? "Signs one batched transaction on Creditcoin Testnet."
            : "Connect a wallet to file. Reading needs none."}
        </span>
      </div>

      <div className="examiner-learning">
        <span className="examiner-learning-label">Last round</span>
        <p className="text-small">{examiner.lastRoundNote}</p>
        <p className="examiner-shift">
          Reallocating attention · {examiner.attentionShift.marketName} ·{" "}
          {formatCtc(examiner.attentionShift.fromCtcPerHour)} →{" "}
          {formatCtc(examiner.attentionShift.toCtcPerHour)} per hour
        </p>
      </div>
    </div>
  );
}
