import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

/**
 * Full-screen confirmation shown between placing a booking and landing on the
 * bookings list.
 *
 * The booking is already saved by the time this appears, so the countdown is
 * purely so the customer can read the reference before the page changes —
 * `onDone` is what actually leaves, and the CTA runs it immediately.
 */
type SuccessBridgeProps = {
  headline: string;
  /** Booking reference, e.g. `DW-000012`. */
  refLabel?: string;
  amountText?: string;
  /** What happens next, read out to screen readers as it appears. */
  nextText?: string;
  ctaLabel: string;
  /** Time before leaving automatically. */
  delayMs?: number;
  onDone: () => void;
};

const SuccessBridge = ({
  headline,
  refLabel,
  amountText,
  nextText,
  ctaLabel,
  delayMs = 4500,
  onDone,
}: SuccessBridgeProps) => {
  const ctaRef = useRef<HTMLButtonElement>(null);
  // Held in a ref so the timer effect never restarts when the parent re-renders
  // and hands over a new function identity — that would postpone the redirect
  // indefinitely.
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  // The CTA and the timer race at the end of the countdown; leaving is only
  // meaningful once, and it clears the booking stores on the way.
  const hasLeft = useRef(false);
  const leaveOnce = () => {
    if (hasLeft.current) return;
    hasLeft.current = true;
    onDoneRef.current();
  };

  const [remaining, setRemaining] = useState(Math.ceil(delayMs / 1000));

  useEffect(() => {
    const redirect = setTimeout(leaveOnce, delayMs);
    const tick = setInterval(() => setRemaining((value) => Math.max(0, value - 1)), 1000);

    return () => {
      clearTimeout(redirect);
      clearInterval(tick);
    };
  }, [delayMs]);

  // The booking is done; the page behind this must not scroll or be tabbed into.
  useEffect(() => {
    ctaRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, []);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-success-headline"
      className="fixed inset-0 z-[100] grid place-items-center bg-[#0f1e57]/70 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md rounded-3xl border border-[#dce7fb] bg-white p-7 text-center shadow-[0_28px_70px_-30px_rgba(15,30,87,0.65)] sm:p-9">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-emerald-50 text-emerald-600">
          <CheckCircle2 size={34} aria-hidden="true" />
        </span>

        <h2 id="booking-success-headline" className="mt-5 text-xl font-extrabold text-[#0f1e57] sm:text-2xl">
          {headline}
        </h2>

        {refLabel && (
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#dce7fb] bg-[#f8fbff] px-4 py-1.5 text-xs font-bold tracking-wide text-[#0b3fc4]">
            {refLabel}
          </p>
        )}

        {amountText && <p className="mt-4 text-2xl font-extrabold text-[#0f1e57]">{amountText}</p>}

        {nextText && (
          <p aria-live="polite" className="mt-3 text-sm leading-6 text-[#63739a]">
            {nextText}
          </p>
        )}

        <button
          ref={ctaRef}
          type="button"
          onClick={leaveOnce}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#0b3fc4] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0935a8] focus:outline-none focus-visible:ring-4 focus-visible:ring-[#dce7fb]"
        >
          {ctaLabel}
        </button>

        <p className="mt-4 flex items-center justify-center gap-2 text-[11px] font-semibold text-[#8fa2c8]">
          <Loader2 size={13} className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
          Redirecting in {remaining}s
        </p>
      </div>
    </div>
  );
};

export default SuccessBridge;
