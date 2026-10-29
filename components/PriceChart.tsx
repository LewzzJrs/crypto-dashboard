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

export function PriceChart({ coinId }: { coinId: string } ) {
  const { data, isLoading, error } = useCoinChart(coinId);

  if (isLoading) return <p>Loading chart...</p>;
  if (error) return <p>Failed to load data</p>;
  if (!data) return null;

  const points = data.prices.map(([time, price]) => ({ time, price}));

  return(
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <XAxis 
            dataKey="time"
            tickFormatter={(t: number) => new Date(t).toLocaleDateString()}
          />
          <YAxis
            domain={["auto", "auto"]}
            width={90}
            tickFormatter={(v: number) => formatPrice(v)}
          />
          <Tooltip />
          <Line type="monotone" dataKey="price" dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}