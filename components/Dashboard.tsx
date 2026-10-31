"use client";

import { useState } from "react";
import { useCoins } from "@/hooks/useCoins";
import type { CoinSelection } from "@/lib/schemas";
import { CoinCards } from "@/components/CoinCards";
import { CoinTable } from "@/components/CoinTable";
import { Header } from "@/components/Header";
import { HeroBanner } from "@/components/HeroBanner";
import { MarketOverview } from "@/components/MarketOverview";
import { MarketTrend } from "@/components/MarketTrend";
import { PriceChart } from "@/components/PriceChart";
import { Sidebar } from "@/components/Sidebar";
import { WatchlistCard } from "@/components/WatchlistCard";
import { Skeleton } from "@/components/ui/skeleton";

const CHART_OPTION_COUNT = 10;

export function Dashboard() {
  const { data, isLoading } = useCoins();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<CoinSelection | null>(null);
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);

  const leader = data?.[0];
  const active =
    selected ?? (leader ? { id: leader.id, symbol: leader.symbol } : null);

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
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-[30px] sm:px-[30px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5">
          <Header search={search} onSearchChange={setSearch} />

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
            <WatchlistCard
              onlyWatchlist={onlyWatchlist}
              onToggle={() => setOnlyWatchlist((prev) => !prev)}
            />
            <MarketTrend onSelect={selectCoin} />
          </div>

          <CoinTable
            search={search}
            onlyWatchlist={onlyWatchlist}
            onToggleOnlyWatchlist={() => setOnlyWatchlist((prev) => !prev)}
            onSelect={selectCoin}
          />
        </div>
      </main>
    </div>
  );
}
