import type { CoinMarket } from "@/lib/schemas";
import type { Holding } from "@/stores/portfolioStore";

export interface HoldingRow {
  holding: Holding;
  coin: CoinMarket | undefined;
  value: number | null;
  cost: number | null;
  pnl: number | null;
  pnlPercent: number | null;
}

export interface PortfolioSummary {
  totalValue: number;
  pnl: number;
  pnlPercent: number | null;
  tracked: number;
}

export function buildRows(
  holdings: Holding[],
  coins: CoinMarket[],
  currency: string,
): HoldingRow[] {
  const byId = new Map(coins.map((coin) => [coin.id, coin]));

  return holdings.map((holding) => {
    const coin = byId.get(holding.coinId);
    const price = coin?.current_price ?? null;
    const buyPrice = holding.buyCurrency === currency ? holding.buyPrice : null;
    const value = price === null ? null : price * holding.amount;
    const cost =
      price !== null && buyPrice !== null && buyPrice > 0
        ? buyPrice * holding.amount
        : null;
    const pnl = cost !== null && value !== null ? value - cost : null;
    const pnlPercent =
      cost !== null && pnl !== null ? (pnl / cost) * 100 : null;

    return { holding, coin, value, cost, pnl, pnlPercent };
  });
}

export function summarize(rows: HoldingRow[]): PortfolioSummary {
  let totalValue = 0;
  let totalCost = 0;
  let pnl = 0;
  let tracked = 0;

  for (const row of rows) {
    if (row.value !== null) totalValue += row.value;
    if (row.cost !== null && row.pnl !== null) {
      totalCost += row.cost;
      pnl += row.pnl;
      tracked += 1;
    }
  }

  return {
    totalValue,
    pnl,
    pnlPercent: totalCost > 0 ? (pnl / totalCost) * 100 : null,
    tracked,
  };
}
