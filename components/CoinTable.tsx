"use client";

import { useState } from "react";
import { useCoins } from "@/hooks/useCoins";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { formatPrice, formatPercent } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceChart } from "@/components/PriceChart";
import { CurrencySelect } from "@/components/CurrencySelect";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { Star } from "lucide-react";

export function CoinTable() {
  const { data, isLoading, error, refetch, isFetching } = useCoins();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currency = useCurrencyStore((state) => state.currency);
  const watchlist = useWatchlistStore((state) => state.ids);
  const toggleWatch = useWatchlistStore((state) => state.toggle);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data: {error.message}</p>;
  if (!data) return null;

  const keyword = search.trim().toLowerCase();
  const filteredCoins = data.filter(
    (coin) =>
      coin.name.toLowerCase().includes(keyword) ||
      coin.symbol.toLowerCase().includes(keyword),
  );

  return (
    <div>
      <Button onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? "Refreshing..." : "Refresh"}
      </Button>
      <CurrencySelect />
      <Input
        placeholder="search coin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {selectedId && <PriceChart coinId={selectedId} />}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>24h %</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCoins.length === 0 && (
            <TableRow>
              <TableCell colSpan={5}>No coins found</TableCell>
            </TableRow>
          )}
          {filteredCoins.map((coin) => (
            <TableRow
              key={coin.id}
              onClick={() => setSelectedId(coin.id)}
              className="cursor-pointer"
            >
              <TableCell>
                <button
                  type="button"
                  aria-label="Toggle watchlist"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWatch(coin.id);
                  }}
                >
                  <Star
                    size={16}
                    className={
                      watchlist.includes(coin.id)
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }
                  />
                </button>
              </TableCell>
              <TableCell>{coin.market_cap_rank}</TableCell>
              <TableCell>{coin.name}</TableCell>
              <TableCell>{formatPrice(coin.current_price, currency)}</TableCell>
              <TableCell>
                {formatPercent(coin.price_change_percentage_24h)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
