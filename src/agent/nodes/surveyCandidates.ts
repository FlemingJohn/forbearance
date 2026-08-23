import type { ChainClients } from "@/chain/createProviders";
import { estimateProofCostCtc } from "@/chain/chainSettings";
import {
  countContinuityHashes,
  isHeightAttested,
  readAttestationBounds,
  readEvidenceGrade,
} from "@/chain/readChainInfo";
import type { ExaminerStateType } from "../examinerState";
import type { IntervalCandidate } from "@/types/examiner";

export function createSurveyCandidates(clients: ChainClients) {
  return async function surveyCandidates(state: ExaminerStateType) {
    const surviving: IntervalCandidate[] = [];

    for (const candidate of state.candidates) {
      const attested = await isHeightAttested(
        clients.chainInfo,
        state.sourceChainKey,
        candidate.closedAtBlock,
      );

      if (!attested) {
        continue;
      }

      const bounds = await readAttestationBounds(
        clients.chainInfo,
        state.sourceChainKey,
        candidate.closedAtBlock,
      );

      const continuityHashCount = countContinuityHashes(bounds);

      surviving.push({
        ...candidate,
        evidenceGrade: readEvidenceGrade(bounds),
        continuityHashCount,
        filingCostCtc: estimateProofCostCtc(continuityHashCount),
      });
    }

    return { survivingCandidates: surviving };
  };
}
