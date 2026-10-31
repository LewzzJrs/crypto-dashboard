import type { Metadata } from "next";
import { MarketsView } from "@/components/MarketsView";

export const metadata: Metadata = { title: "Markets" };

interface MarketsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function MarketsPage({ searchParams }: MarketsPageProps) {
  const { q } = await searchParams;
  return <MarketsView initialSearch={q ?? ""} />;
}
