import { PressButton } from "@/components/PressButton/PressButton";
import { ShaderBackground } from "@/components/ShaderBackground/ShaderBackground";
import { SilenceTrack } from "@/components/SilenceTrack/SilenceTrack";
import { StepIcon } from "@/components/StepIcon/StepIcon";
import { workSteps } from "@/data/howItWorks";
import { formatDuration } from "@/lib/formatDuration";
import { formatBlockHeight, formatCount } from "@/lib/formatNumber";
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
      <section className="landing-hero">
        <ShaderBackground className="landing-hero-shader" />
        <span className="landing-hero-veil" aria-hidden="true" />

        <div className="landing-hero-inner">
          <span className="landing-eyebrow">
            <span className="landing-eyebrow-pip" aria-hidden="true" />
            Reading Ethereum mainnet · block{" "}
            {formatBlockHeight(status.attestedFrontier)}
          </span>

          <h1 className="landing-headline">
            Nobody checks if the watchers are watching.
          </h1>

          <p className="landing-subhead">
            Lending protocols assume a liquidator will show up when a loan goes
            bad. Nobody verifies it. Forbearance proves whether they actually do,
            using Ethereum transactions anyone can open and check.
          </p>

          <div className="landing-actions">
            <PressButton onClick={onOpenDashboard} variant="onDark">
              Open the dashboard
            </PressButton>
            <span className="landing-hero-note">
              No wallet, no login, nothing to install.
            </span>
          </div>
        </div>
      </section>

      <div className="landing-body">
        <section>
          <div className="landing-section-head">
            <h2>Two intervals. Same delay. Opposite disease.</h2>
            <p>
              Only one liquidator can close a position, so proving who finally
              closed it proves everyone else declined until that moment. What
              separates the two cases is whether anyone tried.
            </p>
          </div>

          <div className="landing-compare">
            <article className="landing-card">
              <div className="landing-card-head">
                <span className="landing-card-title">Incentive failure</span>
                <span className="landing-card-market">
                  {silenceCaseFile.marketName}
                </span>
              </div>
              <SilenceTrack
                openedAtBlock={silenceCaseFile.openedAtBlock}
                closedAtBlock={silenceCaseFile.closedAtBlock}
                attemptBlocks={collectAttemptBlocks(silenceCaseFile)}
              />
              <p>
                Empty because nothing happened.{" "}
                {formatDuration(silenceCaseFile.silenceSeconds)} in which{" "}
                {formatCount(silenceCaseFile.respondentCount)} liquidators saw
                the position and walked past it. The reward was not worth
                claiming.
              </p>
            </article>

            <article className="landing-card">
              <div className="landing-card-head">
                <span className="landing-card-title">Mechanism failure</span>
                <span className="landing-card-market">
                  {attemptsCaseFile.marketName}
                </span>
              </div>
              <SilenceTrack
                openedAtBlock={attemptsCaseFile.openedAtBlock}
                closedAtBlock={attemptsCaseFile.closedAtBlock}
                attemptBlocks={collectAttemptBlocks(attemptsCaseFile)}
              />
              <p>
                Every mark is a proven failed attempt. They tried{" "}
                {formatCount(attemptsCaseFile.attemptCount)} times and the call
                kept reverting. The reward was fine. The mechanism is broken.
              </p>
            </article>
          </div>
        </section>

        <section>
          <div className="landing-section-head">
            <h2>How it works</h2>
            <p>
              Checking a fact on Creditcoin is free. Putting it on the record
              costs gas, and gas rises as evidence ages. That tension is what the
              Examiner spends its budget solving.
            </p>
          </div>

          <div className="landing-steps">
            {workSteps.map((step) => (
              <article key={step.ordinal} className="landing-step">
                <StepIcon name={step.icon} />
                <span className="landing-step-ordinal">{step.ordinal}</span>
                <span className="landing-step-title">{step.title}</span>
                <p className="landing-step-detail">{step.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="landing-foot">
          <span>
            {formatCount(totals.caseFileCount)} case files ·{" "}
            {formatCount(totals.exhibitCount)} exhibits sealed
          </span>
          <span>BUIDL CTC 2026 Fall · AI track · CC3 Testnet 102031</span>
        </footer>
      </div>
    </div>
  );
}
