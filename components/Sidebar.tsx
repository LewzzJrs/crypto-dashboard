import { ChartPie, House, Settings, ShoppingBag } from "lucide-react";

const NAV_ITEMS = [
  { href: "#top", label: "Home", Icon: House, active: true },
  { href: "#coins", label: "Markets", Icon: ChartPie, active: false },
  { href: "#watchlist", label: "Watchlist", Icon: ShoppingBag, active: false },
  { href: "#currency", label: "Settings", Icon: Settings, active: false },
];

function LogoMark() {
  return (
    <svg width="42" height="46" viewBox="0 0 42 46" fill="none" aria-hidden>
      <defs>
        <linearGradient id="logo-top" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#ff5fa2" />
          <stop offset="1" stopColor="#c04bd9" />
        </linearGradient>
        <linearGradient id="logo-bottom" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#9a66f2" />
          <stop offset="1" stopColor="#5b3fd1" />
        </linearGradient>
      </defs>
      <path d="M21 0 41 11.5v23L21 46 1 34.5v-23z" fill="url(#logo-bottom)" />
      <path d="M21 0 41 11.5 21 23 1 11.5z" fill="url(#logo-top)" />
    </svg>
  );
}

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-[100px] shrink-0 flex-col items-center pt-[30px] shadow-[inset_-1.5px_0_0_0_rgba(255,255,255,0.15)] md:flex">
      <LogoMark />
      <nav aria-label="Main" className="mt-[77px] flex flex-col gap-4">
        {NAV_ITEMS.map(({ href, label, Icon, active }) => (
          <a
            key={label}
            href={href}
            aria-label={label}
            title={label}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex h-[58px] w-[61px] items-center justify-center rounded-[13px] bg-accent text-white"
                : "flex h-[58px] w-[61px] items-center justify-center rounded-[13px] text-muted-foreground transition-colors hover:text-white"
            }
          >
            <Icon size={22} />
          </a>
        ))}
      </nav>
    </aside>
  );
}
