import { useMemo, useState } from "react";
import { HonestyStrip } from "@/components/HonestyStrip/HonestyStrip";
import { SidePanel } from "@/components/SidePanel/SidePanel";
import { TopBar } from "@/components/TopBar/TopBar";
import { caseFiles, findCaseFilesByMarket } from "@/data/caseFiles";
import { chainStatus } from "@/data/chainStatus";
import { examinerState } from "@/data/examiner";
import { markets, registryTotals } from "@/data/markets";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { LandingPage } from "@/features/landing/LandingPage";
import { formatBlockHeight } from "@/lib/formatNumber";
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
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [selectedMarketId, setSelectedMarketId] =
    useState<string>(DEFAULT_MARKET_ID);

  const silenceCaseFile = useMemo(() => requireCaseFile("case-8f2a"), []);
  const attemptsCaseFile = useMemo(() => requireCaseFile("case-71bd"), []);

  const selectedMarket = useMemo(
    () => markets.find((market) => market.id === selectedMarketId),
    [selectedMarketId],
  );

  const selectedCaseFiles = useMemo(
    () => findCaseFilesByMarket(selectedMarketId),
    [selectedMarketId],
  );

  if (!isDashboardOpen) {
    return (
      <LandingPage
        silenceCaseFile={silenceCaseFile}
        attemptsCaseFile={attemptsCaseFile}
        totals={registryTotals}
        status={chainStatus}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />
    );
  }

  const selectedName = selectedMarket
    ? `${selectedMarket.protocol} · ${selectedMarket.asset}`
    : "All markets";

  return (
    <div className="app">
      <SidePanel
        status={chainStatus}
        markets={markets}
        totals={registryTotals}
        selectedMarketId={selectedMarketId}
        isVisible={isPanelVisible}
        onSelectMarket={setSelectedMarketId}
        onOpenLanding={() => setIsDashboardOpen(false)}
        onHide={() => setIsPanelVisible(false)}
      />

      <div className={`app-body ${isPanelVisible ? "has-panel" : ""}`}>
        <TopBar
          title={selectedName}
          meta={`${chainStatus.networkName} · frontier ${formatBlockHeight(chainStatus.attestedFrontier)}`}
          isPanelVisible={isPanelVisible}
          onTogglePanel={() => setIsPanelVisible((visible) => !visible)}
        />

        <main className="app-content">
          <HonestyStrip status={chainStatus} />

          <Dashboard
            markets={markets}
            totals={registryTotals}
            examiner={examinerState}
            selectedMarket={selectedMarket}
            selectedCaseFiles={selectedCaseFiles}
            onSelectMarket={setSelectedMarketId}
          />
        </main>

        <footer className="app-footer">
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
        </footer>
      </div>
    </div>
  );
}
