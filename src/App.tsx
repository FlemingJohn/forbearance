import { useMemo, useState } from "react";
import { HonestyStrip } from "@/components/HonestyStrip/HonestyStrip";
import { MenuBar, type ScreenName } from "@/components/MenuBar/MenuBar";
import { caseFiles, findCaseFilesByMarket } from "@/data/caseFiles";
import { chainStatus } from "@/data/chainStatus";
import { examinerState } from "@/data/examiner";
import { markets, registryTotals } from "@/data/markets";
import { tourSteps } from "@/data/tourSteps";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { EntryScreen } from "@/features/entry/EntryScreen";
import { TourStage } from "@/features/tour/TourStage";
import "./App.css";

const DEFAULT_MARKET_ID = "morpho-rseth";

function requireCaseFile(caseFileId: string) {
  const caseFile = caseFiles.find((candidate) => candidate.id === caseFileId);

  if (!caseFile) {
    throw new Error(`Case file ${caseFileId} is missing from the registry`);
  }

  return caseFile;
}

export function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>("entry");
  const [tourStepIndex, setTourStepIndex] = useState(0);
  const [selectedMarketId, setSelectedMarketId] =
    useState<string>(DEFAULT_MARKET_ID);

  const silenceCaseFile = useMemo(() => requireCaseFile("case-8f2a"), []);
  const attemptsCaseFile = useMemo(() => requireCaseFile("case-71bd"), []);
  const selectedCaseFiles = useMemo(
    () => findCaseFilesByMarket(selectedMarketId),
    [selectedMarketId],
  );

  const currentStep = tourSteps[tourStepIndex] ?? tourSteps[0];

  function startTour() {
    setTourStepIndex(0);
    setCurrentScreen("tour");
  }

  function openDashboard() {
    setCurrentScreen("dashboard");
  }

  function goToPreviousStep() {
    setTourStepIndex((index) => Math.max(0, index - 1));
  }

  function goToNextStep() {
    if (tourStepIndex === tourSteps.length - 1) {
      openDashboard();
      return;
    }

    setTourStepIndex((index) => Math.min(tourSteps.length - 1, index + 1));
  }

  return (
    <div className="app">
      <MenuBar
        currentScreen={currentScreen}
        onOpenEntry={() => setCurrentScreen("entry")}
        onOpenTour={startTour}
        onOpenDashboard={openDashboard}
      />

      <main className="app-desktop">
        <div className="app-canvas">
          <HonestyStrip status={chainStatus} />

          {currentScreen === "entry" && (
            <EntryScreen
              totals={registryTotals}
              onStartTour={startTour}
              onBrowseRegistry={openDashboard}
            />
          )}

          {currentScreen === "tour" && currentStep && (
            <TourStage
              step={currentStep}
              stepIndex={tourStepIndex}
              totalSteps={tourSteps.length}
              silenceCaseFile={silenceCaseFile}
              attemptsCaseFile={attemptsCaseFile}
              examiner={examinerState}
              onGoBack={goToPreviousStep}
              onGoForward={goToNextStep}
              onSkip={openDashboard}
            />
          )}

          {currentScreen === "dashboard" && (
            <Dashboard
              markets={markets}
              totals={registryTotals}
              examiner={examinerState}
              selectedMarketId={selectedMarketId}
              selectedCaseFiles={selectedCaseFiles}
              onSelectMarket={setSelectedMarketId}
            />
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="app-footer-inner">
          <div>
            <h3>Forbearance</h3>
            <p className="text-small">
              A public registry of proven inaction, built on the Attestcoin
              Protocol.
            </p>
          </div>
          <p className="text-caption">
            BUIDL CTC 2026 Fall · AI track · CC3 Testnet 102031
          </p>
        </div>
      </footer>
    </div>
  );
}
