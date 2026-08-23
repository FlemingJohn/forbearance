import { CheckRow } from "@/components/CheckRow/CheckRow";
import { ExplorerLink } from "@/components/ExplorerLink/ExplorerLink";
import { SilenceTrack } from "@/components/SilenceTrack/SilenceTrack";
import { Tag } from "@/components/Tag/Tag";
import { describeFinding } from "@/lib/describeFinding";
import { formatDuration } from "@/lib/formatDuration";
import { formatBlockHeight, formatCount } from "@/lib/formatNumber";
import type { CaseFile } from "@/types";
import { VerifyPanel } from "./VerifyPanel";
import "./CaseFileWindow.css";

interface CaseFileWindowProps {
  caseFile: CaseFile;
}

export function CaseFileWindow({ caseFile }: CaseFileWindowProps) {
  const finding = describeFinding(caseFile.finding);
  const attemptBlocks = caseFile.exhibits
    .filter((exhibit) => exhibit.role === "attempt")
    .map((exhibit) => exhibit.blockHeight);

  const closingExhibit =
    caseFile.exhibits.find((exhibit) => exhibit.role === "close") ??
    caseFile.exhibits[0]!;

  const caption = `${formatDuration(caseFile.silenceSeconds)} · ${formatCount(caseFile.attemptCount)} attempts proven · ${formatCount(caseFile.respondentCount)} eligible respondents`;

  return (
    <div className="case-file">
      <div className="case-file-head">
        <Tag tone={finding.tone}>{finding.label}</Tag>
        <span className="case-file-opening">
          opened by {caseFile.openingFeedLabel}
        </span>
      </div>

        <SilenceTrack
          openedAtBlock={caseFile.openedAtBlock}
          closedAtBlock={caseFile.closedAtBlock}
          attemptBlocks={attemptBlocks}
          caption={caption}
        />

        <div className="case-file-exhibits">
          {caseFile.exhibits.map((exhibit) => (
            <div key={exhibit.id} className="case-file-exhibit">
              <span className="case-file-exhibit-role">{exhibit.role}</span>
              <span className="case-file-exhibit-detail">
                <span>block {formatBlockHeight(exhibit.blockHeight)}</span>
                <span>{exhibit.eventName}</span>
                <Tag tone={exhibit.succeeded ? "calm" : "alarm"}>
                  {exhibit.succeeded ? "succeeded" : "reverted"}
                </Tag>
              </span>
              <ExplorerLink transactionHash={exhibit.transactionHash} />
            </div>
          ))}
        </div>

        <div className="case-file-checks">
          <CheckRow label="Receipt status" value="asserted" />
          <CheckRow label="Exclusivity" value="holds" />
          <CheckRow label="Evidence grade" value={caseFile.evidenceGrade} />
          <CheckRow label="Filed by" value={caseFile.filedBy} />
        </div>

        <VerifyPanel
          transactionHash={closingExhibit.transactionHash}
          blockHeight={closingExhibit.blockHeight}
        />

    </div>
  );
}
