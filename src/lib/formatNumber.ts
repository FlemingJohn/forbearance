export function formatBlockHeight(height: number): string {
  return height.toLocaleString("en-US");
}

export function formatCount(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatUsd(amount: number): string {
  return `$${amount.toLocaleString("en-US")}`;
}

export function formatCtc(amount: number, decimals = 2): string {
  return `${amount.toFixed(decimals)} CTC`;
}

export function formatRatio(ratio: number): string {
  return `${ratio.toFixed(1)}×`;
}

export function formatProbability(probability: number): string {
  return probability.toFixed(2);
}

export function formatPercent(share: number): string {
  return `${Math.round(share * 100)}%`;
}

export function shortenHash(hash: string): string {
  return `${hash.slice(0, 6)}…${hash.slice(-4)}`;
}
