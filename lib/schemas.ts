import { z } from "zod";

const CoinMarketSchema = z.object({
  id: z.string(),
  symbol: z.string(),
  name: z.string(),
  image: z.url(),
  current_price: z.number().nullable(),
  market_cap: z.number().nullable(),
  market_cap_rank: z.number().nullable(),
  total_volume: z.number().nullable(),
  high_24h: z.number().nullable(),
  low_24h: z.number().nullable(),
  price_change_percentage_24h: z.number().nullable(),
});

export const CoinMarketListSchema = z.array(CoinMarketSchema);
export type CoinMarket = z.infer<typeof CoinMarketSchema>;

export const CoinChartSchema = z.object({
  prices: z.array(z.tuple([z.number(), z.number()])),
});

export type CoinChart = z.infer<typeof CoinChartSchema>;