import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  Check,
  CircleHelp,
  Clock3,
  Handshake,
  Headphones,
  IndianRupee,
  MapPin,
  Network,
  Phone,
  Search,
  ShieldCheck,
  Smartphone,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const differences = [
  {
    icon: Handshake,
    title: "Assisted Workforce Matching",
    copy: "We help customers find the right worker based on their actual service requirement.",
  },
  {
    icon: MapPin,
    title: "Location-Based Assignment",
    copy: "Nearby workers are matched according to the service location.",
  },
  {
    icon: Headphones,
    title: "End-to-End Support",
    copy: "From booking to worker assignment, our team stays involved throughout the process.",
  },
  {
    icon: Network,
    title: "Independent Worker Network",
    copy: "We support independent skilled and general workers across multiple service categories.",
  },
];

const workforceJourney = [
  {
    eyebrow: "Customer Problems",
    icon: UserRoundCheck,
    tone: "light",
    items: [
      [Search, "Difficult to find skilled workers"],
      [Clock3, "Time-consuming search"],
      [CircleHelp, "Uncertain worker availability"],
      [Phone, "Multiple phone calls"],
      [MapPin, "No location-based matching"],
      [CalendarClock, "Unclear service process"],
    ],
  },
  {
    eyebrow: "Worker Problems",
    icon: UsersRound,
    tone: "tint",
    items: [
      [CalendarClock, "Irregular work opportunities"],
      [Clock3, "No consistent bookings"],
      [Network, "Limited customer reach"],
      [UsersRound, "Dependence on labour chowks"],
      [IndianRupee, "Income uncertainty"],
      [MapPin, "Difficulty finding nearby work"],
    ],
  },
  {
    eyebrow: "Dehatwala Solution",
    icon: ShieldCheck,
    tone: "brand",
    items: [
      [Handshake, "Assisted Matching"],
      [MapPin, "Location-Based Assignment"],
      [Sparkles, "Faster Booking"],
      [UserRoundCheck, "Verified Independent Workers"],
      [Headphones, "Dedicated Support"],
      [Smartphone, "Simple Digital Experience"],
    ],
  },
] as const;

type JourneyColumn = (typeof workforceJourney)[number];

