import type { AzureChatOpenAI } from "@langchain/openai";
import { assessmentSchema } from "../assessmentSchema";
import type { ExaminerStateType } from "../examinerState";
import type { IntervalCandidate } from "@/types/examiner";

const systemPrompt = `You assess evidence for a registry that records when
liquidators failed to act on Ethereum lending positions.

An interval is worth filing when the record it produces will hold up. Judge each
candidate on:

- Length of silence relative to the collateral seized. A long wait on a large
  seizure is strong evidence that liquidators were absent while value sat exposed.
- Attempt count. Zero attempts points to a broken incentive. Several reverted
  attempts points to a broken mechanism. Both are fileable, mixed or ambiguous
  patterns are weaker.
- Respondent count. Many eligible liquidators declining is stronger than few.
- Evidence grade. Attestation grade is precise. Checkpoint grade means the fine
  detail was pruned and the record is weaker.

Return a probability between 0 and 1 for every candidate you are given. Be
decisive. Weak evidence should score below 0.4.`;

function describeCandidate(candidate: IntervalCandidate): string {
  return [
    `id: ${candidate.id}`,
    `market: ${candidate.marketName}`,
    `silence: ${candidate.silenceSeconds}s`,
    `attempts: ${candidate.attemptCount}`,
    `seized: ${candidate.seizedAmount.toFixed(4)} ${candidate.seizedSymbol}`,
    `respondents: ${candidate.respondentCount}`,
    `evidence grade: ${candidate.evidenceGrade}`,
    `continuity hashes: ${candidate.continuityHashCount}`,
    `filing cost: ${candidate.filingCostCtc.toFixed(6)} CTC`,
    `bounty: ${candidate.bountyCtc} CTC`,
  ].join(", ");
}

export function createAssessCandidates(model: AzureChatOpenAI) {
  const assessor = model.withStructuredOutput(assessmentSchema, {
    name: "assessments",
  });

  return async function assessCandidates(state: ExaminerStateType) {
    if (state.survivingCandidates.length === 0) {
      return { assessments: [] };
    }

    const candidateLines = state.survivingCandidates
      .map(describeCandidate)
      .join("\n");

    const result = await assessor.invoke([
      { role: "system", content: systemPrompt },
      { role: "user", content: `Candidates:\n${candidateLines}` },
    ]);

    return { assessments: result.assessments };
  };
}
