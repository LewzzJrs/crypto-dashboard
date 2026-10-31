import { NextResponse } from "next/server";
import { isInterval } from "@/lib/ranges";

const BASE_URL = "https://data-api.binance.vision/api/v3";
const SYMBOL_PATTERN = /^[a-z0-9]{1,20}$/i;
const LIMIT = 200;
const REVALIDATE_SECONDS = { "1m": 15, "15m": 60, "1h": 120, "4h": 300 } as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") ?? "";
  const interval = searchParams.get("interval") ?? "";

  if (!SYMBOL_PATTERN.test(symbol)) {
    return NextResponse.json({ error: "Invalid symbol" }, { status: 400 });
  }

  if (!isInterval(interval)) {
    return NextResponse.json(
      { error: "Unsupported interval" },
      { status: 400 }
    );
  }

  const name = symbol.toUpperCase();
  const url = `${BASE_URL}/klines?symbol=${name}USDT&interval=${interval}&limit=${LIMIT}`;

  const res = await fetch(url, {
    next: { revalidate: REVALIDATE_SECONDS[interval] },
  });

  if (res.status === 400) {
    return NextResponse.json(
      { error: `${name} is not available on Binance. Try 1D, 1W, or 1M.` },
      { status: 404 }
    );
  }

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream failed: ${res.status}` },
      { status: res.status }
    );
  }

  const rows = (await res.json()) as unknown[][];
  const prices = rows.map((row) => [Number(row[0]), Number(row[4])]);

  return NextResponse.json({ prices });
}
