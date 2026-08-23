import { useMemo, useState } from "react";
import { SidePanel } from "@/components/SidePanel/SidePanel";
import { TopBar } from "@/components/TopBar/TopBar";
import {
  connectWallet,
  readInitialWalletState,
  switchToTestnet,
} from "@/chain/connectWallet";
import { caseFiles, findCaseFilesByMarket } from "@/data/caseFiles";
import { chainStatus } from "@/data/chainStatus";
import { examinerState } from "@/data/examiner";
import { markets, registryTotals } from "@/data/markets";
import { Dashboard } from "@/features/dashboard/Dashboard";
import { LandingPage } from "@/features/landing/LandingPage";
import type { WalletState } from "@/types/wallet";
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
  const [wallet, setWallet] = useState<WalletState>(readInitialWalletState);

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

  async function requestWalletConnection() {
    setWallet((current) => ({ ...current, status: "connecting" }));
    setWallet(await connectWallet());
  }

  async function requestNetworkSwitch() {
    await switchToTestnet();
    setWallet(await connectWallet());
  }

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

  return (
    <div className="app">
      <SidePanel
        markets={markets}
        examiner={examinerState}
        selectedMarketId={selectedMarketId}
        isVisible={isPanelVisible}
        onSelectMarket={setSelectedMarketId}
        onOpenLanding={() => setIsDashboardOpen(false)}
        onHide={() => setIsPanelVisible(false)}
      />

      <div className={`app-body ${isPanelVisible ? "has-panel" : ""}`}>
        <TopBar
          status={chainStatus}
          wallet={wallet}
          isPanelVisible={isPanelVisible}
          onTogglePanel={() => setIsPanelVisible((visible) => !visible)}
          onConnectWallet={requestWalletConnection}
          onSwitchNetwork={requestNetworkSwitch}
        />

        <main className="app-content">
          <Dashboard
            market={selectedMarket}
            caseFiles={selectedCaseFiles}
            examiner={examinerState}
            wallet={wallet}
            onFileEvidence={requestWalletConnection}
          />
        </main>
      </div>
    </div>
  );
}
