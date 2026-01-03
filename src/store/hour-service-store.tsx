import { create } from "zustand";
import { persist } from "zustand/middleware";

const localStorageProvider = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: any) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

interface RateState {
  MasonHourCount: number;
  helperHourCount: number;

  MasonRate: number;
  helperRate: number;

  totalMasonHourRate: number;
  totalHelperHourRate: number;

  totalHourPrice: number;

  tipValue: number;

  incrementMasonHour: () => void;
  decrementMasonHour: () => void;
  incrementHelperHour: () => void;
  decrementHelperHour: () => void;

  setMasonRate: (rate: number) => void;
  setHelperRate: (rate: number) => void;

  setHourTipPrice: (value: number) => void;
  resetHourTipPrice: (value: number) => void;
  resetHourState: () => void;
}

const initialState: Omit<
  RateState,
  | "incrementMasonHour"
  | "decrementMasonHour"
  | "incrementHelperHour"
  | "decrementHelperHour"
  | "setMasonRate"
  | "setHelperRate"
  | "setHourTipPrice"
  | "resetHourTipPrice"
  | "resetHourState"
> = {
  MasonHourCount: 1,
  helperHourCount: 1,

  MasonRate: 250,
  helperRate: 200,

  totalMasonHourRate: 250,
  totalHelperHourRate: 200,

  totalHourPrice: 450,

  tipValue: 0,
};

export const useHourRateStore = create(
  persist<RateState>(
    (set) => ({
      ...initialState,

      setHourTipPrice: (value: number) =>
        set((state) => {
          const newTotalHourPrice = state.totalMasonHourRate + state.totalHelperHourRate + value; // Add tip to the total price
          return {
            tipValue: value,
            totalHourPrice: newTotalHourPrice,
          };
        }),

      resetHourTipPrice: () =>
        set((state) => {
          const newTotalHourPrice = state.totalMasonHourRate + state.totalHelperHourRate; // Remove tip from the total price
          return {
            tipValue: 0, // Reset tip value
            totalHourPrice: newTotalHourPrice,
          };
        }),

      setMasonRate: (rate: number) =>
        set((state) => {
          const newTotalMasonHourRate = state.MasonHourCount * rate;
          return {
            MasonRate: rate,
            totalMasonHourRate: newTotalMasonHourRate,
            totalHourPrice: newTotalMasonHourRate + state.totalHelperHourRate + state.tipValue,
          };
        }),

      setHelperRate: (rate: number) =>
        set((state) => {
          const newTotalHelperHourRate = state.helperHourCount * rate;
          return {
            helperRate: rate,
            totalHelperHourRate: newTotalHelperHourRate,
            totalHourPrice: state.totalMasonHourRate + newTotalHelperHourRate + state.tipValue,
          };
        }),

      incrementMasonHour: () =>
        set((state) => {
          const newMasonHourCount = state.MasonHourCount + 1;
          const newTotalMasonHourRate = newMasonHourCount * state.MasonRate;
          return {
            MasonHourCount: newMasonHourCount,
            totalMasonHourRate: newTotalMasonHourRate,
            totalHourPrice: newTotalMasonHourRate + state.totalHelperHourRate + state.tipValue,
          };
        }),

      decrementMasonHour: () =>
        set((state) => {
          const newMasonHourCount = Math.max(1, state.MasonHourCount - 1);
          const newTotalMasonHourRate = newMasonHourCount * state.MasonRate;
          return {
            MasonHourCount: newMasonHourCount,
            totalMasonHourRate: newTotalMasonHourRate,
            totalHourPrice: newTotalMasonHourRate + state.totalHelperHourRate + state.tipValue,
          };
        }),

      incrementHelperHour: () =>
        set((state) => {
          const newHelperHourCount = state.helperHourCount + 1;
          const newTotalHelperHourRate = newHelperHourCount * state.helperRate;
          return {
            helperHourCount: newHelperHourCount,
            totalHelperHourRate: newTotalHelperHourRate,
            totalHourPrice: state.totalMasonHourRate + newTotalHelperHourRate + state.tipValue,
          };
        }),

      decrementHelperHour: () =>
        set((state) => {
          const newHelperHourCount = Math.max(1, state.helperHourCount - 1);
          const newTotalHelperHourRate = newHelperHourCount * state.helperRate;
          return {
            helperHourCount: newHelperHourCount,
            totalHelperHourRate: newTotalHelperHourRate,
            totalHourPrice: state.totalMasonHourRate + newTotalHelperHourRate + state.tipValue,
          };
        }),
      resetHourState: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: "hour-rate-store",
      storage: localStorageProvider,
    }
  )
);
