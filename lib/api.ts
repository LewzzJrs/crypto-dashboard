import { CoinMarketListSchema, type CoinMarket } from "@/lib/schemas";

const BASE_URL= "https://api.coingecko.com/api/v3";

export async function getCoins(currency = "usd"): Promise<CoinMarket[]> {
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=10&page=1`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();

  return CoinMarketListSchema.parse(data);
}
