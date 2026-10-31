import Image from "next/image";
import Link from "next/link";

const LAYERS = [
  {
    src: "/hero/sphere.png",
    left: 384,
    top: 244,
    width: 124,
    height: 124,
    duration: 7,
    delay: -2,
  },
  {
    src: "/hero/pill.png",
    left: 304,
    top: 94,
    width: 99.5,
    height: 120,
    duration: 5.5,
    delay: -1,
  },
  {
    src: "/hero/gem.png",
    left: 411,
    top: 88,
    width: 194,
    height: 145,
    duration: 6.5,
    delay: -4,
  },
  {
    src: "/hero/cube.png",
    left: 499,
    top: 161,
    width: 228,
    height: 170,
    duration: 8,
    delay: -3,
  },
  {
    src: "/hero/round-cube.png",
    left: 531,
    top: -6,
    width: 98,
    height: 83,
    duration: 5,
    delay: -2.5,
  },
  {
    src: "/hero/toroid.png",
    left: 384,
    top: -23,
    width: 133,
    height: 117,
    duration: 7.5,
    delay: -5,
  },
];

export function HeroBanner() {
  return (
    <section className="@container relative min-h-[289px] overflow-hidden rounded-[20px] border border-black bg-[linear-gradient(236.48deg,#a0525c_0%,#a0525c_10%,#9e5061_20%,#984c6b_30%,#904877_40%,#864283_50%,#793a91_60%,#6a329f_70%,#5828af_80%,#441dbf_90%,#2d11d1_100%)]">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-0 hidden h-full w-[628px] @min-[600px]:block"
      >
        {LAYERS.map(({ src, left, top, width, height, duration, delay }) => (
          <Image
            key={src}
            src={src}
            alt=""
            width={width}
            height={height}
            unoptimized
            className="hero-float absolute max-w-none select-none"
            style={
              {
                left,
                top,
                width,
                height,
                "--hero-float-duration": `${duration}s`,
                "--hero-float-delay": `${delay}s`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <div className="absolute left-[31px] top-[29px] flex flex-col gap-2.5">
        <p className="text-[10px] font-bold tracking-[1px] text-white">
          CRYPTO DASHBOARD
        </p>
        <div className="flex flex-col gap-[15px]">
          <p className="text-2xl font-bold text-white sm:text-[30px]">
            Your Gateway
            <br />
            into Crypto
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
