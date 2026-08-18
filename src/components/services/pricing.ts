/**
 * Service pricing helpers.
 *
 * `services.base_price` / `services.overtime_price` were dropped in the
 * 2026-08-04 `add_worker_pricing_to_services_table` migration and replaced with
 * a pair of per-worker rates. A service quotes a "meson" and a "helper", either
 * of which can be switched off, and both labels are editable per service.
 */

type Amount = string | number | null | undefined;

/** Laravel casts these to real booleans, but tolerate 1 / "1" from other endpoints. */
const isActive = (value: boolean | number | string | null | undefined) =>
  value === true || value === 1 || value === "1";

/** Pre-built rate row from the API — authoritative, and not limited to two workers. */
export type ApiWorkerRate = {
  key?: string;
  label?: string | null;
  amount?: Amount;
  overtime?: Amount;
  active?: boolean | number | string | null;
};

export type WorkerPricedService = {
  worker_rates?: ApiWorkerRate[] | null;
  meson_label?: string | null;
  is_active_meson?: boolean | number | string | null;
  meson_amount?: Amount;
  meson_overtime_amount?: Amount;
  helper_label?: string | null;
  is_active_helper?: boolean | number | string | null;
  helper_amount?: Amount;
  helper_overtime_amount?: Amount;
};

export type WorkerRate = {
  label: string;
  amount: Amount;
  overtime: Amount;
};

/** `₹1,000`, or null when the API has no usable amount. */
export const formatPrice = (value: Amount) => {
  const amount = Number(value);
  if (!value || Number.isNaN(amount)) return null;
  return `₹${amount.toLocaleString("en-IN")}`;
};

const hasAmount = (value: Amount) => value != null && Number(value) > 0;

/**
 * Every quoted worker, in display order, skipping the ones switched off or left
 * unpriced. Prefers the API's `worker_rates` array — it is authoritative and can
 * carry more than the two meson/helper columns — and falls back to those columns
 * for endpoints that do not build it.
 */
export const workerRates = (service?: WorkerPricedService | null): WorkerRate[] => {
  if (!service) return [];

  if (service.worker_rates?.length) {
    return service.worker_rates
      .filter((rate) => isActive(rate.active) && hasAmount(rate.amount))
      .map((rate) => ({
        label: rate.label || "Worker",
        amount: rate.amount,
        overtime: rate.overtime,
      }));
  }

  const rates: WorkerRate[] = [];

  if (isActive(service.is_active_meson) && hasAmount(service.meson_amount)) {
    rates.push({
      label: service.meson_label || "Meson",
      amount: service.meson_amount,
      overtime: service.meson_overtime_amount,
    });
  }

  if (isActive(service.is_active_helper) && hasAmount(service.helper_amount)) {
    rates.push({
      label: service.helper_label || "Helper",
      amount: service.helper_amount,
      overtime: service.helper_overtime_amount,
    });
  }

  return rates;
};

/**
 * The rate to headline on cards and listings: the first quoted worker, which is
 * the meson when active and the helper otherwise.
 */
export const primaryWorkerRate = (service?: WorkerPricedService | null): WorkerRate | null =>
  workerRates(service)[0] ?? null;

/** A rate the booking store can work with: a positive number, or 0 for "not offered". */
const toRate = (value: Amount) => {
  const rate = Number(value);
  return Number.isFinite(rate) && rate > 0 ? rate : 0;
};

export type BookableWorker = {
  /** Matches the two slots the day-rate store has: `meson` and `helper`. */
  key: string;
  label: string;
  rate: number;
  /** 0 when the service does not quote overtime for this worker. */
  overtimeRate: number;
};

/**
 * The quoted workers as plain numbers for the booking flow. A worker that is
 * switched off, or active but left unpriced, is absent — it must not be offered
 * or charged for.
 */
export const bookableWorkers = (service?: WorkerPricedService | null): BookableWorker[] => {
  if (!service) return [];

  if (service.worker_rates?.length) {
    return service.worker_rates
      .filter((rate) => isActive(rate.active) && hasAmount(rate.amount))
      .map((rate, index) => ({
        key: rate.key || (index === 0 ? "meson" : "helper"),
        label: rate.label || "Worker",
        rate: toRate(rate.amount),
        overtimeRate: toRate(rate.overtime),
      }));
  }

  return workerRates(service).map((rate, index) => ({
    key: index === 0 && isActive(service.is_active_meson) ? "meson" : "helper",
    label: rate.label,
    rate: toRate(rate.amount),
    overtimeRate: toRate(rate.overtime),
  }));
};
