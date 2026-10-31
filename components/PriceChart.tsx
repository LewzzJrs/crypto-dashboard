"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCoinChart } from "@/hooks/useCoinChart";
import { formatPrice } from "@/lib/format";
import { DEFAULT_TIMEFRAME_ID, TIMEFRAMES } from "@/lib/ranges";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/currencyStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PriceChart({
  coinId,
  symbol,
}: {
  coinId: string;
  symbol: string;
}) {
  const [timeframeId, setTimeframeId] = useState(DEFAULT_TIMEFRAME_ID);
  const timeframe =
    TIMEFRAMES.find((item) => item.id === timeframeId) ?? TIMEFRAMES[0];
  const { data, isLoading, error, refetch, isFetching } = useCoinChart(
    coinId,
    symbol,
    timeframe,
  );
  const selectedCurrency = useCurrencyStore((state) => state.currency);

  const isShortTimeframe = timeframe.kind === "interval";
  const currency = isShortTimeframe ? "usd" : selectedCurrency;
  const showTime =
    timeframe.kind === "interval"
      ? timeframe.interval === "1m" || timeframe.interval === "15m"
      : timeframe.days === 1;

  const points = (data?.prices ?? []).map(([time, price]) => ({ time, price }));

  const formatTick = (time: number) =>
    showTime
      ? new Date(time).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      : new Date(time).toLocaleDateString([], {
          day: "numeric",
          month: "short",
        });

  return (
    <div>
      <div className="mb-3 flex flex-wrap justify-end gap-2.5">
        {TIMEFRAMES.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === timeframe.id}
            onClick={() => setTimeframeId(item.id)}
            className={cn(
              "rounded-[10px] bg-[rgba(26,17,29,0.7)] p-2.5 text-sm font-bold",
              item.id === timeframe.id ? "text-white" : "text-[#868b93]",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      {isShortTimeframe && (
        <p className="mb-2 text-right text-xs text-muted-foreground">
          Prices in USDT (Binance)
        </p>
      )}
      {isLoading && <Skeleton className="h-72 w-full" />}
      {error && (
        <div className="flex h-72 w-full flex-col items-center justify-center gap-3">
          <p>Failed to load chart: {error.message}</p>
          <Button
            variant="outline"
            onClick={() => refetch()}
            disabled={isFetching}
          >
            {isFetching ? "Retrying..." : "Try again"}
          </Button>
        </div>
      )}
      {!isLoading && !error && data && (
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <XAxis
                dataKey="time"
                minTickGap={40}
                tickFormatter={formatTick}
              />
              <YAxis
                tickFormatter={(v: number) => formatPrice(v, currency)}
                domain={["auto", "auto"]}
                width={90}
              />
              <Tooltip
                formatter={(value) => formatPrice(Number(value), currency)}
                labelFormatter={(label) =>
                  new Date(Number(label)).toLocaleString()
                }
              />
              <Line type="monotone" dataKey="price" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
