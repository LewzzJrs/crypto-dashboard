"use client";

import { CURRENCIES, isCurrency } from "@/lib/currencies";
import { useCurrencyStore } from "@/stores/currencyStore";

export function CurrencySelect() {
  const currency = useCurrencyStore((state) => state.currency);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);

  return (
    <select
      value={currency}
      onChange={(e) => {
        if (isCurrency(e.target.value)) setCurrency(e.target.value);
      }}
      className="h-12 rounded-[15px] bg-secondary px-4 text-sm font-semibold text-secondary-foreground outline-none"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {c.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
