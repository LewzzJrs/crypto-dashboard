import { CoinMarketListSchema, type CoinMarket } from "@/lib/schemas";

export async function getCoins(currency = "usd"): Promise<CoinMarket[]> {
  const url = `/api/coins?currency=${currency}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();

  return CoinMarketListSchema.parse(data);
}
