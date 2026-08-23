import { BrandMark } from "@/components/BrandMark/BrandMark";
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
          <span className="landing-brand">
            <BrandMark size={34} />
            <span className="landing-brand-name">Forbearance</span>
          </span>

          <span className="landing-eyebrow">
            <span className="landing-eyebrow-pip" aria-hidden="true" />
            Reading Ethereum mainnet · block{" "}
            {formatBlockHeight(status.attestedFrontier)}
          </span>

          <h1 className="landing-headline">
            Credit ratings for DeFi lending markets.
          </h1>

          <p className="landing-subhead">
            Before you lend, you should know whether anyone will actually
            liquidate a bad position. We rate every market from real Ethereum
            transactions, proven on Creditcoin, and an AI analyst issues the
            grade.
          </p>

          <div className="landing-actions">
            <PressButton onClick={onOpenDashboard} variant="onDark">
              See the ratings
            </PressButton>
            <span className="landing-hero-note">
              Live Ethereum data. Nothing to install.
            </span>
          </div>
        </div>
      </section>

      <div className="landing-body">
        <section>
          <div className="landing-section-head">
            <h2>What a rating is built from</h2>
            <p>
              Every grade comes from measured delay on real positions. A market
              where nobody arrives is priced differently from one where they
              arrive and fail.
            </p>
          </div>

          <div className="landing-compare">
            <article className="landing-card">
              <div className="landing-card-head">
                <span className="landing-card-title">Nobody arrived</span>
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
                {formatDuration(silenceCaseFile.silenceSeconds)} with a bad
                position open and not one liquidator acting. Lending here is
                riskier than the protocol admits.
              </p>
            </article>

            <article className="landing-card">
              <div className="landing-card-head">
                <span className="landing-card-title">They tried and failed</span>
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
                {formatCount(attemptsCaseFile.attemptCount)} liquidation calls
                that reverted. The incentive worked, the contract did not. A
                different problem, and a different rating.
              </p>
            </article>
          </div>
        </section>

        <section>
          <div className="landing-section-head">
            <h2>How a rating is issued</h2>
            <p>
              Nothing here is a survey or an opinion poll. Each step reads real
              chain data and the result is checkable by anyone.
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
            {formatCount(totals.caseFileCount)} rated intervals ·{" "}
            {formatCount(totals.exhibitCount)} proven transactions
          </span>
          <span>BUIDL CTC 2026 Fall · AI track · CC3 Testnet 102031</span>
        </footer>
      </div>
    </div>
  );
}
