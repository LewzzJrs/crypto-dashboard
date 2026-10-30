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
      className="h-9 rounded-md border bg-transparent px-3 text-sm"
    >
      {CURRENCIES.map((c) => (
        <option key={c} value={c}>
          {c.toUpperCase()}
        </option>
      ))}
    </select>
  );
}
