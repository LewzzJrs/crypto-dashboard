"use client";

import { useState } from "react";
import { useCoins } from "@/hooks/useCoins";
import type { CoinSelection } from "@/lib/schemas";
import { CoinCards } from "@/components/CoinCards";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketTrend } from "@/components/MarketTrend";
import { PriceChart } from "@/components/PriceChart";
import { WatchlistCard } from "@/components/WatchlistCard";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_OPTION_COUNT = 10;

interface DashboardProps {
  initialCoinId?: string;
}

export function Dashboard({ initialCoinId }: DashboardProps) {
  const { data, isLoading } = useCoins();
  const [selected, setSelected] = useState<CoinSelection | null>(null);

  const preferred = initialCoinId
    ? data?.find((coin) => coin.id === initialCoinId)
    : undefined;
  const fallback = preferred ?? data?.[0];
  const active =
    selected ?? (fallback ? { id: fallback.id, symbol: fallback.symbol } : null);

  const options: CoinSelection[] = (data ?? [])
    .slice(0, CHART_OPTION_COUNT)
    .map(({ id, symbol }) => ({ id, symbol }));
  if (active && !options.some((option) => option.id === active.id)) {
    options.push(active);
  }

  const selectCoin = (coin: CoinSelection) => {
    setSelected({ id: coin.id, symbol: coin.symbol });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <Header title="Home" />

      <div className="grid gap-5 xl:grid-cols-2">
        <HeroBanner />
        {active ? (
          <PriceChart
            coinId={active.id}
            symbol={active.symbol}
            options={options}
            onSelect={setSelected}
          />
        ) : isLoading ? (
          <Skeleton className="min-h-[289px] rounded-[25px]" />
        ) : (
          <div className="grid min-h-[289px] place-items-center rounded-[25px] border-2 border-white/50 text-muted-foreground">
            No chart data
          </div>
        )}
      </div>

      <CoinCards selectedId={active?.id ?? null} onSelect={selectCoin} />

      <div className="grid items-stretch gap-5 xl:grid-cols-[629fr_240fr_370fr]">
        <MarketOverview />
        <WatchlistCard />
        <MarketTrend onSelect={selectCoin} />
      </div>
    </>
  );
}
