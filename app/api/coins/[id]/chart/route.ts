import { NextResponse } from "next/server";

const BASE_URL = "https://api.coingecko.com/api/v3";

export async function GET (
  request: Request,
  { params }: { params: Promise<{id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const currency = searchParams.get("currency") ?? "usd";
  const url = `${BASE_URL}/coins/${id}/market_chart?vs_currency=${currency}&days=7`;

  const res = await fetch(url, {next: { revalidate: 300} });

  if (!res.ok) {
    return NextResponse.json(
      { error: `Upstream failed: ${res.status}` },
      { status: res.status }
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}