"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CoinTable } from "@/components/CoinTable";
import { Header } from "@/components/Header";

interface MarketsViewProps {
  initialSearch: string;
}

export function MarketsView({ initialSearch }: MarketsViewProps) {
  const router = useRouter();
  const [search, setSearch] = useState(initialSearch);

  return (
    <>
      <Header title="Markets" search={search} onSearchChange={setSearch} />
      <CoinTable
        search={search}
        onSelect={(coin) => router.push(`/?coin=${coin.id}`)}
      />
    </>
  );
}
