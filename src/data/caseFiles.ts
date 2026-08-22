import type { CaseFile } from "@/types";

export const caseFiles: CaseFile[] = [
  {
    id: "case-8f2a",
    reference: "0x8f2a…c41d",
    marketId: "morpho-rseth",
    marketName: "Morpho · rsETH",
    finding: "incentive",
    openedAtBlock: 21500000,
    closedAtBlock: 21500240,
    openedAtClock: "14:02:11",
    closedAtClock: "14:50:23",
    silenceSeconds: 2892,
    attemptCount: 0,
    rewardIgnoredUsd: 18400,
    respondentCount: 142,
    evidenceGrade: "attestation",
    filedBy: "Examiner-01",
    exhibits: [
      {
        id: "exhibit-8f2a-a",
        role: "open",
        blockHeight: 21500000,
        transactionIndex: 41,
        transactionHash:
          "0x6fe777442b70a5511f3c443176ae860e50445bd93b663711717996a70c5022ab",
        eventName: "AnswerUpdated",
        succeeded: true,
        sealed: true,
      },
      {
        id: "exhibit-8f2a-b",
        role: "close",
        blockHeight: 21500240,
        transactionIndex: 12,
        transactionHash:
          "0x2c1d9f4a83be5107c6f0a44e2b91d3705a8ff6ce41b0d29e7a3c58146bb90d17",
        eventName: "LiquidationCall",
        succeeded: true,
        sealed: true,
      },
    ],
  },
  {
    id: "case-71bd",
    reference: "0x71bd…9e04",
    marketId: "morpho-weeth",
    marketName: "Morpho · weETH",
    finding: "mechanism",
    openedAtBlock: 21499110,
    closedAtBlock: 21499156,
    openedAtClock: "11:18:04",
    closedAtClock: "11:27:16",
    silenceSeconds: 552,
    attemptCount: 7,
    rewardIgnoredUsd: 0,
    respondentCount: 96,
    evidenceGrade: "attestation",
    filedBy: "Examiner-01",
    exhibits: [
      {
        id: "exhibit-71bd-a",
        role: "open",
        blockHeight: 21499110,
        transactionIndex: 18,
        transactionHash:
          "0x9a4b71e0c2d5384f6ba0917e5c3d8042ff17ab6e903c4152d8be7710a4c3e522",
        eventName: "AnswerUpdated",
        succeeded: true,
        sealed: true,
      },
      {
        id: "exhibit-71bd-b",
        role: "attempt",
        blockHeight: 21499118,
        transactionIndex: 7,
        transactionHash:
          "0x4d0e88b1f37a2c5490e6ad1b7cf25390ba4471e6d8039fc7a215b0e6c491d833",
        eventName: "LiquidationCall",
        succeeded: false,
        sealed: true,
      },
      {
        id: "exhibit-71bd-c",
        role: "attempt",
        blockHeight: 21499127,
        transactionIndex: 22,
        transactionHash:
          "0x7b31c0da95f4e2681ac53b90d7f4128ee60a3d51c9b8470fa2d6e1358c07b944",
        eventName: "LiquidationCall",
        succeeded: false,
        sealed: true,
      },
      {
        id: "exhibit-71bd-d",
        role: "close",
        blockHeight: 21499156,
        transactionIndex: 5,
        transactionHash:
          "0x1f8a44c7e0b93d215fa6c8017be34d90a527ff1c6de8493b02a7c5d1e4409b76",
        eventName: "LiquidationCall",
        succeeded: true,
        sealed: true,
      },
    ],
  },
];

export function findCaseFileById(caseFileId: string): CaseFile | undefined {
  return caseFiles.find((caseFile) => caseFile.id === caseFileId);
}

export function findCaseFilesByMarket(marketId: string): CaseFile[] {
  return caseFiles.filter((caseFile) => caseFile.marketId === marketId);
}
