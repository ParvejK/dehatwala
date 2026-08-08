import {
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

const SUPPORT_PHONE = "+918600999922";

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
      <section className="relative overflow-hidden rounded-3xl bg-[linear-gradient(105deg,#0a3a95_0%,#0d47b4_46%,rgba(13,71,180,0.55)_66%,rgba(13,71,180,0.15)_100%)]">
        <img
          src="/images/dehatwala-worker-join.png"
          alt="देहात वाला का वर्कर"
          className="absolute inset-y-0 right-0 hidden h-full w-1/2 object-cover object-center md:block"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 hidden bg-[linear-gradient(90deg,#0a3a95_0%,#0d47b4_38%,rgba(13,71,180,0.72)_54%,transparent_82%)] md:block"
        />

        <div className="relative px-6 py-9 sm:px-9 sm:py-11">
          <div className="md:max-w-[58%]">
            <h1 className="inline-block text-[26px] font-extrabold leading-tight tracking-tight text-white sm:text-[36px]">
              देहात वाला के साथ जुड़ें
              <span aria-hidden="true" className="mt-2 block h-1 w-28 rounded-full bg-amber-400 sm:w-36" />
            </h1>
            <p className="mt-4 text-sm leading-7 text-blue-100 sm:text-base">
              अपने हुनर से कमाएँ और अपने सपनों को पूरा करें।
            </p>
          </div>

          <ul className="relative mt-7 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-4 xl:max-w-[78%]">
            {HERO_HIGHLIGHTS.map(({ icon: Icon, title, copy }) => (
              <li
                key={title}
                className="rounded-2xl border border-white/60 bg-white px-3 py-4 text-center shadow-lg shadow-blue-950/20 sm:px-4"
              >
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#0b3fc4] text-white">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <strong className="mt-3 block text-[13px] font-extrabold leading-tight text-[#0f1e57]">{title}</strong>
                <span className="mt-1.5 block text-[11px] font-normal leading-4 text-[#63739a]">{copy}</span>
              </li>
            ))}
          </ul>
        </div>
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

      <h2 className="mt-5 text-[26px] font-extrabold tracking-tight text-[#0f1e57] sm:text-[32px]">
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
