import { buildEthereumTransactionUrl } from "@/lib/buildExplorerUrl";
import "./ExplorerLink.css";

interface ExplorerLinkProps {
  transactionHash: string;
  children?: string;
}

export function ExplorerLink({
  transactionHash,
  children = "view on Etherscan",
}: ExplorerLinkProps) {
  return (
    <a
      className="explorer-link"
      href={buildEthereumTransactionUrl(transactionHash)}
      target="_blank"
      rel="noreferrer"
    >
      {children} ↗
    </a>
  );
}
