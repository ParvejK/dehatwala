import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { Link } from "react-router-dom";
import ArticleLinkIcon from "../../components/media/article-link-icon";
import PressCta from "../../components/media/press-cta";
import { formatMediaDate, isRealUrl, mediaArticlePath, mediaImage, publicationLogo } from "./data";
import { Skeleton, SkeletonGrid } from "../../components/skeleton/skeleton";
import { useMediaNews, useMediaPhotos, useMediaPublications, useMediaVideos } from "../../react-query/hooks";

const SectionHeader = ({ title, linkLabel, to }: { title: string; linkLabel: string; to: string }) => (
  <div className="mb-4 flex items-center justify-between gap-4">
    <h2 className="text-[15px] font-extrabold tracking-tight text-[#0b3fc4] sm:text-base">{title}</h2>
    <Link
      to={to}
      className="group inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#0b3fc4] transition hover:text-[#0932a0]"
    >
      {linkLabel}
      <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  </div>
);

const MediaNewsPage = () => {
  const publicationsQuery = useMediaPublications();
  const coverageQuery = useMediaNews();
  const videosQuery = useMediaVideos();
  const photosQuery = useMediaPhotos();

  const publications = publicationsQuery.data?.publications ?? [];
  const coverage = coverageQuery.data?.news ?? [];
  const videos = videosQuery.data?.videos ?? [];
  const photos = photosQuery.data?.photos ?? [];
  const stripRef = useRef<HTMLDivElement>(null);

  const scrollStrip = (direction: -1 | 1) => {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollBy({ left: direction * (strip.clientWidth * 0.7), behavior: "smooth" });
  };

  return (
    <main className="bg-white pb-12 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
            <li>
              <Link to="/" className="transition hover:text-[#0b3fc4]">
                Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} className="text-[#a8b6d4]" />
            </li>
            <li className="font-bold text-[#0f1e57]" aria-current="page">
              Media &amp; News
            </li>
          </ol>
        </nav>

        {/* ---------- Hero ---------- */}
        <section className="grid overflow-hidden rounded-2xl bg-[#0a2a6b] shadow-[0_22px_55px_-38px_rgba(10,42,107,0.7)] lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
          <div className="px-6 py-8 sm:px-9 sm:py-10 lg:flex lg:min-h-[420px] lg:flex-col lg:justify-center lg:px-12 lg:py-12">
            <h1 className="text-[30px] font-extrabold leading-[1.1] tracking-tight text-white sm:text-[40px]">
              Dehatwala
              <br />
              in the <span className="text-amber-400">News</span>
            </h1>
            <p className="mt-4 max-w-md text-xs leading-6 text-blue-100/85 sm:text-sm">
              See how Dehatwala is transforming India’s blue-collar workforce through innovation, employment
              generation, and faster workforce access.
            </p>
            <a
              href="#coverage"
              className="group mt-5 inline-flex min-h-10 w-fit items-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-extrabold text-[#0a2a6b] shadow-[0_10px_24px_-14px_rgba(251,191,36,0.9)] transition hover:-translate-y-0.5 hover:bg-amber-300 focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-200"
            >
              View Media Coverage
              <ArrowRight size={14} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
          </div>

          <img
            src="/images/media-news-hero.png"
            alt="Dehatwala workers with a media crew at a construction site"
            width={1673}
            height={941}
            fetchPriority="high"
            decoding="async"
            className="block h-auto w-full border-t border-white/10 object-contain lg:h-full lg:min-h-[420px] lg:border-l lg:border-t-0 lg:object-cover lg:object-right"
          />
        </section>

        {/* ---------- Featured in ---------- */}
        <section aria-labelledby="featured-heading" className="mt-6 rounded-2xl border border-[#dce7fb] bg-white p-5 sm:p-6">
          <h2
            id="featured-heading"
            className="mb-4 text-[15px] font-extrabold tracking-tight text-[#0b3fc4] sm:text-base"
          >
            Featured In
          </h2>

          {publicationsQuery.isLoading && (
            <div role="status" aria-busy="true" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <span className="sr-only">Loading publications</span>
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="min-h-[62px] rounded-xl" />
              ))}
            </div>
          )}

          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {publications.map(({ id, name, logo, website_url }) => {
              const tile = logo ? (
                <img src={publicationLogo(logo)} alt={name} className="max-h-10 w-auto object-contain" />
              ) : (
                <span className="text-[15px] font-extrabold tracking-tight text-slate-900">{name}</span>
              );

              return (
                <li
                  key={id}
                  className="grid min-h-[62px] place-items-center rounded-xl border border-[#e6edf9] bg-white px-3 text-center transition hover:border-[#bfd5fb] hover:shadow-sm"
                >
                  {isRealUrl(website_url) ? (
                    <a
                      href={website_url ?? undefined}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${name} (opens in a new tab)`}
                      className="grid size-full place-items-center"
                    >
                      {tile}
                    </a>
                  ) : (
                    tile
                  )}
                </li>
              );
            })}
          </ul>
        </section>

        {/* ---------- Latest media coverage ---------- */}
        <section id="coverage" aria-labelledby="coverage-heading" className="mt-6 scroll-mt-24">
          <SectionHeader title="Latest Media Coverage" linkLabel="View all news" to="/media-news/news" />

          {coverageQuery.isLoading && (
            <SkeletonGrid
              count={3}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              label="Loading latest media coverage"
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {coverage.slice(0, 3).map(({ id, slug, tag, title, source, published_at, image, external_url }) => (
              <article
                key={id}
                className="group overflow-hidden rounded-2xl border border-[#dce7fb] bg-white transition hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-18px_rgba(20,61,141,0.5)]"
              >
                <Link
                  to={mediaArticlePath(slug)}
                  tabIndex={-1}
                  aria-hidden="true"
                  className="relative block h-40 overflow-hidden bg-[#eef4ff] sm:h-44"
                >
                  <img
                    src={mediaImage(image)}
                    alt=""
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-[#0b3fc4] shadow-sm">
                    {tag}
                  </span>
                </Link>

                <div className="p-4 sm:p-5">
                  <h3 className="min-h-[42px] text-[13px] font-extrabold leading-[1.45] text-[#0f1e57] sm:text-sm">
                    <Link
                      to={mediaArticlePath(slug)}
                      className="transition hover:text-[#0b3fc4] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                    >
                      {title}
                    </Link>
                  </h3>

                  <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#eef2f9] pt-3">
                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-[#40517b]">{source}</p>
                      <p className="mt-0.5 text-[11px] font-normal text-[#8fa2c8]">{formatMediaDate(published_at)}</p>
                    </div>
                    <ArticleLinkIcon slug={slug} title={title} source={source} externalUrl={external_url ?? ""} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* ---------- Videos & interviews ---------- */}
        <section id="videos" aria-labelledby="videos-heading" className="mt-7 scroll-mt-24">
          <SectionHeader title="Videos & Interviews" linkLabel="View all videos" to="/media-news/videos" />

          {videosQuery.isLoading && (
            <SkeletonGrid
              count={3}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
              aspect="aspect-video"
              label="Loading videos and interviews"
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.slice(0, 3).map(({ id, title, subtitle, duration, thumbnail, video_url }) => (
              <a
                key={id}
                href={video_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Play ${title} on YouTube`}
                className="group overflow-hidden rounded-2xl border border-[#dce7fb] bg-white transition hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-18px_rgba(20,61,141,0.5)] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <div className="relative h-40 overflow-hidden bg-[#0a2a6b] sm:h-44">
                  <img
                    src={mediaImage(thumbnail)}
                    alt=""
                    className="size-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-[#0b3fc4]/90 text-white shadow-lg transition group-hover:scale-110">
                      <Play size={18} fill="currentColor" className="ml-0.5" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                    {duration}
                  </span>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-[13px] font-extrabold leading-[1.45] text-[#0f1e57] sm:text-sm">{title}</h3>
                  <p className="mt-1.5 text-[11px] font-normal leading-4 text-[#8fa2c8]">{subtitle}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ---------- Latest event photos ---------- */}
        <section id="photos" aria-labelledby="photos-heading" className="mt-7 scroll-mt-24">
          <SectionHeader title="Latest Event Photos" linkLabel="View all photos" to="/media-news/photos" />

          {photosQuery.isLoading && (
            <SkeletonGrid
              count={4}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
              aspect="aspect-[3/2]"
              label="Loading event photos"
            />
          )}

          {/* Hidden while loading, so the scroll arrows are not left hovering
              over an empty strip beside the skeleton. */}
          <div className={`relative ${photosQuery.isLoading ? "hidden" : ""}`}>
            <div
              ref={stripRef}
              className="flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {photos.slice(0, 5).map(({ id, image, alt }) => (
                <figure
                  key={id}
                  className="group relative h-28 w-40 shrink-0 snap-start overflow-hidden rounded-xl border border-[#dce7fb] bg-[#eef4ff] sm:h-32 sm:w-48 lg:w-[19%]"
                >
                  <img
                    src={mediaImage(image)}
                    alt={alt}
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </figure>
              ))}
            </div>

            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => scrollStrip(-1)}
                aria-label="Previous photos"
                className="grid size-8 place-items-center rounded-lg border border-[#dce7fb] bg-white text-[#40517b] transition hover:border-[#bfd5fb] hover:text-[#0b3fc4] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scrollStrip(1)}
                aria-label="Next photos"
                className="grid size-8 place-items-center rounded-lg border border-[#dce7fb] bg-white text-[#40517b] transition hover:border-[#bfd5fb] hover:text-[#0b3fc4] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </div>
          </div>
        </section>

        {/* ---------- Press CTA ---------- */}
        <div className="mt-7">
          <PressCta />
        </div>
      </div>
    </main>
  );
};

export default MediaNewsPage;
