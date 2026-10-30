"use client";

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
import { useCurrencyStore } from "@/stores/currencyStore";

export function PriceChart({ coinId }: { coinId: string }) {
  const { data, isLoading, error } = useCoinChart(coinId);
  const currency = useCurrencyStore((state) => state.currency);

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p>Failed to load data</p>;
  if (!data) return null;

  const points = data.prices.map(([time, price]) => ({ time, price }));

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <XAxis
            dataKey="time"
            tickFormatter={(t: number) => new Date(t).toLocaleDateString()}
          />
          <YAxis
            tickFormatter={(v: number) => formatPrice(v, currency)}
            domain={["auto", "auto"]}
            width={90}
          />
          <Tooltip formatter={(value) => formatPrice(Number(value), currency)} />
          <Line type="monotone" dataKey="price" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
