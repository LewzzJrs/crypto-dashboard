"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoins } from "@/lib/api";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useSettingsStore } from "@/stores/settingsStore";

export function useCoins() {
  const currency = useCurrencyStore((state) => state.currency);
  const refreshSeconds = useSettingsStore((state) => state.refreshSeconds);
  return useQuery({
    queryKey: ["coins", currency],
    queryFn: () => getCoins(currency),
    refetchInterval: refreshSeconds > 0 ? refreshSeconds * 1000 : false,
  });
}
