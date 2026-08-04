import { ArrowLeft, ArrowRight, Briefcase, Check, MapPin, SearchX } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import ApplicationForm from "../../components/careers/application-form";
import CareerHero from "../../components/careers/career-hero";
import CareersBreadcrumb from "../../components/careers/careers-breadcrumb";
import { findPosition, OPEN_POSITIONS_PATH, SEND_PROFILE_PATH } from "../../components/careers/data";

const BulletList = ({ title, items }: { title: string; items: string[] }) => (
  <div>
    <h3 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0b3fc4]">{title}</h3>
    <ul className="mt-2.5 space-y-2">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-xs leading-6 text-[#63739a]">
          <Check size={14} className="mt-1 shrink-0 text-[#0b3fc4]" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const CareersApplyPage = () => {
  const { slug } = useParams();
  const position = findPosition(slug);

  if (!position) {
    return (
      <main className="bg-[#f8fbff] pb-14 pt-5 sm:pt-6">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
          <CareersBreadcrumb current="Open Positions" />
          <section className="rounded-3xl border border-[#dce7fb] bg-white p-8 text-center sm:p-12">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
              <SearchX size={26} aria-hidden="true" />
            </span>
            <h1 className="mt-4 text-lg font-extrabold text-[#0f1e57]">This position is no longer listed</h1>
            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#63739a] sm:text-[13px]">
              The role you were looking for has been filled or removed. Have a look at what is currently open, or send
              us your profile for future openings.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                to={OPEN_POSITIONS_PATH}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                View Open Positions <ArrowRight size={15} aria-hidden="true" />
              </Link>
              <Link
                to={SEND_PROFILE_PATH}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#cfe0fb] bg-white px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#0b3fc4] transition hover:bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                Send Your Profile
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const { title, icon: Icon, location, type, department, summary, responsibilities, requirements } = position;

  return (
    <main className="bg-[#f8fbff] pb-14 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <CareersBreadcrumb current={title} />

        <CareerHero />

        <section aria-labelledby="position-heading" className="mt-8 sm:mt-10">
          <Link
            to={OPEN_POSITIONS_PATH}
            className="group inline-flex items-center gap-2 text-xs font-extrabold text-[#0b3fc4] transition hover:text-[#0932a0]"
          >
            <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" aria-hidden="true" />
            Back to Open Positions
          </Link>

          <div className="mt-5 text-center">
            <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
              <Icon size={26} aria-hidden="true" />
            </span>
            <h1 id="position-heading" className="mt-3 text-xl font-extrabold text-[#0f1e57] sm:text-2xl">
              {title}
            </h1>
            <ul className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-xs font-semibold text-[#0b3fc4]">
              <li className="inline-flex items-center gap-1.5">
                <MapPin size={14} aria-hidden="true" /> {location}
              </li>
              <li aria-hidden="true" className="text-[#a8b6d4]">
                ·
              </li>
              <li className="inline-flex items-center gap-1.5">
                <Briefcase size={14} aria-hidden="true" /> {type}
              </li>
            </ul>
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <aside className="rounded-3xl border border-[#dce7fb] bg-white p-5 sm:p-6 lg:sticky lg:top-24">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#63739a]">{department} team</p>
              <p className="mt-2.5 text-xs leading-6 text-[#63739a] sm:text-[13px]">{summary}</p>

              <div className="mt-5 space-y-5 border-t border-[#dce7fb] pt-5">
                <BulletList title="What you will do" items={responsibilities} />
                <BulletList title="What we are looking for" items={requirements} />
              </div>
            </aside>

            <ApplicationForm
              heading="Apply for this Position"
              description="Please fill in your details below to apply for this position."
              source="open-position"
              role={title}
              submitLabel="Submit Application"
            />
          </div>
        </section>
      </div>
    </main>
  );
};

export default CareersApplyPage;
