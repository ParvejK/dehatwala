import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  BriefcaseBusiness,
  CalendarCheck2,
  Headphones,
  IndianRupee,
  LayoutGrid,
  MapPin,
  MessageCircleMore,
  ShieldCheck,
  Sparkles,
  Star,
  UsersRound
} from "lucide-react";
import { Link } from "react-router-dom";
import SearchServices from "../../components/search-services";
import TawkMessenger from "../../components/shared/TawkMessenger";
import { benefits, impact, recognition, steps } from "../../constant/home.constant";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { useCategories, useFetchClients, useServices } from "../../react-query/hooks";

const HomePage = () => {
  const servicesQuery = useServices();
  const categoriesQuery = useCategories();
  const clientsQuery = useFetchClients();

  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="home-surface-soft relative isolate">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_16%,rgba(37,99,235,0.12),transparent_30%),radial-gradient(circle_at_90%_80%,rgba(245,158,11,0.14),transparent_25%)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 pb-16 pt-14 sm:px-8 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:pb-24 lg:pt-20">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-800 shadow-sm">
              <Sparkles size={15} aria-hidden="true" /> Trusted workforce, one booking away
            </div>
            <h1 className="max-w-2xl text-4xl font-black leading-[1.05] tracking-tight text-slate-950 sm:text-5xl lg:text-7xl">
              Skilled workers <span className="text-blue-700">on demand.</span> For every site.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Book verified blue-collar workers for construction and maintenance jobs. Quick, reliable and hassle-free.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#book-a-worker"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Book a worker <ArrowRight size={18} aria-hidden="true" />
              </a>
              <Link
                to="/become-a-part-of-dehatwala"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-800 transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-100"
              >
                Become a worker
              </Link>
            </div>
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
          <div className="relative min-h-[420px] lg:min-h-[560px]">
            <div className="absolute inset-4 rounded-[2.5rem] bg-blue-700 lg:inset-8" />
            <img
              src="/images/hero.jpg"
              alt="A skilled worker preparing materials at a construction site"
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
                  <CalendarCheck2 size={16} aria-hidden="true" />
                </span>
                Quick booking
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Book a worker instantly</h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                Choose a category and tell us what you need. We’ll help you find the right skilled worker nearby.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold text-white/90 sm:text-sm lg:justify-end">
              <span className="inline-flex items-center gap-2">
                <BadgeCheck size={17} className="text-amber-300" aria-hidden="true" /> Verified workers
              </span>
              <span className="inline-flex items-center gap-2">
                <IndianRupee size={17} className="text-amber-300" aria-hidden="true" /> Clear pricing
              </span>
              <span className="inline-flex items-center gap-2">
                <Headphones size={17} className="text-amber-300" aria-hidden="true" /> Booking support
              </span>
            </div>
          </div>

          <div className="relative m-2 mt-5 rounded-[1.5rem] bg-white p-1 shadow-xl shadow-blue-950/15 sm:m-3 sm:mt-6 md:p-2">
            <SearchServices />
          </div>
        </div>
      </section>

      <section className="home-surface-soft relative isolate mt-12 overflow-hidden border-y border-blue-100 py-20 text-slate-950 sm:mt-16 lg:mt-20 lg:py-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_12%,rgba(37,99,235,0.12),transparent_28%),radial-gradient(circle_at_90%_88%,rgba(245,158,11,0.1),transparent_24%)]" />
        <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-px w-[min(86rem,90%)] -translate-x-1/2 bg-gradient-to-r from-transparent via-blue-300 to-transparent" />

        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="mb-10 flex flex-col gap-7 md:mb-12 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
                <Sparkles size={14} aria-hidden="true" /> Most booked
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                Services customers <span className="text-blue-700">rely on.</span>
              </h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
                Popular skilled services chosen for dependable work, verified professionals and simple booking.
              </p>
            </div>
            <Link
              to="/service/all"
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
              {servicesQuery.data.services.slice(0, 4).map((service, index) => {
                const serviceUrl = `/services/detail/${service.slug}`;
                const reviewCount = service.reviews?.length || 0;

                return (
                  <article
                    key={service.id}
                    className="group flex overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white text-slate-950 shadow-lg shadow-blue-900/5 transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10"
                  >
                    <div className="flex w-full flex-col">
                      <Link
                        to={serviceUrl}
                        className="relative block overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-400"
                      >
                        <img
                          src={`${VITE_IMAGE_PATH_URL}/service/${service.service_image}`}
                          alt={`${service.title} service`}
                          className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                        <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
                          <Sparkles size={13} className="text-amber-300" aria-hidden="true" /> Popular #{index + 1}
                        </span>
                        <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-900 shadow-lg">
                          <Star size={14} className="text-amber-500" fill="currentColor" aria-hidden="true" />
                          {service.rating || "New"}
                        </span>
                      </Link>

                      <div className="flex flex-1 flex-col p-5">
                        <p className="text-[11px] font-extrabold uppercase tracking-[0.16em] text-blue-700">
                          {service.category_name || "Skilled service"}
                        </p>
                        <h3 className="mt-2 text-xl font-extrabold leading-tight">
                          <Link
                            to={serviceUrl}
                            className="rounded-sm transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                          >
                            {service.title}
                          </Link>
                        </h3>
                        <p className="mt-3 line-clamp-2 min-h-11 text-sm leading-6 text-slate-600">
                          {service.short_description}
                        </p>

                        <div className="mt-auto flex items-center gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
                          <BadgeCheck size={17} className="text-emerald-600" aria-hidden="true" /> Verified service
                          <span className="ml-auto">
                            {reviewCount ? `${reviewCount} ${reviewCount === 1 ? "review" : "reviews"}` : "New service"}
                          </span>
                        </div>
                        <Link
                          to={serviceUrl}
                          className="mt-4 inline-flex min-h-11 items-center justify-between rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
                          aria-label={`Book ${service.title}`}
                        >
                          Book now{" "}
                          <span className="grid size-7 place-items-center rounded-lg bg-white/15">
                            <ArrowRight size={16} aria-hidden="true" />
                          </span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
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
              to="/service/all"
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
                  to={`/service/${category.slug}`}
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
                {categoriesQuery.data.categories.slice(1, 5).map((category, index) => (
                  <Link
                    key={category.id}
                    to={`/service/${category.slug}`}
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
                        <span className="absolute left-3 top-3 grid size-7 place-items-center rounded-full bg-white/90 text-[10px] font-extrabold text-[var(--home-color-brand)] shadow-sm backdrop-blur">
                          {String(index + 2).padStart(2, "0")}
                        </span>
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

      <section id="how-it-works" className="relative bg-[var(--home-color-surface-soft)] py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--home-color-brand)]">
                Simple process
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--home-color-ink)] sm:text-4xl lg:text-5xl">
                From booking to done, <span className="text-[var(--home-color-brand)]">step by step.</span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-7 text-slate-600">
                A clear, supported process that keeps you informed from your first search through secure payment.
              </p>
              <a
                href="#book-a-worker"
                className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--home-color-brand)] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                Start a booking <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>

            <ol className="relative space-y-4 before:absolute before:bottom-8 before:left-7 before:top-8 before:w-px before:bg-[var(--home-color-border)] sm:before:left-9">
              {steps.map(({ icon: Icon, title, copy }, index) => (
                <li
                  key={title}
                  className="group relative flex gap-4 rounded-[1.5rem] border border-[var(--home-color-border)] bg-white p-4 shadow-sm transition hover:border-blue-300 hover:shadow-md sm:gap-6 sm:p-5"
                >
                  <span className="relative z-[1] grid size-14 shrink-0 place-items-center rounded-2xl bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)] ring-8 ring-white transition group-hover:bg-[var(--home-color-brand)] group-hover:text-white sm:size-16">
                    <Icon size={24} aria-hidden="true" />
                  </span>
                  <div className="min-w-0 py-1">
                    <span className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[var(--home-color-brand)]">
                      Step {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-1 text-lg font-extrabold text-[var(--home-color-ink)] sm:text-xl">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--home-color-brand-deep)] py-20 text-white lg:py-28">
        <div className="pointer-events-none absolute -left-40 -top-40 size-[32rem] rounded-full border-[90px] border-white/[0.03]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-80 w-1/2 bg-[radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.35),transparent_65%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-8 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:px-10">
          <div className="flex flex-col justify-between rounded-[2rem] border border-white/10 bg-white/[0.06] p-7 backdrop-blur sm:p-9">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-300">Our impact</p>
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
                <div className="flex items-start justify-between gap-4">
                  <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-amber-400">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                  <span className="text-xs font-bold text-white/30">0{index + 1}</span>
                </div>
                <strong className="mt-8 block text-3xl font-black tracking-tight sm:text-4xl">{value}</strong>
                <h3 className="mt-1 font-bold text-blue-300">{label}</h3>
                <p className="mt-3 text-sm leading-6 text-slate-400">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--home-color-surface)] py-20 lg:py-28">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
          <div className="relative min-h-[32rem] lg:min-h-[38rem]">
            <div className="absolute inset-x-0 bottom-0 top-8 overflow-hidden rounded-[2rem] bg-[var(--home-color-brand-deep)]">
              <img
                src="/images/work.png"
                alt="Construction workers collaborating safely on site"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--home-color-brand-deep)]/85 via-transparent to-transparent" />
            </div>
            <div className="absolute left-4 top-0 rounded-2xl border border-[var(--home-color-border)] bg-white p-4 shadow-xl sm:left-8 sm:p-5">
              <span className="grid size-11 place-items-center rounded-xl bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)]">
                <BriefcaseBusiness size={22} aria-hidden="true" />
              </span>
              <strong className="mt-3 block text-sm text-[var(--home-color-ink)]">Work with dignity</strong>
              <span className="text-xs text-slate-500">Grow with every opportunity</span>
            </div>
            <div className="absolute bottom-5 left-5 right-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-[var(--home-color-brand-deep)]/90 p-4 text-white backdrop-blur sm:left-auto sm:right-6 sm:w-64">
              <BadgeCheck size={24} className="shrink-0 text-amber-400" aria-hidden="true" />
              <span className="text-xs font-semibold leading-5">Free registration with a simple joining process</span>
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--home-color-brand)]">
              Become a worker
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--home-color-ink)] sm:text-4xl lg:text-5xl">
              क्या आप काम की तलाश में हैं?
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              आज ही देहातवाला से जुड़ें और अपनी उपलब्धता के अनुसार काम के अपडेट पाएं।
            </p>
            <div className="mt-8 grid gap-x-6 gap-y-5 sm:grid-cols-2">
              {[
                [UsersRound, "नि:शुल्क पंजीकरण"],
                [BriefcaseBusiness, "नियमित काम के अवसर"],
                [Banknote, "समय पर भुगतान"],
                [MapPin, "अपने आसपास काम"],
              ].map(([Icon, label]) => {
                const BenefitIcon = Icon as typeof UsersRound;
                return (
                  <div key={label as string} className="flex items-center gap-3 font-bold text-[var(--home-color-ink)]">
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)]">
                      <BenefitIcon size={19} aria-hidden="true" />
                    </span>
                    {label as string}
                  </div>
                );
              })}
            </div>
            <Link
              to="/become-a-part-of-dehatwala"
              className="mt-9 inline-flex min-h-12 items-center gap-2 rounded-xl bg-[var(--home-color-brand)] px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              अभी रजिस्टर करें <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--home-color-surface-tint)] py-20 lg:py-28">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-10">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--home-color-brand)]">
              Trusted &amp; recognised
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--home-color-ink)] sm:text-4xl lg:text-5xl">
              Built on trust. <span className="text-[var(--home-color-brand)]">Backed by proof.</span>
            </h2>
            <p className="mt-5 max-w-md text-base leading-7 text-slate-600">
              A responsible workforce platform shaped around compliance, secure technology and reliable support.
            </p>
            <div className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-[var(--home-color-border)] bg-white px-4 py-3 text-sm font-bold text-[var(--home-color-ink)] shadow-sm">
              <ShieldCheck size={22} className="text-emerald-600" aria-hidden="true" /> Verified credentials
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {recognition.map(({ icon: Icon, title, copy }, index) => (
              <article
                key={title}
                className="group rounded-[1.5rem] border border-[var(--home-color-border)] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/5 sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="grid size-12 place-items-center rounded-2xl bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)] transition group-hover:bg-[var(--home-color-brand)] group-hover:text-white">
                    <Icon size={23} aria-hidden="true" />
                  </span>
                  <span className="text-[11px] font-extrabold tracking-[0.18em] text-slate-300">0{index + 1}</span>
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
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--home-color-brand)]">
                Customer stories
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
            <div className="grid gap-5 md:grid-cols-3">
              {clientsQuery.data.clients.slice(0, 3).map((client, clientIndex) => (
                <figure
                  key={client.id}
                  className={`flex min-h-72 flex-col rounded-[1.75rem] border p-6 sm:p-7 ${clientIndex === 1 ? "border-[var(--home-color-brand-deep)] bg-[var(--home-color-brand-deep)] text-white shadow-xl shadow-blue-950/15" : "border-[var(--home-color-border)] bg-white text-[var(--home-color-ink)] shadow-sm"}`}
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
                    “{client.content}”
                  </blockquote>
                  <figcaption
                    className={`mt-7 flex items-center gap-3 border-t pt-5 ${clientIndex === 1 ? "border-white/10" : "border-slate-100"}`}
                  >
                    {client.client_image ? (
                      <img
                        src={`${VITE_IMAGE_PATH_URL}/client/${client.client_image}`}
                        alt={`${client.name}, customer`}
                        className="size-11 rounded-full object-cover ring-2 ring-white/30"
                      />
                    ) : (
                      <span
                        className={`grid size-11 place-items-center rounded-full font-black ${clientIndex === 1 ? "bg-white/10 text-white" : "bg-[var(--home-color-surface-tint)] text-[var(--home-color-brand)]"}`}
                      >
                        {client.name.charAt(0)}
                      </span>
                    )}
                    <span>
                      <strong className="block text-sm">{client.name}</strong>
                      <span className={`text-xs ${clientIndex === 1 ? "text-slate-400" : "text-slate-500"}`}>
                        {client.company || client.designation || "Customer"}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>
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
