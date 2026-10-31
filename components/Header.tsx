"use client";

import { ChevronLeft, RefreshCw, Search, User } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { CurrencySelect } from "@/components/CurrencySelect";

interface HeaderProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function Header({ search, onSearchChange }: HeaderProps) {
  const { refetch, isFetching } = useCoins();

  return (
    <header
      id="top"
      className="flex scroll-mt-[30px] flex-wrap items-center gap-3 pb-2.5 sm:gap-4"
    >
      <button
        type="button"
        aria-label="Go back"
        onClick={() => window.history.back()}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white"
      >
        <ChevronLeft size={18} />
      </button>
      <h1 className="min-w-0 flex-1 text-center text-sm font-bold text-white">
        Crypto Dashboard
      </h1>
      <label className="flex items-center gap-2.5 rounded-[15px] bg-secondary px-5 py-3.5 text-sm text-secondary-foreground">
        <input
          type="text"
          aria-label="Search coins"
          placeholder="Search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-[150px] bg-transparent outline-none placeholder:text-secondary-foreground"
        />
        <Search size={18} />
      </label>
      <div id="currency">
        <CurrencySelect />
      </div>
      <button
        type="button"
        aria-label="Refresh prices"
        title="Refresh prices"
        onClick={() => refetch()}
        disabled={isFetching}
        className="flex size-[47px] shrink-0 items-center justify-center rounded-full border border-[rgba(217,203,255,0.4)] bg-[#2b2638] text-white disabled:opacity-70"
      >
        <RefreshCw
          size={20}
          className={isFetching ? "animate-spin" : undefined}
        />
      </button>
      <div
        aria-hidden
        className="flex size-[47px] shrink-0 items-center justify-center rounded-full bg-[#3f3655] text-secondary-foreground"
      >
        <User size={22} />
      </div>
    </header>
  );
}
