import { BadgeIndianRupee, Clock3, CheckCircle2, XCircle } from "lucide-react";

import { BookingRefund } from "../../react-query/booking-type";

const formatAmount = (value: string | number) =>
  `₹${new Intl.NumberFormat("en-IN").format(Math.round(Number(value) || 0))}`;

const formatDate = (value?: string | null) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : null;

/** Status → how it reads and how it looks. */
const TONES: Record<BookingRefund["status"], { label: string; chip: string; icon: typeof Clock3 }> = {
  pending: { label: "Refund in progress", chip: "bg-amber-50 text-amber-700", icon: Clock3 },
  processed: { label: "Refunded", chip: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  failed: { label: "Refund failed", chip: "bg-red-50 text-red-600", icon: XCircle },
  not_applicable: { label: "No refund due", chip: "bg-slate-100 text-slate-600", icon: BadgeIndianRupee },
};

/**
 * What was returned after a cancellation.
 *
 * Renders nothing when there is no refund record — an ordinary booking should
 * not carry an empty refund block.
 */
const RefundSummary = ({ refund }: { refund?: BookingRefund | null }) => {
  if (!refund) return null;

  const tone = TONES[refund.status] ?? TONES.pending;
  const Icon = tone.icon;

  const charge = Number(refund.cancellation_charge) || 0;
  const percent = Number(refund.charge_percent) || 0;
  const processedOn = formatDate(refund.processed_at);

  return (
    <section
      aria-labelledby="refund-heading"
      className="rounded-2xl border border-[#dce7fb] bg-[#f8fbff] p-4 sm:p-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 id="refund-heading" className="flex items-center gap-2 text-[13px] font-extrabold text-[#0f1e57]">
          <BadgeIndianRupee size={15} className="text-[#0b3fc4]" aria-hidden="true" />
          Refund
        </h3>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold ${tone.chip}`}>
          <Icon size={12} aria-hidden="true" /> {tone.label}
        </span>
      </div>

      <dl className="mt-3 divide-y divide-[#e6edf9] rounded-xl border border-[#e6edf9] bg-white px-3">
        <div className="flex items-center justify-between py-2">
          <dt className="text-[11px] font-semibold text-[#63739a]">Booking amount</dt>
          <dd className="text-[12px] font-bold text-[#0f1e57]">{formatAmount(refund.booking_amount)}</dd>
        </div>

        {/* Only shown when something was actually withheld — a zero row on a
            full refund just invites the question "what charge?". */}
        {charge > 0 && (
          <div className="flex items-center justify-between py-2">
            <dt className="text-[11px] font-semibold text-[#63739a]">
              Cancellation charge{percent > 0 ? ` (${percent}%)` : ""}
            </dt>
            <dd className="text-[12px] font-bold text-red-600">− {formatAmount(charge)}</dd>
          </div>
        )}

        <div className="flex items-center justify-between py-2">
          <dt className="text-[11px] font-extrabold text-[#0f1e57]">Refund amount</dt>
          <dd className="text-sm font-extrabold text-[#0b3fc4]">{formatAmount(refund.refund_amount)}</dd>
        </div>

        {processedOn && (
          <div className="flex items-center justify-between py-2">
            <dt className="text-[11px] font-semibold text-[#63739a]">Refunded on</dt>
            <dd className="text-[12px] font-bold text-[#0f1e57]">{processedOn}</dd>
          </div>
        )}
      </dl>

      <p className="mt-2.5 text-[11px] leading-5 text-[#63739a]">{refund.reason_label}</p>

      {refund.status === "pending" && (
        <p className="mt-1 text-[11px] leading-5 text-[#8fa2c8]">
          Refunds usually reach your account within 5–7 working days.
        </p>
      )}
    </section>
  );
};

export default RefundSummary;
