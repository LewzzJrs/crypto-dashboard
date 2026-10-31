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
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function PriceChart({ coinId }: { coinId: string }) {
  const { data, isLoading, error, refetch, isFetching } = useCoinChart(coinId);
  const currency = useCurrencyStore((state) => state.currency);

  if (isLoading) return <Skeleton className="h-72 w-full" />;

  if (error) {
    return (
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
    );
  }

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
