import { Armchair, ArrowRight, BriefcaseBusiness, HardHat, Mail, MailOpen, Send } from "lucide-react";
import { Link } from "react-router-dom";

import CareerHero from "../../components/careers/career-hero";
import CareersBreadcrumb from "../../components/careers/careers-breadcrumb";
import {
  CAREERS_EMAIL,
  CAREERS_MAILTO,
  CAREERS_SUBJECT,
  HIRING_PROCESS,
  OPEN_POSITIONS_PATH,
  SEND_PROFILE_PATH,
  WHY_JOIN,
  WORKER_JOIN_PATH,
} from "../../components/careers/data";

const SectionHeading = ({ id, title, copy }: { id: string; title: string; copy?: string }) => (
  <div className="text-center">
    <h2 id={id} className="text-base font-extrabold uppercase tracking-[0.14em] text-[#0b3fc4] sm:text-lg">
      {title}
    </h2>
    <span aria-hidden="true" className="mx-auto mt-2 block h-[3px] w-11 rounded-full bg-[#0b3fc4]" />
    {copy && <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-[#63739a] sm:text-[13px]">{copy}</p>}
  </div>
);

const CareersPage = () => (
  <main className="bg-[#f8fbff] pb-14 pt-5 sm:pt-6">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
      <CareersBreadcrumb />

      <CareerHero showCta />

      {/* ---------- Why join ---------- */}
      <section aria-labelledby="why-join-heading" className="mt-8 sm:mt-10">
        <SectionHeading id="why-join-heading" title="Why Join Dehatwala?" />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WHY_JOIN.map(({ icon: Icon, title, copy }) => (
            <article
              key={title}
              className="rounded-2xl border border-[#dce7fb] bg-white p-5 transition hover:border-[#bfd5fb] hover:shadow-[0_16px_34px_-26px_rgba(11,63,196,0.8)] sm:p-6"
            >
              <span className="grid size-12 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-extrabold text-[#0b3fc4]">{title}</h3>
              <p className="mt-2 text-xs font-normal leading-6 text-[#63739a]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Open opportunities ---------- */}
      <section
        id="open-opportunities"
        aria-labelledby="opportunities-heading"
        className="mt-8 scroll-mt-28 rounded-3xl border border-[#dce7fb] bg-white p-5 sm:p-6 lg:p-7"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
          <div className="relative hidden overflow-hidden rounded-2xl border border-[#dce7fb] bg-[linear-gradient(160deg,#eef4ff,#f8fbff)] p-6 lg:block lg:w-[248px] lg:shrink-0">
            <span
              aria-hidden="true"
              className="absolute inset-0 opacity-60 [background-image:radial-gradient(#cfe0fb_1px,transparent_1px)] [background-size:14px_14px]"
            />
            <div className="relative flex h-full flex-col items-center justify-center gap-4">
              <span className="grid size-24 place-items-center rounded-3xl bg-white text-[#0b3fc4] shadow-[0_20px_40px_-28px_rgba(11,63,196,0.9)]">
                <Armchair size={46} aria-hidden="true" />
              </span>
              <span className="rounded-full border border-[#cfe0fb] bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0b3fc4]">
                Open
              </span>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="opportunities-heading"
              className="text-base font-extrabold uppercase tracking-[0.14em] text-[#0b3fc4] sm:text-lg"
            >
              Open Opportunities
            </h2>
            <p className="mt-3 max-w-2xl text-xs leading-6 text-[#63739a] sm:text-[13px]">
              Explore current opportunities to join the Dehatwala team. If there are no active openings, you can still
              share your profile with us for future opportunities.
            </p>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
              <article className="flex flex-col rounded-2xl border border-[#dce7fb] bg-[#f8fbff] p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#0b3fc4] shadow-sm">
                    <BriefcaseBusiness size={19} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#0b3fc4]">
                      View Open Positions
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-[#63739a]">Explore current job openings and apply.</p>
                  </div>
                </div>
                <Link
                  to={OPEN_POSITIONS_PATH}
                  className="group mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  View Open Positions
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </article>

              <div aria-hidden="true" className="flex items-center gap-3 lg:flex-col lg:gap-2 lg:self-stretch lg:px-1">
                <span className="h-px flex-1 bg-[#dce7fb] lg:h-auto lg:w-px lg:flex-1" />
                <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#63739a]">or</span>
                <span className="h-px flex-1 bg-[#dce7fb] lg:h-auto lg:w-px lg:flex-1" />
              </div>

              <article className="flex flex-col rounded-2xl border border-[#dce7fb] bg-[#f8fbff] p-5">
                <div className="flex items-start gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white text-[#0b3fc4] shadow-sm">
                    <MailOpen size={19} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#0b3fc4]">
                      No Role That Fits?
                    </h3>
                    <p className="mt-1.5 text-xs leading-5 text-[#63739a]">
                      Share your profile for future opportunities.
                    </p>
                  </div>
                </div>
                <Link
                  to={SEND_PROFILE_PATH}
                  className="group mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-4 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Send Your Profile
                  <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Hiring process ---------- */}
      <section aria-labelledby="process-heading" className="mt-8 sm:mt-10">
        <SectionHeading
          id="process-heading"
          title="Our Hiring Process"
          copy="Four steps, usually wrapped up within two weeks. You will always know where you stand."
        />

        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HIRING_PROCESS.map(({ step, icon: Icon, title, copy }, index) => (
            <li
              key={step}
              className="relative rounded-2xl border border-[#dce7fb] bg-white p-5 transition hover:border-[#bfd5fb] hover:shadow-[0_16px_34px_-26px_rgba(11,63,196,0.8)]"
            >
              {index < HIRING_PROCESS.length - 1 && (
                <span aria-hidden="true" className="absolute -right-4 top-9 hidden h-px w-4 bg-[#dce7fb] lg:block" />
              )}
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-11 place-items-center rounded-full bg-[#0b3fc4] text-white">
                  <Icon size={19} aria-hidden="true" />
                </span>
                <span className="text-2xl font-extrabold tracking-tight text-[#dce7fb]">{step}</span>
              </div>
              <h3 className="mt-3.5 text-sm font-extrabold text-[#0b3fc4]">{title}</h3>
              <p className="mt-2 text-xs font-normal leading-6 text-[#63739a]">{copy}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------- Career contact ---------- */}
      <section
        aria-labelledby="career-contact-heading"
        className="mt-8 rounded-3xl border border-[#dce7fb] bg-white p-5 sm:p-6"
      >
        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr_auto] lg:items-center lg:gap-7">
          <div className="flex items-start gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0b3fc4]">
              <Mail size={22} aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <h2
                id="career-contact-heading"
                className="text-base font-extrabold uppercase tracking-[0.14em] text-[#0b3fc4]"
              >
                Career Contact
              </h2>
              <p className="mt-2 text-xs leading-6 text-[#63739a]">
                Interested in joining the Dehatwala team? Email your CV or profile to:
              </p>
              <a
                href={CAREERS_MAILTO}
                className="mt-1 inline-block break-all text-[13px] font-extrabold text-[#0b3fc4] underline-offset-4 transition hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                {CAREERS_EMAIL}
              </a>
            </div>
          </div>

          <div className="border-t border-[#dce7fb] pt-5 lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
            <p className="text-xs font-semibold text-[#63739a]">Subject:</p>
            <p className="mt-1 text-[13px] font-extrabold leading-6 text-[#0b3fc4]">{CAREERS_SUBJECT}</p>
          </div>

          <div
            aria-hidden="true"
            className="hidden size-[104px] shrink-0 place-items-center rounded-2xl border border-[#dce7fb] bg-[linear-gradient(160deg,#eef4ff,#f8fbff)] text-[#0b3fc4] lg:grid"
          >
            <Send size={40} />
          </div>
        </div>
      </section>

      {/* ---------- Worker note ---------- */}
      <section
        aria-labelledby="worker-note-heading"
        className="mt-6 rounded-3xl border border-[#dce7fb] bg-[#f2f6fe] p-5 sm:p-6"
      >
        <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:gap-6 sm:text-left">
          <img
            src="/images/careers-worker-note.jpg"
            alt="Two Dehatwala workers in branded uniforms and safety helmets"
            loading="lazy"
            width={800}
            height={800}
            className="aspect-square w-32 shrink-0 rounded-2xl object-contain sm:w-28 lg:w-32"
          />

          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0b3fc4]">Important Note</p>
            <h2 id="worker-note-heading" className="mt-1.5 text-sm font-extrabold leading-6 text-[#0f1e57] sm:text-base">
              Looking for work opportunities as a skilled or general worker?
            </h2>
            <p className="mt-1.5 text-xs leading-5 text-[#63739a]">Join the Dehatwala Worker Network.</p>
          </div>

          <div className="w-full sm:w-auto sm:shrink-0">
            <Link
              to={WORKER_JOIN_PATH}
              className="group inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
            >
              <HardHat size={16} aria-hidden="true" /> Join as a Worker
              <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  </main>
);

export default CareersPage;
