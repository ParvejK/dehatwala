import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import ArticleLinkIcon from "../../components/media/article-link-icon";
import MediaPageHeader from "../../components/media/media-page-header";
import { formatMediaDate, mediaArticlePath, mediaImage } from "../media-news-page/data";
import { SkeletonGrid } from "../../components/skeleton/skeleton";
import { useMediaNews } from "../../react-query/hooks";

const ALL = "All";

const MediaNewsListPage = () => {
  // Seeded from `?q=`, which the article sidebar search links to.
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") ?? "");
  const [tag, setTag] = useState<string>(ALL);
  const newsQuery = useMediaNews();
  const COVERAGE = useMemo(() => newsQuery.data?.news ?? [], [newsQuery.data]);

  const tags = useMemo(() => [ALL, ...Array.from(new Set(COVERAGE.map((item) => item.tag)))], [COVERAGE]);

  const query = search.trim().toLowerCase();

  const articles = useMemo(
    () =>
      COVERAGE.filter((item) => tag === ALL || item.tag === tag)
        .filter(
          (item) =>
            query.length === 0 ||
            item.title.toLowerCase().includes(query) ||
            item.source.toLowerCase().includes(query) ||
            item.excerpt.toLowerCase().includes(query),
        )
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()),
    [COVERAGE, tag, query],
  );

  return (
    <main className="bg-white pb-14 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <MediaPageHeader
          title="Media Coverage"
          description="Press articles and features about Dehatwala from across Indian business and regional media."
          count={COVERAGE.length}
          countLabel={COVERAGE.length === 1 ? "article" : "articles"}
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {tags.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTag(item)}
                aria-pressed={tag === item}
                className={`inline-flex min-h-9 items-center rounded-full border px-4 text-xs font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                  tag === item
                    ? "border-[#0b3fc4] bg-[#0b3fc4] text-white"
                    : "border-[#dce7fb] bg-white text-[#40517b] hover:border-[#bfd5fb] hover:text-[#0b3fc4]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex w-full items-center gap-2 rounded-lg border border-[#dce7fb] bg-white px-3 focus-within:border-[#0b3fc4] focus-within:ring-4 focus-within:ring-blue-100 sm:w-72">
            <Search size={16} className="shrink-0 text-[#a9b8d6]" aria-hidden="true" />
            <span className="sr-only">Search media coverage</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search articles or publications"
              className="min-h-10 w-full bg-transparent text-[13px] font-medium text-[#0f1e57] outline-none placeholder:font-normal placeholder:text-[#a9b8d6]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="shrink-0 text-[#a9b8d6] transition hover:text-[#40517b]"
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>

        {/* Loading is checked before the empty state: while the request is in
            flight the list is legitimately empty, and "no articles found" is
            the wrong thing to show. */}
        {newsQuery.isLoading ? (
          <SkeletonGrid
            count={6}
            className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            label="Loading articles"
          />
        ) : articles.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map(({ id, slug, tag: itemTag, title, source, published_at, image, external_url, excerpt }) => (
              <article
                key={id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#dce7fb] bg-white transition hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-18px_rgba(20,61,141,0.5)]"
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
                    loading="lazy"
                    className="size-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-[#0b3fc4] shadow-sm">
                    {itemTag}
                  </span>
                </Link>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h2 className="text-[13px] font-extrabold leading-[1.45] text-[#0f1e57] sm:text-sm">
                    <Link
                      to={mediaArticlePath(slug)}
                      className="transition hover:text-[#0b3fc4] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                    >
                      {title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 text-[11px] font-normal leading-5 text-[#8fa2c8]">{excerpt}</p>

                  <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eef2f9] pt-3">
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
        ) : (
          <div className="mt-5 rounded-2xl border border-[#dce7fb] bg-[#f8fbff] px-6 py-14 text-center">
            <h2 className="text-base font-extrabold text-[#0f1e57]">No articles found</h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#63739a]">
              Nothing matches your current filters. Try a different category or search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setTag(ALL);
              }}
              className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-[#cfe0fb] bg-white px-5 text-xs font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MediaNewsListPage;
