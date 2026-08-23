import { useCallback, useState } from "react";
import { estimateProofCostCtc } from "@/chain/chainSettings";
import { createChainClients } from "@/chain/createProviders";
import { fetchTransactionProof } from "@/chain/fetchProof";
import {
  countContinuityHashes,
  isHeightAttested,
  readAttestationBounds,
  readEvidenceGrade,
} from "@/chain/readChainInfo";
import { verifyTransaction } from "@/chain/verifyProof";
import type { VerificationResult } from "@/types/verification";

const idleResult: VerificationResult = {
  stage: "idle",
  message: "Not checked yet",
  continuityHashCount: null,
  evidenceGrade: null,
  estimatedCostCtc: null,
};

export function useProofVerification() {
  const [result, setResult] = useState<VerificationResult>(idleResult);

  const verify = useCallback(
    async (transactionHash: string, blockHeight: number) => {
      const clients = createChainClients();

      setResult({
        ...idleResult,
        stage: "checkingAttestation",
        message: "Checking the block is attested on Creditcoin",
      });

      try {
        const attested = await isHeightAttested(
          clients.chainInfo,
          clients.sourceChainKey,
          blockHeight,
        );

        if (!attested) {
          setResult({
            ...idleResult,
            stage: "failed",
            message: "That block is not attested yet",
          });
          return;
        }

        const bounds = await readAttestationBounds(
          clients.chainInfo,
          clients.sourceChainKey,
          blockHeight,
        );

        const continuityHashCount = countContinuityHashes(bounds);
        const evidenceGrade = readEvidenceGrade(bounds);
        const estimatedCostCtc = estimateProofCostCtc(continuityHashCount);

        setResult({
          stage: "fetchingProof",
          message: "Fetching the Merkle and continuity proofs",
          continuityHashCount,
          evidenceGrade,
          estimatedCostCtc,
        });

        const proof = await fetchTransactionProof(
          clients.proofBuilderUrl,
          clients.sourceChainKey,
          transactionHash,
        );

        setResult((current) => ({
          ...current,
          stage: "callingPrecompile",
          message: "Calling the BlockProver precompile",
        }));

        const isValid = await verifyTransaction(clients.blockProver, proof);

        setResult((current) => ({
          ...current,
          stage: isValid ? "valid" : "invalid",
          message: isValid
            ? "Verified on Creditcoin"
            : "The precompile rejected this proof",
        }));
      } catch (error) {
        setResult({
          ...idleResult,
          stage: "failed",
          message:
            error instanceof Error ? error.message : "Verification failed",
        });
      }
    },
    [],
  );

  return { result, verify };
}
