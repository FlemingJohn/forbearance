import { formatBlockHeight } from "@/lib/formatNumber";
import type { ChainStatus } from "@/types";
import "./HonestyStrip.css";

interface HonestyStripProps {
  status: ChainStatus;
}

export function HonestyStrip({ status }: HonestyStripProps) {
  return (
    <aside className="honesty-strip">
      <p className="honesty-strip-headline">
        <span className="honesty-strip-pip" aria-hidden="true" />
        {status.isLive ? "LIVE" : "CACHED"} · {status.networkName} · chainKey{" "}
        {status.chainKey} · frontier {formatBlockHeight(status.attestedFrontier)}{" "}
        · {status.secondsSinceFrontier}s ago
      </p>
      <ul className="honesty-strip-notes">
        <li>Case files are real mainnet events, proven on CC3 testnet.</li>
        <li>Agent balances are testnet CTC.</li>
        <li>Nothing on this page needs a wallet or a login.</li>
      </ul>
    </aside>
  );
}
