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
  /**
   * The full worksite line, built by the API from the linked address.
   *
   * `book_services` no longer stores the address itself — only `address_id`
   * into `user_addresses` — so the individual address/city/state/pincode
   * columns are gone and this is the only place the address is exposed.
   */
  worksite?: string | null;
  /** The customer's own name for that address, e.g. "Office". */
  worksite_label?: string | null;
  /** Only on cancelled bookings that had money against them. */
  refund?: BookingRefund | null;
  /** Totals and instalments — the source of truth for paid vs due. */
  billing?: BookingBilling;
  amount_due?: number;
  is_fully_paid?: boolean;
  /** Row in `user_addresses`; null when the booking was made signed-out. */
  address_id?: number | null;
  instruction?: string;
  // city_id / state_id / city_name / state_name / pincode / address were
  // dropped from `book_services` when the worksite was normalised into
  // `user_addresses`. Use `worksite` above.
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

/**
 * What was refunded when a booking was cancelled.
 *
 * Present only on cancelled bookings that had money against them; the API
 * omits it entirely otherwise.
 */
export interface BookingRefund {
  id: number;
  booking_amount: string;
  cancellation_charge: string;
  refund_amount: string;
  charge_percent: string;
  /** pending → the money is on its way; processed → it has left. */
  status: "pending" | "processed" | "failed" | "not_applicable";
  reason: string;
  /** Customer-facing wording, built by the API. */
  reason_label: string;
  processed_at: string | null;
}

/** One instalment taken against a booking. */
export interface BookingPayment {
  id: number;
  amount: number;
  method: string;
  method_label: string;
  kind: string;
  kind_label: string;
  reference: string | null;
  /** Staff member who took a cash payment; null for online. */
  collected_by: string | null;
  note: string | null;
  paid_at: string;
}

/**
 * The money side of a booking, computed by the API.
 *
 * Use this rather than deriving paid/unpaid from `transaction_id` — that only
 * ever holds one reference, so a booking paid in two parts reads as unpaid.
 */
export interface BookingBilling {
  total_amount: number;
  amount_paid: number;
  amount_due: number;
  payment_status: "unpaid" | "partial" | "paid" | "overpaid";
  payment_status_label: string;
  can_make_payment: boolean;
  can_pay_after_service: boolean;
  payments: BookingPayment[];
}

/**
 * Mirrors `BookService::STATUSES` in the API.
 *
 * `worker_assigned` / `on_the_way` / `work_started` are the finer-grained
 * operations states the dashboard shows on its progress rail. The API does not
 * send them yet — it collapses all three into `in_progress` — but they are
 * declared here so the rail lights up correctly the moment it starts to.
 */
export type BookingStatus =
  | "pending"
  | "confirmed"
  | "worker_assigned"
  | "on_the_way"
  | "work_started"
  | "in_progress"
  | "completed"
  | "cancelled"
  | "rejected";

export const BOOKING_STATUSES: BookingStatus[] = [
  "pending",
  "confirmed",
  "worker_assigned",
  "on_the_way",
  "work_started",
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
