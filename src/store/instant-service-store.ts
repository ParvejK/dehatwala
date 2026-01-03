import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ServiceStore {
  instantServiceId: number | null;
  serviceId: number | null;
  setInstantServiceId: (id: number | null) => void;
  setServiceId: (id: number | null) => void;
}

export const useServiceStore = create<ServiceStore>()(
  persist(
    (set) => ({
      instantServiceId: null,
      serviceId: null,
      setInstantServiceId: (id) => set({ instantServiceId: id }),
      setServiceId: (id) => set({ serviceId: id }),
    }),
    { name: "service-store" } // Key for localStorage
  )
);
