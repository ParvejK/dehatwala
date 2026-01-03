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
  MasonDayCount: number;
  helperDayCount: number;

  MasonRate: number;
  helperRate: number;

  MasonOvertimeCount: number;
  helperOvertimeCount: number;

  MasonOvertimeRate: number;
  helperOvertimeRate: number;

  totalMasonDayRate: number;
  totalHelperDayRate: number;
  totalMasonOvertimeRate: number;
  totalHelperOvertimeRate: number;

  totalDayPrice: number;
  tipValue: number;

  incrementMasonDay: () => void;
  decrementMasonDay: () => void;
  incrementHelperDay: () => void;
  decrementHelperDay: () => void;

  incrementMasonOvertime: () => void;
  decrementMasonOvertime: () => void;
  incrementHelperOvertime: () => void;
  decrementHelperOvertime: () => void;

  setMasonDayRate: (rate: number) => void;
  setHelperDayRate: (rate: number) => void;
  setMasonOvertimeRate: (rate: number) => void;
  setHelperOvertimeRate: (rate: number) => void;

  setTipPrice: (value: number) => void;
  resetDayTipPrice: (value: number) => void;
  resetDayState: () => void;
}

const initialState = {
  MasonDayCount: 1,
  helperDayCount: 1,

  MasonRate: 800, // Default rates
  helperRate: 600,

  MasonOvertimeCount: 0,
  helperOvertimeCount: 0,

  MasonOvertimeRate: 200, // Default overtime rates
  helperOvertimeRate: 150,

  totalMasonDayRate: 800,
  totalHelperDayRate: 600,
  totalMasonOvertimeRate: 0,
  totalHelperOvertimeRate: 0,

  totalDayPrice: 1400, // Initial total price (Mason + helper)

  tipValue: 0,
};
export const useDayRateStore = create(
  persist<RateState>(
    (set) => ({
      ...initialState,

      setTipPrice: (value: number) =>
        set((state) => {
          const newTotalDayPrice =
            state.totalMasonDayRate +
            state.totalHelperDayRate +
            state.totalMasonOvertimeRate +
            state.totalHelperOvertimeRate +
            value; // Add the tip value to the total price
          return {
            tipValue: value,
            totalDayPrice: newTotalDayPrice,
          };
        }),

      resetDayTipPrice: () =>
        set((state) => {
          const newTotalDayPrice =
            state.totalMasonDayRate +
            state.totalHelperDayRate +
            state.totalMasonOvertimeRate +
            state.totalHelperOvertimeRate; // Exclude the tip value
          return {
            tipValue: 0, // Reset the tip value to 0
            totalDayPrice: newTotalDayPrice,
          };
        }),

      setMasonDayRate: (rate: number) =>
        set((state) => {
          const newTotalMasonDayRate = state.MasonDayCount * rate;
          return {
            MasonRate: rate,
            totalMasonDayRate: newTotalMasonDayRate,
            totalDayPrice:
              newTotalMasonDayRate +
              state.totalHelperDayRate +
              state.totalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      setHelperDayRate: (rate: number) =>
        set((state) => {
          const newTotalHelperDayRate = state.helperDayCount * rate;
          return {
            helperRate: rate,
            totalHelperDayRate: newTotalHelperDayRate,
            totalDayPrice:
              state.totalMasonDayRate +
              newTotalHelperDayRate +
              state.totalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      setMasonOvertimeRate: (rate: number) =>
        set((state) => {
          const newTotalMasonOvertimeRate = state.MasonOvertimeCount * rate;
          return {
            MasonOvertimeRate: rate,
            totalMasonOvertimeRate: newTotalMasonOvertimeRate,
            totalDayPrice:
              state.totalMasonDayRate +
              state.totalHelperDayRate +
              newTotalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      setHelperOvertimeRate: (rate: number) =>
        set((state) => {
          const newTotalHelperOvertimeRate = state.helperOvertimeCount * rate;
          return {
            helperOvertimeRate: rate,
            totalHelperOvertimeRate: newTotalHelperOvertimeRate,
            totalDayPrice:
              state.totalMasonDayRate +
              state.totalHelperDayRate +
              state.totalMasonOvertimeRate +
              newTotalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      incrementMasonDay: () =>
        set((state) => {
          const newMasonDayCount = state.MasonDayCount + 1;
          const newTotalMasonDayRate = newMasonDayCount * state.MasonRate;
          return {
            MasonDayCount: newMasonDayCount,
            totalMasonDayRate: newTotalMasonDayRate,
            totalDayPrice:
              newTotalMasonDayRate +
              state.totalHelperDayRate +
              state.totalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      decrementMasonDay: () =>
        set((state) => {
          const newMasonDayCount = Math.max(1, state.MasonDayCount - 1);
          const newTotalMasonDayRate = newMasonDayCount * state.MasonRate;
          return {
            MasonDayCount: newMasonDayCount,
            totalMasonDayRate: newTotalMasonDayRate,
            totalDayPrice:
              newTotalMasonDayRate +
              state.totalHelperDayRate +
              state.totalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      incrementHelperDay: () =>
        set((state) => {
          const newHelperDayCount = state.helperDayCount + 1;
          const newTotalHelperDayRate = newHelperDayCount * state.helperRate;
          return {
            helperDayCount: newHelperDayCount,
            totalHelperDayRate: newTotalHelperDayRate,
            totalDayPrice:
              state.totalMasonDayRate +
              newTotalHelperDayRate +
              state.totalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      decrementHelperDay: () =>
        set((state) => {
          const newHelperDayCount = Math.max(1, state.helperDayCount - 1);
          const newTotalHelperDayRate = newHelperDayCount * state.helperRate;
          return {
            helperDayCount: newHelperDayCount,
            totalHelperDayRate: newTotalHelperDayRate,
            totalDayPrice:
              state.totalMasonDayRate +
              newTotalHelperDayRate +
              state.totalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      incrementMasonOvertime: () =>
        set((state) => {
          const newMasonOvertimeCount = state.MasonOvertimeCount + 1;
          const newTotalMasonOvertimeRate = newMasonOvertimeCount * state.MasonOvertimeRate;
          return {
            MasonOvertimeCount: newMasonOvertimeCount,
            totalMasonOvertimeRate: newTotalMasonOvertimeRate,
            totalDayPrice:
              state.totalMasonDayRate +
              state.totalHelperDayRate +
              newTotalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      decrementMasonOvertime: () =>
        set((state) => {
          const newMasonOvertimeCount = Math.max(0, state.MasonOvertimeCount - 1);
          const newTotalMasonOvertimeRate = newMasonOvertimeCount * state.MasonOvertimeRate;
          return {
            MasonOvertimeCount: newMasonOvertimeCount,
            totalMasonOvertimeRate: newTotalMasonOvertimeRate,
            totalDayPrice:
              state.totalMasonDayRate +
              state.totalHelperDayRate +
              newTotalMasonOvertimeRate +
              state.totalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      incrementHelperOvertime: () =>
        set((state) => {
          const newHelperOvertimeCount = state.helperOvertimeCount + 1;
          const newTotalHelperOvertimeRate = newHelperOvertimeCount * state.helperOvertimeRate;
          return {
            helperOvertimeCount: newHelperOvertimeCount,
            totalHelperOvertimeRate: newTotalHelperOvertimeRate,
            totalDayPrice:
              state.totalMasonDayRate +
              state.totalHelperDayRate +
              state.totalMasonOvertimeRate +
              newTotalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      decrementHelperOvertime: () =>
        set((state) => {
          const newHelperOvertimeCount = Math.max(0, state.helperOvertimeCount - 1);
          const newTotalHelperOvertimeRate = newHelperOvertimeCount * state.helperOvertimeRate;
          return {
            helperOvertimeCount: newHelperOvertimeCount,
            totalHelperOvertimeRate: newTotalHelperOvertimeRate,
            totalDayPrice:
              state.totalMasonDayRate +
              state.totalHelperDayRate +
              state.totalMasonOvertimeRate +
              newTotalHelperOvertimeRate +
              state.tipValue,
          };
        }),

      resetDayState: () =>
        set(() => ({
          ...initialState,
        })),
    }),
    {
      name: "day-rate-store", // Key for localStorage
      storage: localStorageProvider,
    }
  )
);
