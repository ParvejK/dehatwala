import { useNavigate } from "react-router-dom";

import Modal from "./modal";
import { BookedService } from "../../react-query/booking-type";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const Row = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex items-start justify-between gap-4 py-2">
    <span className="text-[11px] font-semibold text-[#63739a]">{label}</span>
    <span className="text-right text-[12px] font-bold text-[#0f1e57]">{value}</span>
  </div>
);

/**
 * Confirms the details carried over before restarting the booking flow.
 *
 * Nothing is pre-filled into the booking stores here — the customer still walks
 * the normal three steps, where rates are re-read from the service. Copying old
 * prices forward would quote a stale figure if the service has since changed.
 */
const BookAgainModal = ({ booking, onClose }: { booking: BookedService; onClose: () => void }) => {
  const navigate = useNavigate();

  const destination = booking.service_slug ? `/service/detail/${booking.service_slug}` : "/services/all";

  const worksite = [booking.address, booking.city_name, booking.state_name].filter(Boolean).join(", ");

  return (
    <Modal
      title="Book Again"
      subtitle={`Based on DW-${booking.id}`}
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate(destination);
          }}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0]"
        >
          Continue to Book
        </button>
      }
    >
      <p className="text-[12px] leading-6 text-[#63739a]">
        We&apos;ll use the same details to make your booking faster.
      </p>

      <div className="mt-3 divide-y divide-[#eef2f9] rounded-xl border border-[#eef2f9] px-3">
        <Row label="Service" value={booking.service_title} />
        <Row label="Number of Workers" value={`${booking.worker_count ?? 0} Workers`} />
        <Row label="Work Location" value={<span className="block max-w-[13rem]">{worksite || "—"}</span>} />
        <Row label="Previous Date" value={formatDate(booking.book_date)} />
      </div>

      <p className="mt-3 text-[11px] leading-5 text-[#8fa2c8]">
        You can change the workers, date and address before confirming — current rates apply.
      </p>
    </Modal>
  );
};

export default BookAgainModal;
