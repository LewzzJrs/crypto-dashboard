"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { formatPercent, formatPrice } from "@/lib/format";
import type { CoinMarket } from "@/lib/schemas";
import { useCurrencyStore } from "@/stores/currencyStore";
import { Skeleton } from "@/components/ui/skeleton";

const POOL_SIZE = 50;
const ROW_COUNT = 6;
const PLACEHOLDERS = Array.from({ length: ROW_COUNT }, (_, index) => index);
const ROW_GRID =
  "grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_92px] items-center gap-[5px]";

export function MarketTrend({
  onSelect,
}: {
  onSelect: (coin: CoinMarket) => void;
}) {
  const { data, isLoading } = useCoins();
  const currency = useCurrencyStore((state) => state.currency);

  const movers = (data ?? [])
    .slice(0, POOL_SIZE)
    .filter((coin) => coin.price_change_percentage_24h !== null)
    .sort(
      (a, b) =>
        Math.abs(b.price_change_percentage_24h ?? 0) -
        Math.abs(a.price_change_percentage_24h ?? 0),
    )
    .slice(0, ROW_COUNT);

  return (
    <section className="flex min-h-[267px] flex-col gap-3 rounded-[20px] bg-card px-6 pb-4 pt-[17px]">
      <h2 className="text-lg font-bold text-white">Market Trend</h2>
      <div className={`${ROW_GRID} text-[10px] text-[#bfb7b7]`}>
        <span>Name</span>
        <span>Last Price</span>
        <span>24h Change</span>
      </div>
      {isLoading &&
        PLACEHOLDERS.map((item) => <Skeleton key={item} className="h-[17px]" />)}
      {movers.map((coin) => {
        const change = coin.price_change_percentage_24h;
        const isUp = change !== null && change >= 0;

        return (
          <button
            key={coin.id}
            type="button"
            onClick={() => onSelect(coin)}
            className={`${ROW_GRID} text-left text-xs tracking-[0.37px]`}
          >
            <span className="truncate">
              <span className="text-white">{coin.symbol.toUpperCase()}</span>
              {"  "}
              <span className="text-[#9a9a9a]">{coin.name}</span>
            </span>
            <span className="truncate text-[#9292c1]">
              {formatPrice(coin.current_price, currency)}
            </span>
            <span className="flex items-center gap-2 text-white">
              {formatPercent(change)}
              {isUp ? (
                <ArrowUp size={14} className="text-positive" />
              ) : (
                <ArrowDown size={14} className="text-destructive" />
              )}
            </span>
          </button>
        );
      })}
    </section>
  );
}
