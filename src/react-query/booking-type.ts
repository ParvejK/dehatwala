import { ServiceWorkerObj } from "../components/booking/service-worker-obj";

export interface BookedService {
  id: number;
  user_id: number;
  service_id: number;
  service_title: string;
  /** For linking back to the service; null once that service is deleted. */
  service_slug?: string | null;
  /** Bare filename — build the URL as `${VITE_IMAGE_PATH_URL}/service/${name}`. */
  service_image?: string | null;
  display_title?: string;
  address: string;
  address_label?: string;
  /** Row in `user_addresses`; null when the booking was made signed-out. */
  address_id?: number | null;
  instruction?: string;
  city_id: number;
  state_id: number;
  city_name?: string;
  state_name?: string;
  pincode: number;
  meta_title: string | null;
  meta_keyword: string | null;
  meta_description: string | null;
  mode: "day" | "hour"; // Assuming only these modes are allowed
  book_date: string; // ISO date format
  time_slot: string; // Time in HH:mm format
  pick_and_drop: number; // 0 or 1
  tip: number;
  transaction_id?: string;
  total_amount: number;
  coupon_code: string | null;
  coupon_discounted: number;
  /** Worker breakdown frozen at booking time. Older rows may hold the legacy
   *  flat object, so read it through `readServiceWorkerObj`. */
  service_worker_obj: ServiceWorkerObj | Record<string, unknown> | string | null;
  status: BookingStatus;
  payment_mode?: "online" | "offline";
  /** Total workers on the booking, summed from the snapshot by the API. */
  worker_count?: number;
  deleted_at: string | null;
  created_at: string; // ISO date format
  updated_at: string; // ISO date format
}

/** Mirrors `BookService::STATUSES` in the API. */
export type BookingStatus = "pending" | "confirmed" | "in_progress" | "completed" | "cancelled" | "rejected";

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "rejected",
];

// Type for the entire API response
export interface BookedServicesResponse {
  booked_services: BookedService[];
  meta?: {
    total: number;
    /** Counts across the customer's whole history, not just the page shown. */
    status_counts: Record<BookingStatus, number>;
    pending_payment_total: number;
  };
}
