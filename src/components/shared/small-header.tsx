import { ArrowUpRight, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const SmallHeader = () => (
  <div className="relative z-50 overflow-hidden bg-blue-950 px-5 text-white">
    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(37,99,235,0.28),transparent_40%,rgba(245,158,11,0.12))]" />
    <div className="relative mx-auto flex min-h-9 max-w-7xl items-center justify-between gap-4 text-[11px] font-semibold sm:px-3 lg:px-5">
      <div className="flex min-w-0 items-center gap-4 sm:gap-6">
        <a
          href="tel:+91 9997982419"
          className="inline-flex shrink-0 items-center gap-2 text-blue-50 transition hover:text-amber-300 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-amber-300"
        >
          <Phone size={13} aria-hidden="true" />
          <span>+91 9997982419</span>
        </a>
        <span className="hidden items-center gap-1.5 text-blue-200 sm:inline-flex">
          <ShieldCheck size={13} aria-hidden="true" /> Verified workforce platform
        </span>
      </div>
      <Link
        to="/become-a-part-of-dehatwala"
        className="inline-flex shrink-0 items-center gap-1.5 text-amber-300 transition hover:text-amber-200 focus:outline-none focus-visible:rounded focus-visible:ring-2 focus-visible:ring-amber-300"
      >
        <span className="hidden sm:inline">Join Dehatwala · </span>काम पाएं
        <ArrowUpRight size={13} aria-hidden="true" />
      </Link>
    </div>
  </div>
);

export default SmallHeader;
