export type VerificationStage =
  | "idle"
  | "checkingAttestation"
  | "fetchingProof"
  | "callingPrecompile"
  | "valid"
  | "invalid"
  | "failed";

export interface VerificationResult {
  stage: VerificationStage;
  message: string;
  continuityHashCount: number | null;
  evidenceGrade: "attestation" | "checkpoint" | null;
  estimatedCostCtc: number | null;
}
