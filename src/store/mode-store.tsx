import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ModeStore {
  mode: "day" | "hour";
  setMode: (selectedMode: "day" | "hour") => void;
}

const useModeStore = create(
  persist<ModeStore>(
    (set) => ({
      mode: "day",
      setMode: (selectedMode) => set({ mode: selectedMode }),
    }),
    {
      name: "mode-storage",
    }
  )
);

export default useModeStore;
