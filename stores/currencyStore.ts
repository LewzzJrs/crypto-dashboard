import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Currency } from "@/lib/currencies";

type CurrencyState = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: "usd",
      setCurrency: (currency) => set({ currency }),
    }),
    { name: "currency", skipHydration: true },
  ),
);
