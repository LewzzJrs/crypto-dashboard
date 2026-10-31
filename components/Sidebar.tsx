"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowLeftRight,
  ChartPie,
  House,
  Settings,
  ShoppingBag,
  Star,
} from "lucide-react";

const NAV_ITEMS = [
  { href: "/", label: "Home", Icon: House },
  { href: "/markets", label: "Markets", Icon: ChartPie },
  { href: "/watchlist", label: "Watchlist", Icon: Star },
  { href: "/portfolio", label: "Portfolio", Icon: ShoppingBag },
  { href: "/converter", label: "Converter", Icon: ArrowLeftRight },
  { href: "/settings", label: "Settings", Icon: Settings },
];

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

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
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-screen w-[100px] shrink-0 flex-col items-center overflow-y-auto pt-[30px] shadow-[inset_-1.5px_0_0_0_rgba(255,255,255,0.15)] [scrollbar-width:none] md:flex">
      <Link href="/" aria-label="Crypto Dashboard home">
        <LogoMark />
      </Link>
      <nav
        aria-label="Main"
        className="mt-[77px] flex flex-col gap-4 pb-[30px]"
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
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
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-20 flex justify-around border-t border-white/10 bg-background/95 px-2 py-2 backdrop-blur md:hidden"
    >
      {NAV_ITEMS.map(({ href, label, Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            aria-label={label}
            aria-current={active ? "page" : undefined}
            className={
              active
                ? "flex size-11 items-center justify-center rounded-[13px] bg-accent text-white"
                : "flex size-11 items-center justify-center rounded-[13px] text-muted-foreground"
            }
          >
            <Icon size={22} />
          </Link>
        );
      })}
    </nav>
  );
}
