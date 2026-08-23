import provenCaseFiles from "./provenCaseFiles.json";
import type { CaseFile } from "@/types";

export const caseFiles = provenCaseFiles as CaseFile[];

export function findCaseFileById(caseFileId: string): CaseFile | undefined {
  return caseFiles.find((caseFile) => caseFile.id === caseFileId);
}

export function findCaseFilesByMarket(marketId: string): CaseFile[] {
  return caseFiles.filter((caseFile) => caseFile.marketId === marketId);
}

export function findFirstCaseFileByFinding(
  finding: CaseFile["finding"],
): CaseFile | undefined {
  return caseFiles.find((caseFile) => caseFile.finding === finding);
}
