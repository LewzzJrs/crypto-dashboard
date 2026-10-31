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
import { Skeleton } from "@/components/ui/skeleton";
import { PriceChart } from "@/components/PriceChart";
import { CurrencySelect } from "@/components/CurrencySelect";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { Star } from "lucide-react";

const SKELETON_ROWS = Array.from({ length: 8 }, (_, index) => index);
const COLUMNS = Array.from({ length: 5 }, (_, index) => index);

export function CoinTable() {
  const { data, isLoading, error, refetch, isFetching } = useCoins();
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const currency = useCurrencyStore((state) => state.currency);
  const watchlist = useWatchlistStore((state) => state.ids);
  const toggleWatch = useWatchlistStore((state) => state.toggle);
  const [onlyWatchlist, setOnlyWatchlist] = useState(false);

  const keyword = search.trim().toLowerCase();
  const filteredCoins = (data ?? []).filter(
    (coin) =>
      (coin.name.toLowerCase().includes(keyword) ||
        coin.symbol.toLowerCase().includes(keyword)) &&
      (!onlyWatchlist || watchlist.includes(coin.id)),
  );

  const showError = !!error && !data;
  const showEmpty = !isLoading && !showError && filteredCoins.length === 0;
  const emptyMessage =
    onlyWatchlist && watchlist.length === 0
      ? "Your watchlist is empty. Star a coin to add it."
      : "No coins found";

  return (
    <div>
      <Button onClick={() => refetch()} disabled={isFetching}>
        {isFetching ? "Refreshing..." : "Refresh"}
      </Button>
      <Button
        variant="outline"
        onClick={() => setOnlyWatchlist((prev) => !prev)}
      >
        {onlyWatchlist ? "Show all" : "Watchlist only"}
      </Button>
      <CurrencySelect />
      <Input
        placeholder="search coin..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {error && data && (
        <p className="text-sm text-destructive">
          Could not refresh data. Showing the last loaded prices.
        </p>
      )}
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
          {isLoading &&
            SKELETON_ROWS.map((row) => (
              <TableRow key={row}>
                {COLUMNS.map((column) => (
                  <TableCell key={column}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          {showError && (
            <TableRow>
              <TableCell colSpan={COLUMNS.length}>
                <div className="flex flex-col items-center gap-3 py-8">
                  <p>Failed to load data: {error?.message}</p>
                  <Button
                    variant="outline"
                    onClick={() => refetch()}
                    disabled={isFetching}
                  >
                    {isFetching ? "Retrying..." : "Try again"}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          )}
          {showEmpty && (
            <TableRow>
              <TableCell
                colSpan={COLUMNS.length}
                className="py-8 text-center"
              >
                {emptyMessage}
              </TableCell>
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
