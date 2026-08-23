import "dotenv/config";
import { buildExaminerGraph } from "../src/agent/buildExaminerGraph";
import { collectCandidates } from "../src/agent/collectCandidates";
import { createExaminerModel, hasModelSettings } from "../src/agent/createModel";
import { createChainClients } from "../src/chain/createProviders";

const CANDIDATE_COUNT = 4;
const BUDGET_CTC = 1.2;

async function run() {
  if (!hasModelSettings()) {
    console.error(
      "Azure OpenAI is not configured. Set AZURE_OPENAI_API_KEY, AZURE_OPENAI_API_INSTANCE_NAME and AZURE_OPENAI_API_DEPLOYMENT_NAME in .env",
    );
    process.exitCode = 1;
    return;
  }

  const clients = createChainClients();
  const model = createExaminerModel();
  const examiner = buildExaminerGraph(clients, model);

  console.log("Collecting candidates from the source chain");
  const candidates = await collectCandidates(clients, CANDIDATE_COUNT);
  console.log(`Collected ${candidates.length} candidates\n`);

  const result = await examiner.invoke({
    sourceChainKey: clients.sourceChainKey,
    budgetCtc: BUDGET_CTC,
    candidates,
  });

  console.log("Attested frontier:", result.attestedFrontier);
  console.log("Survived the survey:", result.survivingCandidates.length);

  console.log("\nAssessments");
  for (const assessment of result.assessments) {
    console.log(
      `  ${assessment.candidateId}  holds ${assessment.probabilityHolds.toFixed(2)}  ${assessment.reasoning}`,
    );
  }

  console.log("\nDecisions");
  for (const decision of result.decisions) {
    console.log(
      `  ${decision.candidateId}  ${decision.decision.toUpperCase()}  expected ${decision.expectedValueCtc.toFixed(4)} CTC`,
    );
  }

  console.log("\nOutcomes");
  for (const outcome of result.outcomes) {
    console.log(
      `  ${outcome.candidateId}  ${outcome.wasVerified ? "VERIFIED" : "REJECTED"}  spent ${outcome.spentCtc.toFixed(6)} CTC  ${outcome.failureReason ?? ""}`,
    );
  }

  console.log(
    `\nSpent ${result.spentCtc.toFixed(6)} CTC of ${result.budgetCtc} CTC`,
  );
  console.log("\nNarrative:", result.narrative);
}

run().catch((error) => {
  console.error(
    "Examiner failed:",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
});
