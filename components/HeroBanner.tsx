import Link from "next/link";

export function HeroBanner() {
  return (
    <section className="relative min-h-[289px] overflow-hidden rounded-[20px] border border-black bg-[linear-gradient(236.48deg,#a0525c_0%,#a0525c_10%,#9e5061_20%,#984c6b_30%,#904877_40%,#864283_50%,#793a91_60%,#6a329f_70%,#5828af_80%,#441dbf_90%,#2d11d1_100%)]">
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
      <Link
        href="/markets"
        className="absolute left-[31px] top-[215px] rounded-[10px] bg-[#261b4c] px-[25px] py-3 text-base font-bold text-white"
      >
        Browse Coins
      </Link>
    </section>
  );
}
