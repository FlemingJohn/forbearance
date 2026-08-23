import "dotenv/config";
import { collectCandidates } from "../src/agent/collectCandidates";
import { decideFilings } from "../src/agent/nodes/decideFilings";
import { createReadFrontier } from "../src/agent/nodes/readFrontier";
import { createSurveyCandidates } from "../src/agent/nodes/surveyCandidates";
import { createChainClients } from "../src/chain/createProviders";

async function run() {
  const clients = createChainClients();

  const candidates = await collectCandidates(clients, 4);
  console.log("Collected candidates:", candidates.length);

  const readFrontier = createReadFrontier(clients);
  const frontierUpdate = await readFrontier({
    sourceChainKey: clients.sourceChainKey,
    budgetCtc: 1.2,
    spentCtc: 0,
    attestedFrontier: 0,
    candidates,
    survivingCandidates: [],
    assessments: [],
    decisions: [],
    outcomes: [],
    narrative: "",
  });
  console.log("Attested frontier:", frontierUpdate.attestedFrontier);

  const surveyCandidates = createSurveyCandidates(clients);
  const surveyUpdate = await surveyCandidates({
    sourceChainKey: clients.sourceChainKey,
    budgetCtc: 1.2,
    spentCtc: 0,
    attestedFrontier: frontierUpdate.attestedFrontier,
    candidates,
    survivingCandidates: [],
    assessments: [],
    decisions: [],
    outcomes: [],
    narrative: "",
  });

  console.log("Survived survey:", surveyUpdate.survivingCandidates.length);
  for (const candidate of surveyUpdate.survivingCandidates) {
    console.log(
      `  ${candidate.id}  grade ${candidate.evidenceGrade}  hashes ${candidate.continuityHashCount}  cost ${candidate.filingCostCtc.toFixed(6)} CTC`,
    );
  }

  const stubAssessments = surveyUpdate.survivingCandidates.map((candidate, index) => ({
    candidateId: candidate.id,
    probabilityHolds: index === 0 ? 0.9 : 0.3,
    reasoning: "stub",
  }));

  const decisionUpdate = decideFilings({
    sourceChainKey: clients.sourceChainKey,
    budgetCtc: 1.2,
    spentCtc: 0,
    attestedFrontier: frontierUpdate.attestedFrontier,
    candidates,
    survivingCandidates: surveyUpdate.survivingCandidates,
    assessments: stubAssessments,
    decisions: [],
    outcomes: [],
    narrative: "",
  });

  console.log("\nDecisions with stub probabilities:");
  for (const decision of decisionUpdate.decisions) {
    console.log(
      `  ${decision.candidateId}  ${decision.decision.toUpperCase()}  expected ${decision.expectedValueCtc.toFixed(4)} CTC`,
    );
  }
}

run().catch((error) => {
  console.error("Failed:", error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
