"use client";

import { useMemo } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";
import { useCoins } from "@/hooks/useCoins";
import { AXIS_TICK, TOOLTIP_STYLE } from "@/lib/chart";
import type { CoinMarket } from "@/lib/schemas";
import { Skeleton } from "@/components/ui/skeleton";

const SERIES_COUNT = 3;
const SERIES_COLORS = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];

function getPrices(coin: CoinMarket) {
  return coin.sparkline_in_7d?.price ?? [];
}

export function MarketOverview() {
  const { data, isLoading } = useCoins();

  const { series, points, length } = useMemo(() => {
    const top = (data ?? [])
      .slice(0, SERIES_COUNT)
      .filter((coin) => getPrices(coin).length > 1);
    const size =
      top.length > 0 ? Math.min(...top.map((coin) => getPrices(coin).length)) : 0;
    const rows = Array.from({ length: size }, (_, index) => {
      const row: Record<string, number> = { index };
      for (const coin of top) {
        const prices = getPrices(coin);
        row[coin.symbol] = (prices[index] / prices[0] - 1) * 100;
      }
      return row;
    });
    return { series: top, points: rows, length: size };
  }, [data]);

  return (
    <section className="flex min-h-[267px] flex-col rounded-[20px] border-2 border-white/50 bg-card p-5 backdrop-blur-[70px]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-white">Market Overview</h2>
        <p className="rounded-[10px] bg-[rgba(26,17,29,0.7)] p-2.5 text-sm font-bold text-[#e2d8fd]">
          7 days
        </p>
      </div>
      <ul className="mt-1 flex gap-3 text-[10px] font-bold text-muted-foreground">
        {series.map((coin, index) => (
          <li key={coin.id} className="flex items-center gap-1">
            <span
              className="size-2 rounded-full"
              style={{ background: SERIES_COLORS[index] }}
            />
            {coin.symbol.toUpperCase()}
          </li>
        ))}
      </ul>
      <div className="mt-2 min-h-[150px] flex-1">
        {isLoading && <Skeleton className="h-full w-full" />}
        {!isLoading && points.length === 0 && (
          <p className="text-sm text-muted-foreground">No data available</p>
        )}
        {points.length > 0 && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={points}>
              <YAxis
                tickFormatter={(v: number) => `${Math.round(v)}%`}
                domain={["auto", "auto"]}
                width={44}
                tick={AXIS_TICK}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.4)" }}
                formatter={(value, name) => [
                  `${Number(value).toFixed(2)}%`,
                  String(name).toUpperCase(),
                ]}
                labelFormatter={(label) => {
                  const hoursAgo = length - 1 - Number(label);
                  return hoursAgo === 0 ? "Now" : `${hoursAgo}h ago`;
                }}
                contentStyle={TOOLTIP_STYLE}
                labelStyle={{ color: "var(--muted-foreground)" }}
                itemStyle={{ color: "#ffffff" }}
              />
              {series.map((coin, index) => (
                <Line
                  key={coin.id}
                  type="monotone"
                  dataKey={coin.symbol}
                  stroke={SERIES_COLORS[index]}
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
