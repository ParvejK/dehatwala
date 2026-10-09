import { Receipt } from "lucide-react";

import { BookingBilling } from "../../react-query/booking-type";

/** Two decimals here, unlike the rounded figures elsewhere — this is a ledger. */
const formatAmount = (value: number) =>
  `₹${new Intl.NumberFormat("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value || 0)}`;

/** "09 Aug 2026, 07:34" */
const formatWhen = (value?: string | null) => {
  if (!value) return "—";

  // The API sends "YYYY-MM-DD HH:MM:SS", which Safari will not parse with a
  // space, so it is normalised to an ISO-ish string first.
  const date = new Date(value.replace(" ", "T"));
  if (Number.isNaN(date.getTime())) return value;

  return `${date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })}`;
};

/**
 * Every instalment taken against a booking.
 *
 * Only rendered once a payment exists — an unpaid booking would otherwise carry
 * an empty ledger with a "₹0.00 of …" footer, which reads like a fault.
 */
const PaymentHistory = ({ billing }: { billing?: BookingBilling }) => {
  const payments = billing?.payments ?? [];

  if (!billing || payments.length === 0) return null;

  return (
    <section
      aria-labelledby="payment-history-heading"
      className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5"
    >
      <h2
        id="payment-history-heading"
        className="flex items-center gap-2 text-[13px] font-extrabold text-[#0f1e57]"
      >
        <Receipt size={15} className="text-[#0b3fc4]" aria-hidden="true" />
        Payment history
      </h2>

      {/* The table scrolls inside its own container so the page never scrolls
          sideways on a narrow screen. */}
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[46rem] text-left">
          <thead>
            <tr className="border-b border-[#eef2f9] text-[10px] font-bold uppercase tracking-[0.08em] text-[#8fa2c8]">
              <th scope="col" className="pb-2 pr-3">When</th>
              <th scope="col" className="pb-2 pr-3 text-right">Amount</th>
              <th scope="col" className="pb-2 pr-3">Method</th>
              <th scope="col" className="pb-2 pr-3">Type</th>
              <th scope="col" className="pb-2 pr-3">Reference</th>
              <th scope="col" className="pb-2 pr-3">Collected by</th>
              <th scope="col" className="pb-2">Note</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#eef2f9]">
            {payments.map((payment) => (
              <tr key={payment.id} className="text-[12px] font-semibold text-[#0f1e57]">
                <td className="py-2.5 pr-3 whitespace-nowrap">{formatWhen(payment.paid_at)}</td>
                <td className="py-2.5 pr-3 text-right font-extrabold whitespace-nowrap">
                  {formatAmount(payment.amount)}
                </td>
                <td className="py-2.5 pr-3">{payment.method_label || "—"}</td>
                <td className="py-2.5 pr-3">{payment.kind_label || "—"}</td>
                <td className="py-2.5 pr-3 font-mono text-[11px] font-medium text-[#63739a]">
                  {payment.reference || "—"}
                </td>
                <td className="py-2.5 pr-3 font-medium text-[#63739a]">{payment.collected_by || "—"}</td>
                <td className="py-2.5 font-medium text-[#63739a]">{payment.note || "—"}</td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t border-[#dce7fb]">
              <th scope="row" className="pt-3 pr-3 text-left text-[11px] font-extrabold text-[#0f1e57]">
                Total paid
              </th>
              <td colSpan={6} className="pt-3 text-[12px] font-extrabold text-[#0b3fc4]">
                {formatAmount(billing.amount_paid)}{" "}
                <span className="font-semibold text-[#63739a]">of {formatAmount(billing.total_amount)}</span>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {billing.amount_due > 0 && (
        <p className="mt-3 text-[11px] font-bold text-amber-700">
          {formatAmount(billing.amount_due)} still outstanding.
        </p>
      )}
    </section>
  );
};

export default PaymentHistory;
