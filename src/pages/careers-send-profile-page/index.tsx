import { ArrowLeft, Mail } from "lucide-react";
import { Link } from "react-router-dom";

import ApplicationForm from "../../components/careers/application-form";
import CareerHero from "../../components/careers/career-hero";
import CareersBreadcrumb from "../../components/careers/careers-breadcrumb";
import {
  CAREERS_EMAIL,
  CAREERS_MAILTO,
  HIRING_PROCESS,
  OPEN_POSITIONS_PATH,
} from "../../components/careers/data";

const CareersSendProfilePage = () => (
  <main className="bg-[#f8fbff] pb-14 pt-5 sm:pt-6">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
      <CareersBreadcrumb current="Send Your Profile" />

      <CareerHero />

      <section aria-labelledby="send-profile-heading" className="mt-8 sm:mt-10">
        <Link
          to={OPEN_POSITIONS_PATH}
          className="group inline-flex items-center gap-2 text-xs font-extrabold text-[#0b3fc4] transition hover:text-[#0932a0]"
        >
          <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" aria-hidden="true" />
          Back to Open Positions
        </Link>

        <div className="mt-5 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
            <Mail size={26} aria-hidden="true" />
          </span>
          <h1 id="send-profile-heading" className="mt-3 text-xl font-extrabold text-[#0f1e57] sm:text-2xl">
            Send Your Profile
          </h1>
          <p className="mx-auto mt-2.5 max-w-xl text-xs leading-6 text-[#63739a] sm:text-[13px]">
            No open role that fits? Share your profile and we will keep it on file — you are the first people we
            contact when a matching position opens up.
          </p>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <aside className="rounded-3xl border border-[#dce7fb] bg-white p-5 sm:p-6 lg:sticky lg:top-24">
            <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] text-[#0b3fc4]">What happens next</h2>

            <ol className="mt-4 space-y-4">
              {HIRING_PROCESS.map(({ step, icon: Icon, title, copy }) => (
                <li key={step} className="flex gap-3.5">
                  <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
                    <Icon size={16} aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xs font-extrabold text-[#0f1e57]">{title}</span>
                    <span className="mt-1 block text-[11px] font-normal leading-5 text-[#63739a]">{copy}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-5 border-t border-[#dce7fb] pt-4">
              <p className="text-[11px] font-medium leading-5 text-[#63739a]">
                Rather use email? Write to{" "}
                <a
                  href={CAREERS_MAILTO}
                  className="break-all font-extrabold text-[#0b3fc4] underline-offset-4 hover:underline"
                >
                  {CAREERS_EMAIL}
                </a>
              </p>
            </div>
          </aside>

          <ApplicationForm
            heading="Share Your Details"
            description="Fill in your details and attach your CV. We will reach out when a matching role opens up."
            source="send-profile"
            submitLabel="Submit Profile"
            showMessage
          />
        </div>
      </section>
    </div>
  </main>
);

export default CareersSendProfilePage;
