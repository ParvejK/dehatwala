import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock,
  HardHat,
  Headphones,
  Home,
  IndianRupee,
  MessageCircle,
  Phone,
  ShieldCheck,
  Star,
  Wrench,
} from "lucide-react";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { formatPrice, workerRates } from "../../components/services/pricing";
import { parseBulletList, parseTags } from "../../components/services/content";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { useServiceDetail } from "../../react-query/hooks";
import { Review, Service } from "../../types";

const SUPPORT_PHONE = "+918600999922";
const WHATSAPP_URL = "https://wa.me/918600999922";
const FALLBACK_IMAGE = "/images/services/loading-material-handling/hero.jpg";

const heroFeatures = [
  { icon: HardHat, label: "Trained & Verified Workers" },
  { icon: Clock, label: "On-Time Service" },
  { icon: IndianRupee, label: "Transparent Pricing" },
];

const benefits = [
  { icon: ShieldCheck, title: "Verified Workers", copy: "Every worker is background checked before deployment." },
  { icon: Wrench, title: "Right Equipment", copy: "Workers arrive with the tools the job needs." },
  { icon: Clock, title: "On-Time Service", copy: "Timely manpower to keep your work on schedule." },
  { icon: HardHat, title: "Skilled Workers", copy: "Experienced and trained workers for every site." },
];

/**
 * Binds the row's SEO columns to the document head. The project has no head
 * manager, so the previous values are restored on unmount.
 */
const useServiceMeta = (service?: Service) => {
  useEffect(() => {
    if (!service) return;

    const previousTitle = document.title;
    document.title = service.meta_title || `${service.title} | Dehatwala`;

    const applyMeta = (name: string, content?: string | null) => {
      if (!content) return undefined;

      const existing = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
      const tag = existing ?? document.createElement("meta");
      const previousContent = tag.content;

      if (!existing) {
        tag.name = name;
        document.head.appendChild(tag);
      }
      tag.content = content;

      return () => {
        if (existing) tag.content = previousContent;
        else tag.remove();
      };
    };

    const restorers = [
      applyMeta("description", service.meta_description || service.short_description),
      applyMeta("keywords", service.meta_keyword),
    ];

    return () => {
      document.title = previousTitle;
      restorers.forEach((restore) => restore?.());
    };
  }, [service]);
};

const initialsOf = (name: string) =>
  name
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

const serviceImage = (service: Service) =>
  service.service_image ? `${VITE_IMAGE_PATH_URL}/service/${service.service_image}` : FALLBACK_IMAGE;

const DotGrid = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute bg-[radial-gradient(circle,#c3d6f5_1.6px,transparent_1.6px)] [background-size:13px_13px] ${className ?? ""}`}
  />
);

const SectionHeading = ({ children }: { children: React.ReactNode }) => (
  <h2 className="text-xl font-extrabold tracking-tight text-[#0f1e57] sm:text-2xl">{children}</h2>
);

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        aria-hidden="true"
        className={index < rating ? "fill-[#ff9f1a] text-[#ff9f1a]" : "fill-[#e2e8f5] text-[#e2e8f5]"}
      />
    ))}
  </span>
);

const Breadcrumb = ({ service }: { service: Service }) => {
  const categoryName = service.category?.name ?? service.category_name;
  const categoryHref = service.category?.slug ? `/services/${service.category.slug}` : undefined;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
        <li>
          <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
            <Home size={14} aria-hidden="true" /> Home
          </Link>
        </li>
        {categoryName && (
          <>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-[#a8b6d4]" />
            </li>
            <li className="capitalize">
              {categoryHref ? (
                <Link to={categoryHref} className="transition hover:text-[#0b3fc4]">
                  {categoryName}
                </Link>
              ) : (
                categoryName
              )}
            </li>
          </>
        )}
        <li aria-hidden="true">
          <ChevronRight size={14} className="text-[#a8b6d4]" />
        </li>
        <li className="font-bold text-[#0f1e57]" aria-current="page">
          {service.title}
        </li>
      </ol>
    </nav>
  );
};

