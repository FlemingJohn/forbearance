import type { ChainClients } from "@/chain/createProviders";
import { combineProofsIntoBatch, fetchTransactionProof } from "@/chain/fetchProof";
import { verifyBatch } from "@/chain/verifyProof";
import type { ExaminerStateType } from "../examinerState";
import type { FilingOutcome, IntervalCandidate } from "@/types/examiner";

async function proveCandidate(
  clients: ChainClients,
  chainKey: number,
  candidate: IntervalCandidate,
): Promise<FilingOutcome> {
  try {
    const proofs = await Promise.all(
      candidate.transactionHashes.map((transactionHash) =>
        fetchTransactionProof(clients.proofBuilderUrl, chainKey, transactionHash),
      ),
    );

    const batch = combineProofsIntoBatch(proofs);
    const wasVerified = await verifyBatch(clients.blockProver, batch);

    return {
      candidateId: candidate.id,
      wasVerified,
      spentCtc: candidate.filingCostCtc,
      earnedCtc: wasVerified ? candidate.bountyCtc : 0,
      failureReason: wasVerified ? null : "The precompile rejected the batch",
    };
  } catch (error) {
    return {
      candidateId: candidate.id,
      wasVerified: false,
      spentCtc: candidate.filingCostCtc,
      earnedCtc: 0,
      failureReason: error instanceof Error ? error.message : "Unknown failure",
    };
  }
}

export function createFileEvidence(clients: ChainClients) {
  return async function fileEvidence(state: ExaminerStateType) {
    const filingIds = new Set(
      state.decisions
        .filter((decision) => decision.decision === "file")
        .map((decision) => decision.candidateId),
    );

    const filings = state.survivingCandidates.filter((candidate) =>
      filingIds.has(candidate.id),
    );

    const outcomes: FilingOutcome[] = [];

    for (const candidate of filings) {
      outcomes.push(
        await proveCandidate(clients, state.sourceChainKey, candidate),
      );
    }

    const spentCtc = outcomes.reduce(
      (total, outcome) => total + outcome.spentCtc,
      0,
    );

    return { outcomes, spentCtc };
  };
}
