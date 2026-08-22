import { PressButton } from "@/components/PressButton/PressButton";
import { Window } from "@/components/Window/Window";
import { CaseFileWindow } from "@/features/caseFile/CaseFileWindow";
import { DocketWindow } from "@/features/docket/DocketWindow";
import { RegistryWindow } from "@/features/registry/RegistryWindow";
import type {
  CaseFile,
  ExaminerState,
  Market,
  RegistryTotals,
} from "@/types";
import "./Dashboard.css";

interface DashboardProps {
  markets: Market[];
  totals: RegistryTotals;
  examiner: ExaminerState;
  selectedMarketId: string | null;
  selectedCaseFiles: CaseFile[];
  onSelectMarket: (marketId: string) => void;
  onStartTour: () => void;
}

export function Dashboard({
  markets,
  totals,
  examiner,
  selectedMarketId,
  selectedCaseFiles,
  onSelectMarket,
  onStartTour,
}: DashboardProps) {
  const hasCaseFiles = selectedCaseFiles.length > 0;

  return (
    <div className="dashboard">
      <div className="dashboard-invite">
        <div className="dashboard-invite-text">
          <span className="dashboard-invite-title">
            First time here? Take the three minute tour.
          </span>
          <span className="dashboard-invite-detail">
            It walks through one real Ethereum position that sat unliquidated for
            48 minutes, and shows how the machine decides what is worth proving.
          </span>
        </div>
        <PressButton onClick={onStartTour}>▶ Start the tour</PressButton>
      </div>

      <div className="dashboard-column">
        <RegistryWindow
          markets={markets}
          totals={totals}
          selectedMarketId={selectedMarketId}
          onSelectMarket={onSelectMarket}
        />
        <DocketWindow examiner={examiner} />
      </div>

      <div className="dashboard-column">
        {hasCaseFiles ? (
          selectedCaseFiles.map((caseFile) => (
            <CaseFileWindow key={caseFile.id} caseFile={caseFile} />
          ))
        ) : (
          <Window fileName="no-case-files.file">
            <div className="dashboard-empty">
              <h3>No case files for this market</h3>
              <p className="text-small">
                Liquidators arrived fast enough here that no interval crossed the
                filing threshold. Choose Morpho · rsETH or Morpho · weETH to see
                a filed case.
              </p>
            </div>
          </Window>
        )}
      </div>
    </div>
  );
}
