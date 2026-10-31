import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Holding = {
  id: string;
  coinId: string;
  amount: number;
  buyPrice: number | null;
  buyCurrency: string;
};

type PortfolioState = {
  holdings: Holding[];
  add: (holding: Omit<Holding, "id">) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const usePortfolioStore = create<PortfolioState>()(
  persist(
    (set) => ({
      holdings: [],
      add: (holding) =>
        set((state) => ({
          holdings: [
            ...state.holdings,
            {
              ...holding,
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            },
          ],
        })),
      remove: (id) =>
        set((state) => ({
          holdings: state.holdings.filter((holding) => holding.id !== id),
        })),
      clear: () => set({ holdings: [] }),
    }),
    { name: "portfolio", skipHydration: true },
  ),
);
