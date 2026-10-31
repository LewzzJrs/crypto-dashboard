"use client";

import Link from "next/link";
import { Plus, Star } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { CoinLogo } from "@/components/CoinLogo";

const PREVIEW_COUNT = 2;

export function WatchlistCard() {
  const { data } = useCoins();
  const ids = useWatchlistStore((state) => state.ids);

  const preview = (data ?? [])
    .filter((coin) => ids.includes(coin.id))
    .slice(0, PREVIEW_COUNT);

  return (
    <section
      id="watchlist"
      className="flex min-h-[267px] flex-col rounded-[20px] bg-card p-5"
    >
      <h2 className="text-lg font-bold text-white">Watchlist</h2>
      <div className="mt-6 flex gap-2.5">
        {preview.map((coin, index) => (
          <span
            key={coin.id}
            className={`flex size-[60px] shrink-0 items-center justify-center rounded-full bg-[#4a435c] ${
              index === 0 ? "border-2 border-[#614698]" : ""
            }`}
          >
            <CoinLogo src={coin.image} name={coin.name} className="size-[46px]" />
          </span>
        ))}
        <Link
          href="/markets"
          aria-label="Add coins from Markets"
          className="flex size-[60px] shrink-0 items-center justify-center rounded-full border-2 border-dashed border-[rgba(114,63,216,0.73)] text-white"
        >
          <Plus size={19} />
        </Link>
      </div>
      <div className="mt-[27px] flex items-center gap-[5px]">
        <span className="text-[15px] font-medium text-[#9080ba]">Starred:</span>
        <span className="text-[24.75px] font-semibold text-white">
          {ids.length}
        </span>
      </div>
      <Link
        href="/watchlist"
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-[10px] bg-linear-to-r from-[#ac6aec] to-[#bb7ff5] px-4 py-2.5 text-sm font-semibold text-white"
      >
        <Star size={20} />
        Open Watchlist
      </Link>
    </section>
  );
}
