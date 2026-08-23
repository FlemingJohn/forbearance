import { useState } from "react";
import { PressButton } from "@/components/PressButton/PressButton";
import { CaseFileWindow } from "@/features/caseFile/CaseFileWindow";
import { formatDuration } from "@/lib/formatDuration";
import { formatCount } from "@/lib/formatNumber";
import type { CaseFile } from "@/types";
import "./EvidenceList.css";

const VISIBLE_BEFORE_MORE = 4;

interface EvidenceListProps {
  caseFiles: CaseFile[];
}

export function EvidenceList({ caseFiles }: EvidenceListProps) {
  const [openCaseId, setOpenCaseId] = useState(caseFiles[0]?.id ?? "");
  const [isShowingAll, setIsShowingAll] = useState(false);

  const visibleCaseFiles = isShowingAll
    ? caseFiles
    : caseFiles.slice(0, VISIBLE_BEFORE_MORE);

  const hiddenCount = caseFiles.length - visibleCaseFiles.length;

  const mechanismCount = caseFiles.filter(
    (caseFile) => caseFile.finding === "mechanism",
  ).length;

  return (
    <div className="evidence">
      <div className="evidence-head">
        <span className="evidence-title">Evidence</span>
        <span className="evidence-count">
          {formatCount(caseFiles.length)} intervals
          {mechanismCount > 0 && ` · ${mechanismCount} with failed attempts`}
        </span>
      </div>

      <div className="evidence-list">
        {visibleCaseFiles.map((caseFile) => {
          const isOpen = caseFile.id === openCaseId;

          return (
            <div key={caseFile.id}>
              <button
                type="button"
                className={`evidence-row ${isOpen ? "is-open" : ""}`}
                onClick={() => setOpenCaseId(isOpen ? "" : caseFile.id)}
                aria-expanded={isOpen}
              >
                <span className="evidence-row-caret" aria-hidden="true">
                  {isOpen ? "▼" : "▶"}
                </span>
                <span className="evidence-row-reference">
                  {caseFile.reference}
                </span>
                <span className="evidence-row-duration">
                  {formatDuration(caseFile.silenceSeconds)}
                </span>
                <span className="evidence-row-attempts">
                  {caseFile.attemptCount === 0
                    ? "none tried"
                    : `${caseFile.attemptCount} tried`}
                </span>
              </button>

              {isOpen && (
                <div className="evidence-body">
                  <CaseFileWindow caseFile={caseFile} />
                </div>
              )}
            </div>
          );
        })}

        {hiddenCount > 0 && (
          <div className="evidence-more">
            <PressButton onClick={() => setIsShowingAll(true)} variant="ghost">
              Show {formatCount(hiddenCount)} more
            </PressButton>
          </div>
        )}
      </div>
    </div>
  );
}
