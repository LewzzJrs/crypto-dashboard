"use client";

import { useStoresReady } from "@/hooks/useStoresReady";
import { MobileNav, Sidebar } from "@/components/Sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export function AppShell({ children }: { children: React.ReactNode }) {
  const ready = useStoresReady();

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="min-w-0 flex-1 px-5 py-[30px] pb-24 sm:px-[30px] md:pb-[30px]">
        <div className="mx-auto flex max-w-[1280px] flex-col gap-5">
          {ready ? (
            children
          ) : (
            <>
              <Skeleton className="h-[47px] w-full" />
              <Skeleton className="h-[289px] w-full rounded-[20px]" />
            </>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
