import { Link } from "react-router-dom";

import Modal from "./modal";
import RefundSummary from "./refund-summary";
import PaymentHistory from "./payment-history";
import { BookedService } from "../../react-query/booking-type";
import { readServiceWorkerObj } from "../booking/service-worker-obj";
import { isAwaitingPayment, statusTone } from "./booking-status";

const formatAmount = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(Math.round(value || 0))}`;

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const Row = ({ label, value, strong }: { label: string; value: React.ReactNode; strong?: boolean }) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <span className="text-[11px] font-semibold text-[#63739a]">{label}</span>
    <span className={`text-right text-[12px] ${strong ? "font-extrabold text-[#0b3fc4]" : "font-bold text-[#0f1e57]"}`}>
      {value}
    </span>
  </div>
);

const Group = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section className="mt-4 first:mt-0">
    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#8fa2c8]">{title}</h3>
    <div className="mt-1 divide-y divide-[#eef2f9] rounded-xl border border-[#eef2f9] px-3">{children}</div>
  </section>
);

/**
 * Everything recorded against one booking.
 *
 * Reads the row already held by the list query rather than fetching again —
 * the list response carries the full booking, so opening this is instant.
 */
const BookingDetailsModal = ({
  booking,
  onClose,
  onPay,
}: {
  booking: BookedService;
  onClose: () => void;
  onPay: () => void;
}) => {
  const tone = statusTone(booking.status);
  const workers = readServiceWorkerObj(booking.service_worker_obj);
  const awaitingPayment = isAwaitingPayment(booking);

  const tip = Number(booking.tip || 0);
  const discount = Number(booking.coupon_discounted || 0);
  const total = Number(booking.total_amount || 0);
  // From billing, so a part-paid booking shows what was actually taken.
  const paid = booking.billing?.amount_paid ?? (booking.transaction_id ? total : 0);
  const due = booking.billing?.amount_due ?? total - paid;

  // Cash bookings carry a convenience charge that is not stored as its own
  // column. Without deriving it the rows above simply did not add up to the
  // total — a ₹1,950 + ₹100 − ₹205 breakdown showing ₹1,882.
  const convenienceFee = Math.max(0, Math.round((total - (workers.workers_total + tip - discount)) * 100) / 100);

  // Built by the API from the linked saved address; the booking row no longer
  // stores the address itself.
  const worksite = booking.worksite;

  return (
    <Modal
      title="Booking Details"
      subtitle={`DW-${booking.id}`}
      size="md"
      onClose={onClose}
      footer={
        awaitingPayment ? (
          <button
            type="button"
            onClick={onPay}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0]"
          >
            Pay Now
          </button>
        ) : (
          <Link
            to="/dashboard/bookings"
            onClick={onClose}
            className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0]"
          >
            View All Bookings
          </Link>
        )
      }
    >
      <div className="flex justify-end">
        <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${tone.badge}`}>{tone.label}</span>
      </div>

      <Group title="Service Information">
        <Row label="Service" value={booking.service_title} />
        <Row label="Number of Workers" value={`${booking.worker_count ?? 0} Workers`} />
        {workers.workers.map((worker) => (
          <Row
            key={worker.key}
            label={worker.label}
            value={`${worker.day_count} × ${formatAmount(worker.day_rate)}${
              worker.overtime_count > 0 ? ` + ${worker.overtime_count} OT × ${formatAmount(worker.overtime_rate)}` : ""
            }`}
          />
        ))}
      </Group>

      <Group title="Booking Information">
        <Row label="Booking Date" value={formatDate(booking.book_date)} />
        <Row label="Time Slot" value={booking.time_slot || "—"} />
        <Row label="Work Location" value={<span className="block max-w-[15rem]">{worksite || "—"}</span>} />
        {booking.instruction && (
          <Row label="Instructions" value={<span className="block max-w-[15rem]">{booking.instruction}</span>} />
        )}
        <Row label="Placed On" value={formatDate(booking.created_at)} />
      </Group>

      <Group title="Payment Information">
        <Row label="Workers Subtotal" value={formatAmount(workers.workers_total)} />
        {tip > 0 && <Row label="Tip" value={formatAmount(tip)} />}
        {booking.coupon_code && (
          <Row label={`Coupon (${booking.coupon_code})`} value={`− ${formatAmount(discount)}`} />
        )}
        {convenienceFee > 0 && <Row label="Cash Convenience Charge" value={formatAmount(convenienceFee)} />}
        <Row label="Total Amount" value={formatAmount(total)} />
        <Row label="Paid Amount" value={formatAmount(paid)} />
        <Row label="Pending Amount" value={formatAmount(due)} strong={due > 0} />
        <Row label="Payment Mode" value={booking.payment_mode === "offline" ? "Pay after service" : "Online"} />
        {booking.transaction_id && <Row label="Transaction ID" value={booking.transaction_id} />}
      </Group>

      {/* Every instalment taken, with the running total. */}
      <div className="mt-4">
        <PaymentHistory billing={booking.billing} />
      </div>

      {/* Only present on a cancelled booking that had money against it. */}
      <div className="mt-4">
        <RefundSummary refund={booking.refund} />
      </div>
    </Modal>
  );
};

export default BookingDetailsModal;
