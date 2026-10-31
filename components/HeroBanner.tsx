export function HeroBanner() {
  return (
    <section className="relative min-h-[289px] overflow-hidden rounded-[20px] border border-black bg-[linear-gradient(236.48deg,rgba(255,122,122,0.56)_14.234%,rgb(42,15,211)_101.22%)]">
      <div className="absolute left-[31px] top-[29px] flex flex-col gap-2.5">
        <p className="text-[10px] font-bold tracking-[1px] text-white">
          CRYPTO DASHBOARD
        </p>
        <div className="flex flex-col gap-[15px]">
          <p className="text-2xl font-bold text-white sm:text-[30px]">
            Your Gateway
            <br />
            into the Crypto Market
          </p>
          <p className="text-sm font-medium text-white/80">
            Live prices, charts and a watchlist.
            <br />
            Powered by CoinGecko and Binance.
          </p>
        </div>
      </div>
      <a
        href="#coins"
        className="absolute left-[31px] top-[215px] rounded-[10px] bg-[#261b4c] px-[25px] py-3 text-base font-bold text-white"
      >
        Browse Coins
      </a>
    </section>
  );
}
