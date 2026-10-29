import { getCoins } from "@/lib/api"

export default async function Home() {
  const coins = await getCoins();
  return <pre>{JSON.stringify(coins, null, 2)}</pre>
}
