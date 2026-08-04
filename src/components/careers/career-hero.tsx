import { BriefcaseBusiness } from "lucide-react";

type CareerHeroProps = {
  /** The in-page CTA only exists on the careers landing page. */
  showCta?: boolean;
};

const CareerHero = ({ showCta = false }: CareerHeroProps) => (
  <section className="relative isolate overflow-hidden rounded-3xl border border-[#dce7fb] bg-[linear-gradient(120deg,#ffffff_0%,#f2f6fe_58%,#e7effd_100%)]">
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background-image:linear-gradient(#dce7fb_1px,transparent_1px),linear-gradient(90deg,#dce7fb_1px,transparent_1px)] [background-size:56px_56px]"
    />
    <div
      aria-hidden="true"
      className="pointer-events-none absolute -right-28 -top-28 -z-10 hidden size-[420px] rounded-full bg-[#0b3fc4] lg:block"
    />

    <div className="grid items-center gap-8 px-5 py-8 sm:px-8 sm:py-10 lg:grid-cols-[1.02fr_0.98fr] lg:gap-10 lg:py-12">
      <div>
        <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0b3fc4]">Careers at Dehatwala</p>

        <h1 className="mt-3 text-[28px] font-extrabold leading-[1.15] tracking-tight text-[#0f1e57] sm:text-[38px]">
          Build the Future of
          <br className="hidden sm:block" /> Workforce Access in India <span aria-hidden="true">🇮🇳</span>
        </h1>

        <p className="mt-4 max-w-xl text-xs leading-6 text-[#63739a] sm:text-[13px]">
          Dehatwala is building a technology-enabled workforce platform focused on making access to workers and work
          opportunities simpler, more organised and accessible.
        </p>
        <p className="mt-3 max-w-xl text-xs leading-6 text-[#63739a] sm:text-[13px]">
          We are looking for passionate people who want to work on real-world challenges across workforce operations,
          technology, customer support and field execution.
        </p>

        {showCta && (
          <a
            href="#open-opportunities"
            className="mt-7 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            <BriefcaseBusiness size={16} aria-hidden="true" /> View Open Positions
          </a>
        )}
      </div>

      <div className="relative">
        <img
          src="/images/about/about-hero-workers.png"
          alt="Two Dehatwala team members in branded uniform and safety helmets"
          loading="eager"
          className="h-52 w-full rounded-2xl object-cover object-top shadow-[0_28px_60px_-40px_rgba(11,63,196,0.85)] sm:h-64 lg:h-[300px]"
        />
      </div>
    </div>
  </section>
);

export default CareerHero;