const ProblemColumn = ({ column, index }: { column: JourneyColumn; index: number }) => {
  const HeaderIcon = column.icon;
  const isBrand = column.tone === "brand";

  return (
    <article
      className={`relative rounded-[1.75rem] border p-5 shadow-sm sm:p-6 ${
        isBrand
          ? "border-blue-700 bg-[var(--home-color-brand-deep)] text-white shadow-xl shadow-blue-950/15"
          : column.tone === "tint"
            ? "border-blue-200 bg-[var(--home-color-surface-tint)] text-[var(--home-color-ink)]"
            : "border-[var(--home-color-border)] bg-white text-[var(--home-color-ink)]"
      }`}
    >
      {index > 0 && (
        <span className="absolute -top-5 left-1/2 z-10 grid size-10 -translate-x-1/2 place-items-center rounded-full border-4 border-[var(--home-color-surface-soft)] bg-blue-700 text-white lg:-left-6 lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-0">
          <ArrowRight size={17} aria-hidden="true" />
        </span>
      )}
      <div
        className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
          isBrand ? "bg-blue-600 text-white" : "bg-blue-700 text-white"
        }`}
      >
        <HeaderIcon size={20} aria-hidden="true" />
        <h3 className="text-sm font-extrabold">{column.eyebrow}</h3>
      </div>
      <ul className="mt-5 space-y-4">
        {column.items.map(([Icon, label]) => (
          <li key={label} className="flex items-center gap-3 text-sm font-semibold leading-5">
            <span
              className={`grid size-8 shrink-0 place-items-center rounded-lg ${
                isBrand ? "bg-white/10 text-blue-200" : "bg-blue-50 text-blue-700"
              }`}
            >
              <Icon size={16} aria-hidden="true" />
            </span>
            {label}
          </li>
        ))}
      </ul>
    </article>
  );
};

const AboutPage = () => {
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="home-surface-soft relative isolate">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_20%,rgba(37,99,235,0.13),transparent_28%),radial-gradient(circle_at_82%_74%,rgba(245,158,11,0.12),transparent_24%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-14 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:px-10 lg:py-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
              <Sparkles size={14} aria-hidden="true" /> About Dehatwala
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              Who <span className="text-blue-700">we are.</span>
            </h1>
            <div className="mt-6 max-w-2xl space-y-4 text-base leading-7 text-slate-600">
              <p>
                Dehatwala is a technology-enabled workforce platform that helps customers connect with independent
                skilled and general workers through a simple, assisted booking experience.
              </p>
              <p>
                From understanding customer requirements to matching suitable workers, assignment coordination, and
                booking support, Dehatwala provides an end-to-end assisted workforce experience designed to make hiring
                simpler, faster, and more reliable.
              </p>
              <p>
                Our mission is to make workforce hiring easier for customers while creating more consistent earning
                opportunities for independent workers.
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/#book-a-worker"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Book a worker <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/become-a-part-of-dehatwala"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Become a worker
              </Link>
            </div>
          </div>

          <div className="relative min-h-[26rem] sm:min-h-[32rem] lg:min-h-[39rem]">
            <div className="absolute inset-4 rounded-[2.5rem] bg-blue-700 sm:inset-7" />
            <img
              src="/images/about/about-hero-workers.png"
              alt="Two Dehatwala workers wearing safety helmets"
              className="absolute inset-0 h-full w-full rounded-[2.5rem] object-cover object-center shadow-2xl [clip-path:polygon(8%_0,100%_0,100%_92%,0_100%,0_10%)]"
            />
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-[var(--home-color-brand-deep)]/90 p-4 text-white shadow-xl backdrop-blur sm:left-8 sm:right-auto sm:w-72">
              <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/10 text-amber-400">
                <BadgeCheck size={21} aria-hidden="true" />
              </span>
              <span className="text-xs font-semibold leading-5">Technology with a human support layer.</span>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-white py-20 lg:py-28">
        <div className="pointer-events-none absolute left-0 top-16 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-50 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[0.68fr_1.32fr] lg:gap-16 lg:px-10">
          <div className="lg:py-5">
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
              <span className="h-px w-8 bg-blue-600" aria-hidden="true" />
              Built around real needs
            </p>
            <h2 className="mt-5 max-w-md text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              Why we’re built <span className="text-blue-700">differently.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              Technology makes the process faster. Human support makes it dependable. We bring both together at every
              step.
            </p>
            <div className="mt-8 flex max-w-md items-center gap-4 border-t border-slate-200 pt-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-emerald-50 text-emerald-700">
                <BadgeCheck size={21} aria-hidden="true" />
              </span>
              <p className="text-sm font-semibold leading-6 text-slate-700">
                One supported journey—from requirement to assignment.
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {differences.map(({ icon: Icon, title, copy }, index) => {
              const isFeatured = index === 0;

              return (
                <article
                  key={title}
                  className={`group relative isolate min-h-64 overflow-hidden rounded-[1.75rem] border p-6 transition duration-300 hover:-translate-y-1 sm:p-7 ${
                    isFeatured
                      ? "border-blue-700 bg-blue-700 text-white shadow-xl shadow-blue-900/20"
                      : index === 3
                        ? "border-blue-100 bg-[var(--home-color-surface-tint)] text-[var(--home-color-ink)]"
                        : "border-slate-200 bg-white text-[var(--home-color-ink)] shadow-sm hover:border-blue-200 hover:shadow-lg hover:shadow-blue-950/5"
                  }`}
                >
                  {isFeatured && (
                    <>
                      <div className="pointer-events-none absolute -right-16 -top-16 -z-10 size-56 rounded-full border-[38px] border-white/[0.07]" />
                      <div className="pointer-events-none absolute -bottom-20 left-1/3 -z-10 size-48 rounded-full bg-blue-400/25 blur-3xl" />
                    </>
                  )}

                  <div className="flex items-start justify-between gap-5">
                    <span
                      className={`grid size-12 place-items-center rounded-2xl ${
                        isFeatured ? "bg-white/15 text-white" : "bg-blue-50 text-blue-700"
                      }`}
                    >
                      <Icon size={23} aria-hidden="true" />
                    </span>
                    <span
                      className={`text-xs font-black tracking-[0.18em] ${
                        isFeatured ? "text-blue-200" : "text-slate-300"
                      }`}
                      aria-hidden="true"
                    >
                      0{index + 1}
                    </span>
                  </div>

                  <div className="mt-10">
                    <h3 className="max-w-xs text-xl font-extrabold leading-7">{title}</h3>
                    <p className={`mt-3 max-w-sm text-sm leading-6 ${isFeatured ? "text-blue-100" : "text-slate-600"}`}>
                      {copy}
                    </p>
                  </div>

                  <div
                    className={`absolute inset-x-6 bottom-0 h-1 rounded-t-full transition-all duration-300 group-hover:inset-x-4 ${
                      isFeatured ? "bg-amber-400" : "bg-blue-600"
                    }`}
                    aria-hidden="true"
                  />
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="home-surface-soft relative overflow-hidden border-y border-blue-100 py-20 lg:py-28">
        <div className="pointer-events-none absolute -right-24 -top-24 size-80 rounded-full border-[58px] border-blue-200/30" />
        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:gap-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Our reason for building</p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Why we started <span className="text-blue-700">Dehatwala</span>
              </h2>
              <div className="mt-6 space-y-4 text-base leading-7 text-slate-600">
                <p>Every day, customers need reliable workers, and independent workers look for better work opportunities.</p>
                <p>
                  Dehatwala was created to make workforce access simpler through technology and assisted support. By
                  using smart matching, location-based assignment, and a streamlined booking experience, we help
                  customers find the right worker faster while making work opportunities more accessible for independent
                  workers.
                </p>
              </div>
            </div>
            <blockquote className="relative self-end rounded-[2rem] bg-[var(--home-color-brand-deep)] p-7 text-white shadow-2xl shadow-blue-950/15 sm:p-9">
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-amber-400">
                <Sparkles size={23} aria-hidden="true" />
                <span className="sr-only">Mission</span>
              </span>
              <p className="mt-7 text-xl font-bold leading-8 tracking-tight sm:text-2xl sm:leading-9">
                “Our mission is to make finding the right worker—and finding the right work—as simple, fast, and
                accessible as a few taps on a smartphone.”
              </p>
            </blockquote>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-3 lg:gap-7">
            {workforceJourney.map((column, index) => (
              <ProblemColumn key={column.eyebrow} column={column} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="relative isolate overflow-hidden rounded-[2rem] bg-blue-700 px-6 py-10 text-white shadow-2xl shadow-blue-950/20 sm:px-10 lg:grid lg:min-h-[25rem] lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:px-14 lg:py-12">
            <div className="pointer-events-none absolute -left-24 -top-24 -z-10 size-72 rounded-full border-[45px] border-white/5" />
            <div className="relative z-10">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-200">Ready when you are</p>
              <h2 className="mt-4 max-w-md text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Workforce solutions you can rely on.
              </h2>
              <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-blue-100">
                {["Simple booking", "Verified workers", "End-to-end support"].map((item) => (
                  <span key={item} className="inline-flex items-center gap-2">
                    <Check size={16} className="text-amber-300" aria-hidden="true" /> {item}
                  </span>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/#book-a-worker"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-white/30"
                >
                  Book a worker <ArrowRight size={18} aria-hidden="true" />
                </Link>
                <Link
                  to="/become-a-part-of-dehatwala"
                  className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/40 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20 focus:outline-none focus:ring-4 focus:ring-white/20"
                >
                  Become a worker
                </Link>
              </div>
            </div>
            <div className="relative mt-10 min-h-64 lg:absolute lg:bottom-0 lg:right-0 lg:mt-0 lg:h-full lg:w-[53%]">
              <img
                src="/images/about/about-hero-workers.png"
                alt=""
                className="absolute inset-0 h-full w-full object-cover object-center [mask-image:linear-gradient(to_right,transparent_0%,black_26%)]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-700/50 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutPage;
