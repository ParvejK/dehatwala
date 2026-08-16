import { BookingStatus } from "../../react-query/booking-type";

/**
 * Presentation for the API's booking statuses.
 *
 * The dashboard previously read `status` as a number (0 cancelled / 1 confirmed
 * / 2 completed), which no longer matches anything the API sends — every
 * booking fell through to the same "Completed" badge regardless of its real
 * state, including ones that were still pending.
 */
export type StatusTone = {
  label: string;
  /** Tailwind classes for the badge. */
  badge: string;
  /** How many of the `STAGES` below are behind this status, 0-5. */
  stage: number;
  /** Terminal states stop the rail rather than advancing it. */
  stopped: boolean;
};

/**
 * The rail shown under every booking, matching the operations flow.
 *
 * `stage` on each tone below is an index into this list: the number of entries
 * already ticked off.
 */
export const STAGES = ["Confirmed", "Worker Assigned", "Workers On The Way", "Work Started", "Completed"] as const;

export const STATUS_TONES: Record<BookingStatus, StatusTone> = {
  pending: { label: "Booking Pending Confirmation", badge: "bg-amber-50 text-amber-700", stage: 0, stopped: false },
  confirmed: { label: "Confirmed", badge: "bg-blue-50 text-[#0b3fc4]", stage: 1, stopped: false },
  worker_assigned: { label: "Worker Assigned", badge: "bg-sky-50 text-sky-700", stage: 2, stopped: false },
  on_the_way: { label: "Workers On The Way", badge: "bg-violet-50 text-violet-700", stage: 3, stopped: false },
  work_started: { label: "Work Started", badge: "bg-indigo-50 text-indigo-700", stage: 4, stopped: false },
  // The API's single catch-all for everything between assignment and
  // completion, so it sits at the last live stage rather than inventing a
  // position of its own.
  in_progress: { label: "Work Started", badge: "bg-indigo-50 text-indigo-700", stage: 4, stopped: false },
  completed: { label: "Completed", badge: "bg-emerald-50 text-emerald-700", stage: 5, stopped: false },
  cancelled: { label: "Cancelled", badge: "bg-red-50 text-red-600", stage: 0, stopped: true },
  rejected: { label: "Rejected", badge: "bg-red-50 text-red-600", stage: 0, stopped: true },
};

/** Spellings the API might use for the same state, folded onto the canonical key. */
const STATUS_ALIASES: Record<string, BookingStatus> = {
  assigned: "worker_assigned",
  workers_assigned: "worker_assigned",
  worker_on_the_way: "on_the_way",
  workers_on_the_way: "on_the_way",
  on_way: "on_the_way",
  started: "work_started",
  work_in_progress: "in_progress",
};

/** Unknown values are treated as pending rather than crashing the row. */
export const statusTone = (status?: string): StatusTone =>
  STATUS_TONES[status as BookingStatus] ??
  STATUS_TONES[STATUS_ALIASES[status ?? ""]] ??
  STATUS_TONES.pending;

/** Filter chips above the list. `all` is handled separately. */
export const STATUS_FILTERS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "worker_assigned", label: "Worker Assigned" },
  { key: "on_the_way", label: "Workers On The Way" },
  { key: "work_started", label: "Work Started" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

/** A booking still owing money — cancelled ones are not chased for payment. */
export const isAwaitingPayment = (booking: {
  transaction_id?: string;
  status?: string;
  billing?: { amount_due: number };
}) => {
  if (booking.status === "cancelled" || booking.status === "rejected") return false;

  // `billing.amount_due` is authoritative: `transaction_id` holds one
  // reference, so a booking half-paid in two instalments looked fully settled
  // the moment the first one landed.
  if (booking.billing) return booking.billing.amount_due > 0;

  return !booking.transaction_id;
};
