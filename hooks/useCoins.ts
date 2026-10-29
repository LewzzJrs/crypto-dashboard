"use client";

import { useQuery } from "@tanstack/react-query";
import { getCoins } from "@/lib/api";

export function useCoins() {
  return useQuery({
    queryKey: ["coins"],
    queryFn: () => getCoins(),
  });
}
