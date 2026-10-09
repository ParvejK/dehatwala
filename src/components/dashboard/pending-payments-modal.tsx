import { Link } from "react-router-dom";

import Modal from "./modal";
import { BookedService } from "../../react-query/booking-type";

const formatAmount = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(Math.round(value || 0))}`;

/**
 * Every booking still owing money, so dues can be cleared from one place.
 *
 * Each row pays individually — Razorpay settles one booking at a time, and each
 * payment has to be recorded against its own booking. A single "Pay All" charge
 * could not be attributed if it failed halfway.
 */
const PendingPaymentsModal = ({
  bookings,
  onClose,
  onPay,
}: {
  bookings: BookedService[];
  onClose: () => void;
  onPay: (booking: BookedService) => void;
}) => {
  const total = bookings.reduce((sum, booking) => sum + Number(booking.total_amount || 0), 0);

  return (
    <Modal
      title="Pending Payments"
      subtitle={`${bookings.length} ${bookings.length === 1 ? "booking" : "bookings"}`}
      size="md"
      onClose={onClose}
      footer={
        <Link
          to="/dashboard/bookings"
          onClick={onClose}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-4 text-[12px] font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff]"
        >
          View Bookings
        </Link>
      }
    >
      <div className="rounded-xl border border-[#eef2f9]">
        <div className="flex items-center justify-between border-b border-[#eef2f9] px-3.5 py-2.5 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#8fa2c8]">
          <span>Booking</span>
          <span>Pending Amount</span>
        </div>

        <ul className="divide-y divide-[#eef2f9]">
          {bookings.map((booking) => (
            <li key={booking.id} className="flex items-center justify-between gap-3 px-3.5 py-3">
              <div className="min-w-0">
                <p className="truncate text-[12px] font-extrabold text-[#0f1e57]">{booking.service_title}</p>
                <p className="mt-0.5 text-[10px] font-bold text-[#0b3fc4]">DW-{booking.id}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-[12px] font-extrabold text-[#0f1e57]">
                  {formatAmount(Number(booking.total_amount))}
                </span>
                <button
                  type="button"
                  onClick={() => onPay(booking)}
                  className="inline-flex min-h-8 items-center rounded-lg bg-[#0b3fc4] px-3 text-[10px] font-extrabold text-white transition hover:bg-[#0932a0]"
                >
                  Pay
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex items-center justify-between rounded-xl bg-[#fff8ef] px-3.5 py-3">
        <span className="text-[12px] font-extrabold text-[#7a5a1f]">Total Pending Amount</span>
        <span className="text-sm font-extrabold text-[#b7791f]">{formatAmount(total)}</span>
      </div>
    </Modal>
  );
};

export default PendingPaymentsModal;
