import { BrowserProvider, formatEther } from "ethers";
import type { WalletState } from "@/types/wallet";
import { CREDITCOIN_TESTNET_CHAIN_ID } from "./chainSettings";

interface EthereumWindow {
  ethereum?: {
    request: (payload: { method: string; params?: unknown[] }) => Promise<unknown>;
  };
}

const testnetParameters = {
  chainId: `0x${CREDITCOIN_TESTNET_CHAIN_ID.toString(16)}`,
  chainName: "Creditcoin Testnet",
  nativeCurrency: { name: "Creditcoin", symbol: "CTC", decimals: 18 },
  rpcUrls: ["https://rpc.cc3-testnet.creditcoin.network"],
  blockExplorerUrls: ["https://creditcoin-testnet.blockscout.com"],
};

export function findInjectedWallet() {
  const injected = (window as unknown as EthereumWindow).ethereum;
  return injected ?? null;
}

export function readInitialWalletState(): WalletState {
  return {
    status: findInjectedWallet() ? "disconnected" : "unavailable",
    address: null,
    chainId: null,
    balanceCtc: null,
    errorMessage: null,
  };
}

export async function connectWallet(): Promise<WalletState> {
  const injected = findInjectedWallet();

  if (!injected) {
    return {
      status: "unavailable",
      address: null,
      chainId: null,
      balanceCtc: null,
      errorMessage: "No browser wallet found",
    };
  }

  const provider = new BrowserProvider(injected);
  const accounts = (await provider.send("eth_requestAccounts", [])) as string[];
  const address = accounts[0];

  if (!address) {
    return {
      status: "disconnected",
      address: null,
      chainId: null,
      balanceCtc: null,
      errorMessage: "No account was shared",
    };
  }

  const network = await provider.getNetwork();
  const chainId = Number(network.chainId);

  if (chainId !== CREDITCOIN_TESTNET_CHAIN_ID) {
    return {
      status: "wrongNetwork",
      address,
      chainId,
      balanceCtc: null,
      errorMessage: "Switch to Creditcoin Testnet to file evidence",
    };
  }

  const balance = await provider.getBalance(address);

  return {
    status: "connected",
    address,
    chainId,
    balanceCtc: Number(formatEther(balance)).toFixed(2),
    errorMessage: null,
  };
}

export async function switchToTestnet(): Promise<void> {
  const injected = findInjectedWallet();

  if (!injected) {
    return;
  }

  try {
    await injected.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: testnetParameters.chainId }],
    });
  } catch {
    await injected.request({
      method: "wallet_addEthereumChain",
      params: [testnetParameters],
    });
  }
}
