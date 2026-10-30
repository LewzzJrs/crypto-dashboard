import { NextResponse } from "next/server";
import { isCurrency } from "@/lib/currencies";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("currency") ?? "usd";

  if (!isCurrency(raw)) {
    return NextResponse.json(
      { error: "Unsupported currency" },
      { status: 400 }
    );
  }

  const currency = raw;
  const url = `${BASE_URL}/coins/${encodeURIComponent(id)}/market_chart?vs_currency=${currency}&days=7`;

  const res = await fetch(url, { next: { revalidate: 300 } });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream failed: ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
