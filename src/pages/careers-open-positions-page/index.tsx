import { ArrowRight, Briefcase, Building2, MailOpen, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

import CareerHero from "../../components/careers/career-hero";
import CareersBreadcrumb from "../../components/careers/careers-breadcrumb";
import { OPEN_POSITIONS, positionPath, SEND_PROFILE_PATH } from "../../components/careers/data";

const CareersOpenPositionsPage = () => {
  const count = OPEN_POSITIONS.length;

  return (
    <main className="bg-[#f8fbff] pb-14 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <CareersBreadcrumb current="Open Positions" />

        <CareerHero />

        <section aria-labelledby="open-positions-heading" className="mt-8 sm:mt-10">
          <div className="text-center">
            <h2
              id="open-positions-heading"
              className="text-base font-extrabold uppercase tracking-[0.14em] text-[#0b3fc4] sm:text-lg"
            >
              Open Positions
            </h2>
            <span aria-hidden="true" className="mx-auto mt-2 block h-[3px] w-11 rounded-full bg-[#0b3fc4]" />
            <p className="mx-auto mt-3 max-w-2xl text-xs leading-6 text-[#63739a] sm:text-[13px]">
              {count > 0
                ? `${count} ${count === 1 ? "role is" : "roles are"} open right now. Pick one to see the details and apply.`
                : "We do not have any active openings at the moment."}
            </p>
          </div>

          {count > 0 ? (
            <ul className="mt-6 grid gap-4 lg:grid-cols-2">
              {OPEN_POSITIONS.map(({ slug, title, icon: Icon, department, location, type, summary }) => (
                <li key={slug}>
                  <Link
                    to={positionPath(slug)}
                    className="group flex h-full flex-col rounded-2xl border border-[#dce7fb] bg-white p-5 transition hover:border-[#bfd5fb] hover:shadow-[0_16px_34px_-26px_rgba(11,63,196,0.8)] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:p-6"
                  >
                    <div className="flex items-start gap-4">
                      <span className="grid size-12 shrink-0 place-items-center rounded-xl bg-[#eef4ff] text-[#0b3fc4]">
                        <Icon size={22} aria-hidden="true" />
                      </span>
                      <div className="min-w-0">
                        <h3 className="text-sm font-extrabold text-[#0f1e57] sm:text-[15px]">{title}</h3>
                        <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] font-semibold text-[#63739a]">
                          <li className="inline-flex items-center gap-1.5">
                            <Building2 size={13} className="text-[#0b3fc4]" aria-hidden="true" /> {department}
                          </li>
                          <li className="inline-flex items-center gap-1.5">
                            <MapPin size={13} className="text-[#0b3fc4]" aria-hidden="true" /> {location}
                          </li>
                          <li className="inline-flex items-center gap-1.5">
                            <Briefcase size={13} className="text-[#0b3fc4]" aria-hidden="true" /> {type}
                          </li>
                        </ul>
                      </div>
                    </div>

                    <p className="mt-4 flex-1 text-xs font-normal leading-6 text-[#63739a]">{summary}</p>

                    <span className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-[#0b3fc4]">
                      View &amp; Apply
                      <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-6 rounded-3xl border border-[#dce7fb] bg-white p-8 text-center sm:p-10">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
                <MailOpen size={26} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-sm font-extrabold uppercase tracking-[0.08em] text-[#0b3fc4] sm:text-[15px]">
                Currently No Open Positions
              </h3>
              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#63739a]">
                Share your profile with us anyway — we keep it on file and reach out when a matching role opens up.
              </p>
              <Link
                to={SEND_PROFILE_PATH}
                className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Send Your Profile <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </div>
          )}
        </section>

        {count > 0 && (
          <section className="mt-6 flex flex-col items-start gap-4 rounded-3xl border border-[#dce7fb] bg-[#f2f6fe] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#0b3fc4] shadow-sm">
                <MailOpen size={20} aria-hidden="true" />
              </span>
              <div>
                <h2 className="text-sm font-extrabold text-[#0f1e57]">Nothing here fits your profile?</h2>
                <p className="mt-1 text-xs leading-5 text-[#63739a]">
                  Send us your details and we will get in touch when a matching role opens up.
                </p>
              </div>
            </div>
            <Link
              to={SEND_PROFILE_PATH}
              className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:w-auto"
            >
              Send Your Profile <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </section>
        )}
      </div>
    </main>
  );
};

export default CareersOpenPositionsPage;
