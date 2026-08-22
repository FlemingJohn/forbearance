import { PressButton } from "@/components/PressButton/PressButton";
import { Window } from "@/components/Window/Window";
import { formatCount } from "@/lib/formatNumber";
import type { RegistryTotals } from "@/types";
import "./EntryScreen.css";

interface EntryScreenProps {
  totals: RegistryTotals;
  onStartTour: () => void;
  onBrowseRegistry: () => void;
}

export function EntryScreen({
  totals,
  onStartTour,
  onBrowseRegistry,
}: EntryScreenProps) {
  return (
    <Window fileName="forbearance">
      <div className="entry-screen">
        <h1 className="entry-screen-headline">
          Nobody checks if the watchers are watching.
        </h1>

        <p className="text-lede">
          Lending protocols assume a liquidator will show up when a loan goes
          bad. Forbearance proves whether they actually do.
        </p>

        <div className="entry-screen-actions">
          <PressButton onClick={onStartTour} variant="primary">
            ▶ Start the tour · 3 min
          </PressButton>
          <PressButton onClick={onBrowseRegistry} variant="quiet">
            Browse the registry
          </PressButton>
        </div>

        <p className="entry-screen-footnote">
          Reading Ethereum mainnet live · {formatCount(totals.caseFileCount)}{" "}
          case files on record · no wallet or login needed
        </p>
      </div>
    </Window>
  );
}
