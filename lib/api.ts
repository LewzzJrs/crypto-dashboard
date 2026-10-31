import {
  CoinMarketListSchema,
  type CoinMarket,
  CoinChartSchema,
  type CoinChart }
  from "@/lib/schemas";
import type { Interval, RangeDays } from "@/lib/ranges";

export async function getCoins(currency = "usd"): Promise<CoinMarket[]> {
  const url = `/api/coins?currency=${currency}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();

  return CoinMarketListSchema.parse(data);
}

export async function getCoinChart(
  id: string,
  currency = "usd",
  days: RangeDays = 7,
): Promise<CoinChart> {
  const url = `/api/coins/${id}/chart?currency=${currency}&days=${days}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  const data = await res.json();

  return CoinChartSchema.parse(data);
}

export async function getCandles(
  symbol: string,
  interval: Interval,
): Promise<CoinChart> {
  const url = `/api/candles?symbol=${encodeURIComponent(symbol)}&interval=${interval}`;
  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Request failed: ${res.status}`);
  }

  const data = await res.json();

  return CoinChartSchema.parse(data);
}
