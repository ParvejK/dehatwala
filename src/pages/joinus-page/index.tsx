import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Headphones,
  Home,
  IndianRupee,
  MapPin,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import RegistrationForm from "../../components/joinus/registration-form";
import WorkerTestimonials from "../../components/joinus/worker-testimonials";

const SUPPORT_PHONE = "+91 9997982419";

const HERO_HIGHLIGHTS = [
  { icon: MapPin, title: "नज़दीक के काम", copy: "आपके आसपास उपलब्ध काम" },
  { icon: IndianRupee, title: "समय पर भुगतान", copy: "रोज़ाना और समय पर भुगतान" },
  { icon: ShieldCheck, title: "भरोसेमंद प्लेटफ़ॉर्म", copy: "सुरक्षित और पारदर्शी प्रक्रिया" },
  { icon: CalendarDays, title: "रोज़ काम के अवसर", copy: "हर दिन नए काम उपलब्ध" },
];

const BENEFITS = [
  {
    icon: Star,
    title: "अच्छे काम के ज़्यादा मौके",
    copy: "नियमित काम पाने के अवसर",
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: UsersRound,
    title: "सम्मान के साथ काम",
    copy: "मेहनत का सम्मान, बेहतर अनुभव",
    tone: "bg-[#eef4ff] text-[#0b3fc4]",
  },
  {
    icon: Headphones,
    title: "सपोर्ट टीम हमेशा साथ",
    copy: "ज़रूरत पड़ने पर तुरंत सहायता",
    tone: "bg-amber-50 text-amber-600",
  },
  {
    icon: CheckCircle2,
    title: "आसान जॉइन प्रक्रिया",
    copy: "कुछ ही मिनटों में रजिस्ट्रेशन",
    tone: "bg-[#eef4ff] text-[#0b3fc4]",
  },
];

const FOOTER_LINKS = [
  { label: "गोपनीयता नीति", to: "/privacy-policy" },
  { label: "नियम और शर्तें", to: "/terms-and-conditions" },
  { label: "सहायता", to: "/contact" },
];

