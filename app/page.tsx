import { Dashboard } from "@/components/Dashboard";

interface HomeProps {
  searchParams: Promise<{ coin?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { coin } = await searchParams;
  return <Dashboard initialCoinId={coin} />;
}
