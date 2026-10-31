import { describe, expect, it } from "vitest";
import { formatAmount, formatPercent, formatPrice } from "@/lib/format";

describe("formatPrice", () => {
  it("formats usd by default", () => {
    expect(formatPrice(1234.5)).toBe("$1,234.50");
  });

  it("formats other currencies", () => {
    expect(formatPrice(1000, "eur")).toBe("€1,000.00");
  });

  it("shows a dash for null", () => {
    expect(formatPrice(null)).toBe("-");
  });
});

describe("formatPercent", () => {
  it("uses two decimals", () => {
    expect(formatPercent(2.4)).toBe("2.40%");
    expect(formatPercent(-3.8)).toBe("-3.80%");
  });

  it("shows a dash for null", () => {
    expect(formatPercent(null)).toBe("-");
  });
});

describe("formatAmount", () => {
  it("drops trailing zeros", () => {
    expect(formatAmount(0.5)).toBe("0.5");
  });

  it("groups thousands", () => {
    expect(formatAmount(1234567)).toBe("1,234,567");
  });

  it("keeps up to eight decimals", () => {
    expect(formatAmount(0.123456789)).toBe("0.12345679");
  });
});