const JoinUs = () => (
  <main className="bg-white pb-10 pt-5 sm:pt-7">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
      {/* ---------- Hero ---------- */}
      <section className="relative isolate grid overflow-hidden rounded-[1.75rem] border border-[#d8e5fb] bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_48%,#edf4ff_100%)] shadow-[0_32px_90px_-52px_rgba(15,47,112,0.5)] sm:rounded-[2.25rem] lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-24 -top-24 -z-10 size-72 rounded-full bg-blue-100/80 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-10 left-[44%] -z-10 hidden size-40 rounded-full bg-amber-100/70 blur-3xl lg:block"
        />

        <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 lg:flex lg:min-h-[620px] lg:flex-col lg:justify-center lg:px-12 lg:py-14 xl:px-14">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-white/85 px-4 py-2 text-[0.68rem] font-extrabold uppercase tracking-[0.2em] text-[#0b3fc4] shadow-sm backdrop-blur">
              <span className="size-1.5 rounded-full bg-amber-400 ring-4 ring-amber-100" aria-hidden="true" />
              वर्कर पार्टनर बनें
            </p>
            <h1 className="mt-6 text-[2.15rem] font-black leading-[1.12] tracking-[-0.04em] text-[#0f1e57] sm:text-5xl sm:leading-[1.08] xl:text-[3.35rem]">
              देहात वाला के साथ
              <span className="block text-[#0b3fc4]">जुड़ें और आगे बढ़ें</span>
            </h1>
            <p className="mt-5 max-w-lg text-sm font-medium leading-7 text-[#526483] sm:text-base sm:leading-8">
              अपने हुनर से कमाएँ, नज़दीक के काम पाएं और अपने सपनों को पूरा करने की ओर अगला कदम बढ़ाएं।
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#registration-heading"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#0b3fc4] px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-[#08359f] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                अभी रजिस्टर करें <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                href={`tel:${SUPPORT_PHONE}`}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white/90 px-5 py-3 text-sm font-bold text-[#0f1e57] shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:border-blue-300 hover:text-[#0b3fc4] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <Headphones size={17} aria-hidden="true" /> सपोर्ट से बात करें
              </a>
            </div>
          </div>

          <ul className="relative mt-9 grid grid-cols-2 gap-3 border-t border-blue-100 pt-6 lg:max-w-xl">
            {HERO_HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
              <li
                key={title}
                className="flex min-w-0 items-start gap-2.5 rounded-2xl border border-white/80 bg-white/70 p-3 shadow-[0_10px_30px_-24px_rgba(11,63,196,0.5)] backdrop-blur sm:gap-3 sm:p-3.5"
              >
                <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-[#0b3fc4] shadow-sm sm:size-10">
                  <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <strong className="block text-[12px] font-extrabold leading-5 text-[#0f1e57] sm:text-[13px]">
                    {title}
                  </strong>
                  <span className="mt-0.5 hidden text-[10px] leading-4 text-[#63739a] sm:block">{copy}</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        <figure className="relative min-w-0 border-t border-blue-100 bg-[linear-gradient(145deg,#dceaff_0%,#eef5ff_42%,#d8e7ff_100%)] p-3 sm:p-5 lg:border-l lg:border-t-0 lg:p-6">
          <div
            aria-hidden="true"
            className="absolute right-5 top-5 size-24 rounded-full border border-white/80 sm:right-10 sm:top-10 sm:size-36"
          />
          <div
            aria-hidden="true"
            className="absolute bottom-8 left-5 size-16 rounded-full bg-amber-300/45 blur-2xl sm:bottom-12 sm:left-10 sm:size-24"
          />
          <div className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-[1.35rem] border border-white/90 bg-[#dceaff] shadow-[0_24px_60px_-32px_rgba(8,53,159,0.65)] sm:rounded-[1.75rem]">
            <img
              src="/images/join-us-hero.png"
              alt="देहात वाला के तीन वर्कर सुरक्षा हेलमेट में मोबाइल पर लाइव बुकिंग स्टेटस दिखाते हुए"
              width={1254}
              height={1254}
              sizes="(min-width: 1024px) 53vw, 100vw"
              fetchPriority="high"
              decoding="async"
              className="block aspect-square w-full object-contain object-center lg:h-full lg:aspect-auto"
            />
          </div>
        </figure>
      </section>

      {/* ---------- Breadcrumb ---------- */}
      <nav aria-label="Breadcrumb" className="mt-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
          <li>
            <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
              <Home size={14} aria-hidden="true" /> होम
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight size={14} className="text-[#a8b6d4]" />
          </li>
          <li className="font-bold text-[#0f1e57]" aria-current="page">
            अपना पंजीकरण करें
          </li>
        </ol>
      </nav>

      <h2
        id="registration-heading"
        className="mt-5 scroll-mt-24 text-[26px] font-extrabold tracking-tight text-[#0f1e57] sm:text-[32px]"
      >
        अपना पंजीकरण करें
      </h2>
      <p className="mt-1.5 text-sm text-[#63739a]">हमारे साथ जुड़ें और नज़दीक के काम पाएं</p>

      {/* ---------- Form + sidebar ---------- */}
      <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.62fr)]">
        <RegistrationForm />

        <div className="space-y-4 lg:sticky lg:top-24">
          <section
            aria-labelledby="benefits-heading"
            className="rounded-2xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-26px_rgba(20,61,141,0.5)] sm:p-6"
          >
            <h2 id="benefits-heading" className="text-base font-extrabold tracking-tight text-[#0f1e57]">
              देहात वाला से जुड़ने के फायदे
            </h2>

            <ul className="mt-5 space-y-5">
              {BENEFITS.map(({ icon: Icon, title, copy, tone }) => (
                <li key={title} className="flex items-start gap-3">
                  <span className={`grid size-10 shrink-0 place-items-center rounded-xl ${tone}`}>
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <strong className="block text-[13px] font-extrabold leading-snug text-[#0f1e57]">{title}</strong>
                    <span className="mt-1 block text-[11px] font-normal leading-4 text-[#8fa2c8]">{copy}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section
            aria-labelledby="help-heading"
            className="rounded-2xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-26px_rgba(20,61,141,0.5)] sm:p-6"
          >
            <h2 id="help-heading" className="text-base font-extrabold text-[#0f1e57]">
              मदद चाहिए?
            </h2>
            <p className="mt-2 text-xs leading-5 text-[#63739a]">हमारी सपोर्ट टीम आपकी मदद के लिए हमेशा तैयार है।</p>
            <a
              href={`tel:${SUPPORT_PHONE}`}
              className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#cfe0fb] bg-[#eef4ff] px-4 text-xs font-bold text-[#0b3fc4] transition hover:bg-[#e0ebff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              <Headphones size={15} aria-hidden="true" /> सपोर्ट से बात करें
            </a>
          </section>
        </div>
      </div>

      {/* ---------- What workers say ---------- */}
      <WorkerTestimonials />

      {/* ---------- Page footer strip ---------- */}
      <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-[#e6edf9] pt-5 text-[11px] font-medium text-[#8fa2c8] sm:flex-row sm:text-xs">
        <p>© 2025 देहात वाला. सर्वाधिकार सुरक्षित.</p>
        <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {FOOTER_LINKS.map(({ label, to }, index) => (
            <li key={label} className="flex items-center gap-4">
              <Link to={to} className="transition hover:text-[#0b3fc4]">
                {label}
              </Link>
              {index < FOOTER_LINKS.length - 1 && (
                <span aria-hidden="true" className="text-[#dce7fb]">
                  |
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </main>
);

export default JoinUs;
