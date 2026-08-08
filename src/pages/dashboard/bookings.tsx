import { useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  AlertTriangle,
  CalendarClock,
  CalendarDays,
  CheckCircle2,
  MapPin,
  MoreVertical,
  Repeat2,
  Star,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthStore } from "../../store/auth-store";
import { useBookedService, useCancelBooking } from "../../react-query/auth-booked-service-api";
import { BookedService, BookingStatus } from "../../react-query/booking-type";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import SectionHeader from "../../components/dashboard/section-header";
import StatTile from "../../components/dashboard/stat-tile";
import { readServiceWorkerObj, totalWorkerCount } from "../../components/booking/service-worker-obj";
import { isAwaitingPayment, STAGES, STATUS_FILTERS, statusTone } from "../../components/dashboard/booking-status";
import BookingDetailsModal from "../../components/dashboard/booking-details-modal";
import WriteReviewModal from "../../components/dashboard/write-review-modal";
import BookAgainModal from "../../components/dashboard/book-again-modal";
import RescheduleModal from "../../components/dashboard/reschedule-modal";
import PaymentModal from "../../components/dashboard/payment-modal";
import PendingPaymentsModal from "../../components/dashboard/pending-payments-modal";

const formatAmount = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(Math.round(value || 0))}`;

/** Mirrors the API's own refusal, so the tooltip and the toast agree. */
const WORK_STARTED_HINT = "Work has already started. Please contact support to change or cancel this booking.";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const DashboardBookings = () => {
  const { token } = useAuthStore();
  // `isLoading` (not `isPending`) — a disabled query stays pending forever, which
  // would leave the skeleton on screen if the token were ever missing.
  const { data, isLoading, isError } = useBookedService(token ?? "");

  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  /** Booking awaiting confirmation in the cancel dialog. */
  const [pendingCancel, setPendingCancel] = useState<number | null>(null);
  const cancelBooking = useCancelBooking(token ?? "");

  // One piece of state per dialog, each holding the booking it acts on.
  const [detailsFor, setDetailsFor] = useState<BookedService | null>(null);
  const [reviewFor, setReviewFor] = useState<BookedService | null>(null);
  const [rebookFor, setRebookFor] = useState<BookedService | null>(null);
  const [rescheduleFor, setRescheduleFor] = useState<BookedService | null>(null);
  const [payingFor, setPayingFor] = useState<BookedService | null>(null);
  const [showPendingPayments, setShowPendingPayments] = useState(false);
  /** Id of the row whose ⋮ menu is open. */
  const [openMenu, setOpenMenu] = useState<number | null>(null);

  const confirmCancel = async () => {
    if (pendingCancel === null) return;

    try {
      await cancelBooking.mutateAsync(pendingCancel);
      toast.success("Booking cancelled.");
      setPendingCancel(null);
    } catch (error) {
      // The API refuses once work has started, and says why.
      const message = axios.isAxiosError(error)
        ? (error.response?.data?.message ?? "We could not cancel this booking.")
        : "We could not cancel this booking.";
      toast.error(message);
    }
  };

  const allBookings = useMemo(() => data?.booked_services ?? [], [data]);
  const bookings = useMemo(
    () => (filter === "all" ? allBookings : allBookings.filter((booking) => booking.status === filter)),
    [allBookings, filter]
  );

  // Counts come from the API so they describe the whole history rather than
  // whatever subset is on screen.
  const counts = data?.meta?.status_counts;
  const totalBookings = data?.meta?.total ?? allBookings.length;
  const completedCount = counts?.completed ?? allBookings.filter((b) => b.status === "completed").length;
  const cancelledCount =
    (counts?.cancelled ?? allBookings.filter((b) => b.status === "cancelled").length) +
    (counts?.rejected ?? allBookings.filter((b) => b.status === "rejected").length);

  const pendingPayment = allBookings.filter(isAwaitingPayment);
  const pendingTotal =
    data?.meta?.pending_payment_total ??
    pendingPayment.reduce((total, booking) => total + Number(booking.total_amount || 0), 0);

  return (
    // Any click outside an open ⋮ menu dismisses it.
    <div className="space-y-5" onClick={() => openMenu !== null && setOpenMenu(null)}>
      <SectionHeader title="My Bookings" description="Track and manage all your worker bookings in one place." />

      {detailsFor && (
        <BookingDetailsModal
          booking={detailsFor}
          onClose={() => setDetailsFor(null)}
          onPay={() => {
            setPayingFor(detailsFor);
            setDetailsFor(null);
          }}
        />
      )}

      {reviewFor && <WriteReviewModal booking={reviewFor} onClose={() => setReviewFor(null)} />}

      {rebookFor && <BookAgainModal booking={rebookFor} onClose={() => setRebookFor(null)} />}

      {rescheduleFor && <RescheduleModal booking={rescheduleFor} onClose={() => setRescheduleFor(null)} />}

      {payingFor && (
        <PaymentModal booking={payingFor} onClose={() => setPayingFor(null)} onPaid={() => setPayingFor(null)} />
      )}

      {showPendingPayments && (
        <PendingPaymentsModal
          bookings={pendingPayment}
          onClose={() => setShowPendingPayments(false)}
          onPay={(booking) => {
            setPayingFor(booking);
            setShowPendingPayments(false);
          }}
        />
      )}

      {pendingCancel !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-booking-title"
          className="fixed inset-0 z-[100] grid place-items-center bg-[#0f1e57]/70 p-4"
        >
          <div className="w-full max-w-sm rounded-2xl border border-[#dce7fb] bg-white p-6 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
              <AlertTriangle size={22} aria-hidden="true" />
            </span>
            <h3 id="cancel-booking-title" className="mt-4 text-sm font-extrabold text-[#0f1e57]">
              Cancel this booking?
            </h3>
            <p className="mt-2 text-xs leading-6 text-[#63739a]">
              DW-{pendingCancel} will be cancelled. This cannot be undone, and cancellation charges may apply.
            </p>
            <div className="mt-5 flex gap-2.5">
              <button
                type="button"
                onClick={() => setPendingCancel(null)}
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

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatTile icon={CalendarDays} value={String(totalBookings)} label="Total Bookings" tone="brand" />
        <StatTile icon={CheckCircle2} value={String(completedCount)} label="Completed" tone="success" />
        <StatTile icon={XCircle} value={String(cancelledCount)} label="Cancelled" tone="danger" />
        <StatTile
          icon={Wallet}
          value={formatAmount(pendingTotal)}
          label="Pending Payments"
          hint={`${pendingPayment.length} ${pendingPayment.length === 1 ? "booking" : "bookings"}`}
          tone="warning"
          action={
            pendingPayment.length > 0
              ? { label: "View All →", onClick: () => setShowPendingPayments(true) }
              : undefined
          }
        />
      </div>

      {pendingTotal > 0 && (
        <div className="flex flex-col gap-3 rounded-2xl border border-[#f3d6b8] bg-[#fff8ef] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#b7791f]" aria-hidden="true" />
            <div>
              <p className="text-[13px] font-extrabold text-[#7a5a1f]">
                You have {pendingPayment.length} {pendingPayment.length === 1 ? "booking" : "bookings"} with pending
                payment of {formatAmount(pendingTotal)}.
              </p>
              <p className="mt-0.5 text-[11px] leading-5 text-[#7a5a1f]">
                Please clear your dues to enjoy uninterrupted service.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setShowPendingPayments(true)}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg bg-[#0b3fc4] px-5 text-xs font-extrabold text-white transition hover:bg-[#0932a0]"
          >
            Pay Now
          </button>
        </div>
      )}

      {allBookings.length > 0 && (
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter bookings by status">
          {STATUS_FILTERS.map(({ key, label }) => {
            const count = key === "all" ? totalBookings : (counts?.[key] ?? 0);
            const isActive = filter === key;

            // Hide statuses this customer has never had, so the row stays short.
            if (key !== "all" && count === 0) return null;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                aria-pressed={isActive}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3.5 text-[11px] font-extrabold transition ${
                  isActive
                    ? "border-[#0b3fc4] bg-[#0b3fc4] text-white"
                    : "border-[#dce7fb] bg-white text-[#40517b] hover:bg-[#f1f6ff]"
                }`}
              >
                {label}
                <span className={isActive ? "text-white/70" : "text-[#8fa2c8]"}>{count}</span>
              </button>
            );
          })}
        </div>
      )}

      {isLoading ? (
        <div className="space-y-4" aria-busy="true">
          {[0, 1].map((item) => (
            <div key={item} className="h-52 animate-pulse rounded-2xl border border-[#dce7fb] bg-white" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-[#f3d6b8] bg-[#fff8ef] p-8 text-center" role="alert">
          <h3 className="text-sm font-extrabold text-[#7a5a1f]">We could not load your bookings</h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#7a5a1f]">
            Bookings are temporarily unavailable. Please try again shortly or contact support.
          </p>
          <Link
            to="/dashboard/support"
            className="mt-5 inline-flex min-h-10 items-center rounded-lg bg-[#0b3fc4] px-5 text-xs font-extrabold text-white transition hover:bg-[#0932a0]"
          >
            Contact support
          </Link>
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-2xl border border-[#dce7fb] bg-white p-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
            <CalendarDays size={26} aria-hidden="true" />
          </span>
          {/* An active filter matching nothing is a different situation from
              having never booked, and needs a different way out. */}
          {filter === "all" ? (
            <>
              <h3 className="mt-4 text-sm font-extrabold text-[#0f1e57] sm:text-[15px]">No bookings yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#63739a]">
                Once you book a worker, every booking will appear here with its status and payment details.
              </p>
              <Link
                to="/services/all"
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0]"
              >
                Book a Worker
              </Link>
            </>
          ) : (
            <>
              <h3 className="mt-4 text-sm font-extrabold text-[#0f1e57] sm:text-[15px]">No bookings in this status</h3>
              <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#63739a]">
                Nothing here right now. Try another status to see the rest of your bookings.
              </p>
              <button
                type="button"
                onClick={() => setFilter("all")}
                className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0]"
              >
                Show all bookings
              </button>
            </>
          )}
        </div>
      ) : (
        <ul className="space-y-4">
          {bookings.map((booking) => {
            const tone = statusTone(booking.status);
            const isPaid = !!booking.transaction_id;
            const awaitingPayment = isAwaitingPayment(booking);
            // Actionable only before work starts — the API refuses otherwise.
            const canCancel = booking.status === "pending" || booking.status === "confirmed";
            // Still worth showing (disabled) while a job is under way; a
            // finished or cancelled booking has nothing left to change.
            const isChangeable = canCancel || booking.status === "in_progress";
            const canReview = booking.status === "completed";
            // The API sums this from the snapshot; fall back for legacy rows.
            const workers = booking.worker_count ?? totalWorkerCount(readServiceWorkerObj(booking.service_worker_obj));
            const location = [booking.city_name, booking.state_name].filter(Boolean).join(", ") || booking.address;

            return (
              <li key={booking.id} className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
                <div className="flex gap-4">
                  {/* ---------- Thumbnail ---------- */}
                  <div className="hidden size-20 shrink-0 overflow-hidden rounded-xl bg-[#eef4ff] sm:block">
                    {booking.service_image ? (
                      <img
                        src={`${VITE_IMAGE_PATH_URL}/service/${booking.service_image}`}
                        alt=""
                        loading="lazy"
                        className="size-full object-cover"
                        onError={(event) => {
                          // A missing file must not leave a broken-image icon.
                          event.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <span className="grid size-full place-items-center text-[#0b3fc4]">
                        <Users size={24} aria-hidden="true" />
                      </span>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#0f1e57] sm:text-[15px]">
                          {booking.service_title}
                        </h3>
                        <p className="mt-1 text-[11px] font-bold text-[#0b3fc4]">Booking ID: DW-{booking.id}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`rounded-full px-3 py-1 text-[11px] font-extrabold ${tone.badge}`}>
                          {tone.label}
                          {isPaid && booking.status === "completed" ? " • Paid" : ""}
                        </span>

                        {/* ---------- Row menu ---------- */}
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setOpenMenu(openMenu === booking.id ? null : booking.id)}
                            aria-label={`Actions for booking DW-${booking.id}`}
                            aria-expanded={openMenu === booking.id}
                            className="grid size-8 place-items-center rounded-lg text-[#63739a] transition hover:bg-[#f1f6ff] hover:text-[#0f1e57]"
                          >
                            <MoreVertical size={16} aria-hidden="true" />
                          </button>

                          {openMenu === booking.id && (
                            <div className="absolute right-0 top-9 z-20 w-44 overflow-hidden rounded-xl border border-[#dce7fb] bg-white py-1 shadow-[0_18px_44px_-24px_rgba(15,30,87,0.6)]">
                              <button
                                type="button"
                                onClick={() => {
                                  setDetailsFor(booking);
                                  setOpenMenu(null);
                                }}
                                className="block w-full px-3.5 py-2 text-left text-[11px] font-bold text-[#40517b] transition hover:bg-[#f1f6ff]"
                              >
                                View Details
                              </button>
                              {awaitingPayment && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPayingFor(booking);
                                    setOpenMenu(null);
                                  }}
                                  className="block w-full px-3.5 py-2 text-left text-[11px] font-bold text-[#40517b] transition hover:bg-[#f1f6ff]"
                                >
                                  Pay Now
                                </button>
                              )}
                              {canReview && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setReviewFor(booking);
                                    setOpenMenu(null);
                                  }}
                                  className="block w-full px-3.5 py-2 text-left text-[11px] font-bold text-[#40517b] transition hover:bg-[#f1f6ff]"
                                >
                                  Write Review
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  setRebookFor(booking);
                                  setOpenMenu(null);
                                }}
                                className="block w-full px-3.5 py-2 text-left text-[11px] font-bold text-[#40517b] transition hover:bg-[#f1f6ff]"
                              >
                                Book Again
                              </button>
                              {canCancel && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setRescheduleFor(booking);
                                      setOpenMenu(null);
                                    }}
                                    className="block w-full px-3.5 py-2 text-left text-[11px] font-bold text-[#40517b] transition hover:bg-[#f1f6ff]"
                                  >
                                    Reschedule
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPendingCancel(booking.id);
                                      setOpenMenu(null);
                                    }}
                                    className="block w-full px-3.5 py-2 text-left text-[11px] font-bold text-red-600 transition hover:bg-red-50"
                                  >
                                    Cancel Booking
                                  </button>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <ul className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-semibold text-[#63739a]">
                      <li className="inline-flex items-center gap-1.5">
                        <CalendarDays size={13} className="text-[#0b3fc4]" aria-hidden="true" />
                        {formatDate(booking.book_date)}
                      </li>
                      {location && (
                        <li className="inline-flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#0b3fc4]" aria-hidden="true" />
                          <span className="line-clamp-1 max-w-[16rem]">{location}</span>
                        </li>
                      )}
                      <li className="inline-flex items-center gap-1.5">
                        <Users size={13} className="text-[#0b3fc4]" aria-hidden="true" />
                        {workers} {workers === 1 ? "Worker" : "Workers"}
                      </li>
                      <li className="inline-flex items-center gap-1.5 font-extrabold text-[#0f1e57]">
                        {formatAmount(Number(booking.total_amount))}
                      </li>
                    </ul>

                    {/* ---------- Progress ---------- */}
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
                              <CheckCircle2
                                size={14}
                                className={done ? "text-emerald-600" : "text-[#cdd8ee]"}
                                aria-hidden="true"
                              />
                            )}
                            <span className={stopped ? "text-red-600" : done ? "text-[#0f1e57]" : "text-[#a8b6d4]"}>
                              {stopped ? tone.label : stage}
                            </span>
                          </li>
                        );
                      })}
                    </ol>

                    {/* ---------- Payment ---------- */}
                    {awaitingPayment ? (
                      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-[#fff8ef] px-4 py-3">
                        <p className="text-[12px] font-extrabold text-[#7a5a1f]">
                          Payment Pending: {formatAmount(Number(booking.total_amount))}
                        </p>
                        <button
                          type="button"
                          onClick={() => setPayingFor(booking)}
                          className="inline-flex min-h-9 items-center rounded-lg bg-[#0b3fc4] px-4 text-[11px] font-extrabold text-white transition hover:bg-[#0932a0]"
                        >
                          Pay Now
                        </button>
                      </div>
                    ) : (
                      isPaid && (
                        <p className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-700">
                          <CheckCircle2 size={13} aria-hidden="true" />
                          Payment Status: Paid · ₹0 Pending — All Cleared
                        </p>
                      )
                    )}

                    <div className="mt-4 flex flex-wrap gap-2.5">
                      <button
                        type="button"
                        onClick={() => setDetailsFor(booking)}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#cfe0fb] bg-white px-4 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
                      >
                        View Details
                      </button>
                      {/* Shown on every live booking so the action is visible from
                          the start, but only usable once the work is done — there
                          is nothing to review before then. */}
                      {!tone.stopped && (
                        <button
                          type="button"
                          onClick={() => setReviewFor(booking)}
                          disabled={!canReview}
                          title={canReview ? undefined : "You can review this once the job is completed."}
                          className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#cfe0fb] bg-white px-4 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:border-[#e6edf9] disabled:text-[#a8b6d4] disabled:hover:bg-white"
                        >
                          <Star size={13} aria-hidden="true" /> Write Review
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setRebookFor(booking)}
                        className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-[#0b3fc4] px-4 text-[11px] font-extrabold text-white transition hover:bg-[#0932a0]"
                      >
                        <Repeat2 size={13} aria-hidden="true" /> Book Again
                      </button>

                      {/* Shown on any booking that has not finished, and
                          disabled once work is under way rather than removed.
                          Hiding them made a live booking look unchangeable with
                          no explanation; the API refuses at this point and says
                          why, so the reason is surfaced here instead. */}
                      {isChangeable && (
                        <>
                          <button
                            type="button"
                            onClick={() => setRescheduleFor(booking)}
                            disabled={!canCancel}
                            title={canCancel ? undefined : WORK_STARTED_HINT}
                            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#cfe0fb] bg-white px-4 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:border-[#e6edf9] disabled:text-[#a8b6d4] disabled:hover:bg-white"
                          >
                            <CalendarClock size={13} aria-hidden="true" /> Reschedule
                          </button>
                          <button
                            type="button"
                            onClick={() => setPendingCancel(booking.id)}
                            disabled={!canCancel}
                            title={canCancel ? undefined : WORK_STARTED_HINT}
                            className="inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-4 text-[11px] font-extrabold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:border-[#e6edf9] disabled:text-[#a8b6d4] disabled:hover:bg-white"
                          >
                            <XCircle size={13} aria-hidden="true" /> Cancel
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default DashboardBookings;
