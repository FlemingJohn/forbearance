import { useCallback, useState } from "react";
import { BrowserProvider } from "ethers";
import { createChainClients } from "@/chain/createProviders";
import { readExposure } from "@/chain/readExposure";
import { describeRating } from "@/lib/describeRating";
import { markets } from "@/data/markets";
import type { ExposureReport, WalletState } from "@/types/exposure";

interface InjectedProvider {
  request: (payload: { method: string; params?: unknown[] }) => Promise<unknown>;
}

function findInjectedWallet(): InjectedProvider | null {
  const injected = (window as unknown as { ethereum?: InjectedProvider })
    .ethereum;

  return injected ?? null;
}

const emptyReport: ExposureReport = {
  isLoaded: false,
  positions: [],
  unsafeCount: 0,
};

export function useExposure() {
  const [wallet, setWallet] = useState<WalletState>({
    status: findInjectedWallet() ? "disconnected" : "unavailable",
    address: null,
    errorMessage: null,
  });

  const [report, setReport] = useState<ExposureReport>(emptyReport);

  const connect = useCallback(async () => {
    const injected = findInjectedWallet();

    if (!injected) {
      setWallet({
        status: "unavailable",
        address: null,
        errorMessage: "No browser wallet found",
      });
      return;
    }

    setWallet((current) => ({ ...current, status: "connecting" }));

    try {
      const provider = new BrowserProvider(injected);
      const accounts = (await provider.send(
        "eth_requestAccounts",
        [],
      )) as string[];
      const address = accounts[0];

      if (!address) {
        setWallet({
          status: "disconnected",
          address: null,
          errorMessage: "No account was shared",
        });
        return;
      }

      setWallet({ status: "connected", address, errorMessage: null });

      const clients = createChainClients();
      const positions = await readExposure(clients.ethereumProvider, address);

      const unsafeCount = positions.filter((position) => {
        if (!position.hasPosition) {
          return false;
        }

        const market = markets.find(
          (candidate) => candidate.id === position.marketId,
        );

        return market ? describeRating(market).band === "unsafe" : false;
      }).length;

      setReport({ isLoaded: true, positions, unsafeCount });
    } catch (error) {
      setWallet({
        status: "failed",
        address: null,
        errorMessage:
          error instanceof Error ? error.message : "Could not connect",
      });
    }
  }, []);

  return { wallet, report, connect };
}
