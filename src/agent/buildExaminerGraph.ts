import { END, START, StateGraph } from "@langchain/langgraph";
import type { AzureChatOpenAI } from "@langchain/openai";
import type { ChainClients } from "@/chain/createProviders";
import { ExaminerState, type ExaminerStateType } from "./examinerState";
import { createAssessCandidates } from "./nodes/assessCandidates";
import { decideFilings } from "./nodes/decideFilings";
import { createFileEvidence } from "./nodes/fileEvidence";
import { createReadFrontier } from "./nodes/readFrontier";
import { createSurveyCandidates } from "./nodes/surveyCandidates";
import { createWriteNarrative } from "./nodes/writeNarrative";

function hasFilings(state: ExaminerStateType): "fileEvidence" | "writeNarrative" {
  const willFile = state.decisions.some(
    (decision) => decision.decision === "file",
  );

  return willFile ? "fileEvidence" : "writeNarrative";
}

function hasSurvivors(
  state: ExaminerStateType,
): "assessCandidates" | "writeNarrative" {
  return state.survivingCandidates.length > 0
    ? "assessCandidates"
    : "writeNarrative";
}

export function buildExaminerGraph(
  clients: ChainClients,
  model: AzureChatOpenAI,
) {
  const graph = new StateGraph(ExaminerState)
    .addNode("readFrontier", createReadFrontier(clients))
    .addNode("surveyCandidates", createSurveyCandidates(clients))
    .addNode("assessCandidates", createAssessCandidates(model))
    .addNode("decideFilings", decideFilings)
    .addNode("fileEvidence", createFileEvidence(clients))
    .addNode("writeNarrative", createWriteNarrative(model))
    .addEdge(START, "readFrontier")
    .addEdge("readFrontier", "surveyCandidates")
    .addConditionalEdges("surveyCandidates", hasSurvivors, {
      assessCandidates: "assessCandidates",
      writeNarrative: "writeNarrative",
    })
    .addEdge("assessCandidates", "decideFilings")
    .addConditionalEdges("decideFilings", hasFilings, {
      fileEvidence: "fileEvidence",
      writeNarrative: "writeNarrative",
    })
    .addEdge("fileEvidence", "writeNarrative")
    .addEdge("writeNarrative", END);

  return graph.compile();
}
