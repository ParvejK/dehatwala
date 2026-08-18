import { type LucideIcon } from "lucide-react";

const TONES = {
  brand: "bg-[#eef4ff] text-[#0b3fc4]",
  success: "bg-emerald-50 text-emerald-600",
  danger: "bg-red-50 text-red-500",
  warning: "bg-amber-50 text-amber-600",
} as const;

type StatTileProps = {
  icon: LucideIcon;
  value: string;
  label: string;
  hint?: string;
  tone?: keyof typeof TONES;
  /** Optional link-style action in the tile's corner, e.g. "View All". */
  action?: { label: string; onClick: () => void };
};

const StatTile = ({ icon: Icon, value, label, hint, tone = "brand", action }: StatTileProps) => (
  <article className="rounded-2xl border border-[#dce7fb] bg-white p-4">
    <div className="flex items-start justify-between gap-2">
      <span className={`grid size-10 place-items-center rounded-xl ${TONES[tone]}`}>
        <Icon size={19} aria-hidden="true" />
      </span>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="text-[10px] font-extrabold text-[#0b3fc4] transition hover:underline"
        >
          {action.label}
        </button>
      )}
    </div>
    <strong className="mt-3 block text-xl font-extrabold tracking-tight text-[#0f1e57]">{value}</strong>
    <span className="mt-0.5 block text-[11px] font-semibold text-[#63739a]">{label}</span>
    {hint && <span className="mt-0.5 block text-[10px] font-medium text-[#8fa2c8]">{hint}</span>}
  </article>
);

export default StatTile;
