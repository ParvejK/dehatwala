import { useEffect, useMemo, useRef } from "react";
import {
  ArrowRight,
  BadgeIndianRupee,
  Bolt,
  CreditCard,
  Headphones,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { formatPrice, primaryWorkerRate } from "../../components/services/pricing";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { useCategories, useInfiniteServicesByCategory } from "../../react-query/hooks";
import { Category, Service, SubCategory } from "../../types";

const FALLBACK_HERO_IMAGE = "/images/services/loading-material-handling/hero.jpg";

const serviceHighlights = [
  { label: "Verified Workers", icon: ShieldCheck },
  { label: "Background Checked", icon: UserRoundCheck },
  { label: "Fast Response", icon: Bolt },
];

const trustBenefits = [
  { icon: Heart, title: "Easy Booking", copy: "A quick, guided booking process." },
  { icon: MapPin, title: "Local Workers", copy: "Workers available in your area." },
  { icon: ShieldCheck, title: "Trusted Professionals", copy: "Verified and background-checked workers." },
  { icon: Bolt, title: "Quick Response", copy: "Get workers on time, when you need them." },
  { icon: CreditCard, title: "Flexible Payment", copy: "Convenient payment options for every booking." },
  { icon: Headphones, title: "Assisted Support", copy: "Our support team is ready to help." },
];

const proofPoints = [
  { icon: ShieldCheck, title: "Verified Workers", copy: "Background Verified" },
  { icon: Bolt, title: "On-Time Service", copy: "Punctual & Reliable" },
  { icon: BadgeIndianRupee, title: "Transparent Pricing", copy: "No Hidden Charges" },
];

const categoryImage = (category: Category) =>
  category.cat_img ? `${VITE_IMAGE_PATH_URL}/category/${category.cat_img}` : FALLBACK_HERO_IMAGE;

const serviceImage = (service: Service) =>
  service.service_image ? `${VITE_IMAGE_PATH_URL}/service/${service.service_image}` : FALLBACK_HERO_IMAGE;

const DotGrid = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute bg-[radial-gradient(circle,#c3d6f5_1.6px,transparent_1.6px)] [background-size:13px_13px] ${className ?? ""}`}
  />
);

/**
 * Wildcard slug for "every category". The API accepts it on either slug and
 * answers with all services, `category: null` and no sub categories — so the
 * page has to supply its own hero copy and filters for this case.
 */
const ALL_SLUG = "all";

const ALL_DESCRIPTION =
  "Every skilled and general workforce service on Dehatwala in one place. Pick a category to narrow it down, or browse the full list below.";

const ServiceHero = ({ category }: { category?: Category }) => (
  <section className="relative overflow-hidden rounded-3xl border border-[#dce7fb] bg-[#f2f6fe] shadow-[0_18px_50px_-24px_rgba(20,61,141,0.45)]">
    <DotGrid className="left-5 top-6 h-24 w-16 sm:h-32 sm:w-20" />
    <DotGrid className="bottom-6 left-3 hidden h-24 w-8 lg:block" />

    <div className="grid lg:grid-cols-[1fr_1.05fr]">
      <div className="relative z-10 flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-11 lg:pl-12 lg:pr-6">
        <div className="mb-5 grid size-16 place-items-center rounded-[20px] bg-[#0b3fc4] text-white shadow-lg shadow-blue-800/25 sm:size-[72px]">
          <Truck size={36} strokeWidth={1.6} aria-hidden="true" />
        </div>

        <h1 className="text-[32px] font-extrabold capitalize leading-[1.12] tracking-tight text-[#0f1e57] sm:text-[38px] lg:text-[40px]">
          {category?.name ?? "All Services"}
        </h1>
        <p className="mt-4 max-w-sm text-sm font-normal leading-6 text-[#4a5b83] sm:text-[15px] sm:leading-7">
          {category?.description || ALL_DESCRIPTION}
        </p>

        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-4 sm:mt-9">
          {proofPoints.map(({ icon: Icon, title, copy }) => (
            <li key={title} className="flex items-center gap-2 whitespace-nowrap">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#bed2f6] bg-white/70 text-[#0b3fc4]">
                <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <strong className="block text-[11px] font-bold text-[#0f1e57]">{title}</strong>
                <span className="block text-[10px] font-normal text-[#65769c]">{copy}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative min-h-64 overflow-hidden sm:min-h-72 lg:min-h-full">
        <img
          src={category ? categoryImage(category) : FALLBACK_HERO_IMAGE}
          alt={category?.name ?? ""}
          className="absolute inset-0 size-full object-cover"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_HERO_IMAGE;
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

const baseChip =
  "inline-flex h-9 items-center rounded-full border px-4 text-xs font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100";
const activeChip = "border-[#0b3fc4] bg-[#0b3fc4] text-white";
const idleChip = "border-[#dce7fb] bg-white text-[#3d4f77] hover:border-[#bfd5fb] hover:text-[#0b3fc4]";

const SubCategoryFilter = ({
  categorySlug,
  subCategories,
  activeSlug,
}: {
  categorySlug: string;
  subCategories: SubCategory[];
  activeSlug?: string;
}) => (
  <nav aria-label="Filter by sub category" className="mb-6 flex flex-wrap gap-2.5">
    <Link to={`/services/${categorySlug}`} className={`${baseChip} ${activeSlug ? idleChip : activeChip}`}>
      All Services
    </Link>
    {subCategories.map((subCategory) => (
      <Link
        key={subCategory.id}
        to={`/services/${categorySlug}/${subCategory.slug}`}
        aria-current={subCategory.slug === activeSlug ? "page" : undefined}
        className={`${baseChip} ${subCategory.slug === activeSlug ? activeChip : idleChip}`}
      >
        {subCategory.name}
      </Link>
    ))}
  </nav>
);

/** Shown on /services/all, where the API returns no sub categories to filter by. */
const CategoryFilter = ({ categories }: { categories: Category[] }) => (
  <nav aria-label="Filter by category" className="mb-6 flex flex-wrap gap-2.5">
    <span aria-current="page" className={`${baseChip} ${activeChip}`}>
      All Services
    </span>
    {categories.map((category) => (
      <Link key={category.id} to={`/services/${category.slug}`} className={`${baseChip} ${idleChip}`}>
        {category.name}
      </Link>
    ))}
  </nav>
);

const ServiceCard = ({ service }: { service: Service }) => {
  const detailUrl = `/service/detail/${service.slug}`;
  const price = formatPrice(primaryWorkerRate(service)?.amount);

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e0eafb] bg-white shadow-[0_4px_14px_rgba(26,64,135,0.06)] transition duration-300 hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-12px_rgba(26,64,135,0.35)] md:grid md:h-[206px] md:grid-cols-[36%_64%]">
      <Link to={detailUrl} tabIndex={-1} aria-hidden="true" className="block h-52 overflow-hidden md:h-full">
        {/* Lazy + async decoding: the browser skips images still below the
            fold, which is most of the list, and never blocks paint on them. */}
        <img
          src={serviceImage(service)}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
          onError={(event) => {
            event.currentTarget.src = FALLBACK_HERO_IMAGE;
          }}
        />
      </Link>

      <div className="flex min-w-0 flex-col px-5 py-4 sm:px-6 lg:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link to={detailUrl} className="rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
              <h3 className="text-lg font-extrabold leading-tight tracking-tight text-[#0f1e57] lg:text-xl">
                {service.title}
              </h3>
            </Link>
            <p className="mt-1.5 line-clamp-2 max-w-md text-xs font-normal leading-[1.5] text-[#5a6a90] md:min-h-[39px] lg:text-[13px]">
              {service.short_description}
            </p>
          </div>
          {service.rating ? (
            <span
              className="inline-flex shrink-0 items-center gap-1.5 text-base font-extrabold text-[#0f1e57]"
              aria-label={`Rated ${service.rating} out of 5`}
            >
              <Star size={18} className="fill-[#ff9f1a] text-[#ff9f1a]" aria-hidden="true" />
              {service.rating}
            </span>
          ) : null}
        </div>

        <ul className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#eaf1fd] pb-3.5 text-[10px] font-semibold text-[#0b3fc4] sm:gap-x-7 lg:text-[11px]">
          {serviceHighlights.map(({ label, icon: Icon }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-[#0b3fc4] px-3.5 py-1.5 text-white">
              <span className="block text-[9px] font-medium leading-none text-blue-200">
                {price ? "Pricing" : "Pricing"}
              </span>
              <strong className="mt-1 block text-sm font-bold leading-none">
                {price ? (
                  <>
                    {price} <span className="text-[10px] font-medium">/ Day</span>
                  </>
                ) : (
                  "On Request"
                )}
              </strong>
            </div>
            <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#eaf7ee] px-4 text-[10px] font-semibold text-emerald-700 lg:text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Available Today
            </span>
          </div>

          <Link
            to={detailUrl}
            className="inline-flex h-9 min-w-[136px] items-center justify-center gap-3 rounded-lg bg-[#0b3fc4] px-5 text-xs font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Book Now
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

const ListingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-72 rounded-3xl bg-[#eaf1fd] lg:h-80" />
    <div className="py-10 sm:py-12">
      <div className="mb-4 h-8 w-72 rounded-lg bg-[#eaf1fd]" />
      <div className="space-y-4">
        {[0, 1, 2].map((key) => (
          <div key={key} className="h-52 rounded-2xl bg-[#eaf1fd] md:h-[206px]" />
        ))}
      </div>
    </div>
  </div>
);

const EmptyState = ({ message }: { message: string }) => (
  <div className="rounded-2xl border border-[#dce7fb] bg-[#f6f9ff] px-6 py-14 text-center">
    <h3 className="text-lg font-extrabold tracking-tight text-[#0f1e57] sm:text-xl">No services found</h3>
    <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-[#5a6a90]">{message}</p>
  </div>
);

const CategoryNotFound = () => (
  <div className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] px-6 py-16 text-center">
    <h1 className="text-2xl font-extrabold tracking-tight text-[#0f1e57] sm:text-3xl">Category not found</h1>
    <p className="mx-auto mt-3 max-w-md text-sm font-normal leading-6 text-[#5a6a90]">
      The category you are looking for is not available. Please head back and pick a service category.
    </p>
    <Link
      to="/"
      className="mt-6 inline-flex min-h-11 items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-6 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
    >
      Back to home <ArrowRight size={17} aria-hidden="true" />
    </Link>
  </div>
);

const TrustSection = () => (
  <section
    aria-labelledby="trust-heading"
    className="rounded-3xl border border-[#dce7fb] bg-gradient-to-br from-[#f2f6fe] to-white px-5 py-10 sm:px-8 lg:px-10"
  >
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b3fc4] sm:text-sm">
        The Dehatwala Difference
      </p>
      <h2 id="trust-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-[#0f1e57] sm:text-[32px]">
        Why Customers Prefer Dehatwala
      </h2>
      <p className="mt-3 text-sm font-normal leading-6 text-[#5a6a90] sm:text-base">
        Reliable workers, transparent pricing and a simple assisted booking experience.
      </p>
    </div>

    <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {trustBenefits.map(({ icon: Icon, title, copy }) => (
        <article
          key={title}
          className="rounded-2xl border border-[#e0eafb] bg-white p-5 text-center shadow-[0_4px_14px_rgba(26,64,135,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_rgba(26,64,135,0.4)]"
        >
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#0b3fc4] text-white shadow-md shadow-blue-800/20">
            <Icon size={25} aria-hidden="true" />
          </span>
          <h3 className="mt-4 flex min-h-[35px] items-center justify-center text-sm font-extrabold leading-tight text-[#0f1e57]">
            {title}
          </h3>
          <p className="mt-2 text-xs font-normal leading-5 text-[#5a6a90]">{copy}</p>
        </article>
      ))}
    </div>
  </section>
);

const ServiceListingPage = () => {
  const { category_slug, sub_category_slug } = useParams();
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteServicesByCategory(category_slug, sub_category_slug);

  // /services/all has no category to render from, so fall back to the category
  // list for the filter chips.
  const isAllCategories = category_slug?.toLowerCase() === ALL_SLUG;
  const { data: categoryData } = useCategories();

  // Category and sub-categories are identical on every page, so the first is
  // as good as any; only the service rows accumulate.
  const firstPage = data?.pages?.[0];
  const category = firstPage?.category;
  const services = useMemo(() => (data?.pages ?? []).flatMap((page) => page.services ?? []), [data]);
  const totalServices = firstPage?.meta?.total ?? services.length;
  const subCategories = firstPage?.sub_categories ?? [];

  /**
   * Loads the next page when the sentinel below the grid scrolls into view.
   *
   * `rootMargin` starts the request before the sentinel is actually visible, so
   * the next rows are usually in place by the time the visitor reaches them.
   */
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: "400px" }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const activeSubCategory =
    sub_category_slug && sub_category_slug.toLowerCase() !== ALL_SLUG
      ? subCategories.find((subCategory) => subCategory.slug === sub_category_slug)
      : undefined;

  const hasListing = !!category || isAllCategories;

  return (
    <main className="bg-white pb-20 pt-6 sm:pt-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        {isLoading && <ListingSkeleton />}

        {!isLoading && (isError || !hasListing) && <CategoryNotFound />}

        {!isLoading && !isError && hasListing && (
          <>
            <ServiceHero category={category} />

            <section aria-labelledby="services-heading" className="py-10 sm:py-12">
              <div className="mb-4">
                <h2
                  id="services-heading"
                  className="text-2xl font-extrabold capitalize tracking-tight text-[#0f1e57] sm:text-[30px]"
                >
                  {activeSubCategory ? activeSubCategory.name : category ? `${category.name} Services` : "All Services"}
                </h2>
                <p className="mt-1 text-xs font-normal text-[#5a6a90] sm:text-sm">
                  {/* The API's total, not the number loaded so far — otherwise
                      this would read "9 services available" until the visitor
                      scrolled to the end. */}
                  {totalServices > 0
                    ? `${totalServices} service${totalServices > 1 ? "s" : ""} available — choose the one you need`
                    : "Choose the service you need"}
                </p>
              </div>

              {isAllCategories
                ? categoryData?.categories?.length > 0 && <CategoryFilter categories={categoryData.categories} />
                : subCategories.length > 0 && (
                    <SubCategoryFilter
                      categorySlug={category_slug}
                      subCategories={subCategories}
                      activeSlug={sub_category_slug}
                    />
                  )}

              {services.length > 0 ? (
                <div className="space-y-4">
                  {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                  ))}

                  {/* The observer watches this. A button is kept alongside so
                      the rest stays reachable without a scroll event — for
                      keyboard users, and if IntersectionObserver never fires. */}
                  <div ref={sentinelRef} aria-hidden="true" />

                  {hasNextPage && (
                    <div className="pt-2 text-center">
                      <button
                        type="button"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#cfe0fb] bg-white px-6 text-[13px] font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isFetchingNextPage ? "Loading…" : "Load more services"}
                      </button>
                    </div>
                  )}

                  {isFetchingNextPage && (
                    <p role="status" className="sr-only">
                      Loading more services
                    </p>
                  )}

                  {/* Only worth saying once more than one page has loaded;
                      on a short list it states the obvious. */}
                  {!hasNextPage && (data?.pages?.length ?? 0) > 1 && (
                    <p className="pt-2 text-center text-xs font-semibold text-[#8fa2c8]">
                      You have seen all {totalServices} services.
                    </p>
                  )}
                </div>
              ) : (
                <EmptyState
                  message={
                    activeSubCategory
                      ? `We have no services listed under ${activeSubCategory.name} yet. Try another sub category.`
                      : isAllCategories
                        ? "No services are listed yet. Please check back soon."
                        : "We have no services listed in this category yet. Please check back soon."
                  }
                />
              )}
            </section>

            <TrustSection />
          </>
        )}
      </div>
    </main>
  );
};

export default ServiceListingPage;
