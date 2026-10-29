import {
  CoinMarketListSchema,
  type CoinMarket,
  CoinChartSchema,
  type CoinChart }
  from "@/lib/schemas";

export async function getCoins(currency = "usd"): Promise<CoinMarket[]> {
  const url = `/api/coins?currency=${currency}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();

  return CoinMarketListSchema.parse(data);
}

export async function getCoinChart(id: string, currency = "usd"): Promise<CoinChart> {
  const url = `/api/coins/${id}/chart?currency=${currency}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();

  return CoinChartSchema.parse(data);
}
