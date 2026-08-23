import { Contract, JsonRpcProvider } from "ethers";
import { blockProverAbi } from "./blockProverAbi";
import { chainInfoAbi } from "./chainInfoAbi";
import {
  BLOCK_PROVER_ADDRESS,
  CHAIN_INFO_ADDRESS,
  readChainSettings,
} from "./chainSettings";
import type { BlockProverContract, ChainInfoContract } from "./contractTypes";

export interface ChainClients {
  creditcoinProvider: JsonRpcProvider;
  ethereumProvider: JsonRpcProvider;
  blockProver: BlockProverContract;
  chainInfo: ChainInfoContract;
  sourceChainKey: number;
  proofBuilderUrl: string;
}

export function createChainClients(): ChainClients {
  const settings = readChainSettings();
  const creditcoinProvider = new JsonRpcProvider(settings.creditcoinRpcUrl);
  const ethereumProvider = new JsonRpcProvider(settings.ethereumRpcUrl);

  const blockProver = new Contract(
    BLOCK_PROVER_ADDRESS,
    blockProverAbi,
    creditcoinProvider,
  ) as unknown as BlockProverContract;

  const chainInfo = new Contract(
    CHAIN_INFO_ADDRESS,
    chainInfoAbi,
    creditcoinProvider,
  ) as unknown as ChainInfoContract;

  return {
    creditcoinProvider,
    ethereumProvider,
    blockProver,
    chainInfo,
    sourceChainKey: settings.sourceChainKey,
    proofBuilderUrl: settings.proofBuilderUrl,
  };
}
