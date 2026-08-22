import { StepIcon } from "@/components/StepIcon/StepIcon";
import { workSteps } from "@/data/howItWorks";
import "./HowItWorks.css";

export function HowItWorks() {
  return (
    <div className="how-it-works">
      {workSteps.map((step) => (
        <article key={step.ordinal} className="how-step">
          <div className="how-step-icon">
            <StepIcon name={step.icon} />
            <span className="how-step-ordinal">{step.ordinal}</span>
          </div>
          <h3 className="how-step-title">{step.title}</h3>
          <p className="how-step-detail">{step.detail}</p>
        </article>
      ))}
    </div>
  );
}
