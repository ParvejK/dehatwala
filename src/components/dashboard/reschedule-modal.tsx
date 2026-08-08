import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { CalendarDays } from "lucide-react";

import Modal from "./modal";
import { useAuthStore } from "../../store/auth-store";
import { useRescheduleBooking } from "../../react-query/auth-booked-service-api";
import { BookedService } from "../../react-query/booking-type";

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—";

const RescheduleModal = ({ booking, onClose }: { booking: BookedService; onClose: () => void }) => {
  const { token } = useAuthStore();
  const reschedule = useRescheduleBooking(token ?? "");

  // `book_date` arrives as YYYY-MM-DD, which is what the date input wants.
  const [bookDate, setBookDate] = useState(booking.book_date?.slice(0, 10) ?? "");
  const [error, setError] = useState("");

  // A booking cannot be moved into the past; the API enforces this too.
  const [minDate] = useState(() => new Date().toISOString().split("T")[0]);

  const submit = async () => {
    if (!bookDate) {
      setError("Please choose a new date.");
      return;
    }

    setError("");

    try {
      await reschedule.mutateAsync({ bookingId: booking.id, bookDate });
      toast.success("Booking rescheduled.");
      onClose();
    } catch (submitError) {
      const data = axios.isAxiosError(submitError)
        ? (submitError.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined)
        : undefined;

      setError(
        (data?.errors ? Object.values(data.errors)[0]?.[0] : undefined) ??
          data?.message ??
          "We could not reschedule this booking."
      );
    }
  };

  return (
    <Modal
      title="Reschedule Booking"
      subtitle={`DW-${booking.id} · ${booking.service_title}`}
      onClose={onClose}
      footer={
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={reschedule.isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-4 text-[12px] font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff] disabled:opacity-60"
          >
            Keep current date
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={reschedule.isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reschedule.isPending ? "Saving…" : "Confirm New Date"}
          </button>
        </div>
      }
    >
      <p className="flex items-center gap-2 rounded-xl bg-[#f8fbff] px-3.5 py-2.5 text-[11px] font-semibold text-[#63739a]">
        <CalendarDays size={14} className="shrink-0 text-[#0b3fc4]" aria-hidden="true" />
        Currently scheduled for {formatDate(booking.book_date)}
      </p>

      <label htmlFor="reschedule-date" className="mt-4 block text-[11px] font-extrabold text-[#0f1e57]">
        New date
      </label>
      <input
        id="reschedule-date"
        type="date"
        value={bookDate}
        min={minDate}
        onChange={(event) => {
          setBookDate(event.target.value);
          setError("");
        }}
        className="mt-1.5 min-h-11 w-full rounded-xl border border-[#d8e4f8] bg-white px-4 text-[12px] font-medium text-[#0f1e57] outline-none transition focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100"
      />

      {error && (
        <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700">
          {error}
        </p>
      )}

      <p className="mt-3 text-[11px] leading-5 text-[#8fa2c8]">
        Rescheduling is free until workers are dispatched. Charges may apply afterwards.
      </p>
    </Modal>
  );
};

export default RescheduleModal;
