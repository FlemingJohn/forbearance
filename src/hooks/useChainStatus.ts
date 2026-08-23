import { useEffect, useRef, useState } from "react";
import { createChainClients } from "@/chain/createProviders";
import { readAttestedFrontier } from "@/chain/readChainInfo";
import type { ChainStatus } from "@/types";

const POLL_INTERVAL_MS = 15000;

const startingStatus: ChainStatus = {
  networkName: "Ethereum mainnet",
  chainKey: 3,
  attestedFrontier: 0,
  secondsSinceFrontier: 0,
  isLive: false,
};

export function useChainStatus(): ChainStatus {
  const [status, setStatus] = useState<ChainStatus>(startingStatus);
  const lastChangeRef = useRef(Date.now());

  useEffect(() => {
    const clients = createChainClients();
    let isMounted = true;

    async function pollFrontier() {
      try {
        const frontier = await readAttestedFrontier(
          clients.chainInfo,
          clients.sourceChainKey,
        );

        if (!isMounted) {
          return;
        }

        setStatus((current) => {
          if (frontier.height !== current.attestedFrontier) {
            lastChangeRef.current = Date.now();
          }

          return {
            networkName: "Ethereum mainnet",
            chainKey: clients.sourceChainKey,
            attestedFrontier: frontier.height,
            secondsSinceFrontier: 0,
            isLive: true,
          };
        });
      } catch {
        if (isMounted) {
          setStatus((current) => ({ ...current, isLive: false }));
        }
      }
    }

    pollFrontier();
    const pollTimer = setInterval(pollFrontier, POLL_INTERVAL_MS);

    const tickTimer = setInterval(() => {
      if (!isMounted) {
        return;
      }

      setStatus((current) => ({
        ...current,
        secondsSinceFrontier: Math.round(
          (Date.now() - lastChangeRef.current) / 1000,
        ),
      }));
    }, 1000);

    return () => {
      isMounted = false;
      clearInterval(pollTimer);
      clearInterval(tickTimer);
    };
  }, []);

  return status;
}
