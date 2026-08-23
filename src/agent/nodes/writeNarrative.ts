import type { AzureChatOpenAI } from "@langchain/openai";
import { narrativeSchema } from "../assessmentSchema";
import type { ExaminerStateType } from "../examinerState";

const systemPrompt = `You write a two sentence account of what an evidence
examiner did this round. Say what it filed, what it spent, and what the outcomes
teach it about where to spend attention next. Be plain and factual. Do not use
marketing language.`;

export function createWriteNarrative(model: AzureChatOpenAI) {
  const narrator = model.withStructuredOutput(narrativeSchema, {
    name: "narrative",
  });

  return async function writeNarrative(state: ExaminerStateType) {
    const filed = state.outcomes.length;
    const verified = state.outcomes.filter(
      (outcome) => outcome.wasVerified,
    ).length;
    const earned = state.outcomes.reduce(
      (total, outcome) => total + outcome.earnedCtc,
      0,
    );

    const failures = state.outcomes
      .filter((outcome) => !outcome.wasVerified)
      .map((outcome) => `${outcome.candidateId}: ${outcome.failureReason}`)
      .join("; ");

    const result = await narrator.invoke([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: [
          `Surveyed ${state.survivingCandidates.length} attested candidates.`,
          `Filed ${filed}, verified ${verified}.`,
          `Spent ${state.spentCtc.toFixed(6)} CTC of a ${state.budgetCtc} CTC budget.`,
          `Earned ${earned} CTC.`,
          failures ? `Failures: ${failures}` : "No failures.",
        ].join(" "),
      },
    ]);

    return { narrative: result.narrative };
  };
}
