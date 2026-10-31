import { describe, expect, it } from "vitest";
import { makeCoin } from "@/lib/__fixtures__/coins";
import { buildRows, summarize } from "@/lib/portfolio";
import type { Holding } from "@/stores/portfolioStore";

const ETH = makeCoin({
  id: "ethereum",
  symbol: "eth",
  name: "Ethereum",
  current_price: 3921.5,
});
const BTC = makeCoin({ current_price: 103456.78 });
const COINS = [BTC, ETH];

function holding(overrides: Partial<Holding> = {}): Holding {
  return {
    id: "h1",
    coinId: "ethereum",
    amount: 2,
    buyPrice: 3000,
    buyCurrency: "usd",
    ...overrides,
  };
}

describe("buildRows", () => {
  it("values a holding at the current price times the amount", () => {
    const [row] = buildRows([holding()], COINS, "usd");
    expect(row.coin?.id).toBe("ethereum");
    expect(row.value).toBeCloseTo(7843, 6);
  });

  it("calculates profit and percent when the buy currency matches", () => {
    const [row] = buildRows([holding()], COINS, "usd");
    expect(row.cost).toBe(6000);
    expect(row.pnl).toBeCloseTo(1843, 6);
    expect(row.pnlPercent).toBeCloseTo(30.7167, 3);
  });

  it("calculates a loss as a negative number", () => {
    const coins = [makeCoin({ id: "x", symbol: "x", current_price: 80 })];
    const [row] = buildRows(
      [holding({ coinId: "x", amount: 3, buyPrice: 100 })],
      coins,
      "usd",
    );
    expect(row.value).toBe(240);
    expect(row.cost).toBe(300);
    expect(row.pnl).toBe(-60);
    expect(row.pnlPercent).toBeCloseTo(-20, 6);
  });

  it("skips profit when the buy currency differs from the selected one", () => {
    const [row] = buildRows([holding({ buyCurrency: "idr" })], COINS, "usd");
    expect(row.value).toBeCloseTo(7843, 6);
    expect(row.cost).toBeNull();
    expect(row.pnl).toBeNull();
    expect(row.pnlPercent).toBeNull();
  });

  it("skips profit when there is no buy price", () => {
    const [row] = buildRows([holding({ buyPrice: null })], COINS, "usd");
    expect(row.value).toBeCloseTo(7843, 6);
    expect(row.pnl).toBeNull();
  });

  it("treats a zero buy price as no buy price", () => {
    const [row] = buildRows([holding({ buyPrice: 0 })], COINS, "usd");
    expect(row.cost).toBeNull();
    expect(row.pnl).toBeNull();
    expect(row.pnlPercent).toBeNull();
  });

  it("returns empty values for a coin that is not in the list", () => {
    const [row] = buildRows([holding({ coinId: "missing" })], COINS, "usd");
    expect(row.coin).toBeUndefined();
    expect(row.value).toBeNull();
    expect(row.pnl).toBeNull();
  });

  it("returns empty values when the coin has no price", () => {
    const coins = [makeCoin({ id: "ethereum", current_price: null })];
    const [row] = buildRows([holding()], coins, "usd");
    expect(row.value).toBeNull();
    expect(row.cost).toBeNull();
    expect(row.pnl).toBeNull();
  });

  it("keeps the order of the holdings", () => {
    const rows = buildRows(
      [holding({ id: "a" }), holding({ id: "b", coinId: "bitcoin" })],
      COINS,
      "usd",
    );
    expect(rows.map((row) => row.holding.id)).toEqual(["a", "b"]);
  });

  it("returns no rows for no holdings", () => {
    expect(buildRows([], COINS, "usd")).toEqual([]);
  });
});

describe("summarize", () => {
  it("returns zeros for no rows", () => {
    expect(summarize([])).toEqual({
      totalValue: 0,
      pnl: 0,
      pnlPercent: null,
      tracked: 0,
    });
  });

  it("adds up the value of every holding but profit only for tracked ones", () => {
    const rows = buildRows(
      [holding(), holding({ id: "h2", coinId: "bitcoin", amount: 0.5, buyPrice: null })],
      COINS,
      "usd",
    );
    const summary = summarize(rows);
    expect(summary.totalValue).toBeCloseTo(59571.39, 2);
    expect(summary.pnl).toBeCloseTo(1843, 6);
    expect(summary.pnlPercent).toBeCloseTo(30.7167, 3);
    expect(summary.tracked).toBe(1);
  });

  it("combines gains and losses into one percent of the total cost", () => {
    const coins = [ETH, makeCoin({ id: "x", symbol: "x", current_price: 80 })];
    const rows = buildRows(
      [holding(), holding({ id: "h2", coinId: "x", amount: 3, buyPrice: 100 })],
      coins,
      "usd",
    );
    const summary = summarize(rows);
    expect(summary.pnl).toBeCloseTo(1783, 6);
    expect(summary.pnlPercent).toBeCloseTo(28.3016, 3);
    expect(summary.tracked).toBe(2);
  });

  it("has no percent when nothing is tracked", () => {
    const rows = buildRows([holding({ buyPrice: null })], COINS, "usd");
    const summary = summarize(rows);
    expect(summary.totalValue).toBeCloseTo(7843, 6);
    expect(summary.pnl).toBe(0);
    expect(summary.pnlPercent).toBeNull();
    expect(summary.tracked).toBe(0);
  });

  it("ignores holdings that have no price in the total", () => {
    const rows = buildRows(
      [holding({ coinId: "missing" }), holding({ id: "h2", buyPrice: null })],
      COINS,
      "usd",
    );
    expect(summarize(rows).totalValue).toBeCloseTo(7843, 6);
  });
});
