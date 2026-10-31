import { isCurrency, type Currency } from "@/lib/currencies";
import type { CoinMarket } from "@/lib/schemas";

export type Unit =
  | { kind: "coin"; id: string }
  | { kind: "fiat"; code: Currency };

export interface RateTables {
  usd: CoinMarket[];
  fiat: Partial<Record<Currency, CoinMarket[]>>;
}

export function unitKey(unit: Unit) {
  return unit.kind === "coin" ? `coin:${unit.id}` : `fiat:${unit.code}`;
}

export function parseUnit(key: string): Unit | null {
  const index = key.indexOf(":");
  if (index < 0) return null;
  const kind = key.slice(0, index);
  const value = key.slice(index + 1);
  if (kind === "coin" && value) return { kind: "coin", id: value };
  if (kind === "fiat" && isCurrency(value)) return { kind: "fiat", code: value };
  return null;
}

export function usdPerUnit(unit: Unit, tables: RateTables): number | null {
  if (unit.kind === "coin") {
    return tables.usd.find((coin) => coin.id === unit.id)?.current_price ?? null;
  }
  if (unit.code === "usd") return 1;

  const quoted = tables.fiat[unit.code];
  if (!quoted) return null;

  for (const reference of tables.usd) {
    const usdPrice = reference.current_price;
    const fiatPrice = quoted.find((coin) => coin.id === reference.id)
      ?.current_price;
    if (usdPrice && fiatPrice) return usdPrice / fiatPrice;
  }
  return null;
}

export function convert(
  amount: number,
  from: Unit,
  to: Unit,
  tables: RateTables,
): number | null {
  const source = usdPerUnit(from, tables);
  const target = usdPerUnit(to, tables);
  if (source === null || target === null || target === 0) return null;
  return (amount * source) / target;
}

export function unitLabel(unit: Unit, tables: RateTables) {
  if (unit.kind === "fiat") return unit.code.toUpperCase();
  const coin = tables.usd.find((item) => item.id === unit.id);
  return coin ? coin.symbol.toUpperCase() : unit.id;
}
