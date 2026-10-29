"use client";

import { useCoins } from "@/hooks/useCoins";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table"

export function CoinTable() {
  const { data, isLoading, error } = useCoins();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Failed to load data</p>;
  if (!data) return null;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>24h %</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((coin) => (
          <TableRow key={coin.id}>
            <TableCell>{coin.market_cap_rank}</TableCell>
            <TableCell>{coin.name}</TableCell>
            <TableCell>{coin.current_price}</TableCell>
            <TableCell>{coin.price_change_percentage_24h}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}


