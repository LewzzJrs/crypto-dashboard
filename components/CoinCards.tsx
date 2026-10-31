"use client";

import { useRef } from "react";
import {
  ArrowLeftRight,
  ChevronRight,
  CircleArrowDown,
  CircleArrowUp,
} from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { formatPercent, formatPrice } from "@/lib/format";
import type { CoinMarket } from "@/lib/schemas";
import { useCurrencyStore } from "@/stores/currencyStore";
import { CoinLogo } from "@/components/CoinLogo";
import { Sparkline } from "@/components/Sparkline";
import { Skeleton } from "@/components/ui/skeleton";

const CARD_COUNT = 10;
const PLACEHOLDERS = Array.from({ length: 5 }, (_, index) => index);
const SCROLL_STEP = 260;

export function CoinCards({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (coin: CoinMarket) => void;
}) {
  const { data, isLoading } = useCoins();
  const currency = useCurrencyStore((state) => state.currency);
  const scroller = useRef<HTMLDivElement>(null);

  const coins = (data ?? []).slice(0, CARD_COUNT);

  if (!isLoading && coins.length === 0) return null;

  return (
    <section aria-label="Top coins" className="relative">
      <div
        ref={scroller}
        className="flex gap-5 overflow-x-auto pt-[25px] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {isLoading &&
          PLACEHOLDERS.map((item) => (
            <Skeleton
              key={item}
              className="h-[155px] w-[240px] shrink-0 rounded-[20px]"
            />
          ))}
        {coins.map((coin) => {
          const change = coin.price_change_percentage_24h;
          const isUp = change !== null && change >= 0;
          const isSelected = coin.id === selectedId;
          const price = formatPrice(coin.current_price, currency);

          return (
            <button
              key={coin.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(coin)}
              className={`relative h-[155px] w-[240px] shrink-0 rounded-[20px] border bg-card text-left ${
                isSelected ? "border-primary" : "border-white/50"
              }`}
            >
              <CoinLogo
                src={coin.image}
                name={coin.name}
                className="absolute left-1/2 top-0 size-[50px] -translate-x-1/2 -translate-y-1/2"
              />
              <div className="absolute left-3.5 top-[34px] flex items-center gap-3 text-sm font-semibold text-muted-foreground">
                <span>{coin.symbol.toUpperCase()}</span>
                <ArrowLeftRight size={16} />
                <span>{currency.toUpperCase()}</span>
              </div>
              {change !== null && (
                <div
                  className={`absolute right-[15px] top-[34px] flex items-center gap-[5px] text-sm font-semibold ${
                    isUp ? "text-positive" : "text-destructive"
                  }`}
                >
                  {isUp ? (
                    <CircleArrowUp size={16} />
                  ) : (
                    <CircleArrowDown size={16} />
                  )}
                  {formatPercent(change)}
                </div>
              )}
              <Sparkline
                values={coin.sparkline_in_7d?.price ?? []}
                stroke={isUp ? "var(--chart-1)" : "var(--chart-2)"}
                className="absolute inset-x-[17px] top-[78px] bottom-[16px] h-[61px] w-[206px]"
              />
              <p
                className={`absolute left-[15px] top-[62px] font-semibold text-white ${
                  price.length > 14 ? "text-base" : "text-xl"
                }`}
              >
                {price}
              </p>
            </button>
          );
        })}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-linear-to-l from-background/80 to-transparent"
      />
      <button
        type="button"
        aria-label="Scroll coins right"
        onClick={() =>
          scroller.current?.scrollBy({ left: SCROLL_STEP, behavior: "smooth" })
        }
        className="absolute right-0 top-[85px] flex size-10 items-center justify-center rounded-full border border-[#614698] bg-[#2d2346] text-white"
      >
        <ChevronRight size={18} />
      </button>
    </section>
  );
}
