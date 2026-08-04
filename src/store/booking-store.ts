import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface BookingDetailsState {
  /** Service being booked — captured on the select-worker step. */
  serviceId: number | null;
  serviceSlug: string;
  serviceTitle: string;

  /**
   * Shown in the booking summary (e.g. "Brick Mason" / "Brick Helper").
   * Defaults to generic labels; override once the API exposes per-service
   * worker labels.
   */
  workerLabel: string;
  helperLabel: string;

  /** Step 2 — service schedule. */
  bookDate: string;
  timeSlot: string;

  /** Step 2 — worksite address. */
  address: string;
  stateId: string;
  cityId: string;
  pincode: string;
  instructions: string;

  /** Resolved from checkAvailability once the address is confirmed. */
  serviceAreaId: number | null;

  acceptedTerms: boolean;

  setService: (service: { id: number | null; slug: string; title: string }) => void;
  setWorkerLabels: (labels: { workerLabel: string; helperLabel: string }) => void;
  setSchedule: (schedule: { bookDate: string; timeSlot: string }) => void;
  setAddress: (address: {
    address: string;
    stateId: string;
    cityId: string;
    pincode: string;
    instructions: string;
    serviceAreaId: number | null;
  }) => void;
  setAcceptedTerms: (accepted: boolean) => void;
  resetBooking: () => void;
}

const initialState = {
  serviceId: null,
  serviceSlug: "",
  serviceTitle: "",

  workerLabel: "Skilled Worker",
  helperLabel: "Helper",

  bookDate: "",
  timeSlot: "09:00",

  address: "",
  stateId: "",
  cityId: "",
  pincode: "",
  instructions: "",

  serviceAreaId: null,

  acceptedTerms: false,
};

export const useBookingStore = create<BookingDetailsState>()(
  persist(
    (set) => ({
      ...initialState,

      setService: (service) =>
        set({ serviceId: service.id, serviceSlug: service.slug, serviceTitle: service.title }),

      setWorkerLabels: (labels) =>
        set({ workerLabel: labels.workerLabel, helperLabel: labels.helperLabel }),

      setSchedule: (schedule) => set({ bookDate: schedule.bookDate, timeSlot: schedule.timeSlot }),

      setAddress: (address) =>
        set({
          address: address.address,
          stateId: address.stateId,
          cityId: address.cityId,
          pincode: address.pincode,
          instructions: address.instructions,
          serviceAreaId: address.serviceAreaId,
        }),

      setAcceptedTerms: (accepted) => set({ acceptedTerms: accepted }),

      resetBooking: () => set({ ...initialState }),
    }),
    { name: "booking-store" }
  )
);
