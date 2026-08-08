import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CalendarCheck2,
  Clock3,
  Flame,
  LayoutGrid,
  MapPin,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  Workflow,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import ServiceCard from "../../components/services/service-card";
import ServiceSearch from "../../components/services/service-search";
import ServiceSearchResults from "../../components/services/service-search-results";
import TawkMessenger from "../../components/shared/TawkMessenger";
import RemoteAvatar from "../../components/shared/remote-avatar";
import {
  benefits,
  impact,
  recognition,
  steps,
  workerAssurances,
  workerBenefits,
} from "../../constant/home.constant";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { useCategories, useFetchClients, useServices } from "../../react-query/hooks";
import { Service } from "../../types";

const HomePage = () => {
  const servicesQuery = useServices();
  const categoriesQuery = useCategories();
  const clientsQuery = useFetchClients();

  // Owned here so the search bar and its results can live in separate sections.
  const [search, setSearch] = useState<{ query: string; services: Service[] } | null>(null);

  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="home-surface-soft relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.14),transparent_25%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-24 lg:pt-20">
          <div className="lg:self-start">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-800 shadow-sm">
              <Sparkles size={15} aria-hidden="true" /> Trusted workforce. One click away.
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
              Skilled workers <span className="text-blue-700">on demand.</span> For every site.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Book verified workers for any job. Fast, reliable, and hassle-free.
            </p>
            <div className="mt-9 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {benefits.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-blue-100 text-blue-700">
                    <Icon size={17} aria-hidden="true" />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="relative min-h-[420px] lg:min-h-[560px]">
              <div className="absolute inset-4 rounded-[2.5rem] bg-blue-700 lg:inset-8" />
              <img
                src="/images/hero-image.png"
                alt="Dehatwala worker in a blue T-shirt and yellow safety helmet"
                className="absolute inset-0 h-full w-full rounded-[2.5rem] object-cover object-center shadow-2xl [clip-path:polygon(8%_0,100%_0,100%_92%,0_100%,0_10%)]"
              />
              <div className="absolute bottom-5 left-5 right-5 grid grid-cols-3 rounded-2xl border border-white/50 bg-white/95 p-4 shadow-xl backdrop-blur sm:left-10 sm:right-10 sm:p-5">
                {[
                  ["20+", "Services"],
                  ["30 min", "Response target"],
                  ["24/7", "Support"],
                ].map(([value, label]) => (
                  <div key={label} className="text-center">
                    <strong className="block text-lg font-black text-blue-700 sm:text-2xl">{value}</strong>
                    <span className="text-[10px] font-semibold text-slate-600 sm:text-xs">{label}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                to="/services/all"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Book a worker <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link
                to="/become-a-part-of-dehatwala"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Become a worker
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section
        id="book-a-worker"
        className="relative z-[1] mx-auto -mt-1 max-w-7xl scroll-mt-6 px-5 sm:px-8 lg:-mt-12 lg:px-10"
      >
        <div className="relative overflow-hidden rounded-[2rem] bg-blue-700 shadow-2xl shadow-blue-950/20">
          <div className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full border-[48px] border-white/5" />
          <div className="pointer-events-none absolute -bottom-32 left-1/3 size-64 rounded-full bg-blue-500/30 blur-3xl" />

          <div className="relative grid gap-6 px-5 pb-3 pt-7 sm:px-7 md:px-9 md:pt-9 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10">
            <div className="max-w-2xl text-white">
              <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
                <span className="grid size-7 place-items-center rounded-lg bg-white/15">
                  <Sparkles size={16} aria-hidden="true" />
                </span>
                Quick Booking
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Book a worker instantly</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Select a service and book a verified worker in minutes.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/90 sm:text-sm lg:justify-end">
              <span className="inline-flex items-center gap-2">
                <CalendarCheck2 size={17} className="text-amber-300" aria-hidden="true" /> Your Schedule
              </span>
              <span className="inline-flex items-center gap-2">
                <MapPin size={17} className="text-amber-300" aria-hidden="true" /> Nearby Workers
              </span>
              <span className="inline-flex items-center gap-2">
                <Sparkles size={17} className="text-amber-300" aria-hidden="true" /> Fast Booking
              </span>
            </div>
          </div>

          <div className="relative m-2 mt-5 rounded-[1.5rem] bg-white px-4 py-5 shadow-xl shadow-blue-950/15 sm:m-3 sm:mt-6 sm:px-6 sm:py-6">
            <ServiceSearch onResults={setSearch} />
          </div>
        </div>
      </section>

      {search && (
        <ServiceSearchResults query={search.query} services={search.services} onClear={() => setSearch(null)} />
      )}

      <section className="home-surface-soft relative isolate mt-12 overflow-hidden border-y border-blue-100 py-20 text-slate-950 sm:mt-16 lg:mt-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_12%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_90%_88%,rgba(245,158,11,0.1),transparent_24%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-px w-[min(86rem,90%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-7 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
                <Flame size={14} aria-hidden="true" /> Popular right now
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Most <span className="text-blue-700">Booked Services</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Top-rated services loved by our customers.
              </p>
            </div>
            <Link
              to="/services/all"
              className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              Explore all services <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          {servicesQuery.isLoading && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading popular services">
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="h-[28rem] animate-pulse rounded-[1.75rem] border border-blue-100 bg-white/80"
                />
              ))}
            </div>
          )}
          {servicesQuery.isError && (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center font-medium text-red-700"
            >
              Services could not be loaded right now. Please try again shortly.
            </p>
          )}
          {servicesQuery.data && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {servicesQuery.data.services.slice(0, 4).map((service) => (
                <ServiceCard key={service.id} service={service} badge="Popular" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--home-color-surface)] py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[var(--home-color-surface-tint)] to-transparent" />
        <div className="pointer-events-none absolute -right-24 top-20 size-80 rounded-full border-[56px] border-[var(--home-color-border)]/50" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-6 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--home-color-brand)]">
                <span className="grid size-8 place-items-center rounded-lg bg-[var(--home-color-surface-tint)]">
                  <LayoutGrid size={16} aria-hidden="true" />
                </span>
                Browse by category
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-[var(--home-color-ink)] sm:text-4xl lg:text-5xl">
                Find the right skill for <span className="text-[var(--home-color-brand)]">every job.</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Explore trusted professionals by category and get the help your site needs, without the guesswork.
              </p>
            </div>
            <Link
              to="/services/all"
              className="inline-flex min-h-12 w-fit items-center gap-2 rounded-xl border border-[var(--home-color-border)] bg-[var(--home-color-surface)] px-5 py-3 text-sm font-bold text-[var(--home-color-brand)] shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-blue-100"
            >
              View all categories <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>

          {categoriesQuery.isLoading && (
            <div className="grid gap-4 lg:grid-cols-[1.05fr_1.4fr]" aria-label="Loading service categories">
              <div className="min-h-[25rem] animate-pulse rounded-[2rem] bg-[var(--home-color-surface-tint)]" />
              <div className="grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div
                    key={index}
                    className="min-h-48 animate-pulse rounded-[1.5rem] bg-[var(--home-color-surface-tint)]"
                  />
                ))}
              </div>
            </div>
          )}
          {categoriesQuery.isError && (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center font-medium text-red-700"
            >
              Categories could not be loaded right now.
            </p>
          )}
          {categoriesQuery.data && categoriesQuery.data.categories.length > 0 && (
            <div className="grid gap-4 lg:grid-cols-[1.05fr_1.4fr]">
              {categoriesQuery.data.categories.slice(0, 1).map((category) => (
                <Link
                  key={category.id}
                  to={`/services/${category.slug}`}
                  className="group relative flex min-h-[25rem] overflow-hidden rounded-[2rem] bg-[var(--home-color-brand-deep)] shadow-xl shadow-blue-950/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
                  aria-label={`Explore ${category.name} services`}
                >
                  <img
                    src={`${VITE_IMAGE_PATH_URL}/category/${category.cat_img}`}
                    alt={`${category.name} services`}
                    className="absolute inset-0 h-full w-full object-cover opacity-75 transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--home-color-brand-deep)] via-[var(--home-color-brand-deep)]/35 to-transparent" />
                  <div className="relative mt-auto p-6 text-white sm:p-8">
                    <span className="mb-4 inline-flex rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] backdrop-blur">
                      Featured category
                    </span>
                    <h3 className="text-3xl font-extrabold tracking-tight">{category.name}</h3>
                    <p className="mt-2 line-clamp-2 max-w-md text-sm leading-6 text-blue-50/85">
                      {category.description}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold">
                      Explore services
                      <span className="grid size-8 place-items-center rounded-full bg-white text-[var(--home-color-brand)] transition group-hover:translate-x-1">
                        <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </span>
                  </div>
                </Link>
              ))}

              <div className="grid gap-4 sm:grid-cols-2">
                {categoriesQuery.data.categories.slice(1, 5).map((category) => (
                  <Link
                    key={category.id}
                    to={`/services/${category.slug}`}
                    className="group flex min-h-48 overflow-hidden rounded-[1.5rem] border border-[var(--home-color-border)] bg-[var(--home-color-surface)] p-3 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/5 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                    aria-label={`Explore ${category.name} services`}
                  >
                    <div className="flex w-full flex-col">
                      <div className="relative min-h-28 flex-1 overflow-hidden rounded-[1rem] bg-[var(--home-color-surface-soft)]">
                        <img
                          src={`${VITE_IMAGE_PATH_URL}/category/${category.cat_img}`}
                          alt=""
                          className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      </div>
                      <div className="flex items-center gap-3 px-2 pb-1 pt-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-extrabold text-[var(--home-color-ink)] transition group-hover:text-[var(--home-color-brand)]">
                            {category.name}
                          </h3>
                          <p className="mt-1 line-clamp-1 text-xs text-slate-500">{category.description}</p>
                        </div>
                        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)] transition group-hover:bg-[var(--home-color-brand)] group-hover:text-white">
                          <ArrowRight size={16} aria-hidden="true" />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
          {categoriesQuery.data && categoriesQuery.data.categories.length === 0 && (
            <p className="rounded-2xl border border-[var(--home-color-border)] bg-[var(--home-color-surface-soft)] p-8 text-center font-medium text-slate-600">
              No service categories are available yet.
            </p>
          )}
        </div>
      </section>

      {/* scroll-mt clears the sticky header when arriving from a #how-it-works
          link, which would otherwise tuck the heading underneath it. */}
      <section
        id="how-it-works"
        className="relative isolate scroll-mt-24 overflow-hidden bg-[#f8faff] py-16 sm:py-20 lg:py-24"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_10%,rgba(37,99,235,0.06),transparent_28%),radial-gradient(circle_at_92%_88%,rgba(37,99,235,0.05),transparent_25%)]" />
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-blue-700">
              <Workflow size={13} aria-hidden="true" /> Simple booking process
            </p>
            <h2 className="mt-4 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl lg:text-[2.75rem]">
              How Dehatwala <span className="text-blue-700">Works</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600">
              A simple booking process from request to completion.
              <br className="hidden sm:block" /> Book in minutes—we’ll handle the rest.
            </p>
            <Link
              to="/services/all"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Start a booking <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <ol className="relative mt-10 grid gap-4 lg:mt-8 lg:grid-cols-5 lg:gap-6 lg:pt-10 lg:before:absolute lg:before:left-[10%] lg:before:right-[10%] lg:before:top-[0.7rem] lg:before:h-px lg:before:bg-blue-500">
            {steps.map(({ icon: Icon, title, copy }, index) => (
              <li
                key={title}
                className="group relative flex min-h-36 gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.06)] transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_16px_35px_rgba(37,99,235,0.10)] lg:min-h-[15.5rem] lg:flex-col lg:items-center lg:px-4 lg:pb-5 lg:pt-4 lg:text-center"
              >
                <span className="absolute -left-1 top-5 z-[2] grid size-7 -translate-x-1/2 place-items-center rounded-full border-2 border-white bg-blue-700 text-xs font-black text-white shadow-md shadow-blue-700/20 lg:-top-[3.1rem] lg:left-1/2 lg:size-8 lg:-translate-x-1/2">
                  {index + 1}
                </span>
                {index < steps.length - 1 ? (
                  <span className="absolute -bottom-4 left-[0.4rem] top-12 w-px bg-blue-200 lg:hidden" />
                ) : null}
                <span className="grid size-14 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white lg:size-16">
                  <Icon size={27} strokeWidth={2.2} aria-hidden="true" />
                </span>
                <div className="min-w-0 pt-0.5 lg:pt-0">
                  <span className="text-[9px] font-extrabold uppercase tracking-[0.16em] text-blue-700">
                    Step {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-1 text-sm font-extrabold text-slate-950 sm:text-base">{title}</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-500">{copy}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-8 grid overflow-hidden rounded-2xl border border-blue-100 bg-white/75 shadow-sm backdrop-blur sm:grid-cols-3">
            {[
              { icon: Clock3, title: "Fast Response", copy: "Quick support when you need it." },
              { icon: MapPin, title: "Location Match", copy: "Nearby workers for your convenience." },
              { icon: CalendarCheck2, title: "Flexible Timing", copy: "Book as per your schedule." },
            ].map(({ icon: Icon, title, copy }, index) => (
              <div
                key={title}
                className={`flex items-center gap-3 px-5 py-4 ${index > 0 ? "border-t border-blue-100 sm:border-l sm:border-t-0" : ""}`}
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-700">
                  <Icon size={21} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="text-xs font-extrabold text-slate-950">{title}</h3>
                  <p className="mt-1 text-[10px] leading-4 text-slate-500">{copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--home-color-brand-deep)] py-20 text-white lg:py-28">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full border-[90px] border-white/[0.03]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.35),transparent_65%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur sm:p-9">
            <div>
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-300">
                <TrendingUp size={15} aria-hidden="true" /> Our impact
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Local service.
                <br />
                <span className="text-blue-300">Real opportunity.</span>
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-slate-300">
                Built to make skilled work easier to access while creating dependable opportunities in the communities
                we serve.
              </p>
            </div>
            <div className="mt-10 flex items-center gap-3 border-t border-white/10 pt-6 text-sm font-semibold text-slate-300">
              <BadgeCheck size={21} className="text-amber-400" aria-hidden="true" /> Every booking supports a stronger
              local workforce.
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {impact.map(({ icon: Icon, value, label, copy }, index) => (
              <article
                key={label}
                className={`rounded-[1.75rem] border p-6 transition hover:-translate-y-1 ${index === 0 ? "border-blue-400/30 bg-blue-600/20" : "border-white/10 bg-white/[0.05]"}`}
              >
                <div>
                  <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-amber-400">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                </div>
                <strong className="mt-8 block text-3xl font-black tracking-tight sm:text-4xl">{value}</strong>
                <h3 className="mt-1 font-bold text-blue-300">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Roomier padding: the reference leaves a clear margin before
              "Become a" rather than sitting tight to the card edge. */}
          <div className="overflow-hidden rounded-[2rem] bg-[#f7f7f5] p-5 sm:p-7 lg:p-9">
            {/* No column gap on desktop: the photo's diagonal edge is the
                transition, and a gutter on top of it left a dead strip
                between the copy and the image. */}
            {/* Top-aligned, not centred: "Become a" is level with the top of
                the photo in the reference. Centring against a 31rem image
                pushed the heading down and opened a gap above it. */}
            {/* ~46/54 split, measured off the reference where the photo's
                left edge falls a little past the halfway point. */}
            <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.18fr)] lg:gap-0">
              <div className="lg:pr-6">
                {/* "Worker" is set larger than "Become a" in the reference,
                    not the same size. */}
                <h2 className="font-black leading-[0.98] tracking-tight text-[var(--home-color-ink)]">
                  <span className="block text-[32px] sm:text-[40px]">Become a</span>
                  <span className="block text-[40px] text-[var(--home-color-brand)] sm:text-[52px]">Worker</span>
                </h2>

                {/* The gold rule sits under the opening words, not the whole
                    line, matching the reference. */}
                <p className="mt-6 text-lg font-extrabold text-[var(--home-color-ink)] sm:text-xl">
                  <span className="relative inline-block">
                    क्या आप
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-0.5 left-0 h-[3px] w-full rounded-full bg-amber-400"
                    />
                  </span>{" "}
                  काम की तलाश में है ?
                </p>
                <p className="mt-2.5 max-w-[17rem] text-sm leading-6 text-slate-600">
                  आज ही देहातवाला से जुड़ें और काम के अपडेट पायें।
                </p>

                <div className="mt-5">
                  <Link
                    to="/become-a-part-of-dehatwala"
                    className="inline-flex min-h-12 items-center gap-8 rounded-xl bg-[var(--home-color-brand)] px-6 text-[15px] font-bold text-white shadow-lg shadow-blue-700/25 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
                  >
                    अभी रजिस्टर करे
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </div>

                <p className="mt-7 flex items-center gap-2 text-base font-extrabold text-[var(--home-color-ink)]">
                  <Star size={17} className="shrink-0 text-amber-400" fill="currentColor" aria-hidden="true" />
                  क्यों जुड़ें देहातवाला से?
                </p>

                <ul className="mt-4 space-y-4">
                  {workerBenefits.map(({ icon: Icon, title, copy }) => (
                    <li key={title} className="flex items-center gap-3">
                      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[var(--home-color-brand)] shadow-[0_2px_10px_-4px_rgba(15,42,95,0.35)]">
                        <Icon size={19} aria-hidden="true" />
                      </span>
                      {/* Gold rule separating the icon from its label, as in
                          the reference. Stretches to the row's height. */}
                      <span aria-hidden="true" className="h-9 w-[3px] shrink-0 rounded-full bg-amber-400" />
                      <span className="min-w-0">
                        <strong className="block text-[13px] font-extrabold text-[var(--home-color-ink)]">
                          {title}
                        </strong>
                        <span className="mt-0.5 block text-[11px] leading-5 text-slate-500">{copy}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Rounded corners come from this wrapper and the diagonal from
                  the image's own clip-path — a clip-path alone would discard
                  the radius. The exposed wedge shows the card behind. */}
              {/* Negative margins cancel the card's own padding so the photo
                  reaches the card's top and right edges, as in the reference,
                  and the top-right radius matches the card's own. */}
              <div className="overflow-hidden rounded-[1.5rem]">
                <img
                  src="/images/dehatwala-worker-join.png"
                  alt="Dehatwala workers in blue uniforms and yellow safety helmets on a construction site"
                  className="worker-photo-angled h-[20rem] w-full object-cover object-[center_25%] sm:h-[24rem] lg:h-[34rem]"
                />
              </div>
            </div>

            {/* Centred columns with hairline dividers. `divide-x` only reads
                correctly on the single row, so it is scoped to lg. */}
            <ul className="mt-6 grid gap-6 rounded-[1.25rem] bg-white px-5 py-6 shadow-sm sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-0 lg:divide-x lg:divide-slate-200">
              {workerAssurances.map(({ icon: Icon, title, copy }) => (
                <li key={title} className="flex flex-col items-center px-4 text-center">
                  <Icon size={30} className="shrink-0 text-[var(--home-color-brand)]" aria-hidden="true" />
                  <strong className="mt-3 block text-[13px] font-extrabold leading-5 text-[var(--home-color-ink)]">
                    {title}
                  </strong>
                  <span className="mt-1 block max-w-[12rem] text-[11px] leading-4 text-slate-500">{copy}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--home-color-surface-tint)] py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-10">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--home-color-brand)]">
              <BadgeCheck size={15} aria-hidden="true" /> Recognised by
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--home-color-ink)] sm:text-4xl lg:text-5xl">
              Trust and <span className="text-[var(--home-color-brand)]">Recognised</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              Backed by Government Recognition &amp; Secure Technology.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[var(--home-color-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--home-color-ink)] shadow-sm">
              <ShieldCheck size={22} className="text-emerald-600" aria-hidden="true" /> Trusted by 1,00,000+ workers
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recognition.map(({ icon: Icon, title, copy }) => (
              <article
                key={title}
                className="group rounded-[1.5rem] border border-[var(--home-color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/5 sm:p-6"
              >
                <div>
                  <span className="grid size-12 place-items-center rounded-2xl bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)] transition group-hover:bg-[var(--home-color-brand)] group-hover:text-white">
                    <Icon size={23} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-5 text-lg font-extrabold text-[var(--home-color-ink)]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--home-color-surface)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-5 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[var(--home-color-brand)]">
                <MessageCircleMore size={15} aria-hidden="true" /> Customer stories
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--home-color-ink)] sm:text-4xl lg:text-5xl">
                Trusted by people who <span className="text-[var(--home-color-brand)]">needed it done.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-600 md:text-right">
              Real experiences from customers who found dependable, skilled help through Dehatwala.
            </p>
          </div>
          {clientsQuery.isLoading && (
            <div className="grid gap-5 md:grid-cols-3" aria-label="Loading customer stories">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="h-72 animate-pulse rounded-[1.75rem] bg-[var(--home-color-surface-soft)]" />
              ))}
            </div>
          )}
          {clientsQuery.isError && (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-5 text-center font-medium text-red-700"
            >
              Customer stories are temporarily unavailable.
            </p>
          )}
          {clientsQuery.data && clientsQuery.data.clients.length > 0 && (
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}
              // Not `!overflow-visible`: that let the neighbouring slides bleed
              // in on both sides, so a row of 3 read as 5 with two clipped.
              className="customer-stories-carousel !pb-12 [&_.swiper-slide]:h-auto"
              aria-label="Customer stories"
            >
              {/* No slice: it is a carousel, so every story the API returns is
                  reachable. Capping at 3 silently dropped the rest. */}
              {clientsQuery.data.clients.map((client, clientIndex) => (
                <SwiperSlide key={client.id}>
                  <figure
                    className={`flex min-h-72 h-full flex-col rounded-[1.75rem] border p-6 sm:p-7 ${clientIndex === 1 ? "border-[var(--home-color-brand-deep)] bg-[var(--home-color-brand-deep)] text-white shadow-xl shadow-blue-950/15" : "border-[var(--home-color-border)] bg-white text-[var(--home-color-ink)] shadow-sm"}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 text-amber-400" aria-label="5 out of 5 stars">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <Star key={index} size={16} fill="currentColor" aria-hidden="true" />
                        ))}
                      </div>
                      <MessageCircleMore
                        size={27}
                        className={clientIndex === 1 ? "text-blue-300" : "text-blue-200"}
                        aria-hidden="true"
                      />
                    </div>
                    <blockquote
                      className={`mt-7 flex-1 text-base font-medium leading-7 ${clientIndex === 1 ? "text-slate-100" : "text-slate-700"}`}
                    >
                      {/* The stored text already carries its own quotes, so
                          wrapping it raw produced ""…"". Strip both straight
                          and curly forms, then add exactly one pair. */}
                      &ldquo;{(client.content ?? "").replace(/["“”]/g, "").trim()}&rdquo;
                    </blockquote>
                    <figcaption
                      className={`mt-7 flex items-center gap-3 border-t pt-5 ${clientIndex === 1 ? "border-white/10" : "border-slate-100"}`}
                    >
                      <RemoteAvatar
                        folder="client"
                        file={client.client_image}
                        name={client.name}
                        className="size-11 rounded-full object-cover ring-2 ring-white/30"
                        fallbackClassName={`grid size-11 shrink-0 place-items-center rounded-full font-black ${clientIndex === 1 ? "bg-white/10 text-white" : "bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)]"}`}
                      />
                      <span>
                        <strong className="block text-sm">{client.name}</strong>
                        <span className={`text-xs ${clientIndex === 1 ? "text-slate-400" : "text-slate-500"}`}>
                          {client.company || client.designation || "Customer"}
                        </span>
                      </span>
                    </figcaption>
                  </figure>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          {clientsQuery.data && clientsQuery.data.clients.length === 0 && (
            <p className="rounded-2xl border border-[var(--home-color-border)] bg-[var(--home-color-surface-soft)] p-8 text-center font-medium text-slate-600">
              Customer stories will appear here soon.
            </p>
          )}
        </div>
      </section>
      <TawkMessenger />
    </main>
  );
};

export default HomePage;
