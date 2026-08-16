import { ArrowRight, ChevronRight, Clock3, HardHat, Home, Minus, Plus, ShieldCheck, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookingSteps from "../../../components/booking/booking-steps";
import { bookingPath } from "../../../components/booking/steps";
import { bookableWorkers } from "../../../components/services/pricing";
import { useServiceDetail } from "../../../react-query/hooks";
import { useBookingStore } from "../../../store/booking-store";
import { useDayRateStore } from "../../../store/day-service-store";

const formatPrice = (value: number) => new Intl.NumberFormat("en-IN").format(value);

type CounterRowProps = {
  label: string;
  /** Distinguishes the day and overtime rows for screen readers, which do not get the section heading. */
  srLabel?: string;
  helper?: string;
  rate: number;
  unit: string;
  value: number;
  allowZero?: boolean;
  icon: typeof HardHat;
  onDecrease: () => void;
  onIncrease: () => void;
};

const CounterRow = ({
  label,
  srLabel,
  helper,
  rate,
  unit,
  value,
  allowZero,
  icon: Icon,
  onDecrease,
  onIncrease,
}: CounterRowProps) => (
  <div className="flex flex-col gap-4 rounded-2xl border border-[#e0eafb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
    <div className="flex min-w-0 items-center gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f1f6ff] text-[#0b3fc4]">
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <h3 className="text-sm font-extrabold text-[#0f1e57] sm:text-base">{label}</h3>
        <p className="mt-1 text-xs font-bold text-[#0b3fc4]">
          ₹{formatPrice(rate)} <span className="font-medium text-[#63739a]">/ {unit}</span>
        </p>
        {helper && <p className="mt-1 text-[11px] font-normal text-[#7080a4]">{helper}</p>}
      </div>
    </div>

    <div className="inline-flex h-11 w-fit items-center overflow-hidden rounded-xl border border-[#d8e4f8] bg-white shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={allowZero ? value === 0 : value === 1}
        aria-label={`Decrease ${srLabel ?? label}`}
        className="grid size-11 place-items-center text-[#0b3fc4] transition hover:bg-[#f1f6ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:text-slate-300"
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <output className="grid h-full min-w-11 place-items-center border-x border-[#e6edf9] text-sm font-extrabold text-[#0f1e57]">
        {value}
      </output>
      <button
        type="button"
        onClick={onIncrease}
        aria-label={`Increase ${srLabel ?? label}`}
        className="grid size-11 place-items-center text-[#0b3fc4] transition hover:bg-[#f1f6ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  </div>
);

const SelectWorkerPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useServiceDetail(slug ?? "");
  const service = data?.service;

  const [showTermsError, setShowTermsError] = useState(false);

  const { acceptedTerms, setAcceptedTerms, setService, setWorkerLabels, workerLabel, helperLabel } = useBookingStore();

  const {
    MasonDayCount,
    helperDayCount,
    MasonRate,
    helperRate,
    MasonOvertimeCount,
    helperOvertimeCount,
    MasonOvertimeRate,
    helperOvertimeRate,
    totalMasonDayRate,
    totalHelperDayRate,
    totalMasonOvertimeRate,
    totalHelperOvertimeRate,
    totalDayPrice,
    incrementMasonDay,
    decrementMasonDay,
    incrementHelperDay,
    decrementHelperDay,
    incrementMasonOvertime,
    decrementMasonOvertime,
    incrementHelperOvertime,
    decrementHelperOvertime,
    configureService,
  } = useDayRateStore();

  // Keep the booking store in sync with the service being booked, and load its
  // per-worker rates and labels. A worker the service does not quote comes back
  // with a rate of 0, which takes it out of the counters and the total.
  useEffect(() => {
    if (!service) return;

    setService({ id: service.id, slug: service.slug, title: service.title });
    localStorage.setItem("service-title", service.title);

    const workers = bookableWorkers(service);
    const mason = workers.find((worker) => worker.key === "meson");
    const helper = workers.find((worker) => worker.key === "helper");

    setWorkerLabels({
      workerLabel: mason?.label || service.meson_label || "Skilled Worker",
      helperLabel: helper?.label || service.helper_label || "Helper",
    });

    configureService({
      serviceId: service.id,
      masonRate: mason?.rate ?? 0,
      masonOvertimeRate: mason?.overtimeRate ?? 0,
      helperRate: helper?.rate ?? 0,
      helperOvertimeRate: helper?.overtimeRate ?? 0,
    });
  }, [service, setService, setWorkerLabels, configureService]);

  const continueBooking = () => {
    if (!acceptedTerms) {
      setShowTermsError(true);
      return;
    }
    navigate(bookingPath(slug ?? "", "booking-details"));
  };

  if (isLoading) {
    return (
      <main className="bg-white pb-20 pt-6 sm:pt-10">
        <div className="mx-auto w-full max-w-7xl animate-pulse px-4 sm:px-8 lg:px-10">
          <div className="h-10 w-64 rounded-lg bg-[#eaf1fd]" />
          <div className="mt-5 h-40 rounded-3xl bg-[#eaf1fd]" />
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
            <div className="h-96 rounded-3xl bg-[#eaf1fd]" />
            <div className="h-96 rounded-3xl bg-[#eaf1fd]" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !service) {
    return (
      <main className="bg-white pb-20 pt-6 sm:pt-10">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-8">
          <div className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] px-6 py-16">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0f1e57]">Service not found</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#5a6a90]">
              We could not load this service, so it cannot be booked right now.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-6 text-sm font-bold text-white transition hover:bg-[#0932a0]"
            >
              Back to home <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // A rate of 0 means this service does not offer that worker at all.
  const hasMason = MasonRate > 0;
  const hasHelper = helperRate > 0;
  const hasMasonOvertime = hasMason && MasonOvertimeRate > 0;
  const hasHelperOvertime = hasHelper && helperOvertimeRate > 0;
  const isBookable = hasMason || hasHelper;

  const summaryRows: [string, string, number][] = [];

  if (hasMason) {
    summaryRows.push([workerLabel, `${MasonDayCount} × ₹${formatPrice(MasonRate)} / day`, totalMasonDayRate]);
  }
  if (hasHelper) {
    summaryRows.push([helperLabel, `${helperDayCount} × ₹${formatPrice(helperRate)} / day`, totalHelperDayRate]);
  }

  if (MasonOvertimeCount > 0) {
    summaryRows.push([
      `${workerLabel} Overtime`,
      `${MasonOvertimeCount} × ₹${formatPrice(MasonOvertimeRate)} / hour`,
      totalMasonOvertimeRate,
    ]);
  }
  if (helperOvertimeCount > 0) {
    summaryRows.push([
      `${helperLabel} Overtime`,
      `${helperOvertimeCount} × ₹${formatPrice(helperOvertimeRate)} / hour`,
      totalHelperOvertimeRate,
    ]);
  }

  return (
    <main className="bg-white pb-20 pt-6 sm:pt-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
                <Home size={14} aria-hidden="true" /> Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-[#a8b6d4]" />
            </li>
            <li>
              <Link to={`/service/detail/${service.slug}`} className="transition hover:text-[#0b3fc4]">
                {service.title}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-[#a8b6d4]" />
            </li>
            <li className="font-bold text-[#0f1e57]" aria-current="page">
              Select Worker
            </li>
          </ol>
        </nav>

        <BookingSteps current={1} slug={service.slug} />

        <section className="rounded-3xl border border-[#dce7fb] bg-[#f2f6fe] px-6 py-8 sm:px-9 sm:py-10">
          <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-[#0f1e57] sm:text-[34px]">
            Book {service.title}
          </h1>
          {service.short_description && (
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#4a5b83] sm:text-[15px]">
              {service.short_description}
            </p>
          )}
          <p className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#0f1e57]">
            <ShieldCheck size={17} className="text-[#0b3fc4]" aria-hidden="true" /> Trained &amp; verified workers
          </p>
        </section>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
          <div className="space-y-5">
            <section
              aria-labelledby="workers-heading"
              className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-22px_rgba(20,61,141,0.45)] sm:p-7"
            >
              <h2 id="workers-heading" className="text-xl font-extrabold text-[#0f1e57]">
                Choose Workers
              </h2>
              <p className="mt-1 text-xs font-normal text-[#63739a]">
                {isBookable
                  ? "Select how many workers you need for the job."
                  : "This service does not have published rates yet."}
              </p>

              {isBookable ? (
                <div className="mt-5 space-y-3">
                  {hasMason && (
                    <CounterRow
                      label={workerLabel}
                      rate={MasonRate}
                      unit="day"
                      value={MasonDayCount}
                      icon={HardHat}
                      onDecrease={decrementMasonDay}
                      onIncrease={incrementMasonDay}
                    />
                  )}
                  {hasHelper && (
                    <CounterRow
                      label={helperLabel}
                      rate={helperRate}
                      unit="day"
                      value={helperDayCount}
                      icon={UserRound}
                      onDecrease={decrementHelperDay}
                      onIncrease={incrementHelperDay}
                    />
                  )}
                </div>
              ) : (
                <p className="mt-5 rounded-2xl border border-[#f3d6b8] bg-[#fff8ef] px-4 py-3.5 text-xs leading-5 text-[#7a5a1f]">
                  Pricing for this service is on request. Call us on{" "}
                  <a href="tel:+91 9997982419" className="font-extrabold text-[#0b3fc4] hover:underline">
                    +91 9997982419
                  </a>{" "}
                  and our team will quote it for you.
                </p>
              )}
            </section>

            {(hasMasonOvertime || hasHelperOvertime) && (
              <section
                aria-labelledby="overtime-heading"
                className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-22px_rgba(20,61,141,0.45)] sm:p-7"
              >
                <h2 id="overtime-heading" className="text-xl font-extrabold text-[#0f1e57]">
                  Overtime <span className="text-sm font-semibold text-[#0b3fc4]">(Optional)</span>
                </h2>
                <p className="mt-3 flex items-start gap-2 rounded-xl bg-[#eef4ff] px-4 py-3 text-xs font-medium leading-5 text-[#40517b]">
                  <Clock3 size={16} className="mt-0.5 shrink-0 text-[#0b3fc4]" aria-hidden="true" />
                  Work after 5:00 PM is charged as overtime, only for the actual hours worked.
                </p>

                <div className="mt-4 space-y-3">
                  {hasMasonOvertime && (
                    <CounterRow
                      label={workerLabel}
                      srLabel={`${workerLabel} overtime hours`}
                      helper="After 5:00 PM"
                      rate={MasonOvertimeRate}
                      unit="hour"
                      value={MasonOvertimeCount}
                      allowZero
                      icon={Clock3}
                      onDecrease={decrementMasonOvertime}
                      onIncrease={incrementMasonOvertime}
                    />
                  )}
                  {hasHelperOvertime && (
                    <CounterRow
                      label={helperLabel}
                      srLabel={`${helperLabel} overtime hours`}
                      helper="After 5:00 PM"
                      rate={helperOvertimeRate}
                      unit="hour"
                      value={helperOvertimeCount}
                      allowZero
                      icon={Clock3}
                      onDecrease={decrementHelperOvertime}
                      onIncrease={incrementHelperOvertime}
                    />
                  )}
                </div>
              </section>
            )}
          </div>

          <aside
            aria-labelledby="summary-heading"
            className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_16px_42px_-24px_rgba(20,61,141,0.55)] sm:p-7 lg:sticky lg:top-24"
          >
            <h2 id="summary-heading" className="text-xl font-extrabold text-[#0f1e57]">
              Booking Summary
            </h2>

            <dl className="mt-5 space-y-4 text-sm">
              {summaryRows.map(([label, detail, amount]) => (
                <div key={label} className="flex items-end justify-between gap-4">
                  <div>
                    <dt className="font-bold text-[#0f1e57]">{label}</dt>
                    <dd className="mt-1 text-xs text-[#63739a]">{detail}</dd>
                  </div>
                  <dd className="font-bold text-[#0f1e57]">₹{formatPrice(amount)}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-6 flex items-end justify-between border-t border-[#e3ebf8] pt-5">
              <div>
                <p className="text-sm font-bold text-[#0f1e57]">Total Amount</p>
                <p className="mt-1 text-[11px] text-emerald-600">Secure payments. 100% safe.</p>
              </div>
              <strong className="text-2xl font-extrabold text-[#0f1e57]">₹{formatPrice(totalDayPrice)}</strong>
            </div>

            <button
              type="button"
              onClick={continueBooking}
              disabled={!isBookable}
              className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-6 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-[#9fb4e4]"
            >
              Continue Booking <ArrowRight size={17} aria-hidden="true" />
            </button>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#40517b]">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(event) => {
                  setAcceptedTerms(event.target.checked);
                  setShowTermsError(false);
                }}
                className="mt-0.5 size-4 rounded border-[#9bb0d6] text-[#0b3fc4] focus:ring-[#0b3fc4]"
              />
              <span>
                I have read and agree to the{" "}
                <Link to="/terms-and-conditions" className="font-bold text-[#0b3fc4] hover:underline">
                  Terms &amp; Conditions
                </Link>{" "}
                and the{" "}
                <Link to="/cancellation-and-refund" className="font-bold text-[#0b3fc4] hover:underline">
                  Cancellation &amp; Refund Policy
                </Link>
                .
              </span>
            </label>
            {showTermsError && (
              <p role="alert" className="mt-2 text-xs font-semibold text-red-600">
                Please accept the terms to continue.
              </p>
            )}
          </aside>
        </div>
      </div>
    </main>
  );
};

export default SelectWorkerPage;
