import { CaseFileWindow } from "@/features/caseFile/CaseFileWindow";
import { DocketWindow } from "@/features/docket/DocketWindow";
import { AssumptionPanel } from "./AssumptionPanel";
import { TourRail } from "./TourRail";
import type { CaseFile, ExaminerState, TourPanel, TourStep } from "@/types";
import "./TourStage.css";

interface TourStageProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  silenceCaseFile: CaseFile;
  attemptsCaseFile: CaseFile;
  examiner: ExaminerState;
  onGoBack: () => void;
  onGoForward: () => void;
  onSkip: () => void;
}

function renderPanel(
  panel: TourPanel,
  silenceCaseFile: CaseFile,
  attemptsCaseFile: CaseFile,
  examiner: ExaminerState,
) {
  if (panel === "assumption") {
    return <AssumptionPanel />;
  }

  if (panel === "silence") {
    return <CaseFileWindow caseFile={silenceCaseFile} />;
  }

  if (panel === "attempts") {
    return (
      <>
        <CaseFileWindow caseFile={attemptsCaseFile} />
        <CaseFileWindow caseFile={silenceCaseFile} />
      </>
    );
  }

  return <DocketWindow examiner={examiner} />;
}

export function TourStage({
  step,
  stepIndex,
  totalSteps,
  silenceCaseFile,
  attemptsCaseFile,
  examiner,
  onGoBack,
  onGoForward,
  onSkip,
}: TourStageProps) {
  return (
    <div className="tour-stage">
      <TourRail
        step={step}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
        onGoBack={onGoBack}
        onGoForward={onGoForward}
        onSkip={onSkip}
      />
      <div className="tour-stage-panels">
        {renderPanel(step.panel, silenceCaseFile, attemptsCaseFile, examiner)}
      </div>
    </div>
  );
}
