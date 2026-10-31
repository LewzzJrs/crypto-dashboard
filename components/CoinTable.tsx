"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ChevronDown, ChevronUp, Star } from "lucide-react";
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

const SKELETON_ROWS = Array.from({ length: 8 }, (_, index) => index);
const COLUMNS = Array.from({ length: 5 }, (_, index) => index);

type SortKey = "rank" | "name" | "price" | "change";
type Direction = "asc" | "desc";
interface SortState {
  key: SortKey;
  direction: Direction;
}

const DEFAULT_DIRECTION: Record<SortKey, Direction> = {
  rank: "asc",
  name: "asc",
  price: "desc",
  change: "desc",
};

function sortValue(coin: CoinMarket, key: SortKey) {
  switch (key) {
    case "rank":
      return coin.market_cap_rank;
    case "name":
      return coin.name.toLowerCase();
    case "price":
      return coin.current_price;
    case "change":
      return coin.price_change_percentage_24h;
  }
}

function compareCoins(a: CoinMarket, b: CoinMarket, sort: SortState) {
  const x = sortValue(a, sort.key);
  const y = sortValue(b, sort.key);
  if (x === null && y === null) return 0;
  if (x === null) return 1;
  if (y === null) return -1;
  const result =
    typeof x === "string" && typeof y === "string"
      ? x.localeCompare(y)
      : Number(x) - Number(y);
  return sort.direction === "asc" ? result : -result;
}

interface SortHeadProps {
  label: string;
  sortKey: SortKey;
  sort: SortState;
  onSort: (key: SortKey) => void;
}

function SortHead({ label, sortKey, sort, onSort }: SortHeadProps) {
  const active = sort.key === sortKey;
  return (
    <TableHead
      aria-sort={
        active ? (sort.direction === "asc" ? "ascending" : "descending") : "none"
      }
    >
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1"
      >
        {label}
        {active &&
          (sort.direction === "asc" ? (
            <ChevronUp size={12} />
          ) : (
            <ChevronDown size={12} />
          ))}
      </button>
    </TableHead>
  );
}

interface CoinTableProps {
  search: string;
  onSelect: (coin: CoinMarket) => void;
  title?: string;
  watchlistOnly?: boolean;
}

export function CoinTable({
  search,
  onSelect,
  title = "All Coins",
  watchlistOnly = false,
}: CoinTableProps) {
  const { data, isLoading, error, refetch, isFetching } = useCoins();
  const currency = useCurrencyStore((state) => state.currency);
  const watchlist = useWatchlistStore((state) => state.ids);
  const toggleWatch = useWatchlistStore((state) => state.toggle);
  const [filterWatchlist, setFilterWatchlist] = useState(false);
  const [sort, setSort] = useState<SortState>({
    key: "rank",
    direction: "asc",
  });

  const onlyWatchlist = watchlistOnly || filterWatchlist;
  const keyword = search.trim().toLowerCase();
  const visibleCoins = (data ?? [])
    .filter(
      (coin) =>
        (coin.name.toLowerCase().includes(keyword) ||
          coin.symbol.toLowerCase().includes(keyword)) &&
        (!onlyWatchlist || watchlist.includes(coin.id)),
    )
    .sort((a, b) => compareCoins(a, b, sort));

  const handleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === "asc" ? "desc" : "asc" }
        : { key, direction: DEFAULT_DIRECTION[key] },
    );
  };

  const showError = !!error && !data;
  const showEmpty = !isLoading && !showError && visibleCoins.length === 0;
  const emptyMessage =
    onlyWatchlist && watchlist.length === 0
      ? "Your watchlist is empty. Star a coin in Markets to add it."
      : "No coins found";

  return (
    <section
      id="coins"
      className="flex scroll-mt-5 flex-col gap-3 rounded-[20px] bg-card px-6 pb-4 pt-4.25"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {!watchlistOnly && (
          <Button
            size="lg"
            variant="outline"
            onClick={() => setFilterWatchlist((prev) => !prev)}
          >
            {filterWatchlist ? "Show all" : "Watchlist only"}
          </Button>
        )}
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
            <SortHead label="#" sortKey="rank" sort={sort} onSort={handleSort} />
            <SortHead
              label="Name"
              sortKey="name"
              sort={sort}
              onSort={handleSort}
            />
            <SortHead
              label="Last Price"
              sortKey="price"
              sort={sort}
              onSort={handleSort}
            />
            <SortHead
              label="24h Change"
              sortKey="change"
              sort={sort}
              onSort={handleSort}
            />
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
          {visibleCoins.map((coin) => {
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
