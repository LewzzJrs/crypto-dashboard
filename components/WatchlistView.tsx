"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoinTable } from "@/components/CoinTable";
import { Header } from "@/components/Header";

export function WatchlistView() {
  const router = useRouter();
  const [search, setSearch] = useState("");

  return (
    <>
      <Header title="Watchlist" search={search} onSearchChange={setSearch} />
      <CoinTable
        title="Your Watchlist"
        search={search}
        watchlistOnly
        onSelect={(coin) => router.push(`/?coin=${coin.id}`)}
      />
    </>
  );
}
