import { z } from "zod";

export const assessmentSchema = z
  .object({
    assessments: z.array(
      z.object({
        candidateId: z
          .string()
          .describe("The id of the candidate being assessed"),
        probabilityHolds: z
          .number()
          .min(0)
          .max(1)
          .describe(
            "Probability between 0 and 1 that this interval survives as a filed case",
          ),
        reasoning: z
          .string()
          .describe("One sentence explaining the probability"),
      }),
    ),
  })
  .describe("Assessment of every candidate interval");

export type AssessmentResult = z.infer<typeof assessmentSchema>;

export const narrativeSchema = z
  .object({
    narrative: z
      .string()
      .describe(
        "Two sentences describing what the examiner did this round and what it learned",
      ),
  })
  .describe("A short account of the round");

export type NarrativeResult = z.infer<typeof narrativeSchema>;
