import { PressButton } from "@/components/PressButton/PressButton";
import { SilenceTrack } from "@/components/SilenceTrack/SilenceTrack";
import { Tag } from "@/components/Tag/Tag";
import { Window } from "@/components/Window/Window";
import { formatDuration } from "@/lib/formatDuration";
import { formatBlockHeight, formatCount, formatUsd } from "@/lib/formatNumber";
import type { CaseFile, ChainStatus, RegistryTotals } from "@/types";
import "./LandingPage.css";

interface LandingPageProps {
  silenceCaseFile: CaseFile;
  attemptsCaseFile: CaseFile;
  totals: RegistryTotals;
  status: ChainStatus;
  onOpenDashboard: () => void;
}

function collectAttemptBlocks(caseFile: CaseFile): number[] {
  return caseFile.exhibits
    .filter((exhibit) => exhibit.role === "attempt")
    .map((exhibit) => exhibit.blockHeight);
}

export function LandingPage({
  silenceCaseFile,
  attemptsCaseFile,
  totals,
  status,
  onOpenDashboard,
}: LandingPageProps) {
  return (
    <div className="landing">
      <div className="landing-inner">
        <Window fileName="forbearance">
          <div className="landing-hero">
            <h1 className="landing-headline">
              Nobody checks if the watchers are watching.
            </h1>

            <p className="text-lede">
              Lending protocols assume a liquidator will show up when a loan goes
              bad. Nobody verifies it. Forbearance proves whether they actually
              do, using Ethereum transactions anyone can open and check.
            </p>

            <div className="landing-actions">
              <PressButton onClick={onOpenDashboard} variant="primary">
                Open the dashboard
              </PressButton>
              <span className="text-caption">
                No wallet. No login. Reads live Ethereum mainnet.
              </span>
            </div>
          </div>
        </Window>

        <Window fileName="the-evidence.file">
          <h2>Two intervals. Same delay. Opposite disease.</h2>

          <div className="landing-proof">
            <div className="landing-proof-column">
              <div className="landing-proof-heading">
                <Tag isInverted>Incentive failure</Tag>
                <span className="text-caption">
                  {silenceCaseFile.marketName}
                </span>
              </div>
              <SilenceTrack
                openedAtBlock={silenceCaseFile.openedAtBlock}
                closedAtBlock={silenceCaseFile.closedAtBlock}
                attemptBlocks={collectAttemptBlocks(silenceCaseFile)}
              />
              <p className="text-small">
                Empty because nothing happened.{" "}
                {formatDuration(silenceCaseFile.silenceSeconds)} in which{" "}
                {formatCount(silenceCaseFile.respondentCount)} liquidators saw{" "}
                {formatUsd(silenceCaseFile.rewardIgnoredUsd)} on the table and
                walked past it. The reward was not worth claiming.
              </p>
            </div>

            <div className="landing-proof-column">
              <div className="landing-proof-heading">
                <Tag>Mechanism failure</Tag>
                <span className="text-caption">
                  {attemptsCaseFile.marketName}
                </span>
              </div>
              <SilenceTrack
                openedAtBlock={attemptsCaseFile.openedAtBlock}
                closedAtBlock={attemptsCaseFile.closedAtBlock}
                attemptBlocks={collectAttemptBlocks(attemptsCaseFile)}
              />
              <p className="text-small">
                Every mark is a proven failed attempt. They tried{" "}
                {formatCount(attemptsCaseFile.attemptCount)} times and the call
                kept reverting. The reward was fine. The mechanism is broken.
              </p>
            </div>
          </div>

          <p className="text-small">
            Only one liquidator can close a position, so proving who finally
            closed it proves everyone else declined until that moment. Proving
            the failed attempts is what separates the two cases, and almost
            nothing else can prove a transaction that failed.
          </p>

          <p className="landing-footnote">
            {formatCount(totals.caseFileCount)} case files ·{" "}
            {formatCount(totals.exhibitCount)} exhibits sealed ·{" "}
            {status.networkName} frontier{" "}
            {formatBlockHeight(status.attestedFrontier)}
          </p>
        </Window>
      </div>
    </div>
  );
}
