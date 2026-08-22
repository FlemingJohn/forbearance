import { PressButton } from "@/components/PressButton/PressButton";
import { StepProgress } from "@/components/StepProgress/StepProgress";
import type { TourStep } from "@/types";
import "./TourRail.css";

interface TourRailProps {
  step: TourStep;
  stepIndex: number;
  totalSteps: number;
  onGoBack: () => void;
  onGoForward: () => void;
  onSkip: () => void;
}

export function TourRail({
  step,
  stepIndex,
  totalSteps,
  onGoBack,
  onGoForward,
  onSkip,
}: TourRailProps) {
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === totalSteps - 1;

  return (
    <aside className="tour-rail">
      <StepProgress currentStep={stepIndex} totalSteps={totalSteps} />
      <h2 className="tour-rail-title">{step.title}</h2>
      <p className="tour-rail-summary">{step.summary}</p>
      <p className="tour-rail-detail">{step.detail}</p>

      <div className="tour-rail-controls">
        <PressButton onClick={onGoBack} isDisabled={isFirstStep} variant="quiet">
          ‹ Back
        </PressButton>
        <PressButton onClick={onGoForward} variant="primary">
          {isLastStep ? "Open registry" : "Next ›"}
        </PressButton>
      </div>

      <div className="tour-rail-skip">
        <PressButton onClick={onSkip} variant="quiet">
          Skip to the registry
        </PressButton>
      </div>
    </aside>
  );
}
