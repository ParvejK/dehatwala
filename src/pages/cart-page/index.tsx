import { useEffect, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Clock3,
  HardHat,
  Headphones,
  Home,
  MapPin,
  MessageCircle,
  Minus,
  Plus,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { serviceDetails } from "../service-detail-page/data";
import { useDayRateStore } from "../../store/day-service-store";

const SUPPORT_PHONE = "+918600999922";
const WHATSAPP_URL = "https://wa.me/918600999922";

type StepperProps = {
  label: string;
  rate: number;
  unit: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  allowZero?: boolean;
  icon: typeof HardHat;
};

const formatPrice = (value: number) => new Intl.NumberFormat("en-IN").format(value);

const Stepper = ({ label, rate, unit, value, onDecrease, onIncrease, allowZero, icon: Icon }: StepperProps) => (
  <div className="flex flex-col gap-4 border-b border-[#e8effb] py-5 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex min-w-0 items-center gap-4">
      <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f1f6ff] text-[#0b3fc4]">
        <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-sm font-extrabold text-[#0f1e57] sm:text-base">{label}</h3>
        <p className="mt-1 text-xs font-bold text-[#0b3fc4]">
          ₹{formatPrice(rate)} <span className="font-medium text-[#63739a]">/ {unit}</span>
        </p>
      </div>
    </div>

    <div className="inline-flex h-11 w-fit items-center overflow-hidden rounded-xl border border-[#d8e4f8] bg-white shadow-sm">
      <button
        type="button"
        onClick={onDecrease}
        disabled={allowZero ? value === 0 : value === 1}
        className="grid size-11 place-items-center text-[#0b3fc4] transition hover:bg-[#f1f6ff] disabled:cursor-not-allowed disabled:text-slate-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
        aria-label={`Decrease ${label}`}
      >
        <Minus size={16} aria-hidden="true" />
      </button>
      <output className="grid h-full min-w-11 place-items-center border-x border-[#e6edf9] text-sm font-extrabold text-[#0f1e57]">
        {value}
      </output>
      <button
        type="button"
        onClick={onIncrease}
        className="grid size-11 place-items-center text-[#0b3fc4] transition hover:bg-[#f1f6ff] focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-500"
        aria-label={`Increase ${label}`}
      >
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  </div>
);

const CartPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug = searchParams.get("slug") || "loading-unloading-work";
  const service = serviceDetails[slug] ?? serviceDetails["loading-unloading-work"];
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsError, setShowTermsError] = useState(false);
  const [selectedTip, setSelectedTip] = useState(0);

  const {
    MasonDayCount,
    helperDayCount,
    MasonRate,
    helperRate,
    MasonOvertimeCount,
    helperOvertimeCount,
    MasonOvertimeRate,
    helperOvertimeRate,
    totalMasonDayRate,
    totalHelperDayRate,
    totalMasonOvertimeRate,
    totalHelperOvertimeRate,
    totalDayPrice,
    incrementMasonDay,
    decrementMasonDay,
    incrementHelperDay,
    decrementHelperDay,
    incrementMasonOvertime,
    decrementMasonOvertime,
    incrementHelperOvertime,
    decrementHelperOvertime,
    setTipPrice,
  } = useDayRateStore();

  useEffect(() => {
    localStorage.setItem("service-title", service.title);
  }, [service.title]);

  const handleTip = (amount: number) => {
    setSelectedTip(amount);
    setTipPrice(amount);
  };

  const continueBooking = () => {
    if (!acceptedTerms) {
      setShowTermsError(true);
      return;
    }
    navigate(`/service-letter?service=day&slug=${encodeURIComponent(service.slug)}`);
  };

  return (
    <main className="bg-white pb-20 pt-5 sm:pt-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
                <Home size={14} aria-hidden="true" /> Home
              </Link>
            </li>
            <li aria-hidden="true"><ChevronRight size={14} className="text-[#a8b6d4]" /></li>
            <li><Link to="/service/all" className="transition hover:text-[#0b3fc4]">Services</Link></li>
            <li aria-hidden="true"><ChevronRight size={14} className="text-[#a8b6d4]" /></li>
            <li className="font-bold text-[#0f1e57]" aria-current="page">Book {service.title}</li>
          </ol>
        </nav>

        <section className="relative overflow-hidden rounded-3xl border border-[#dce7fb] bg-[#f2f6fe] shadow-[0_18px_50px_-24px_rgba(20,61,141,0.45)]">
          <div className="grid lg:grid-cols-[1fr_1.05fr]">
            <div className="relative z-10 flex flex-col justify-center px-6 py-9 sm:px-10 lg:pl-12">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b3fc4]">Instant workforce booking</p>
              <h1 className="mt-3 text-[30px] font-extrabold leading-tight tracking-tight text-[#0f1e57] sm:text-[38px]">
                Book {service.title} Service
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-[#4a5b83]">{service.shortDescription[0]}</p>
              <ul className="mt-7 flex flex-wrap gap-4 text-xs font-bold text-[#0f1e57]">
                <li className="flex items-center gap-2"><ShieldCheck size={18} className="text-[#0b3fc4]" /> Trusted &amp; verified workers</li>
                <li className="flex items-center gap-2"><Check size={18} className="text-[#0b3fc4]" /> Quick &amp; hassle-free booking</li>
              </ul>
            </div>
            <div className="relative min-h-60 overflow-hidden sm:min-h-72 lg:min-h-[300px]">
              <img src={service.image} alt={`Worker providing ${service.title.toLowerCase()}`} className="absolute inset-0 size-full object-cover" />
              <div aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(to_top,#f2f6fe_0%,transparent_45%)] lg:bg-[linear-gradient(to_right,#f2f6fe_0%,transparent_28%)]" />
            </div>
          </div>
        </section>

        <div className="mt-5 grid items-start gap-5 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
          <div className="space-y-5">
            <section aria-labelledby="worker-heading" className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-22px_rgba(20,61,141,0.45)] sm:p-7">
              <div className="flex items-center gap-3">
                <span className="grid size-8 place-items-center rounded-full bg-[#0b3fc4] text-sm font-extrabold text-white">1</span>
                <h2 id="worker-heading" className="text-xl font-extrabold text-[#0f1e57]">Select workers</h2>
              </div>
              <div className="mt-3">
                <Stepper label="Skilled Worker" rate={MasonRate} unit="day" value={MasonDayCount} onDecrease={decrementMasonDay} onIncrease={incrementMasonDay} icon={HardHat} />
                <Stepper label="Helper" rate={helperRate} unit="day" value={helperDayCount} onDecrease={decrementHelperDay} onIncrease={incrementHelperDay} icon={UserRound} />
              </div>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="grid size-8 place-items-center rounded-full bg-[#0b3fc4] text-sm font-extrabold text-white">2</span>
                  <div>
                    <h2 className="text-xl font-extrabold text-[#0f1e57]">Overtime <span className="text-sm font-semibold text-[#0b3fc4]">(Optional)</span></h2>
                    <p className="mt-1 text-xs font-medium text-[#63739a]">After 5:00 PM</p>
                  </div>
                </div>
              </div>
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#eef4ff] px-4 py-3 text-xs font-medium leading-5 text-[#40517b]">
                <Clock3 size={16} className="mt-0.5 shrink-0 text-[#0b3fc4]" /> Charged only for actual hours worked after 5:00 PM.
              </p>
              <div className="mt-2">
                <Stepper label="Skilled Worker Overtime" rate={MasonOvertimeRate} unit="hour" value={MasonOvertimeCount} onDecrease={decrementMasonOvertime} onIncrease={incrementMasonOvertime} allowZero icon={Clock3} />
                <Stepper label="Helper Overtime" rate={helperOvertimeRate} unit="hour" value={helperOvertimeCount} onDecrease={decrementHelperOvertime} onIncrease={incrementHelperOvertime} allowZero icon={Clock3} />
              </div>
            </section>
          </div>

          <aside aria-labelledby="summary-heading" className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_16px_42px_-24px_rgba(20,61,141,0.55)] sm:p-7 lg:sticky lg:top-24">
            <h2 id="summary-heading" className="text-xl font-extrabold text-[#0f1e57]">Booking Summary</h2>
            <div className="mt-5 space-y-4 text-sm">
              {[
                ["Skilled Worker", `${MasonDayCount} × ₹${formatPrice(MasonRate)}`, totalMasonDayRate],
                ["Helper", `${helperDayCount} × ₹${formatPrice(helperRate)}`, totalHelperDayRate],
                ...(MasonOvertimeCount ? [["Skilled Worker Overtime", `${MasonOvertimeCount} × ₹${formatPrice(MasonOvertimeRate)}`, totalMasonOvertimeRate]] : []),
                ...(helperOvertimeCount ? [["Helper Overtime", `${helperOvertimeCount} × ₹${formatPrice(helperOvertimeRate)}`, totalHelperOvertimeRate]] : []),
              ].map(([label, detail, amount]) => (
                <div key={String(label)} className="flex items-end justify-between gap-4">
                  <div><p className="font-bold text-[#0f1e57]">{label}</p><p className="mt-1 text-xs text-[#63739a]">{detail}</p></div>
                  <strong className="text-[#0f1e57]">₹{formatPrice(Number(amount))}</strong>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t border-[#e3ebf8] pt-5">
              <p className="text-xs font-bold text-[#40517b]">Add a tip for your workers</p>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[0, 50, 100, 200].map((amount) => (
                  <button key={amount} type="button" onClick={() => handleTip(amount)} className={`min-h-10 rounded-xl border text-xs font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${selectedTip === amount ? "border-[#0b3fc4] bg-[#0b3fc4] text-white" : "border-[#d8e4f8] text-[#40517b] hover:bg-[#f1f6ff]"}`}>
                    {amount === 0 ? "No tip" : `₹${amount}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex items-end justify-between border-t border-[#e3ebf8] pt-5">
              <div><p className="text-sm font-bold text-[#0f1e57]">Total Amount</p><p className="mt-1 text-[11px] text-emerald-600">Secure payments. 100% safe.</p></div>
              <strong className="text-2xl font-extrabold text-[#0f1e57]">₹{formatPrice(totalDayPrice)}</strong>
            </div>

            <button type="button" onClick={continueBooking} className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-6 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200">
              Continue Booking <ArrowRight size={17} aria-hidden="true" />
            </button>

            <label className="mt-4 flex cursor-pointer items-start gap-3 text-xs leading-5 text-[#40517b]">
              <input type="checkbox" checked={acceptedTerms} onChange={(event) => { setAcceptedTerms(event.target.checked); setShowTermsError(false); }} className="mt-0.5 size-4 rounded border-[#9bb0d6] text-[#0b3fc4] focus:ring-[#0b3fc4]" />
              <span>I have read and agree to the <Link to="/terms-and-conditions" className="font-bold text-[#0b3fc4] hover:underline">Terms &amp; Conditions</Link>.</span>
            </label>
            {showTermsError && <p role="alert" className="mt-2 text-xs font-semibold text-red-600">Please accept the terms to continue.</p>}
            <p className="mt-3 text-[11px] leading-5 text-[#7080a4]">By continuing, you also agree to our cancellation, refund and privacy policies.</p>
          </aside>
        </div>

        <section className="mt-5 flex items-center gap-4 rounded-2xl border border-[#dce7fb] bg-[#f2f6fe] px-5 py-5 sm:px-7">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white text-[#0b3fc4] shadow-sm"><MapPin size={23} aria-hidden="true" /></span>
          <div><h2 className="font-extrabold text-[#0f1e57]">Workers will be assigned from your nearest location</h2><p className="mt-1 text-xs text-[#63739a]">We ensure the fastest possible delivery of skilled workers.</p></div>
        </section>

        <section aria-label="Support options" className="mt-5 grid overflow-hidden rounded-2xl bg-[#062f87] text-white md:grid-cols-2">
          <a href={`tel:${SUPPORT_PHONE}`} className="flex min-h-28 items-center gap-4 border-b border-white/15 px-6 transition hover:bg-white/10 md:border-b-0 md:border-r">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-white/10"><Headphones size={23} /></span>
            <div><p className="text-xs text-blue-200">Need Help?</p><h2 className="mt-1 font-bold">Talk to our support team</h2></div>
          </a>
          <a href={WHATSAPP_URL} target="_blank" rel="noreferrer" className="flex min-h-28 items-center gap-4 px-6 transition hover:bg-white/10">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-emerald-500"><MessageCircle size={24} /></span>
            <div className="flex-1"><p className="text-xs text-blue-200">Chat on WhatsApp</p><h2 className="mt-1 font-bold">We&apos;re online to help you</h2></div>
            <ArrowRight size={18} />
          </a>
        </section>
      </div>
    </main>
  );
};

export default CartPage;
