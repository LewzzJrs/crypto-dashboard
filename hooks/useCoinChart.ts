"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoinChart } from "@/lib/api";

export function useCoinChart(id: string | null) {
  return useQuery({
    queryKey: ["coin-chart", id],
    queryFn: () => getCoinChart(id!),
    enabled: id !== null,
  });
}