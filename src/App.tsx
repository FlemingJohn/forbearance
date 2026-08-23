import { useMemo, useState } from "react";
import { SidePanel } from "@/components/SidePanel/SidePanel";
import { TopBar } from "@/components/TopBar/TopBar";
import {
  findCaseFilesByMarket,
  findFirstCaseFileByFinding,
} from "@/data/caseFiles";
import { examinerState } from "@/data/examiner";
import { markets, registryTotals } from "@/data/markets";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { LandingPage } from "@/features/landing/LandingPage";
import { useChainStatus } from "@/hooks/useChainStatus";
import { useExposure } from "@/hooks/useExposure";
import "./App.css";

const DEFAULT_MARKET_ID = markets[0]?.id ?? "";

export function App() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [isPanelVisible, setIsPanelVisible] = useState(true);
  const [selectedMarketId, setSelectedMarketId] =
    useState<string>(DEFAULT_MARKET_ID);
  const chainStatus = useChainStatus();
  const { wallet, report: exposure, connect } = useExposure();

  const silenceCaseFile = useMemo(
    () => findFirstCaseFileByFinding("incentive"),
    [],
  );
  const attemptsCaseFile = useMemo(
    () => findFirstCaseFileByFinding("mechanism") ?? silenceCaseFile,
    [silenceCaseFile],
  );

  const selectedMarket = useMemo(
    () => markets.find((market) => market.id === selectedMarketId),
    [selectedMarketId],
  );

  const selectedCaseFiles = useMemo(
    () => findCaseFilesByMarket(selectedMarketId),
    [selectedMarketId],
  );

  if (!isDashboardOpen && silenceCaseFile && attemptsCaseFile) {
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

  return (
    <div className="app">
      <SidePanel
        markets={markets}
        examiner={examinerState}
        selectedMarketId={selectedMarketId}
        wallet={wallet}
        exposure={exposure}
        onConnectWallet={connect}
        isVisible={isPanelVisible}
        onSelectMarket={setSelectedMarketId}
        onOpenLanding={() => setIsDashboardOpen(false)}
        onHide={() => setIsPanelVisible(false)}
      />

      <div className={`app-body ${isPanelVisible ? "has-panel" : ""}`}>
        <TopBar
          status={chainStatus}
          isPanelVisible={isPanelVisible}
          onTogglePanel={() => setIsPanelVisible((visible) => !visible)}
        />

        <main className="app-content">
          <Dashboard
            market={selectedMarket}
            caseFiles={selectedCaseFiles}
            examiner={examinerState}
            exposure={exposure}
          />
        </main>
      </div>
    </div>
  );
}
