import { CheckRow } from "@/components/CheckRow/CheckRow";
import { ExplorerLink } from "@/components/ExplorerLink/ExplorerLink";
import { SilenceTrack } from "@/components/SilenceTrack/SilenceTrack";
import { Tag } from "@/components/Tag/Tag";
import { Window } from "@/components/Window/Window";
import { describeFinding } from "@/lib/describeFinding";
import { formatDuration } from "@/lib/formatDuration";
import { formatBlockHeight, formatCount, formatUsd } from "@/lib/formatNumber";
import type { CaseFile } from "@/types";
import "./CaseFileWindow.css";

interface CaseFileWindowProps {
  caseFile: CaseFile;
}

function buildFileName(caseFile: CaseFile): string {
  const marketSlug = caseFile.marketName.replace(/\s·\s/g, "-").toLowerCase();
  return `case-${caseFile.id.replace("case-", "")}-${marketSlug}.file`;
}

export function CaseFileWindow({ caseFile }: CaseFileWindowProps) {
  const finding = describeFinding(caseFile.finding);
  const attemptBlocks = caseFile.exhibits
    .filter((exhibit) => exhibit.role === "attempt")
    .map((exhibit) => exhibit.blockHeight);

  return (
    <Window fileName={buildFileName(caseFile)}>
      <div className="row">
        <Tag isInverted={finding.isFailure}>{finding.label} FINDING</Tag>
        <span className="text-caption">{caseFile.marketName}</span>
      </div>

      <p className="text-small">{finding.plainLanguage}</p>

      <div className="case-file-endpoints">
        <span>
          opens · block {formatBlockHeight(caseFile.openedAtBlock)} ·{" "}
          {caseFile.openedAtClock}
        </span>
        <span>
          {caseFile.closedAtClock} · block{" "}
          {formatBlockHeight(caseFile.closedAtBlock)} · closes
        </span>
      </div>

      <SilenceTrack
        openedAtBlock={caseFile.openedAtBlock}
        closedAtBlock={caseFile.closedAtBlock}
        attemptBlocks={attemptBlocks}
      />

      <p className="case-file-summary">
        <b>{formatDuration(caseFile.silenceSeconds)}</b> ·{" "}
        {formatCount(caseFile.attemptCount)} attempts proven ·{" "}
        {formatUsd(caseFile.rewardIgnoredUsd)} reward available ·{" "}
        {formatCount(caseFile.respondentCount)} eligible respondents
      </p>

      <div className="case-file-exhibits">
        <h3>Exhibits</h3>
        {caseFile.exhibits.map((exhibit) => (
          <div key={exhibit.id} className="case-file-exhibit">
            <span className="case-file-exhibit-detail">
              <span className="case-file-exhibit-role">{exhibit.role}</span>
              <span>block {formatBlockHeight(exhibit.blockHeight)}</span>
              <span>index {exhibit.transactionIndex}</span>
              <span>{exhibit.eventName}</span>
              <Tag isInverted={!exhibit.succeeded}>
                {exhibit.succeeded ? "succeeded" : "reverted"}
              </Tag>
            </span>
            <ExplorerLink transactionHash={exhibit.transactionHash} />
          </div>
        ))}
      </div>

      <div className="case-file-checks">
        <CheckRow label="Receipt status asserted" value="sealed" />
        <CheckRow label="Exclusivity holds" value="sealed" />
        <CheckRow label="Evidence grade" value={caseFile.evidenceGrade} />
        <CheckRow label="Filed by" value={caseFile.filedBy} />
      </div>

      <p className="text-small">
        Only one liquidator can close this position, so proving who closed it at{" "}
        {caseFile.closedAtClock} proves the other{" "}
        {formatCount(caseFile.respondentCount - 1)} declined for the whole
        interval.
      </p>
    </Window>
  );
}
