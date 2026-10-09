import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { BOOKING_STEPS, bookingPath } from "./steps";

const BookingSteps = ({ current, slug }: { current: 1 | 2 | 3; slug: string }) => (
  <nav aria-label="Booking progress" className="mb-5">
    <p className="mb-3 text-xs font-bold uppercase tracking-[0.14em] text-[#0b3fc4]">
      Step {current} of {BOOKING_STEPS.length}
    </p>

    <ol className="flex items-center gap-2 sm:gap-3">
      {BOOKING_STEPS.map(({ step, label, segment }, index) => {
        const isDone = step < current;
        const isCurrent = step === current;

        const marker = (
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-full text-xs font-extrabold transition ${
              isDone
                ? "bg-[#0b3fc4] text-white"
                : isCurrent
                  ? "bg-[#0b3fc4] text-white ring-4 ring-blue-100"
                  : "border border-[#d8e4f8] bg-white text-[#8fa2c8]"
            }`}
          >
            {isDone ? <Check size={15} aria-hidden="true" /> : step}
          </span>
        );

        const text = (
          <span
            className={`text-xs font-bold sm:text-sm ${
              isDone || isCurrent ? "text-[#0f1e57]" : "text-[#8fa2c8]"
            }`}
          >
            {label}
          </span>
        );

        return (
          <li key={segment} className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            {isDone ? (
              <Link
                to={bookingPath(slug, segment)}
                className="flex min-w-0 items-center gap-2 rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:gap-3"
              >
                {marker}
                <span className="hidden truncate sm:inline">{text}</span>
              </Link>
            ) : (
              <span
                className="flex min-w-0 items-center gap-2 sm:gap-3"
                aria-current={isCurrent ? "step" : undefined}
              >
                {marker}
                <span className="hidden truncate sm:inline">{text}</span>
              </span>
            )}

            {index < BOOKING_STEPS.length - 1 && (
              <span
                aria-hidden="true"
                className={`h-0.5 min-w-4 flex-1 rounded-full ${isDone ? "bg-[#0b3fc4]" : "bg-[#e0eafb]"}`}
              />
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);

export default BookingSteps;
