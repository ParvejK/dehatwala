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
  /** How far along the progress rail this status sits, 0-3. */
  stage: number;
  /** Terminal states stop the rail rather than advancing it. */
  stopped: boolean;
};

export const STATUS_TONES: Record<BookingStatus, StatusTone> = {
  pending: { label: "Pending Confirmation", badge: "bg-amber-50 text-amber-700", stage: 0, stopped: false },
  confirmed: { label: "Confirmed", badge: "bg-blue-50 text-[#0b3fc4]", stage: 1, stopped: false },
  in_progress: { label: "In Progress", badge: "bg-indigo-50 text-indigo-700", stage: 2, stopped: false },
  completed: { label: "Completed", badge: "bg-emerald-50 text-emerald-700", stage: 3, stopped: false },
  cancelled: { label: "Cancelled", badge: "bg-red-50 text-red-600", stage: 0, stopped: true },
  rejected: { label: "Rejected", badge: "bg-red-50 text-red-600", stage: 0, stopped: true },
};

/** Unknown values are treated as pending rather than crashing the row. */
export const statusTone = (status?: string): StatusTone =>
  STATUS_TONES[status as BookingStatus] ?? STATUS_TONES.pending;

/** The rail shown under every booking, matching the operations flow. */
export const STAGES = ["Confirmed", "Assigned", "Completed"] as const;

/** Filter chips above the list. `all` is handled separately. */
export const STATUS_FILTERS: { key: BookingStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

/** A booking still owing money — cancelled ones are not chased for payment. */
export const isAwaitingPayment = (booking: { transaction_id?: string; status?: string }) =>
  !booking.transaction_id && booking.status !== "cancelled" && booking.status !== "rejected";
