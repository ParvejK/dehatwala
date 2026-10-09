import { useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
  Facebook,
  Globe,
  Home,
  Link2,
  Linkedin,
  Search,
  SquareArrowOutUpRight,
  Twitter,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import ArticleLinkIcon from "../../components/media/article-link-icon";
import PressCta from "../../components/media/press-cta";
import {
  formatMediaDate,
  formatReadTime,
  isRealUrl,
  mediaArticlePath,
  mediaImage,
  toParagraphs,
} from "../media-news-page/data";
import { useMediaNewsDetail } from "../../react-query/hooks";
import { MediaNewsItem } from "../../types";

const NEWS_LIST_PATH = "/media-news/news";

const TagChip = ({ tag }: { tag: string }) => (
  <span className="inline-flex items-center rounded-md bg-[#eef4ff] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-[#0b3fc4]">
    {tag}
  </span>
);

const ShareRow = ({ title }: { title: string }) => {
  const url = window.location.href;

  const targets = [
    { icon: Facebook, label: "Share on Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}` },
    {
      icon: Twitter,
      label: "Share on X",
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    },
    {
      icon: Linkedin,
      label: "Share on LinkedIn",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    },
  ];

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard.");
    } catch {
      toast.error("Could not copy the link.");
    }
  };

  return (
    <div className="flex items-center gap-2.5">
      <span className="text-[11px] font-bold text-[#40517b]">Share:</span>
      {targets.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noreferrer"
          aria-label={label}
          className="grid size-8 place-items-center rounded-full bg-[#0b3fc4] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          <Icon size={15} aria-hidden="true" />
        </a>
      ))}
      <button
        type="button"
        onClick={copyLink}
        aria-label="Copy link to this article"
        className="grid size-8 place-items-center rounded-full border border-[#cfe0fb] bg-white text-[#0b3fc4] transition hover:bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        <Link2 size={15} aria-hidden="true" />
      </button>
    </div>
  );
};

