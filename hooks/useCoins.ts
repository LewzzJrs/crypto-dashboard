"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoins } from "@/lib/api";
import { useCurrencyStore } from "@/stores/currencyStore";

export function useCoins() {
  const currency = useCurrencyStore((state) => state.currency);
  return useQuery({
    queryKey: ["coins", currency],
    queryFn: () => getCoins(currency),
  });
}
