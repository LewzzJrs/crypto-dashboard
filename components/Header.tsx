"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, RefreshCw, Search, User } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { CurrencySelect } from "@/components/CurrencySelect";

interface HeaderProps {
  title: string;
  search?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({ title, search, onSearchChange }: HeaderProps) {
  const router = useRouter();
  const { refetch, isFetching } = useCoins();
  const isLive = onSearchChange !== undefined;
  const controlledProps = onSearchChange
    ? {
        value: search ?? "",
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          onSearchChange(e.target.value),
      }
    : {};

  return (
    <header
      id="top"
      className="flex scroll-mt-[30px] flex-wrap items-center gap-3 pb-2.5 sm:gap-4"
    >
      <button
        type="button"
        aria-label="Go back"
        onClick={() => router.back()}
        className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-white"
      >
        <ChevronLeft size={18} />
      </button>
      <h1 className="min-w-0 flex-1 text-center text-sm font-bold text-white">
        {title}
      </h1>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (isLive) return;
          const value = new FormData(e.currentTarget).get("q");
          const query = typeof value === "string" ? value.trim() : "";
          router.push(
            query ? `/markets?q=${encodeURIComponent(query)}` : "/markets",
          );
        }}
        className="flex items-center gap-2.5 rounded-[15px] bg-secondary px-5 py-3.5 text-sm text-secondary-foreground"
      >
        <input
          type="text"
          name="q"
          aria-label="Search coins"
          placeholder="Search"
          {...controlledProps}
          className="w-[150px] bg-transparent outline-none placeholder:text-secondary-foreground"
        />
        <button type="submit" aria-label="Search" className="shrink-0">
          <Search size={18} />
        </button>
      </form>
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
