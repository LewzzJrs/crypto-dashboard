"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useCoins } from "@/hooks/useCoins";
import { buildRows, summarize } from "@/lib/portfolio";
import { formatAmount, formatPercent, formatPrice } from "@/lib/format";
import {
  CARD_CLASS,
  FIELD_CLASS,
  LABEL_CLASS,
  PRIMARY_BUTTON_CLASS,
} from "@/lib/styles";
import { useCurrencyStore } from "@/stores/currencyStore";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { CoinLogo } from "@/components/CoinLogo";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Header } from "@/components/Header";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

function pnlClass(value: number | null) {
  if (value === null || value === 0) return "text-white";
  return value > 0 ? "text-positive" : "text-destructive";
}

function signed(text: string, value: number | null) {
  return value !== null && value > 0 ? `+${text}` : text;
}

interface StatProps {
  label: string;
  value: string;
  hint?: string;
  valueClassName?: string;
}

function Stat({ label, value, hint, valueClassName = "text-white" }: StatProps) {
  return (
    <div className={CARD_CLASS}>
      <p className={LABEL_CLASS}>{label}</p>
      <p className={`mt-2 text-2xl font-semibold ${valueClassName}`}>{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function PortfolioView() {
  const { data, isLoading, error } = useCoins();
  const currency = useCurrencyStore((state) => state.currency);
  const holdings = usePortfolioStore((state) => state.holdings);
  const add = usePortfolioStore((state) => state.add);
  const remove = usePortfolioStore((state) => state.remove);
  const clear = usePortfolioStore((state) => state.clear);

  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [buyPrice, setBuyPrice] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const coins = data ?? [];
  const selectedId = coinId || coins[0]?.id || "";
  const rows = buildRows(holdings, coins, currency);
  const summary = summarize(rows);
  const upper = currency.toUpperCase();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedId) return;

    const parsedAmount = Number(amount);
    if (amount.trim() === "" || !Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError("Amount must be greater than 0.");
      return;
    }

    let parsedPrice: number | null = null;
    if (buyPrice.trim() !== "") {
      parsedPrice = Number(buyPrice);
      if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
        setFormError("Buy price must be 0 or more.");
        return;
      }
    }

    add({
      coinId: selectedId,
      amount: parsedAmount,
      buyPrice: parsedPrice,
      buyCurrency: currency,
    });
    setAmount("");
    setBuyPrice("");
    setFormError(null);
  };

  const hasHoldings = holdings.length > 0;
  const pnlText =
    summary.tracked > 0
      ? signed(formatPrice(summary.pnl, currency), summary.pnl)
      : "-";

  return (
    <>
      <Header title="Portfolio" />

      <div className="grid gap-5 md:grid-cols-3">
        <Stat
          label="Total value"
          value={isLoading ? "..." : formatPrice(summary.totalValue, currency)}
          hint={`${holdings.length} ${holdings.length === 1 ? "holding" : "holdings"}`}
        />
        <Stat
          label="Profit / Loss"
          value={pnlText}
          valueClassName={pnlClass(summary.tracked > 0 ? summary.pnl : null)}
          hint={
            summary.tracked > 0
              ? `${signed(formatPercent(summary.pnlPercent), summary.pnlPercent)} on ${summary.tracked} of ${holdings.length} holdings`
              : `Add a buy price in ${upper} to track profit`
          }
        />
        <Stat label="Currency" value={upper} hint="Change it in the header" />
      </div>

      <form
        onSubmit={handleSubmit}
        className={`${CARD_CLASS} grid gap-4 md:grid-cols-[1.4fr_1fr_1fr_auto] md:items-end`}
      >
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Coin</span>
          <select
            value={selectedId}
            onChange={(e) => setCoinId(e.target.value)}
            disabled={coins.length === 0}
            className={FIELD_CLASS}
          >
            {coins.map((coin) => (
              <option key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol.toUpperCase()})
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Amount</span>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.5"
            className={FIELD_CLASS}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className={LABEL_CLASS}>Buy price ({upper}, optional)</span>
          <input
            type="number"
            inputMode="decimal"
            step="any"
            min="0"
            value={buyPrice}
            onChange={(e) => setBuyPrice(e.target.value)}
            placeholder="0"
            className={FIELD_CLASS}
          />
        </label>
        <button
          type="submit"
          disabled={coins.length === 0}
          className={PRIMARY_BUTTON_CLASS}
        >
          Add holding
        </button>
        {formError && (
          <p role="alert" className="text-sm text-destructive md:col-span-4">
            {formError}
          </p>
        )}
      </form>

      <section className={`${CARD_CLASS} flex flex-col gap-3`}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-white">Holdings</h2>
          <ConfirmButton
            label="Clear all"
            confirmLabel="Click again to clear"
            disabled={!hasHoldings}
            onConfirm={clear}
          />
        </div>

        {isLoading && hasHoldings && <Skeleton className="h-24 w-full" />}
        {error && !data && (
          <p className="text-sm text-destructive">
            Could not load prices: {error.message}
          </p>
        )}

        {!hasHoldings && (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No holdings yet. Add your first coin above.
          </p>
        )}

        {hasHoldings && !(isLoading && !data) && (
          <Table>
            <TableHeader className="[&_th]:text-xs [&_th]:text-[#bfb7b7]">
              <TableRow>
                <TableHead>Coin</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Profit / Loss</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ holding, coin, value, pnl, pnlPercent }) => (
                <TableRow key={holding.id}>
                  <TableCell>
                    {coin && (
                      <CoinLogo
                        src={coin.image}
                        name={coin.name}
                        className="mr-3 inline-block size-7 max-w-none align-middle"
                      />
                    )}
                    <span className="align-middle text-white">
                      {coin ? coin.symbol.toUpperCase() : holding.coinId}
                    </span>
                    {coin && (
                      <span className="ml-2 hidden align-middle text-[#9a9a9a] sm:inline">
                        {coin.name}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-white">
                    {formatAmount(holding.amount)}
                  </TableCell>
                  <TableCell className="text-[#9292c1]">
                    {formatPrice(coin?.current_price ?? null, currency)}
                  </TableCell>
                  <TableCell className="text-white">
                    {formatPrice(value, currency)}
                  </TableCell>
                  <TableCell>
                    {pnl !== null ? (
                      <span className={pnlClass(pnl)}>
                        {signed(formatPrice(pnl, currency), pnl)} (
                        {signed(formatPercent(pnlPercent), pnlPercent)})
                      </span>
                    ) : (
                      <span
                        className="text-muted-foreground"
                        title={
                          holding.buyPrice !== null &&
                          holding.buyCurrency !== currency
                            ? `Bought in ${holding.buyCurrency.toUpperCase()}`
                            : "No buy price"
                        }
                      >
                        {holding.buyPrice !== null &&
                        holding.buyCurrency !== currency
                          ? `Bought in ${holding.buyCurrency.toUpperCase()}`
                          : "-"}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <button
                      type="button"
                      aria-label="Remove holding"
                      onClick={() => remove(holding.id)}
                      className="flex text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 size={16} />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </>
  );
}
