"use client";

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
import type { CoinMarket } from "@/lib/schemas";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrencyStore } from "@/stores/currencyStore";
import { useWatchlistStore } from "@/stores/watchlistStore";
import { ArrowDown, ArrowUp, Star } from "lucide-react";

const SKELETON_ROWS = Array.from({ length: 8 }, (_, index) => index);
const COLUMNS = Array.from({ length: 5 }, (_, index) => index);

export function CoinTable({
  search,
  onlyWatchlist,
  onToggleOnlyWatchlist,
  onSelect,
}: {
  search: string;
  onlyWatchlist: boolean;
  onToggleOnlyWatchlist: () => void;
  onSelect: (coin: CoinMarket) => void;
}) {
  const { data, isLoading, error, refetch, isFetching } = useCoins();
  const currency = useCurrencyStore((state) => state.currency);
  const watchlist = useWatchlistStore((state) => state.ids);
  const toggleWatch = useWatchlistStore((state) => state.toggle);

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
    <section
      id="coins"
      className="flex scroll-mt-5 flex-col gap-3 rounded-[20px] bg-card px-6 pb-4 pt-[17px]"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">All Coins</h2>
        <Button size="lg" variant="outline" onClick={onToggleOnlyWatchlist}>
          {onlyWatchlist ? "Show all" : "Watchlist only"}
        </Button>
      </div>
      {error && data && (
        <p className="text-sm text-destructive">
          Could not refresh data. Showing the last loaded prices.
        </p>
      )}
      <Table>
        <TableHeader className="[&_th]:text-xs [&_th]:text-[#bfb7b7]">
          <TableRow>
            <TableHead></TableHead>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Last Price</TableHead>
            <TableHead>24h Change</TableHead>
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
          {filteredCoins.map((coin) => {
            const change = coin.price_change_percentage_24h;
            const isUp = change !== null && change >= 0;

            return (
              <TableRow
                key={coin.id}
                onClick={() => onSelect(coin)}
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
                <TableCell className="text-muted-foreground">
                  {coin.market_cap_rank}
                </TableCell>
                <TableCell>
                  <span className="text-white">{coin.symbol.toUpperCase()}</span>{" "}
                  <span className="text-[#9a9a9a]">{coin.name}</span>
                </TableCell>
                <TableCell className="text-[#9292c1]">
                  {formatPrice(coin.current_price, currency)}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center gap-2 text-white">
                    {formatPercent(change)}
                    {change !== null &&
                      (isUp ? (
                        <ArrowUp size={14} className="text-positive" />
                      ) : (
                        <ArrowDown size={14} className="text-destructive" />
                      ))}
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}
