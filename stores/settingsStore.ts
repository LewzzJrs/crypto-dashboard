import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_TIMEFRAME_ID } from "@/lib/ranges";

type SettingsState = {
  refreshSeconds: number;
  defaultTimeframeId: string;
  setRefreshSeconds: (seconds: number) => void;
  setDefaultTimeframeId: (id: string) => void;
  reset: () => void;
};

const DEFAULTS = {
  refreshSeconds: 0,
  defaultTimeframeId: DEFAULT_TIMEFRAME_ID,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULTS,
      setRefreshSeconds: (refreshSeconds) => set({ refreshSeconds }),
      setDefaultTimeframeId: (defaultTimeframeId) =>
        set({ defaultTimeframeId }),
      reset: () => set(DEFAULTS),
    }),
    { name: "settings", skipHydration: true },
  ),
);
