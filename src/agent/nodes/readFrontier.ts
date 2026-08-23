import type { ChainClients } from "@/chain/createProviders";
import { readAttestedFrontier } from "@/chain/readChainInfo";
import type { ExaminerStateType } from "../examinerState";

export function createReadFrontier(clients: ChainClients) {
  return async function readFrontier(state: ExaminerStateType) {
    const frontier = await readAttestedFrontier(
      clients.chainInfo,
      state.sourceChainKey,
    );

    return { attestedFrontier: frontier.height };
  };
}
