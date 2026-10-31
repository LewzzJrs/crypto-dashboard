# Crypto Dashboard

An open-source cryptocurrency dashboard built with Next.js. It shows live prices for the top 250 coins, price charts from 1 minute to 1 month, a persistent watchlist and multi-currency support.

## Features

- Market table with the top 250 coins by market cap, search and 24h change indicators
- Price chart with 1m, 15m, 1h, 4h, 1D, 1W and 1M timeframes
- Top coin cards with 7-day sparklines
- Market overview comparing the 7-day performance of the top 3 coins
- Market trend list with the biggest 24h movers
- Watchlist saved in the browser (localStorage)
- 7 display currencies: USD, IDR, EUR, JPY, GBP, AUD, SGD
- Loading skeletons, error states with retry, and empty states
- Responsive layout

## Tech Stack

- [Next.js](https://nextjs.org) 16 (App Router, Route Handlers) and React 19
- TypeScript
- Tailwind CSS v4 and [shadcn/ui](https://ui.shadcn.com) (Base UI)
- [TanStack Query](https://tanstack.com/query) for data fetching and caching
- [Zustand](https://zustand-demo.pmnd.rs) for client state
- [Zod](https://zod.dev) for response validation
- [Recharts](https://recharts.org) for charts
- [lucide-react](https://lucide.dev) for icons

## Getting Started

### Requirements

- Node.js 20.9 or newer
- npm

### Installation

```bash
git clone https://github.com/LewzzJrs/crypto-dashboard.git
cd crypto-dashboard
npm install
```

### Run in development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for production

```bash
npm run build
npm start
```

### Other scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create a production build |
| `npm start` | Run the production build |
| `npm run lint` | Run ESLint |

## Environment Variables

No environment variables are required. Both data sources are public and need no API key. `.env.example` is included for reference and will list any variables added in the future.

## Data Sources

| Data | Source |
| --- | --- |
| Coin list, prices, sparklines, 1D / 1W / 1M charts | [CoinGecko](https://www.coingecko.com/en/api) public API |
| 1m, 15m, 1h and 4h charts | [Binance](https://developers.binance.com/docs/binance-spot-api-docs) public market data |

Notes:

- The browser never calls these APIs directly. Requests go through Route Handlers under `app/api`, which avoids CORS errors and lets Next.js cache the responses (60 seconds for the coin list, 5 minutes for CoinGecko charts, 15 seconds to 5 minutes for Binance candles).
- The CoinGecko free plan is rate limited. If you see request errors, wait a moment and use the retry button.
- Short timeframes use Binance USDT pairs, so prices are shown in USDT and only coins listed on Binance are available. Other coins show a message and can still use 1D, 1W and 1M.

## Project Structure

```
app/
  api/
    coins/              CoinGecko market list and per-coin charts
    candles/            Binance candles for short timeframes
  layout.tsx
  page.tsx
components/             Dashboard sections (header, cards, charts, table)
  ui/                   shadcn/ui primitives
hooks/                  TanStack Query hooks
lib/                    API client, schemas, formatters, constants
stores/                 Zustand stores (currency, watchlist)
```

## Design

The interface is based on the [Cryptocurrency Dashboard (FREEBIE)](https://www.figma.com/community/file/1020368000168618349) community design on Figma.

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a branch: `git switch -c feat/your-feature`
3. Commit using [Conventional Commits](https://www.conventionalcommits.org), for example `feat: add price alerts`
4. Push the branch and open a pull request

Please run `npm run lint` before opening a pull request.

## License

Released under the [MIT License](LICENSE).
