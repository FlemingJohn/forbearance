const ETHEREUM_EXPLORER = "https://etherscan.io";
const CREDITCOIN_EXPLORER = "https://creditcoin-testnet.blockscout.com";

export function buildEthereumTransactionUrl(transactionHash: string): string {
  return `${ETHEREUM_EXPLORER}/tx/${transactionHash}`;
}

export function buildEthereumBlockUrl(blockHeight: number): string {
  return `${ETHEREUM_EXPLORER}/block/${blockHeight}`;
}

export function buildCreditcoinAddressUrl(address: string): string {
  return `${CREDITCOIN_EXPLORER}/address/${address}`;
}
