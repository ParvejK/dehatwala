import { AlertTriangle, Check } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

import { BookingCancellationReason } from "../../react-query/booking-type";
import Modal from "./modal";

type CancelBookingModalProps = {
  bookingId: number;
  reasons: BookingCancellationReason[];
  isPending: boolean;
  onClose: () => void;
  onConfirm: (reasonIds: Array<number | string>) => void;
};

const reasonLabel = (reason: BookingCancellationReason) => {
  const label = [reason.label, reason.name, reason.reason, reason.title].find((value) => value?.trim());
  return label?.trim() ?? `Reason ${reason.id}`;
};

const CancelBookingModal = ({
  bookingId,
  reasons,
  isPending,
  onClose,
  onConfirm,
}: CancelBookingModalProps) => {
  const [selectedReasonIds, setSelectedReasonIds] = useState<Array<number | string>>([]);
  const [showSelectionError, setShowSelectionError] = useState(false);

  const uniqueReasons = useMemo(
    () => Array.from(new Map(reasons.map((reason) => [String(reason.id), reason])).values()),
    [reasons],
  );

  const requestClose = useCallback(() => {
    if (!isPending) onClose();
  }, [isPending, onClose]);

  const toggleReason = (reasonId: number | string) => {
    setShowSelectionError(false);
    setSelectedReasonIds((current) =>
      current.some((id) => String(id) === String(reasonId))
        ? current.filter((id) => String(id) !== String(reasonId))
        : [...current, reasonId],
    );
  };

  const submit = () => {
    if (selectedReasonIds.length === 0) {
      setShowSelectionError(true);
      return;
    }

    onConfirm(selectedReasonIds);
  };

  const hasReasons = uniqueReasons.length > 0;

  return (
    <Modal
      title="Cancel this booking?"
      subtitle={`Booking DW-${bookingId}`}
      onClose={requestClose}
      size="md"
      footer={
        <div className="flex flex-col-reverse gap-2.5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={requestClose}
            disabled={isPending}
            className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-5 text-xs font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-32"
          >
            Keep booking
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isPending || !hasReasons}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-red-600 px-5 text-xs font-extrabold text-white transition hover:bg-red-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 disabled:cursor-not-allowed disabled:opacity-60 sm:min-w-36"
          >
            {isPending ? "Cancelling…" : "Cancel booking"}
          </button>
        </div>
      }
    >
      <div className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3.5">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white text-red-600 shadow-sm">
          <AlertTriangle size={18} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-extrabold text-[#0f1e57]">This action cannot be undone</p>
          <p className="mt-1 text-[11px] leading-5 text-[#63739a]">
            Cancellation charges may apply. Select every reason that applies before continuing.
          </p>
        </div>
      </div>

      <fieldset className="mt-5" aria-describedby={showSelectionError ? "cancel-reason-error" : "cancel-reason-help"}>
        <div className="flex items-baseline justify-between gap-3">
          <legend className="text-xs font-extrabold text-[#0f1e57]">Why are you cancelling?</legend>
          {selectedReasonIds.length > 0 && (
            <span className="text-[10px] font-extrabold uppercase tracking-wide text-[#0b3fc4]">
              {selectedReasonIds.length} selected
            </span>
          )}
        </div>
        <p id="cancel-reason-help" className="mt-1 text-[11px] leading-5 text-[#63739a]">
          You can select more than one reason.
        </p>

        {hasReasons ? (
          <div className="mt-3 space-y-2">
            {uniqueReasons.map((reason, index) => {
              const checked = selectedReasonIds.some((id) => String(id) === String(reason.id));
              const inputId = `cancel-reason-${bookingId}-${index}`;

              return (
                <label
                  key={String(reason.id)}
                  htmlFor={inputId}
                  className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 text-xs font-bold transition focus-within:ring-4 focus-within:ring-blue-100 ${
                    checked
                      ? "border-[#8eb2f2] bg-[#f1f6ff] text-[#0f1e57]"
                      : "border-[#dce7fb] bg-white text-[#40517b] hover:border-[#b9cef1] hover:bg-[#f8faff]"
                  } ${isPending ? "pointer-events-none opacity-60" : ""}`}
                >
                  <input
                    id={inputId}
                    type="checkbox"
                    value={String(reason.id)}
                    checked={checked}
                    onChange={() => toggleReason(reason.id)}
                    disabled={isPending}
                    className="peer sr-only"
                  />
                  <span
                    className={`grid size-5 shrink-0 place-items-center rounded-md border transition ${
                      checked ? "border-[#0b3fc4] bg-[#0b3fc4] text-white" : "border-[#b9c8e3] bg-white text-transparent"
                    }`}
                    aria-hidden="true"
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="min-w-0 leading-5">{reasonLabel(reason)}</span>
                </label>
              );
            })}
          </div>
        ) : (
          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[11px] leading-5 text-amber-800" role="status">
            Cancellation reasons are unavailable right now. Keep the booking and try again shortly.
          </div>
        )}

        {showSelectionError && (
          <p id="cancel-reason-error" className="mt-3 text-[11px] font-bold text-red-600" role="alert">
            Select at least one reason to cancel this booking.
          </p>
        )}
      </fieldset>
    </Modal>
  );
};

export default CancelBookingModal;