const DetailHero = ({ service }: { service: Service }) => {
  const categoryName = service.category?.name ?? service.category_name;
  const categoryHref = service.category?.slug ? `/services/${service.category.slug}` : undefined;
  const tags = parseTags(service.tags, service.tag_list);

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#dce7fb] bg-[#f2f6fe] shadow-[0_18px_50px_-24px_rgba(20,61,141,0.45)]">
      <DotGrid className="left-5 top-6 h-24 w-16 sm:h-32 sm:w-20" />
      <DotGrid className="bottom-6 left-3 hidden h-24 w-8 lg:block" />

      <div className="grid lg:grid-cols-[1fr_1.05fr]">
        <div className="relative z-10 flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-11 lg:pl-12 lg:pr-6">
          <div className="mb-5 flex items-center gap-3.5">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#0b3fc4] text-white shadow-lg shadow-blue-800/25 sm:size-14">
              <HardHat size={26} strokeWidth={1.7} aria-hidden="true" />
            </span>
            {categoryName &&
              (categoryHref ? (
                <Link
                  to={categoryHref}
                  className="rounded text-sm font-bold capitalize text-[#0b3fc4] transition hover:text-[#0932a0] hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:text-[15px]"
                >
                  {categoryName}
                </Link>
              ) : (
                <span className="text-sm font-bold capitalize text-[#0b3fc4] sm:text-[15px]">{categoryName}</span>
              ))}
          </div>

          <h1 className="text-[32px] font-extrabold leading-[1.12] tracking-tight text-[#0f1e57] sm:text-[38px] lg:text-[44px]">
            {service.title}
          </h1>

          {service.short_description && (
            <div className="mt-4 max-w-md space-y-1 text-sm font-normal leading-6 text-[#4a5b83] sm:text-[15px] sm:leading-7">
              <p>{service.short_description}</p>
            </div>
          )}

          {service.rating ? (
            <div className="mt-5 flex items-center gap-2.5">
              <Stars rating={service.rating} />
              <span className="text-sm font-bold text-[#0f1e57]">{service.rating}</span>
              <span className="text-xs font-normal text-[#5a6a90]">
                ({service.reviews?.length ?? 0} review{(service.reviews?.length ?? 0) === 1 ? "" : "s"})
              </span>
            </div>
          ) : null}

          {tags.length > 0 && (
            <ul aria-label="Service tags" className="mt-5 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-[#bed2f6] bg-white/70 px-3 py-1 text-[11px] font-bold capitalize text-[#0b3fc4]"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}

          <ul className="mt-7 grid gap-4 sm:mt-9 sm:grid-cols-3">
            {heroFeatures.map(({ icon: FeatureIcon, label }) => (
              <li key={label} className="flex items-center gap-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-full border border-[#bed2f6] bg-white/70 text-[#0b3fc4]">
                  <FeatureIcon size={16} strokeWidth={1.9} aria-hidden="true" />
                </span>
                <span className="text-[11px] font-bold leading-tight text-[#0f1e57]">{label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="relative min-h-64 overflow-hidden sm:min-h-72 lg:min-h-full">
          <img
            src={serviceImage(service)}
            alt={`Dehatwala workers providing ${service.title.toLowerCase()} services`}
            className="absolute inset-0 size-full object-cover"
            onError={(event) => {
              event.currentTarget.src = FALLBACK_IMAGE;
            }}
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[linear-gradient(to_top,#f2f6fe_0%,rgba(242,246,254,0)_45%)] lg:bg-[linear-gradient(to_right,#f2f6fe_0%,rgba(242,246,254,0)_26%)]"
          />
        </div>
      </div>
    </section>
  );
};

const AboutSection = ({ service }: { service: Service }) => (
  <section aria-labelledby="about-heading" className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7 lg:p-8">
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2.5fr)] lg:gap-8">
      <div className="lg:pr-4">
        <h2 id="about-heading" className="text-xl font-extrabold tracking-tight text-[#0f1e57] sm:text-2xl">
          About {service.title}
        </h2>
        {service.description ? (
          <div
            className="prose prose-sm mt-3 max-w-none text-sm font-normal leading-6 text-[#5a6a90]"
            dangerouslySetInnerHTML={{ __html: service.description }}
          />
        ) : (
          service.short_description && (
            <p className="mt-3 text-sm font-normal leading-6 text-[#5a6a90]">{service.short_description}</p>
          )
        )}

        {service.category?.description && (
          <p className="mt-4 border-l-2 border-[#dce7fb] pl-3.5 text-xs font-normal leading-5 text-[#66779e]">
            <span className="font-bold capitalize text-[#0f1e57]">{service.category.name}:</span>{" "}
            {service.category.description}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {benefits.map(({ icon: Icon, title, copy }) => (
          <article
            key={title}
            className="rounded-2xl border border-[#e0eafb] bg-white p-5 text-center shadow-[0_4px_14px_rgba(26,64,135,0.06)] transition hover:-translate-y-0.5 hover:border-[#bfd5fb] hover:shadow-[0_12px_24px_-14px_rgba(26,64,135,0.4)]"
          >
            <span className="mx-auto grid size-12 place-items-center rounded-2xl border border-[#dbe7fb] bg-[#f2f6fe] text-[#0b3fc4]">
              <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <h3 className="mt-3.5 flex min-h-[35px] items-center justify-center text-sm font-extrabold leading-tight text-[#0f1e57]">
              {title}
            </h3>
            <p className="mt-2 text-xs font-normal leading-5 text-[#5a6a90]">{copy}</p>
          </article>
        ))}
      </div>
    </div>
  </section>
);

const BulletCard = ({
  heading,
  items,
  icon: Icon,
}: {
  heading: string;
  items: string[];
  icon: typeof BadgeCheck;
}) => (
  <div className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7">
    <SectionHeading>{heading}</SectionHeading>
    <ul className="mt-5 space-y-3.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-sm font-medium leading-6 text-[#31416e]">
          <Icon size={19} className="mt-0.5 shrink-0 text-[#0b3fc4]" aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  </div>
);

const IncludedSection = ({ service }: { service: Service }) => {
  const included = parseBulletList(service.whats_included, service.whats_included_list);
  const idealFor = parseBulletList(service.ideal_for, service.ideal_for_list);

  if (included.length === 0 && idealFor.length === 0) return null;

  return (
    <section className={`grid gap-4 ${included.length > 0 && idealFor.length > 0 ? "md:grid-cols-2" : ""}`}>
      {included.length > 0 && <BulletCard heading="What's Included" items={included} icon={BadgeCheck} />}
      {idealFor.length > 0 && <BulletCard heading="Ideal For" items={idealFor} icon={ChevronRight} />}
    </section>
  );
};

const PricingSection = ({ service }: { service: Service }) => {
  // One tile per worker the service actually quotes, each with its own day and
  // overtime rate. Labels are editable per service (Brick Meson, Operator, ...).
  const rates = workerRates(service);

  return (
    <section aria-labelledby="pricing-heading" className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7">
      <h2 id="pricing-heading" className="text-xl font-extrabold tracking-tight text-[#0f1e57] sm:text-2xl">
        Pricing
      </h2>

      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
        {rates.length > 0 ? (
          rates.map((rate) => {
            const dayPrice = formatPrice(rate.amount);
            const overtimePrice = formatPrice(rate.overtime);

            return (
              <div key={rate.label} className="rounded-2xl border border-[#e0eafb] bg-white p-4">
                <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6a90]">{rate.label}</dt>
                <dd className="mt-1.5 text-lg font-extrabold text-[#0f1e57]">
                  {dayPrice} <span className="text-xs font-medium text-[#5a6a90]">/ Day</span>
                  <span className="mt-1 block text-[11px] font-medium text-[#5a6a90]">
                    Overtime: {overtimePrice ? `${overtimePrice} / hour` : "On Request"}
                  </span>
                </dd>
              </div>
            );
          })
        ) : (
          <div className="rounded-2xl border border-[#e0eafb] bg-white p-4">
            <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6a90]">Starting from</dt>
            <dd className="mt-1.5 text-lg font-extrabold text-[#0f1e57]">On Request</dd>
          </div>
        )}

        <div className="rounded-2xl border border-[#e0eafb] bg-white p-4">
          <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-[#5a6a90]">Availability</dt>
          <dd className="mt-1.5 inline-flex items-center gap-2 text-lg font-extrabold text-emerald-700">
            <span className="size-2.5 rounded-full bg-emerald-500" aria-hidden="true" />
            Available Today
          </dd>
        </div>
      </dl>

      {rates.length === 0 && (
        <p className="mt-4 text-xs font-normal leading-5 text-[#5a6a90]">
          Final pricing depends on site, duration and worker count. Call us for an exact quote.
        </p>
      )}
    </section>
  );
};

const ReviewsSection =({ reviews, fallbackRole }: { reviews: Review[]; fallbackRole?: string }) => (
  <section aria-labelledby="reviews-heading" className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7 lg:p-8">
    <h2 id="reviews-heading" className="text-center text-xl font-extrabold tracking-tight text-[#0f1e57] sm:text-2xl">
      What Our Customers Say
    </h2>

    <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {reviews.map((review, index) => (
        <figure
          key={`${review.name}-${index}`}
          className="flex flex-col rounded-2xl border border-[#e0eafb] bg-white p-5 shadow-[0_4px_14px_rgba(26,64,135,0.06)]"
        >
          <figcaption className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e8f0ff] text-sm font-extrabold text-[#0b3fc4]"
            >
              {initialsOf(review.name)}
            </span>
            <span className="min-w-0">
              <strong className="block truncate text-sm font-extrabold text-[#0f1e57]">{review.name}</strong>
              <span className="block truncate text-xs font-normal capitalize text-[#5a6a90]">
                {review.service_name ?? fallbackRole ?? "Verified Customer"}
              </span>
            </span>
          </figcaption>

          <div className="mt-3.5">
            <Stars rating={review.rating} />
          </div>

          <blockquote className="mt-3 text-xs font-normal leading-5 text-[#5a6a90]">
            &ldquo;{review.review_comments}&rdquo;
          </blockquote>
        </figure>
      ))}
    </div>
  </section>
);

const TrustBanner = ({ service }: { service: Service }) => (
  <section
    aria-labelledby="trust-banner-heading"
    className="relative overflow-hidden rounded-3xl bg-[#062b79] px-5 py-7 text-white shadow-[0_20px_50px_-24px_rgba(6,43,121,0.9)] sm:px-8 sm:py-8"
  >
    <div aria-hidden="true" className="absolute -right-16 -top-24 size-72 rounded-full bg-blue-500/25 blur-2xl" />

    <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto]">
      <div className="flex items-start gap-4">
        <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-white/10">
          <ShieldCheck size={27} className="text-amber-400" aria-hidden="true" />
        </span>
        <div>
          <h2 id="trust-banner-heading" className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Verified Workers. Trusted Service.
          </h2>
          <p className="mt-2 max-w-xl text-sm font-normal leading-6 text-blue-100">
            Book {service.title.toLowerCase()} with trained and background-checked workers from Dehatwala.
          </p>
        </div>
      </div>

      <Link
        to={`/book/${service.slug}/select-worker`}
        className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-white px-6 text-sm font-bold text-[#062b79] transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
      >
        Book This Service <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </div>
  </section>
);

const SupportSection = () => (
  <section aria-label="Support options" className="grid gap-4 md:grid-cols-2">
    <article className="flex flex-col gap-4 rounded-3xl border border-[#e0eafb] bg-white p-6 shadow-[0_4px_14px_rgba(26,64,135,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#f2f6fe] text-[#0b3fc4]">
          <Headphones size={23} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#0b3fc4]">Need Help?</p>
          <h2 className="mt-1 text-base font-extrabold text-[#0f1e57] sm:text-lg">Talk to our support team</h2>
        </div>
      </div>
      <a
        href={`tel:${SUPPORT_PHONE}`}
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0b3fc4] px-5 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
      >
        <Phone size={16} aria-hidden="true" /> Call Now
      </a>
    </article>

    <article className="flex flex-col gap-4 rounded-3xl border border-[#e0eafb] bg-white p-6 shadow-[0_4px_14px_rgba(26,64,135,0.06)] sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eaf7ee] text-emerald-600">
          <MessageCircle size={23} aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-600">Chat on WhatsApp</p>
          <h2 className="mt-1 text-base font-extrabold text-[#0f1e57] sm:text-lg">We&apos;re online to help you</h2>
        </div>
      </div>
      <a
        href={WHATSAPP_URL}
        target="_blank"
        rel="noreferrer"
        className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-bold text-white transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
      >
        Chat Now <ArrowRight size={16} aria-hidden="true" />
      </a>
    </article>
  </section>
);

const DetailSkeleton = () => (
  <div className="animate-pulse space-y-4 sm:space-y-5">
    <div className="h-4 w-56 rounded bg-[#eaf1fd]" />
    <div className="h-80 rounded-3xl bg-[#eaf1fd] lg:h-96" />
    <div className="h-56 rounded-3xl bg-[#eaf1fd]" />
    <div className="grid gap-4 md:grid-cols-2">
      <div className="h-56 rounded-3xl bg-[#eaf1fd]" />
      <div className="h-56 rounded-3xl bg-[#eaf1fd]" />
    </div>
  </div>
);

const ServiceNotFound = () => (
  <div className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] px-6 py-16 text-center">
    <h1 className="text-2xl font-extrabold tracking-tight text-[#0f1e57] sm:text-3xl">Service not found</h1>
    <p className="mx-auto mt-3 max-w-md text-sm font-normal leading-6 text-[#5a6a90]">
      The service you are looking for is not available. Please head back and browse our services.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-6 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      Back to home <ArrowRight size={17} aria-hidden="true" />
    </Link>
  </div>
);

const ServicesDetailsPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError } = useServiceDetail(slug ?? "");

  const service = data?.service;
  const reviews = service?.reviews ?? [];

  useServiceMeta(service);

  return (
    <main className="bg-white pb-20 pt-5 sm:pt-8">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        {isLoading && <DetailSkeleton />}

        {!isLoading && (isError || !service) && <ServiceNotFound />}

        {!isLoading && !isError && service && (
          <>
            <Breadcrumb service={service} />

            <div className="space-y-4 sm:space-y-5">
              <DetailHero service={service} />
              <AboutSection service={service} />
              <IncludedSection service={service} />
              <PricingSection service={service} />
              {reviews.length > 0 && (
                <ReviewsSection reviews={reviews} fallbackRole={service.category?.name ?? service.category_name} />
              )}
              <TrustBanner service={service} />
              <SupportSection />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default ServicesDetailsPage;
