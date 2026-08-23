import { Annotation } from "@langchain/langgraph";
import type {
  CandidateAssessment,
  FilingDecision,
  FilingOutcome,
  IntervalCandidate,
} from "@/types/examiner";

function replaceList<Item>() {
  return {
    reducer: (_previous: Item[], next: Item[]) => next,
    default: (): Item[] => [],
  };
}

export const ExaminerState = Annotation.Root({
  sourceChainKey: Annotation<number>({
    reducer: (_previous, next) => next,
    default: () => 3,
  }),
  budgetCtc: Annotation<number>({
    reducer: (_previous, next) => next,
    default: () => 1.2,
  }),
  spentCtc: Annotation<number>({
    reducer: (previous, next) => previous + next,
    default: () => 0,
  }),
  attestedFrontier: Annotation<number>({
    reducer: (_previous, next) => next,
    default: () => 0,
  }),
  candidates: Annotation<IntervalCandidate[]>(replaceList()),
  survivingCandidates: Annotation<IntervalCandidate[]>(replaceList()),
  assessments: Annotation<CandidateAssessment[]>(replaceList()),
  decisions: Annotation<FilingDecision[]>(replaceList()),
  outcomes: Annotation<FilingOutcome[]>(replaceList()),
  narrative: Annotation<string>({
    reducer: (_previous, next) => next,
    default: () => "",
  }),
});

export type ExaminerStateType = typeof ExaminerState.State;
