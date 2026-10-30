"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoinChart } from "@/lib/api";
import { useCurrencyStore } from "@/stores/currencyStore";

export function useCoinChart(id: string | null) {
  const currency = useCurrencyStore((state) => state.currency);
  return useQuery({
    queryKey: ["coin-chart", id, currency],
    queryFn: () => getCoinChart(id!, currency),
    enabled: id !== null,
  });
}
