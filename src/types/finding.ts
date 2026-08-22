export type Finding = "healthy" | "thinning" | "incentive" | "mechanism";

export type EvidenceGrade = "attestation" | "checkpoint";

export interface FindingDescription {
  label: string;
  plainLanguage: string;
  isFailure: boolean;
}
