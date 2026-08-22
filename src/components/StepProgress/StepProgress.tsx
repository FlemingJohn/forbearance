import "./StepProgress.css";

interface StepProgressProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index);

  return (
    <div className="step-progress">
      <span className="step-progress-label">
        Step {currentStep + 1} of {totalSteps}
      </span>
      <div className="step-progress-bar" aria-hidden="true">
        {steps.map((index) => (
          <i key={index} className={index <= currentStep ? "is-reached" : ""} />
        ))}
      </div>
    </div>
  );
}
