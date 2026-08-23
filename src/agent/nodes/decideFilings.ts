import type { ExaminerStateType } from "../examinerState";
import type { FilingDecision } from "@/types/examiner";

const MINIMUM_PROBABILITY = 0.5;

export function decideFilings(state: ExaminerStateType) {
  const assessmentById = new Map(
    state.assessments.map((assessment) => [
      assessment.candidateId,
      assessment.probabilityHolds,
    ]),
  );

  const ranked = state.survivingCandidates
    .map((candidate) => {
      const probability = assessmentById.get(candidate.id) ?? 0;
      const expectedValueCtc =
        probability * candidate.bountyCtc - candidate.filingCostCtc;

      return { candidate, probability, expectedValueCtc };
    })
    .sort((left, right) => right.expectedValueCtc - left.expectedValueCtc);

  let remainingBudget = state.budgetCtc;
  const decisions: FilingDecision[] = [];

  for (const entry of ranked) {
    const isProfitable = entry.expectedValueCtc > 0;
    const isConfident = entry.probability >= MINIMUM_PROBABILITY;
    const fitsBudget = entry.candidate.filingCostCtc <= remainingBudget;

    if (isProfitable && isConfident && fitsBudget) {
      remainingBudget -= entry.candidate.filingCostCtc;
      decisions.push({
        candidateId: entry.candidate.id,
        decision: "file",
        expectedValueCtc: entry.expectedValueCtc,
      });
      continue;
    }

    decisions.push({
      candidateId: entry.candidate.id,
      decision: isProfitable ? "hold" : "drop",
      expectedValueCtc: entry.expectedValueCtc,
    });
  }

  return { decisions };
}
