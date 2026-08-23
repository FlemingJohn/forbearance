import { Contract } from "ethers";
import type { JsonRpcProvider } from "ethers";

const erc20Abi = [
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
];

export interface TokenDetail {
  decimals: number;
  symbol: string;
}

const fallbackDetail: TokenDetail = { decimals: 18, symbol: "units" };
const cache = new Map<string, TokenDetail>();

export async function readTokenDetail(
  ethereumProvider: JsonRpcProvider,
  tokenAddress: string | null,
): Promise<TokenDetail> {
  if (!tokenAddress) {
    return fallbackDetail;
  }

  const cached = cache.get(tokenAddress);

  if (cached) {
    return cached;
  }

  try {
    const token = new Contract(tokenAddress, erc20Abi, ethereumProvider);
    const [decimals, symbol] = await Promise.all([
      token.decimals!(),
      token.symbol!(),
    ]);

    const detail: TokenDetail = {
      decimals: Number(decimals),
      symbol: String(symbol),
    };

    cache.set(tokenAddress, detail);
    return detail;
  } catch {
    return fallbackDetail;
  }
}
