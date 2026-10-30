import { NextResponse } from "next/server";
import { isCurrency } from "@/lib/currencies";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("currency") ?? "usd";
  if (!isCurrency(raw)) {
    return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
  }
  const currency = raw;
  const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=250&page=1`;

  const res = await fetch(url, { next: { revalidate: 60} });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream Failed: ${res.status}`},
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
