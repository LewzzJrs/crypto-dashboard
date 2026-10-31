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
import { ChevronDown } from "lucide-react";
import { useCoinChart } from "@/hooks/useCoinChart";
import { AXIS_TICK, TOOLTIP_STYLE } from "@/lib/chart";
import { formatPrice } from "@/lib/format";
import { DEFAULT_TIMEFRAME_ID, TIMEFRAMES } from "@/lib/ranges";
import type { CoinSelection } from "@/lib/schemas";
import { cn } from "@/lib/utils";
import { useCurrencyStore } from "@/stores/currencyStore";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface PriceChartProps {
  coinId: string;
  symbol: string;
  options: CoinSelection[];
  onSelect: (coin: CoinSelection) => void;
}

export function PriceChart({
  coinId,
  symbol,
  options,
  onSelect,
}: PriceChartProps) {
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
  const quote = isShortTimeframe ? "USDT" : selectedCurrency.toUpperCase();
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
    <section className="min-h-72.25 rounded-[25px] border-2 border-white/50 bg-[linear-gradient(148deg,rgba(255,255,255,0.12)_28.7%,rgba(255,255,255,0)_100%)] p-6.25 backdrop-blur-[70px]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="relative">
          <select
            aria-label="Select coin"
            value={coinId}
            onChange={(e) => {
              const option = options.find((item) => item.id === e.target.value);
              if (option) onSelect(option);
            }}
            className="appearance-none rounded-[10px] bg-[rgba(26,17,29,0.7)] py-2.5 pl-3.25 pr-10 text-sm font-bold text-white outline-none"
          >
            {options.map((option) => (
              <option key={option.id} value={option.id}>
                {option.symbol.toUpperCase()}/{quote}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white"
          />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {TIMEFRAMES.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-pressed={item.id === timeframe.id}
              onClick={() => setTimeframeId(item.id)}
              className={cn(
                "rounded-[10px] bg-[rgba(26,17,29,0.7)] p-2.5 text-sm font-bold",
                item.id === timeframe.id ? "text-white" : "text-muted-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      {isLoading && <Skeleton className="h-43.25 w-full" />}
      {error && (
        <div className="flex h-43.25 w-full flex-col items-center justify-center gap-3">
          <p className="text-center text-sm">
            Failed to load chart: {error.message}
          </p>
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
        <div className="h-43.25 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <XAxis
                dataKey="time"
                minTickGap={40}
                tickFormatter={formatTick}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tickFormatter={(v: number) => formatPrice(v, currency)}
                domain={["auto", "auto"]}
                width={90}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => formatPrice(Number(value), currency)}
                labelFormatter={(label) =>
                  new Date(Number(label)).toLocaleString()
                }
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: "var(--muted-foreground)" }}
                itemStyle={{ color: "#ffffff" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
