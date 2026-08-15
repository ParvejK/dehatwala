import axios from "axios";
import {
  AlertTriangle,
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Repeat2,
  Star,
  Ticket,
  Users,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";

import { readServiceWorkerObj } from "../../components/booking/service-worker-obj";
import { isAwaitingPayment, STAGES, statusTone } from "../../components/dashboard/booking-status";
import PaymentHistory from "../../components/dashboard/payment-history";
import PaymentModal from "../../components/dashboard/payment-modal";
import RefundSummary from "../../components/dashboard/refund-summary";
import { SkeletonBookingCard, SkeletonListRow } from "../../components/skeleton/skeleton";
import { useBookedService, useCancelBooking } from "../../react-query/auth-booked-service-api";
import { BookedService } from "../../react-query/booking-type";
import { useAuthStore } from "../../store/auth-store";

const formatAmount = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(Math.round(value || 0))}`;

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" })
    : "—";

/** One label/value pair in the detail panels. */
const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2.5">
    <dt className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#8fa2c8]">{label}</dt>
    <dd className="text-right text-[12px] font-semibold text-[#0f1e57]">{value}</dd>
  </div>
);

const Panel = ({ title, icon: Icon, children }: { title: string; icon: typeof MapPin; children: React.ReactNode }) => (
  <section className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
    <h2 className="flex items-center gap-2 text-[13px] font-extrabold text-[#0f1e57]">
      <Icon size={15} className="text-[#0b3fc4]" aria-hidden="true" />
      {title}
    </h2>
    <div className="mt-2 divide-y divide-[#eef2f9]">{children}</div>
  </section>
);

const DashboardBookingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuthStore();

  const { data, isLoading, isError } = useBookedService(token ?? "");
  const cancelBooking = useCancelBooking(token ?? "");
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [payingFor, setPayingFor] = useState<BookedService | null>(null);

  // Served from the list query's cache when arriving from the list, so opening a
  // booking is instant and there is one source of truth for its data.
  const booking = useMemo(() => data?.booked_services?.find((item) => String(item.id) === id), [data, id]);

  const workers = useMemo(() => readServiceWorkerObj(booking?.service_worker_obj), [booking]);

  if (isLoading) {
    // Shaped like the page it stands in for: header, two panels, then the
    // workers table — rather than one tall grey block.
    return (
      <div role="status" aria-busy="true" className="space-y-4">
        <span className="sr-only">Loading booking</span>
        <SkeletonBookingCard />
        <div className="grid gap-4 lg:grid-cols-2">
          <SkeletonListRow lines={3} />
          <SkeletonListRow lines={3} />
        </div>
        <SkeletonListRow lines={4} />
      </div>
    );
  }

  if (isError || !booking) {
    return (
      <div className="rounded-2xl border border-[#dce7fb] bg-white p-10 text-center">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
          <CalendarDays size={26} aria-hidden="true" />
        </span>
        <h2 className="mt-4 text-sm font-extrabold text-[#0f1e57]">Booking not found</h2>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#63739a]">
          This booking may have been removed, or it belongs to a different account.
        </p>
        <Link
          to="/dashboard/bookings"
          className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0]"
        >
          Back to my bookings
        </Link>
      </div>
    );
  }

  const tone = statusTone(booking.status);
  const isPaid = booking.billing ? booking.billing.amount_due <= 0 : !!booking.transaction_id;
  const awaitingPayment = isAwaitingPayment(booking);
  // Cancel stays offered once work is under way — the customer may still need
  // to call it off, and the API replies with how. Matches the bookings list.
  const canCancel = booking.status === "pending" || booking.status === "confirmed" || booking.status === "in_progress";

  const tip = Number(booking.tip || 0);
  const discount = Number(booking.coupon_discounted || 0);
  const total = Number(booking.total_amount || 0);

  const confirmCancel = async () => {
    try {
      await cancelBooking.mutateAsync(booking.id);
      toast.success("Booking cancelled.");
      setConfirmingCancel(false);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "We could not cancel this booking.")
        : "We could not cancel this booking.";
      toast.error(message);
    }
  };

  // Built by the API from the linked saved address.
  const worksite = booking.worksite;

  return (
    <div className="space-y-4">
      {payingFor && (
        <PaymentModal booking={payingFor} onClose={() => setPayingFor(null)} onPaid={() => setPayingFor(null)} />
      )}

      {confirmingCancel && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-detail-title"
          className="fixed inset-0 z-[100] grid place-items-center bg-[#0f1e57]/70 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-[#dce7fb] bg-white p-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={22} aria-hidden="true" />
            </span>
            <h3 id="cancel-detail-title" className="mt-4 text-sm font-extrabold text-[#0f1e57]">
              Cancel this booking?
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#63739a]">
              DW-{booking.id} will be cancelled. This cannot be undone, and cancellation charges may apply.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setConfirmingCancel(false)}
                disabled={cancelBooking.isPending}
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-4 text-[11px] font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff] disabled:opacity-60"
              >
                Keep booking
              </button>
              <button
                type="button"
                onClick={confirmCancel}
                disabled={cancelBooking.isPending}
                className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg bg-red-600 px-4 text-[11px] font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cancelBooking.isPending ? "Cancelling…" : "Yes, cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => navigate("/dashboard/bookings")}
        className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#0b3fc4] hover:underline"
      >
        <ArrowLeft size={14} aria-hidden="true" /> Back to my bookings
      </button>

      {/* ---------- Header ---------- */}
      <header className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-base font-extrabold text-[#0f1e57] sm:text-lg">{booking.service_title}</h1>
            <p className="mt-1 text-[11px] font-bold text-[#0b3fc4]">Booking ID: DW-{booking.id}</p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${tone.badge}`}>
            {tone.label}
            {isPaid && booking.status === "completed" ? " • Paid" : ""}
          </span>
        </div>

        <ol className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[#eef2f9] pt-3.5">
          {STAGES.map((stage, index) => {
            const done = index < tone.stage;
            const stopped = tone.stopped && index === tone.stage;

            if (tone.stopped && index > tone.stage) return null;

            return (
              <li key={stage} className="inline-flex items-center gap-1.5 text-[11px] font-bold">
                {stopped ? (
                  <XCircle size={14} className="text-red-500" aria-hidden="true" />
                ) : (
                  <CheckCircle2 size={14} className={done ? "text-emerald-600" : "text-[#cdd8ee]"} aria-hidden="true" />
                )}
                <span className={stopped ? "text-red-600" : done ? "text-[#0f1e57]" : "text-[#a8b6d4]"}>
                  {stopped ? tone.label : stage}
                </span>
              </li>
            );
          })}
        </ol>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel title="Schedule" icon={Clock3}>
          <Row label="Work date" value={formatDate(booking.book_date)} />
          {/* <Row label="Time slot" value={booking.time_slot || "—"} /> */}
          <Row label="Booking type" value={booking.mode === "hour" ? "Hourly" : "Per day"} />
          <Row label="Placed on" value={formatDate(booking.created_at)} />
        </Panel>

        <Panel title="Worksite" icon={MapPin}>
          <Row label="Label" value={booking.worksite_label || "Worksite"} />
          <Row label="Address" value={<span className="block max-w-[15rem]">{worksite || "—"}</span>} />
          {booking.instruction && (
            <Row label="Instructions" value={<span className="block max-w-[15rem]">{booking.instruction}</span>} />
          )}
        </Panel>
      </div>

      {/* ---------- Workers ---------- */}
      <section className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
        <h2 className="flex items-center gap-2 text-[13px] font-extrabold text-[#0f1e57]">
          <Users size={15} className="text-[#0b3fc4]" aria-hidden="true" />
          Workers &amp; Charges
        </h2>

        {workers.workers.length === 0 ? (
          <p className="mt-3 text-xs text-[#63739a]">No worker breakdown was recorded for this booking.</p>
        ) : (
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[34rem] text-left">
              <thead>
                <tr className="border-b border-[#eef2f9] text-[10px] font-bold uppercase tracking-[0.08em] text-[#8fa2c8]">
                  <th className="pb-2">Worker</th>
                  <th className="pb-2 text-right">Days × Rate</th>
                  <th className="pb-2 text-right">Overtime</th>
                  <th className="pb-2 text-right">Line total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#eef2f9]">
                {workers.workers.map((worker) => (
                  <tr key={worker.key} className="text-[12px] font-semibold text-[#0f1e57]">
                    <td className="py-2.5">{worker.label}</td>
                    <td className="py-2.5 text-right">
                      {worker.day_count} × {formatAmount(worker.day_rate)}
                    </td>
                    <td className="py-2.5 text-right">
                      {worker.overtime_count > 0
                        ? `${worker.overtime_count} × ${formatAmount(worker.overtime_rate)}`
                        : "—"}
                    </td>
                    <td className="py-2.5 text-right font-extrabold">{formatAmount(worker.line_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ---------- Payment ---------- */}
      <Panel title="Payment" icon={CreditCard}>
        <Row label="Workers subtotal" value={formatAmount(workers.workers_total)} />
        {tip > 0 && <Row label="Tip" value={formatAmount(tip)} />}
        {booking.coupon_code && (
          <Row
            label="Coupon"
            value={
              <span className="inline-flex items-center gap-1.5">
                <Ticket size={13} className="text-emerald-600" aria-hidden="true" />
                {booking.coupon_code}
                {discount > 0 && <span className="text-emerald-700">− {formatAmount(discount)}</span>}
              </span>
            }
          />
        )}
        <Row
          label="Total"
          value={<span className="text-sm font-extrabold text-[#0b3fc4]">{formatAmount(total)}</span>}
        />
        <Row label="Payment mode" value={booking.payment_mode === "offline" ? "Pay after service" : "Paid online"} />
        <Row
          label="Payment status"
          value={
            isPaid ? <span className="text-emerald-700">Paid</span> : <span className="text-amber-700">Pending</span>
          }
        />
        {booking.transaction_id && <Row label="Transaction ID" value={booking.transaction_id} />}
      </Panel>

      {/* Every instalment taken, with the running total. */}
      <PaymentHistory billing={booking.billing} />

      {/* Only present on a cancelled booking that had money against it. */}
      <RefundSummary refund={booking.refund} />

      {awaitingPayment && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-[#fff8ef] px-4 py-3.5">
          <p className="text-[12px] font-extrabold text-[#7a5a1f]">Payment Pending: {formatAmount(total)}</p>
          <button
            type="button"
            onClick={() => setPayingFor(booking)}
            className="inline-flex min-h-9 items-center rounded-lg bg-[#0b3fc4] px-4 text-[11px] font-extrabold text-white transition hover:bg-[#0932a0]"
          >
            Pay Now
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-2.5">
        <Link
          to={booking.service_slug ? `/service/detail/${booking.service_slug}` : "/services/all"}
          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#0b3fc4] px-4 text-[11px] font-extrabold text-white transition hover:bg-[#0932a0]"
        >
          <Repeat2 size={13} aria-hidden="true" /> Book Again
        </Link>
        {booking.status === "completed" && (
          <Link
            to={`/service-reviews/${booking.id}/${booking.service_id}`}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#cfe0fb] bg-white px-4 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
          >
            <Star size={13} aria-hidden="true" /> Write Review
          </Link>
        )}
        {canCancel && (
          <button
            type="button"
            onClick={() => setConfirmingCancel(true)}
            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 text-[11px] font-extrabold text-red-600 transition hover:bg-red-50"
          >
            <XCircle size={13} aria-hidden="true" /> Cancel Booking
          </button>
        )}
      </div>
    </div>
  );
};

export default DashboardBookingDetail;
