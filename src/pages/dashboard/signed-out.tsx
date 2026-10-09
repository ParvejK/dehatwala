import { ArrowRight, LogIn, ShieldCheck, Sparkles, UserRoundPlus } from "lucide-react";
import { Link } from "react-router-dom";

const SIGN_IN_POINTS = ["Track your bookings and payments", "Rebook a worker in one tap", "Manage saved worksites"];

const SIGN_UP_POINTS = ["Free to join, no charges", "Verified workers near you", "Transparent, upfront pricing"];

const Panel = ({
  icon: Icon,
  eyebrow,
  title,
  copy,
  points,
  ctaLabel,
  to,
  primary,
}: {
  icon: typeof LogIn;
  eyebrow: string;
  title: string;
  copy: string;
  points: string[];
  ctaLabel: string;
  to: string;
  primary?: boolean;
}) => (
  <section
    className={`flex flex-col rounded-3xl border p-6 sm:p-8 ${
      primary ? "border-[#0b3fc4] bg-[#0b3fc4] text-white" : "border-[#dce7fb] bg-white"
    }`}
  >
    <span
      className={`grid size-12 place-items-center rounded-2xl ${
        primary ? "bg-white/15 text-white" : "bg-[#eef4ff] text-[#0b3fc4]"
      }`}
    >
      <Icon size={22} aria-hidden="true" />
    </span>

    <p
      className={`mt-5 text-[11px] font-extrabold uppercase tracking-[0.16em] ${
        primary ? "text-blue-100" : "text-[#0b3fc4]"
      }`}
    >
      {eyebrow}
    </p>
    <h2 className={`mt-2 text-xl font-extrabold sm:text-2xl ${primary ? "text-white" : "text-[#0f1e57]"}`}>{title}</h2>
    <p className={`mt-2 text-xs leading-6 sm:text-[13px] ${primary ? "text-blue-100" : "text-[#63739a]"}`}>{copy}</p>

    <ul className="mt-5 space-y-2.5">
      {points.map((point) => (
        <li
          key={point}
          className={`flex items-start gap-2.5 text-xs sm:text-[13px] ${primary ? "text-blue-50" : "text-[#40517b]"}`}
        >
          <ShieldCheck
            size={15}
            className={`mt-0.5 shrink-0 ${primary ? "text-amber-300" : "text-[#0b3fc4]"}`}
            aria-hidden="true"
          />
          {point}
        </li>
      ))}
    </ul>

    <Link
      to={to}
      className={`mt-auto inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 pt-0 text-sm font-bold transition focus:outline-none focus-visible:ring-4 ${
        primary
          ? "mt-7 bg-white text-[#0b3fc4] hover:bg-blue-50 focus-visible:ring-blue-300"
          : "mt-7 border border-[#0b3fc4] text-[#0b3fc4] hover:bg-[#eef4ff] focus-visible:ring-blue-100"
      }`}
    >
      {ctaLabel} <ArrowRight size={17} aria-hidden="true" />
    </Link>
  </section>
);

/** Shown at every /dashboard route when there is no session. */
const DashboardSignedOut = () => (
  <main className="bg-[#f8fbff] pb-16 pt-8 sm:pt-12">
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-8">
      <div className="text-center">
        <p className="inline-flex items-center gap-2 rounded-full border border-[#dce7fb] bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.16em] text-[#0b3fc4]">
          <Sparkles size={13} aria-hidden="true" /> Your account
        </p>
        <h1 className="mt-4 text-2xl font-extrabold tracking-tight text-[#0f1e57] sm:text-3xl">
          Sign in to view your dashboard
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-xs leading-6 text-[#63739a] sm:text-sm">
          Manage your bookings, payments, saved worksites and reviews in one place.
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        <Panel
          primary
          icon={LogIn}
          eyebrow="Existing customer"
          title="Sign In"
          copy="Already booked with Dehatwala? Sign in with your mobile number and OTP."
          points={SIGN_IN_POINTS}
          ctaLabel="Sign In"
          to="/sign-in?path=/dashboard/bookings"
        />
        <Panel
          icon={UserRoundPlus}
          eyebrow="New here"
          title="Create Account"
          copy="Book verified workers in minutes. Registration takes less than a minute."
          points={SIGN_UP_POINTS}
          ctaLabel="Sign Up"
          to="/sign-up"
        />
      </div>

      <p className="mt-8 text-center text-[11px] leading-5 text-[#8fa2c8]">
        Looking for work instead?{" "}
        <Link to="/become-a-part-of-dehatwala" className="font-bold text-[#0b3fc4] hover:underline">
          Join the Dehatwala Worker Network
        </Link>
      </p>
    </div>
  </main>
);

export default DashboardSignedOut;