const SidebarArticle = ({ article }: { article: MediaNewsItem }) => (
  <li>
    <Link
      to={mediaArticlePath(article.slug)}
      className="group flex gap-3 rounded-xl p-2 transition hover:bg-[#f6f9ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
    >
      <span className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-[#eef4ff]">
        <img
          src={mediaImage(article.image)}
          alt=""
          loading="lazy"
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </span>
      <span className="min-w-0">
        <TagChip tag={article.tag} />
        <span className="mt-1.5 line-clamp-2 block text-[12px] font-extrabold leading-[1.4] text-[#0f1e57] transition group-hover:text-[#0b3fc4]">
          {article.title}
        </span>
        <span className="mt-1 block text-[10px] font-normal text-[#8fa2c8]">
          {article.source} &middot; {formatMediaDate(article.published_at)}
        </span>
      </span>
    </Link>
  </li>
);

const RelatedCard = ({ article }: { article: MediaNewsItem }) => (
  <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#dce7fb] bg-white transition hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-18px_rgba(20,61,141,0.5)]">
    <Link to={mediaArticlePath(article.slug)} className="relative block h-36 overflow-hidden bg-[#eef4ff]">
      <img
        src={mediaImage(article.image)}
        alt=""
        loading="lazy"
        className="size-full object-cover transition duration-500 group-hover:scale-105"
      />
      <span className="absolute bottom-3 left-3 rounded-md bg-white/95 px-2.5 py-1 text-[10px] font-extrabold text-[#0b3fc4] shadow-sm">
        {article.tag}
      </span>
    </Link>

    <div className="flex flex-1 flex-col p-4">
      <h3 className="text-[13px] font-extrabold leading-[1.45] text-[#0f1e57]">
        <Link to={mediaArticlePath(article.slug)} className="transition hover:text-[#0b3fc4]">
          {article.title}
        </Link>
      </h3>

      <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eef2f9] pt-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-bold text-[#40517b]">{article.source}</p>
          <p className="mt-0.5 text-[11px] font-normal text-[#8fa2c8]">{formatMediaDate(article.published_at)}</p>
        </div>
        <ArticleLinkIcon
          slug={article.slug}
          title={article.title}
          source={article.source}
          externalUrl={article.external_url ?? ""}
        />
      </div>
    </div>
  </article>
);

const MediaNewsDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const { data, isPending, isError } = useMediaNewsDetail(slug);
  const article = data?.article;

  if (isPending) {
    return (
      <main className="bg-white pb-14 pt-5 sm:pt-6">
        <div className="mx-auto w-full max-w-7xl animate-pulse px-4 sm:px-8 lg:px-10">
          <div className="h-4 w-72 rounded bg-[#eaf1fd]" />
          <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.4fr)]">
            <div className="h-[42rem] rounded-2xl bg-[#eaf1fd]" />
            <div className="h-80 rounded-2xl bg-[#eaf1fd]" />
          </div>
        </div>
      </main>
    );
  }

  if (isError || !article) {
    return (
      <main className="bg-white pb-14 pt-5 sm:pt-6">
        <div className="mx-auto w-full max-w-3xl px-4 text-center sm:px-8">
          <div className="rounded-2xl border border-[#dce7fb] bg-[#f8fbff] px-6 py-16">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0f1e57]">Article not found</h1>
            <p className="mx-auto mt-3 max-w-md text-xs leading-6 text-[#63739a] sm:text-sm">
              This story is no longer listed. Browse our latest media coverage instead.
            </p>
            <Link
              to={NEWS_LIST_PATH}
              className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[13px] font-bold text-white transition hover:bg-[#0932a0]"
            >
              View all news <ChevronRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const others = (data?.related ?? []).filter((item) => item.slug !== article.slug);
  const sidebarArticles = others.slice(0, 3);
  const relatedArticles = others.slice(0, 3);

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `${NEWS_LIST_PATH}?q=${encodeURIComponent(query)}` : NEWS_LIST_PATH);
  };

  return (
    <main className="bg-white pb-12 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
                <Home size={14} aria-hidden="true" /> Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} className="text-[#a8b6d4]" />
            </li>
            <li>
              <Link to="/media-news" className="transition hover:text-[#0b3fc4]">
                Media &amp; News
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} className="text-[#a8b6d4]" />
            </li>
            <li className="line-clamp-1 font-bold text-[#0f1e57]" aria-current="page">
              {article.title}
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,0.4fr)]">
          {/* ---------- Article ---------- */}
          <article className="rounded-2xl border border-[#dce7fb] bg-white p-5 sm:p-7">
            <Link
              to="/media-news"
              className="group inline-flex items-center gap-2 text-xs font-bold text-[#0b3fc4] transition hover:text-[#0932a0]"
            >
              <ArrowLeft size={15} className="transition group-hover:-translate-x-0.5" aria-hidden="true" />
              Back to Media &amp; News
            </Link>

            <div className="mt-5">
              <TagChip tag={article.tag} />
            </div>

            <h1 className="mt-3 text-[26px] font-extrabold leading-[1.2] tracking-tight text-[#0f1e57] sm:text-[32px]">
              {article.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-b border-[#eef2f9] pb-4">
              <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#8fa2c8]">
                <span className="text-[15px] font-extrabold tracking-tight text-slate-900">{article.source}</span>
                <span aria-hidden="true" className="text-[#cdd8ee]">
                  |
                </span>
                <time dateTime={article.published_at}>{formatMediaDate(article.published_at)}</time>
                <span aria-hidden="true" className="text-[#cdd8ee]">
                  |
                </span>
                <span>{formatReadTime(article.read_time)}</span>
              </div>

              <ShareRow title={article.title} />
            </div>

            <img
              src={mediaImage(article.image)}
              alt={article.title}
              className="mt-5 h-56 w-full rounded-xl object-cover sm:h-72 lg:h-80"
            />

            <p className="mt-6 text-[13px] font-extrabold leading-6 text-[#0f1e57] sm:text-sm">{article.lead}</p>

            <div className="mt-4 space-y-4">
              {toParagraphs(article.body, article.body_list).map((paragraph, index) => {
                // The pull quote sits after the second paragraph, as in the design.
                const showQuote = !!article.quote_text && index === 1;

                return (
                  <div key={paragraph} className="space-y-4">
                    <p className="text-xs leading-6 text-[#5a6a90] sm:text-[13px]">{paragraph}</p>
                    {showQuote && (
                      <blockquote className="border-l-2 border-[#0b3fc4] pl-4 text-xs italic leading-6 text-[#40517b] sm:text-[13px]">
                        &ldquo;{article.quote_text}&rdquo;
                        <footer className="mt-1 not-italic font-bold text-[#0f1e57]">— {article.quote_author}</footer>
                      </blockquote>
                    )}
                  </div>
                );
              })}
            </div>

            {isRealUrl(article.external_url) ? (
              <div className="mt-7 flex flex-col gap-4 rounded-xl bg-[#f2f6fe] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[#0b3fc4] shadow-sm">
                    <Globe size={19} aria-hidden="true" />
                  </span>
                  <div>
                    <p className="text-[13px] font-extrabold text-[#0f1e57]">Read Full Article on {article.source}</p>
                    <p className="mt-0.5 text-[11px] font-normal text-[#63739a]">
                      Click the button to view the original article on their website.
                    </p>
                  </div>
                </div>
                <a
                  href={article.external_url ?? undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-5 text-[13px] font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
                >
                  Visit {article.source} <SquareArrowOutUpRight size={15} aria-hidden="true" />
                </a>
              </div>
            ) : (
              <p className="mt-7 rounded-xl bg-[#f2f6fe] px-5 py-4 text-[11px] leading-5 text-[#63739a]">
                This is Dehatwala&rsquo;s summary of the coverage. A link to the original article on {article.source}{" "}
                will be added here shortly.
              </p>
            )}
          </article>

          {/* ---------- Sidebar ---------- */}
          <aside className="space-y-4 lg:sticky lg:top-24">
            <form onSubmit={submitSearch} role="search">
              <label className="flex items-center gap-2 rounded-lg border border-[#dce7fb] bg-white px-3 focus-within:border-[#0b3fc4] focus-within:ring-4 focus-within:ring-blue-100">
                <span className="sr-only">Search news</span>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search news..."
                  className="min-h-11 w-full bg-transparent text-[13px] font-medium text-[#0f1e57] outline-none placeholder:font-normal placeholder:text-[#a9b8d6]"
                />
                <button
                  type="submit"
                  aria-label="Search news"
                  className="shrink-0 text-[#0b3fc4] transition hover:text-[#0932a0]"
                >
                  <Search size={17} aria-hidden="true" />
                </button>
              </label>
            </form>

            <section
              aria-labelledby="sidebar-coverage-heading"
              className="rounded-2xl border border-[#dce7fb] bg-white p-4"
            >
              <h2
                id="sidebar-coverage-heading"
                className="text-[13px] font-extrabold tracking-tight text-[#0b3fc4] sm:text-sm"
              >
                Latest Media Coverage
              </h2>
              <ul className="mt-3 space-y-1">
                {sidebarArticles.map((item) => (
                  <SidebarArticle key={item.slug} article={item} />
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {/* ---------- Related ---------- */}
        {relatedArticles.length > 0 && (
          <section aria-labelledby="related-heading" className="mt-7">
            <h2 id="related-heading" className="mb-4 text-[15px] font-extrabold tracking-tight text-[#0b3fc4] sm:text-base">
              More Articles You May Like
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((item) => (
                <RelatedCard key={item.slug} article={item} />
              ))}
            </div>
          </section>
        )}

        <div className="mt-7">
          <PressCta />
        </div>
      </div>
    </main>
  );
};

export default MediaNewsDetailPage;
