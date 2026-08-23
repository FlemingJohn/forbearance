import { PressButton } from "@/components/PressButton/PressButton";
import { useProofVerification } from "@/hooks/useProofVerification";
import { formatCtc } from "@/lib/formatNumber";
import type { VerificationStage } from "@/types/verification";
import "./VerifyPanel.css";

const stages: { id: VerificationStage; label: string }[] = [
  { id: "checkingAttestation", label: "Block attested on Creditcoin" },
  { id: "fetchingProof", label: "Merkle and continuity proofs built" },
  { id: "callingPrecompile", label: "BlockProver precompile called" },
];

const stageOrder: VerificationStage[] = [
  "idle",
  "checkingAttestation",
  "fetchingProof",
  "callingPrecompile",
  "valid",
];

function readStageState(
  stage: VerificationStage,
  currentStage: VerificationStage,
): "pending" | "active" | "done" {
  const currentIndex = stageOrder.indexOf(currentStage);
  const stageIndex = stageOrder.indexOf(stage);

  if (currentStage === "valid" || currentIndex > stageIndex) {
    return "done";
  }

  if (currentIndex === stageIndex) {
    return "active";
  }

  return "pending";
}

interface VerifyPanelProps {
  transactionHash: string;
  blockHeight: number;
}

export function VerifyPanel({
  transactionHash,
  blockHeight,
}: VerifyPanelProps) {
  const { result, verify } = useProofVerification();

  const isRunning =
    result.stage === "checkingAttestation" ||
    result.stage === "fetchingProof" ||
    result.stage === "callingPrecompile";

  const messageTone =
    result.stage === "valid"
      ? "is-valid"
      : result.stage === "failed" || result.stage === "invalid"
        ? "is-failed"
        : "";

  return (
    <div className="verify-panel">
      <div className="verify-panel-head">
        <span className="verify-panel-title">
          Check this yourself, live on chain
        </span>
        <PressButton
          onClick={() => verify(transactionHash, blockHeight)}
          isDisabled={isRunning}
        >
          {isRunning ? "Verifying" : "Verify now"}
        </PressButton>
      </div>

      {result.stage !== "idle" && (
        <div className="verify-panel-steps">
          {stages.map((stage) => {
            const state = readStageState(stage.id, result.stage);

            return (
              <span
                key={stage.id}
                className={`verify-panel-step ${state === "active" ? "is-active" : ""} ${state === "done" ? "is-done" : ""}`}
              >
                <span className="verify-panel-step-mark" aria-hidden="true">
                  {state === "done" ? "✓" : state === "active" ? "›" : "·"}
                </span>
                {stage.label}
              </span>
            );
          })}
        </div>
      )}

      {result.continuityHashCount !== null && (
        <div className="verify-panel-outcome">
          <span>
            evidence <b>{result.evidenceGrade}</b>
          </span>
          <span>
            continuity hashes <b>{result.continuityHashCount}</b>
          </span>
          {result.estimatedCostCtc !== null && (
            <span>
              filing cost <b>{formatCtc(result.estimatedCostCtc, 6)}</b>
            </span>
          )}
        </div>
      )}

      <p className={`verify-panel-message ${messageTone}`}>
        {result.stage === "idle"
          ? "Runs a read only call against the precompile. No wallet, no gas."
          : result.message}
      </p>
    </div>
  );
}
