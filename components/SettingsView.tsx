"use client";

import { ExternalLink } from "lucide-react";
import { CurrencySelect } from "@/components/CurrencySelect";
import { ConfirmButton } from "@/components/ConfirmButton";
import { Header } from "@/components/Header";
import { DEFAULT_TIMEFRAME_ID, TIMEFRAMES, type Timeframe } from "@/lib/ranges";
import { REFRESH_OPTIONS } from "@/lib/settings";
import { CARD_CLASS, FIELD_CLASS } from "@/lib/styles";
import { useCurrencyStore } from "@/stores/currencyStore";
import { usePortfolioStore } from "@/stores/portfolioStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { useWatchlistStore } from "@/stores/watchlistStore";

const REPO_URL = "https://github.com/LewzzJrs/crypto-dashboard";

function timeframeName(timeframe: Timeframe) {
  if (timeframe.kind === "interval") {
    return `${timeframe.label} candles (USDT)`;
  }
  return `${timeframe.label} (${timeframe.days} ${timeframe.days === 1 ? "day" : "days"})`;
}

interface SettingRowProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

function SettingRow({ title, description, children }: SettingRowProps) {
  return (
    <div className="flex flex-col gap-3 border-b border-white/10 py-4 first:pt-0 last:border-b-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
      <div className="w-full shrink-0 sm:w-52 [&_select]:w-full">{children}</div>
    </div>
  );
}

export function SettingsView() {
  const refreshSeconds = useSettingsStore((state) => state.refreshSeconds);
  const defaultTimeframeId = useSettingsStore(
    (state) => state.defaultTimeframeId,
  );
  const setRefreshSeconds = useSettingsStore((state) => state.setRefreshSeconds);
  const setDefaultTimeframeId = useSettingsStore(
    (state) => state.setDefaultTimeframeId,
  );
  const resetSettings = useSettingsStore((state) => state.reset);
  const setCurrency = useCurrencyStore((state) => state.setCurrency);
  const watchlist = useWatchlistStore((state) => state.ids);
  const clearWatchlist = useWatchlistStore((state) => state.clear);
  const holdings = usePortfolioStore((state) => state.holdings);
  const clearPortfolio = usePortfolioStore((state) => state.clear);

  const refreshValue = REFRESH_OPTIONS.some(
    (option) => option.value === refreshSeconds,
  )
    ? refreshSeconds
    : 0;
  const timeframeValue = TIMEFRAMES.some(
    (timeframe) => timeframe.id === defaultTimeframeId,
  )
    ? defaultTimeframeId
    : DEFAULT_TIMEFRAME_ID;

  const handleReset = () => {
    resetSettings();
    setCurrency("usd");
  };

  return (
    <>
      <Header title="Settings" />

      <div className="grid items-start gap-5 xl:grid-cols-2">
        <section className={CARD_CLASS}>
          <h2 className="mb-4 text-lg font-bold text-white">Preferences</h2>

          <SettingRow
            title="Currency"
            description="Used for prices across every page."
          >
            <CurrencySelect />
          </SettingRow>

          <SettingRow
            title="Auto refresh"
            description="How often prices update by themselves."
          >
            <select
              aria-label="Auto refresh"
              value={refreshValue}
              onChange={(e) => setRefreshSeconds(Number(e.target.value))}
              className={FIELD_CLASS}
            >
              {REFRESH_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </SettingRow>

          <SettingRow
            title="Default chart timeframe"
            description="The timeframe the price chart starts with."
          >
            <select
              aria-label="Default chart timeframe"
              value={timeframeValue}
              onChange={(e) => setDefaultTimeframeId(e.target.value)}
              className={FIELD_CLASS}
            >
              {TIMEFRAMES.map((timeframe) => (
                <option key={timeframe.id} value={timeframe.id}>
                  {timeframeName(timeframe)}
                </option>
              ))}
            </select>
          </SettingRow>
        </section>

        <section className={CARD_CLASS}>
          <h2 className="mb-4 text-lg font-bold text-white">Your data</h2>
          <p className="mb-4 text-xs text-muted-foreground">
            Everything is saved in this browser only. Nothing is sent to a
            server.
          </p>

          <SettingRow
            title="Watchlist"
            description={`${watchlist.length} starred ${watchlist.length === 1 ? "coin" : "coins"}`}
          >
            <ConfirmButton
              label="Clear watchlist"
              confirmLabel="Click again to clear"
              disabled={watchlist.length === 0}
              onConfirm={clearWatchlist}
            />
          </SettingRow>

          <SettingRow
            title="Portfolio"
            description={`${holdings.length} ${holdings.length === 1 ? "holding" : "holdings"}`}
          >
            <ConfirmButton
              label="Clear portfolio"
              confirmLabel="Click again to clear"
              disabled={holdings.length === 0}
              onConfirm={clearPortfolio}
            />
          </SettingRow>

          <SettingRow
            title="Preferences"
            description="Back to USD, no auto refresh, 1W chart."
          >
            <ConfirmButton
              label="Reset preferences"
              confirmLabel="Click again to reset"
              onConfirm={handleReset}
            />
          </SettingRow>
        </section>
      </div>

      <section className={CARD_CLASS}>
        <h2 className="mb-2 text-lg font-bold text-white">About</h2>
        <p className="text-sm text-muted-foreground">
          Open-source crypto dashboard. Prices come from CoinGecko and short
          timeframe candles from Binance. Released under the MIT license.
        </p>
        <a
          href={REPO_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
        >
          View on GitHub
          <ExternalLink size={14} />
        </a>
      </section>
    </>
  );
}
