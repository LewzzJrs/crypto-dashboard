"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpDown } from "lucide-react";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import { getCoins } from "@/lib/api";
import {
  convert,
  parseUnit,
  unitLabel,
  type RateTables,
  type Unit,
} from "@/lib/converter";
import { CURRENCIES, type Currency } from "@/lib/currencies";
import { formatAmount, formatPrice } from "@/lib/format";
import { CARD_CLASS, FIELD_CLASS, LABEL_CLASS } from "@/lib/styles";
import { useCurrencyStore } from "@/stores/currencyStore";

function fiatOf(unit: Unit | null): Currency {
  return unit?.kind === "fiat" ? unit.code : "usd";
}

function formatResult(value: number, unit: Unit) {
  return unit.kind === "fiat"
    ? formatPrice(value, unit.code)
    : formatAmount(value);
}

interface UnitSelectProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  tables: RateTables;
}

function UnitSelect({ label, value, onChange, tables }: UnitSelectProps) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={FIELD_CLASS}
    >
      <optgroup label="Fiat">
        {CURRENCIES.map((code) => (
          <option key={code} value={`fiat:${code}`}>
            {code.toUpperCase()}
          </option>
        ))}
      </optgroup>
      <optgroup label="Crypto">
        {tables.usd.map((coin) => (
          <option key={coin.id} value={`coin:${coin.id}`}>
            {coin.name} ({coin.symbol.toUpperCase()})
          </option>
        ))}
      </optgroup>
    </select>
  );
}

export function ConverterView() {
  const currency = useCurrencyStore((state) => state.currency);
  const [amount, setAmount] = useState("1");
  const [fromKey, setFromKey] = useState("coin:bitcoin");
  const [toKey, setToKey] = useState(`fiat:${currency}`);

  const from = parseUnit(fromKey);
  const to = parseUnit(toKey);
  const fromFiat = fiatOf(from);
  const toFiat = fiatOf(to);

  const usdQuery = useQuery({
    queryKey: ["coins", "usd"],
    queryFn: () => getCoins("usd"),
  });
  const fromQuery = useQuery({
    queryKey: ["coins", fromFiat],
    queryFn: () => getCoins(fromFiat),
  });
  const toQuery = useQuery({
    queryKey: ["coins", toFiat],
    queryFn: () => getCoins(toFiat),
  });

  const fiat: RateTables["fiat"] = {};
  fiat[fromFiat] = fromQuery.data;
  fiat[toFiat] = toQuery.data;
  const tables: RateTables = { usd: usdQuery.data ?? [], fiat };

  const isLoading =
    usdQuery.isLoading || fromQuery.isLoading || toQuery.isLoading;
  const failure = usdQuery.error ?? fromQuery.error ?? toQuery.error;

  const parsedAmount = Number(amount);
  const validAmount =
    amount.trim() !== "" && Number.isFinite(parsedAmount) && parsedAmount >= 0;

  const result =
    from && to && validAmount ? convert(parsedAmount, from, to, tables) : null;
  const unitRate = from && to ? convert(1, from, to, tables) : null;

  const swap = () => {
    setFromKey(toKey);
    setToKey(fromKey);
  };

  return (
    <>
      <Header title="Converter" />

      <section className={`${CARD_CLASS} flex flex-col gap-6`}>
        <h2 className="text-lg font-bold text-white">Currency converter</h2>

        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : failure && !usdQuery.data ? (
          <p className="text-sm text-destructive">
            Could not load rates: {failure.message}
          </p>
        ) : (
          <div className="grid gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
            <div className="flex flex-col gap-3">
              <label htmlFor="convert-amount" className={LABEL_CLASS}>
                Amount
              </label>
              <input
                id="convert-amount"
                type="number"
                inputMode="decimal"
                step="any"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={FIELD_CLASS}
              />
              <UnitSelect
                label="From"
                value={fromKey}
                onChange={setFromKey}
                tables={tables}
              />
            </div>

            <button
              type="button"
              aria-label="Swap"
              onClick={swap}
              className="mx-auto flex size-12 items-center justify-center rounded-full bg-secondary text-secondary-foreground md:mb-0"
            >
              <ArrowUpDown size={18} className="md:rotate-90" />
            </button>

            <div className="flex flex-col gap-3">
              <span className={LABEL_CLASS}>Result</span>
              <output
                aria-live="polite"
                className="flex h-12 items-center overflow-x-auto rounded-[15px] bg-accent px-4 text-sm font-semibold text-white"
              >
                {result !== null && to ? formatResult(result, to) : "-"}
              </output>
              <UnitSelect
                label="To"
                value={toKey}
                onChange={setToKey}
                tables={tables}
              />
            </div>
          </div>
        )}

        {!isLoading && from && to && unitRate !== null && (
          <p className="text-sm text-muted-foreground">
            1 {unitLabel(from, tables)} = {formatResult(unitRate, to)}{" "}
            {to.kind === "coin" ? unitLabel(to, tables) : ""}
          </p>
        )}
        {!validAmount && (
          <p className="text-sm text-destructive">
            Enter an amount of 0 or more.
          </p>
        )}
      </section>
    </>
  );
}
