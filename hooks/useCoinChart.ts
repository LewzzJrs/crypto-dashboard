"use client";

import { useQuery } from "@tanstack/react-query";
import { getCandles, getCoinChart } from "@/lib/api";
import type { Timeframe } from "@/lib/ranges";
import { useCurrencyStore } from "@/stores/currencyStore";

export function useCoinChart(
  id: string | null,
  symbol: string,
  timeframe: Timeframe,
) {
  const currency = useCurrencyStore((state) => state.currency);
  const priceUnit = timeframe.kind === "interval" ? "usdt" : currency;

  return useQuery({
    queryKey: ["coin-chart", id, timeframe.id, priceUnit],
    queryFn: () =>
      timeframe.kind === "days"
        ? getCoinChart(id!, currency, timeframe.days)
        : getCandles(symbol, timeframe.interval),
    enabled: id !== null,
  });
}
