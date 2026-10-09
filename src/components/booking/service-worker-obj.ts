/**
 * `service_worker_obj` — the worker breakdown frozen onto a booking.
 *
 * Replaces the old flat `instant_service_obj`, which hardcoded two slots named
 * `MasonDayCount` / `helperDayCount` back when a service quoted exactly one
 * mason and one helper. Services now quote an open list of workers through
 * `worker_rates` (see `components/services/pricing.ts`), each with its own label
 * and its own on/off switch, so the wire format is an array of priced lines
 * rather than a fixed pair of columns.
 *
 * Everything here is a snapshot: labels and rates are copied at booking time so
 * later edits to a service never rewrite what a customer already agreed to pay.
 */

/** One worker type on a booking, with its day and overtime charges. */
export type ServiceWorkerLine = {
  /** Slot in the day-rate store: `meson` or `helper`. */
  key: string;
  /** The service's own label for this worker, as shown at booking time. */
  label: string;
  day_count: number;
  day_rate: number;
  day_total: number;
  overtime_count: number;
  overtime_rate: number;
  overtime_total: number;
  /** `day_total + overtime_total`. */
  line_total: number;
};

export type ServiceWorkerObj = {
  workers: ServiceWorkerLine[];
  /** Sum of every `line_total`, before the tip. */
  workers_total: number;
  tip: number;
  /** `workers_total + tip` — what the customer is charged. */
  grand_total: number;
};

/** The slice of the day-rate store this module reads. */
type DayRateSnapshot = {
  MasonDayCount: number;
  helperDayCount: number;
  MasonRate: number;
  helperRate: number;
  MasonOvertimeCount: number;
  helperOvertimeCount: number;
  MasonOvertimeRate: number;
  helperOvertimeRate: number;
  tipValue: number;
};

const line = (
  key: string,
  label: string,
  dayCount: number,
  dayRate: number,
  overtimeCount: number,
  overtimeRate: number
): ServiceWorkerLine => {
  const day_total = dayCount * dayRate;
  const overtime_total = overtimeCount * overtimeRate;

  return {
    key,
    label,
    day_count: dayCount,
    day_rate: dayRate,
    day_total,
    overtime_count: overtimeCount,
    overtime_rate: overtimeRate,
    overtime_total,
    line_total: day_total + overtime_total,
  };
};

/**
 * Builds the payload object from the current booking state.
 *
 * A worker with no days booked is left out entirely rather than sent as a zero
 * row: a rate of 0 means the service does not offer that worker, and an empty
 * line would otherwise show up as a charge of ₹0 on the booking.
 */
export const buildServiceWorkerObj = (
  day: DayRateSnapshot,
  labels: { workerLabel: string; helperLabel: string }
): ServiceWorkerObj => {
  const workers = [
    line(
      "meson",
      labels.workerLabel || "Skilled Worker",
      day.MasonDayCount,
      day.MasonRate,
      day.MasonOvertimeCount,
      day.MasonOvertimeRate
    ),
    line(
      "helper",
      labels.helperLabel || "Helper",
      day.helperDayCount,
      day.helperRate,
      day.helperOvertimeCount,
      day.helperOvertimeRate
    ),
  ].filter((worker) => worker.day_count > 0);

  const workers_total = workers.reduce((sum, worker) => sum + worker.line_total, 0);
  const tip = day.tipValue || 0;

  return { workers, workers_total, tip, grand_total: workers_total + tip };
};

/** Legacy `instant_service_obj` rows, still written by the old /service-letter flow. */
type LegacyWorkerObj = {
  MasonDayCount?: number;
  helperDayCount?: number;
  MasonRate?: number;
  helperRate?: number;
  MasonOvertimeCount?: number;
  helperOvertimeCount?: number;
  MasonOvertimeRate?: number;
  helperOvertimeRate?: number;
  totalDayPrice?: number;
  tipValue?: number;
};

/**
 * Normalises whatever a booking row carries into the current shape.
 *
 * Bookings written before the rename hold the flat legacy object, and the old
 * /service-letter flow still writes it, so readers go through here instead of
 * reaching into either shape directly.
 */
export const readServiceWorkerObj = (
  value: ServiceWorkerObj | LegacyWorkerObj | string | null | undefined
): ServiceWorkerObj => {
  const empty: ServiceWorkerObj = { workers: [], workers_total: 0, tip: 0, grand_total: 0 };

  // The API has sent this column as a JSON string in the past.
  let parsed: unknown = value;
  if (typeof value === "string") {
    try {
      parsed = JSON.parse(value);
    } catch {
      return empty;
    }
  }

  if (!parsed || typeof parsed !== "object") return empty;

  if (Array.isArray((parsed as ServiceWorkerObj).workers)) {
    const current = parsed as ServiceWorkerObj;
    const workers_total =
      current.workers_total ?? current.workers.reduce((sum, worker) => sum + (worker.line_total || 0), 0);
    const tip = current.tip ?? 0;

    return { workers: current.workers, workers_total, tip, grand_total: current.grand_total ?? workers_total + tip };
  }

  const legacy = parsed as LegacyWorkerObj;

  return buildServiceWorkerObj(
    {
      MasonDayCount: legacy.MasonDayCount ?? 0,
      helperDayCount: legacy.helperDayCount ?? 0,
      MasonRate: legacy.MasonRate ?? 0,
      helperRate: legacy.helperRate ?? 0,
      MasonOvertimeCount: legacy.MasonOvertimeCount ?? 0,
      helperOvertimeCount: legacy.helperOvertimeCount ?? 0,
      MasonOvertimeRate: legacy.MasonOvertimeRate ?? 0,
      helperOvertimeRate: legacy.helperOvertimeRate ?? 0,
      tipValue: legacy.tipValue ?? 0,
    },
    { workerLabel: "Skilled Worker", helperLabel: "Helper" }
  );
};

/** Total workers on a booking — what the listing pages show as "N Workers". */
export const totalWorkerCount = (obj: ServiceWorkerObj): number =>
  obj.workers.reduce((sum, worker) => sum + (worker.day_count || 0), 0);
