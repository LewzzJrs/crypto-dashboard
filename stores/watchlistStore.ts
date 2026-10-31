import { create } from "zustand";
import { persist } from "zustand/middleware";

type WatchlistState = {
  ids: string[];
  toggle: (id: string) => void;
  clear: () => void;
};

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((x) => x !== id)
            : [...state.ids, id],
        })),
      clear: () => set({ ids: [] }),
    }),
    { name: "watchlist", skipHydration: true },
  ),
);
