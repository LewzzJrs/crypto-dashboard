"use client";

import { useEffect, useState } from "react";
import { useCurrencyStore } from "@/stores/currencyStore";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useWatchlistStore } from "@/stores/watchlistStore";

export function useStoresReady() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      useCurrencyStore.persist.rehydrate(),
      useWatchlistStore.persist.rehydrate(),
      useSettingsStore.persist.rehydrate(),
      usePortfolioStore.persist.rehydrate(),
    ]).then(() => {
      if (active) setReady(true);
    });
    return () => {
      active = false;
    };
  }, []);

  return ready;
}
