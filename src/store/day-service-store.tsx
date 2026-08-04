import { create } from "zustand";
import { persist } from "zustand/middleware";

const localStorageProvider = {
  getItem: (name: string) => {
    const value = localStorage.getItem(name);
    return value ? JSON.parse(value) : null;
  },
  setItem: (name: string, value: unknown) => {
    localStorage.setItem(name, JSON.stringify(value));
  },
  removeItem: (name: string) => {
    localStorage.removeItem(name);
  },
};

/** Rates and counts the service being booked. Guards against carrying one service's numbers into another. */
type ServiceWorkerConfig = {
  serviceId: number | null;
  /** 0 means the worker is not offered by this service and must not be charged. */
  masonRate: number;
  masonOvertimeRate: number;
  helperRate: number;
  helperOvertimeRate: number;
};

interface RateState {
  /** Which service the rates below belong to. */
  serviceId: number | null;

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

  configureService: (config: ServiceWorkerConfig) => void;

  setTipPrice: (value: number) => void;
  resetDayTipPrice: (value: number) => void;
  resetDayState: () => void;
}

const initialState = {
  serviceId: null,

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

      /**
       * Applies the rates of the service being booked. A rate of 0 means that
       * worker is not offered, so its count and totals are forced to 0 instead
       * of falling back to the seeded defaults. Counts reset whenever the
       * service changes, so one booking never inherits another's quantities.
       */
      configureService: ({ serviceId, masonRate, masonOvertimeRate, helperRate, helperOvertimeRate }) =>
        set((state) => {
          const isSameService = state.serviceId === serviceId;

          const masonDayCount = masonRate > 0 ? (isSameService ? Math.max(1, state.MasonDayCount) : 1) : 0;
          const helperDayCount = helperRate > 0 ? (isSameService ? Math.max(1, state.helperDayCount) : 1) : 0;

          const masonOvertimeCount =
            masonOvertimeRate > 0 && masonDayCount > 0 && isSameService ? state.MasonOvertimeCount : 0;
          const helperOvertimeCount =
            helperOvertimeRate > 0 && helperDayCount > 0 && isSameService ? state.helperOvertimeCount : 0;

          const tipValue = isSameService ? state.tipValue : 0;

          const totalMasonDayRate = masonDayCount * masonRate;
          const totalHelperDayRate = helperDayCount * helperRate;
          const totalMasonOvertimeRate = masonOvertimeCount * masonOvertimeRate;
          const totalHelperOvertimeRate = helperOvertimeCount * helperOvertimeRate;

          return {
            serviceId,

            MasonRate: masonRate,
            helperRate,
            MasonOvertimeRate: masonOvertimeRate,
            helperOvertimeRate,

            MasonDayCount: masonDayCount,
            helperDayCount,
            MasonOvertimeCount: masonOvertimeCount,
            helperOvertimeCount,

            totalMasonDayRate,
            totalHelperDayRate,
            totalMasonOvertimeRate,
            totalHelperOvertimeRate,

            tipValue,
            totalDayPrice:
              totalMasonDayRate + totalHelperDayRate + totalMasonOvertimeRate + totalHelperOvertimeRate + tipValue,
          };
        }),

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
