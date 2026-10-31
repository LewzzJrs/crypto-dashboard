import type { CoinMarket } from "@/lib/schemas";

export function makeCoin(overrides: Partial<CoinMarket> = {}): CoinMarket {
  return {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://example.com/bitcoin.png",
    current_price: 100000,
    market_cap: 1,
    market_cap_rank: 1,
    total_volume: 1,
    high_24h: 1,
    low_24h: 1,
    price_change_percentage_24h: 0,
    ...overrides,
  };
}
