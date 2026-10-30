import { create } from "zustand";
import type { Currency } from "@/lib/currencies";

type CurrencyState = {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
};

export const useCurrencyStore = create<CurrencyState>((set) => ({
  currency: "usd",
  setCurrency: (currency) => set({ currency }),
}));
