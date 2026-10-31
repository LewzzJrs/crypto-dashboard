import { describe, expect, it } from "vitest";
import { makeCoin } from "@/lib/__fixtures__/coins";
import {
  convert,
  parseUnit,
  unitKey,
  unitLabel,
  usdPerUnit,
  type RateTables,
  type Unit,
} from "@/lib/converter";

const BTC = makeCoin({ current_price: 100000 });
const ETH = makeCoin({
  id: "ethereum",
  symbol: "eth",
  name: "Ethereum",
  current_price: 4000,
});

const TABLES: RateTables = {
  usd: [BTC, ETH],
  fiat: {
    idr: [
      makeCoin({ current_price: 1_600_000_000 }),
      makeCoin({ id: "ethereum", symbol: "eth", current_price: 64_000_000 }),
    ],
    eur: [
      makeCoin({ current_price: 92000 }),
      makeCoin({ id: "ethereum", symbol: "eth", current_price: 3680 }),
    ],
  },
};

const bitcoin: Unit = { kind: "coin", id: "bitcoin" };
const ethereum: Unit = { kind: "coin", id: "ethereum" };
const usd: Unit = { kind: "fiat", code: "usd" };
const idr: Unit = { kind: "fiat", code: "idr" };
const eur: Unit = { kind: "fiat", code: "eur" };

describe("parseUnit", () => {
  it("parses a coin key", () => {
    expect(parseUnit("coin:bitcoin")).toEqual(bitcoin);
  });

  it("parses a fiat key", () => {
    expect(parseUnit("fiat:idr")).toEqual(idr);
  });

  it("keeps colons inside a coin id", () => {
    expect(parseUnit("coin:a:b")).toEqual({ kind: "coin", id: "a:b" });
  });

  it("rejects unknown fiat codes", () => {
    expect(parseUnit("fiat:xxx")).toBeNull();
  });

  it("rejects keys without a kind", () => {
    expect(parseUnit("bitcoin")).toBeNull();
  });

  it("rejects an empty coin id", () => {
    expect(parseUnit("coin:")).toBeNull();
  });

  it("rejects an unknown kind", () => {
    expect(parseUnit("metal:gold")).toBeNull();
  });
});

describe("unitKey", () => {
  it("builds keys that parseUnit can read back", () => {
    for (const unit of [bitcoin, ethereum, usd, idr, eur]) {
      expect(parseUnit(unitKey(unit))).toEqual(unit);
    }
  });
});

describe("usdPerUnit", () => {
  it("returns the usd price of a coin", () => {
    expect(usdPerUnit(bitcoin, TABLES)).toBe(100000);
  });

  it("returns null for a coin that is not listed", () => {
    expect(usdPerUnit({ kind: "coin", id: "missing" }, TABLES)).toBeNull();
  });

  it("returns 1 for usd", () => {
    expect(usdPerUnit(usd, TABLES)).toBe(1);
  });

  it("derives the usd value of another fiat from a reference coin", () => {
    expect(usdPerUnit(idr, TABLES)).toBeCloseTo(100000 / 1_600_000_000, 12);
    expect(usdPerUnit(eur, TABLES)).toBeCloseTo(100000 / 92000, 9);
  });

  it("returns null when the fiat prices are missing", () => {
    expect(usdPerUnit({ kind: "fiat", code: "jpy" }, TABLES)).toBeNull();
  });

  it("skips reference coins that have no price", () => {
    const tables: RateTables = {
      usd: [makeCoin({ id: "a", current_price: null }), BTC],
      fiat: {
        idr: [
          makeCoin({ id: "a", current_price: 5 }),
          makeCoin({ current_price: 1_600_000_000 }),
        ],
      },
    };
    expect(usdPerUnit(idr, tables)).toBeCloseTo(100000 / 1_600_000_000, 12);
  });

  it("returns null when no reference coin has both prices", () => {
    const tables: RateTables = {
      usd: [makeCoin({ current_price: null })],
      fiat: { idr: [makeCoin({ current_price: 1_600_000_000 })] },
    };
    expect(usdPerUnit(idr, tables)).toBeNull();
  });
});

describe("convert", () => {
  it("converts a coin to usd", () => {
    expect(convert(1, bitcoin, usd, TABLES)).toBe(100000);
  });

  it("converts a coin to another coin", () => {
    expect(convert(2, bitcoin, ethereum, TABLES)).toBe(50);
  });

  it("converts a coin to another fiat", () => {
    expect(convert(1, bitcoin, idr, TABLES)).toBeCloseTo(1_600_000_000, 3);
  });

  it("converts between two fiat currencies", () => {
    expect(convert(16000, idr, usd, TABLES)).toBeCloseTo(1, 9);
    expect(convert(16000, idr, eur, TABLES)).toBeCloseTo(0.92, 9);
  });

  it("converts back to the same amount in a round trip", () => {
    const there = convert(3, ethereum, idr, TABLES);
    expect(there).not.toBeNull();
    expect(convert(there ?? 0, idr, ethereum, TABLES)).toBeCloseTo(3, 9);
  });

  it("returns zero for a zero amount", () => {
    expect(convert(0, bitcoin, usd, TABLES)).toBe(0);
  });

  it("returns null when the source rate is missing", () => {
    expect(convert(1, { kind: "coin", id: "missing" }, usd, TABLES)).toBeNull();
  });

  it("returns null when the target rate is missing", () => {
    expect(convert(1, bitcoin, { kind: "fiat", code: "jpy" }, TABLES)).toBeNull();
  });

  it("returns null instead of dividing by a zero price", () => {
    const tables: RateTables = {
      usd: [BTC, makeCoin({ id: "dead", symbol: "dead", current_price: 0 })],
      fiat: {},
    };
    expect(convert(1, bitcoin, { kind: "coin", id: "dead" }, tables)).toBeNull();
  });
});

describe("unitLabel", () => {
  it("uses the upper case symbol for a coin", () => {
    expect(unitLabel(bitcoin, TABLES)).toBe("BTC");
  });

  it("uses the upper case code for a fiat", () => {
    expect(unitLabel(idr, TABLES)).toBe("IDR");
  });

  it("falls back to the id for an unknown coin", () => {
    expect(unitLabel({ kind: "coin", id: "missing" }, TABLES)).toBe("missing");
  });
});
