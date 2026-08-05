import { ArrowRight, BookOpen, CalendarDays, Clock3, Mail, RefreshCw, Search, Sparkles, X } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useBlogs } from "../../react-query/hooks";
import { ArticleCard, CategoryBadge } from "../../components/blog/article";
import { Article, toArticle } from "../../components/blog/article-model";
import { BlogCategory, formatDate, toBlogCategory } from "./data";

/* ---------------------------------- hero ---------------------------------- */

const BlogHero = ({ search, onSearchChange }: { search: string; onSearchChange: (value: string) => void }) => (
  <section className="relative isolate overflow-hidden bg-[#062b79] text-white">
    <div
      className="pointer-events-none absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:56px_56px]"
      aria-hidden="true"
    />

    <div className="relative mx-auto flex max-w-7xl flex-col gap-10 px-5 pb-24 pt-12 sm:px-8 lg:min-h-[540px] lg:flex-row lg:items-center lg:gap-0 lg:px-10 lg:pb-32 lg:pt-16">
      <div className="relative z-10 w-full lg:max-w-xl xl:max-w-2xl">
        <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
          <Sparkles size={15} aria-hidden="true" /> Dehatwala blog
        </p>
        <h1 className="mt-5 text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl xl:text-[3.5rem]">
          Dehatwala Workforce <span className="block text-amber-400">Insights</span>
        </h1>
        <span className="mt-6 block h-1 w-16 rounded-full bg-amber-400" aria-hidden="true" />
        <p className="mt-6 max-w-xl text-sm font-normal leading-7 text-blue-100 sm:text-base">
          Practical guides, hiring tips, worker resources and industry insights to help customers and independent
          workers make better workforce decisions.
        </p>

        <label className="mt-8 flex max-w-xl items-center gap-2 rounded-xl bg-white p-1.5 pl-4 text-slate-900 shadow-2xl shadow-blue-950/30 focus-within:ring-4 focus-within:ring-amber-300/40">
          <Search className="shrink-0 text-blue-700" size={20} aria-hidden="true" />
          <span className="sr-only">Search articles, services or workforce guides</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search articles, services or workforce guides..."
            className="min-w-0 flex-1 bg-transparent px-1 py-2.5 text-sm font-normal outline-none placeholder:text-slate-400"
          />
          <span
            className="grid size-10 shrink-0 place-items-center rounded-lg bg-blue-700 text-white"
            aria-hidden="true"
          >
            <Search size={18} />
          </span>
        </label>
      </div>

      <div className="relative w-full overflow-hidden rounded-2xl lg:absolute lg:inset-y-0 lg:right-0 lg:w-[56%] lg:rounded-none xl:right-[calc((1280px-100vw)/2)] xl:w-[calc(54%+(100vw-1280px)/2)]">
        <img
          src="/images/blog-hero.png"
          alt="Dehatwala workers in blue polo T-shirts and safety helmets shown on a mobile screen"
          className="h-full w-full object-cover object-center"
        />
        <div
          className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,#062b79_0%,rgba(6,43,121,0.85)_18%,rgba(6,43,121,0.15)_45%,transparent_70%)] lg:block"
          aria-hidden="true"
        />
      </div>
    </div>
  </section>
);

/* ------------------------------ category strip ----------------------------- */

const CategoryStrip = ({ categories, counts }: { categories: BlogCategory[]; counts: Record<string, number> }) => (
  <nav
    aria-label="Blog categories"
    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-7"
  >
    <div className="mb-5 flex items-center gap-4">
      <span className="hidden h-px flex-1 bg-slate-200 sm:block" aria-hidden="true" />
      <h2 className="text-base font-bold tracking-tight text-slate-950 sm:text-lg">Explore by Category</h2>
      <span className="hidden h-px flex-1 bg-slate-200 sm:block" aria-hidden="true" />
    </div>

    <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
      {categories.map((category) => {
        const Icon = category.icon;
        const count = counts[category.id] ?? 0;

        return (
          <li key={category.id}>
            <Link
              to={`/blog/category/${category.id}`}
              title={category.description}
              className={`flex h-full w-full flex-col items-center gap-2.5 rounded-2xl border border-slate-200 bg-white px-2 py-4 text-center text-blue-900 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 ${
                count === 0 ? "opacity-60" : ""
              }`}
            >
              <span className={`grid size-11 place-items-center rounded-xl ${category.iconClassName}`}>
                <Icon size={22} aria-hidden="true" />
              </span>
              <span className="text-xs font-bold leading-4 sm:text-[13px]">{category.label}</span>
              <span className="text-[11px] font-normal text-slate-500">
                {count} {count === 1 ? "article" : "articles"}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  </nav>
);

/* --------------------------------- cards ---------------------------------- */


const FeaturedArticle = ({ article }: { article: Article }) => (
  <section aria-labelledby="featured-article">
    <h2 id="featured-article" className="mb-4 text-lg font-bold tracking-tight text-slate-950">
      Featured Article
    </h2>

    <article className="grid gap-5 rounded-3xl border border-blue-100 bg-[var(--home-color-surface-tint)] p-4 sm:p-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center lg:gap-8 lg:p-6">
      <Link
        to={`/blog/${article.slug}`}
        tabIndex={-1}
        aria-hidden="true"
        className="group relative block aspect-[16/10] overflow-hidden rounded-2xl bg-slate-100"
      >
        <img
          src={article.image}
          alt=""
          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="lg:pr-6">
        <CategoryBadge category={article.category} />
        <h3 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-slate-950 sm:text-3xl">
          <Link
            to={`/blog/${article.slug}`}
            className="transition hover:text-blue-700 focus:outline-none focus-visible:rounded focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            {article.title}
          </Link>
        </h3>
        <p className="mt-4 line-clamp-3 text-sm font-normal leading-7 text-slate-600">{article.excerpt}</p>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-normal text-slate-500">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 size={14} aria-hidden="true" /> {article.readTime}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays size={14} aria-hidden="true" /> Updated {formatDate(article.updatedAt)}
          </span>
        </div>

        <Link
          to={`/blog/${article.slug}`}
          className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
        >
          Read Guide <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </article>
  </section>
);

const CategoryRow = ({ category, articles }: { category: BlogCategory; articles: Article[] }) => (
  <section aria-labelledby={`category-${category.id}`}>
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 id={`category-${category.id}`} className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
        {category.label}
      </h2>
      <Link
        to={`/blog/category/${category.id}`}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-1 py-1 text-sm font-semibold text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        View All <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </div>
  </section>
);

/* -------------------------------- subscribe -------------------------------- */

const SubscribeSection = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // TODO: post the address to the newsletter endpoint once the API is available.
    setSubscribed(true);
    setEmail("");
  };

  return (
    <section className="rounded-3xl border border-blue-100 bg-[var(--home-color-surface-soft)] p-5 sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-center lg:gap-10">
        <div className="flex items-start gap-4">
          <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-blue-700 text-white shadow-lg shadow-blue-700/20">
            <Mail size={22} aria-hidden="true" />
          </span>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-slate-950 sm:text-xl">
              Stay Updated with Useful Workforce Insights
            </h2>
            <p className="mt-1.5 text-sm font-normal leading-6 text-slate-600">
              Subscribe to get expert tips, hiring guides and worker opportunities straight to your inbox.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 sm:flex-row">
          <label className="flex-1">
            <span className="sr-only">Email address</span>
            <input
              type="email"
              required
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setSubscribed(false);
              }}
              placeholder="Enter your email address"
              className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-normal text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </label>
          <button
            type="submit"
            className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
          >
            Subscribe
          </button>
        </form>
      </div>

      {subscribed && (
        <p role="status" className="mt-4 text-sm font-semibold text-emerald-700 lg:text-right">
          Thanks for subscribing. We will keep you posted.
        </p>
      )}
    </section>
  );
};

/* -------------------------------- skeleton -------------------------------- */

const BlogSkeleton = () => (
  <div role="status" aria-live="polite" className="motion-safe:animate-pulse">
    <div className="grid gap-5 rounded-3xl border border-blue-100 bg-[var(--home-color-surface-tint)] p-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:gap-8 lg:p-6">
      <div className="aspect-[16/10] rounded-2xl bg-slate-200" />
      <div className="space-y-4">
        <div className="h-5 w-28 rounded-md bg-blue-100" />
        <div className="h-8 w-full rounded-lg bg-slate-200" />
        <div className="h-8 w-3/4 rounded-lg bg-slate-200" />
        <div className="h-3.5 w-full rounded-full bg-slate-100" />
        <div className="h-3.5 w-5/6 rounded-full bg-slate-100" />
        <div className="h-11 w-36 rounded-xl bg-blue-100" />
      </div>
    </div>

    {Array.from({ length: 2 }).map((_, rowIndex) => (
      <div key={rowIndex} className="mt-10">
        <div className="mb-4 h-6 w-48 rounded-lg bg-slate-200" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((__, cardIndex) => (
            <div key={cardIndex} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              <div className="aspect-[16/10] bg-slate-200" />
              <div className="space-y-3 p-4">
                <div className="h-5 w-24 rounded-md bg-blue-50" />
                <div className="h-4 w-full rounded-md bg-slate-200" />
                <div className="h-4 w-4/5 rounded-md bg-slate-200" />
                <div className="h-3 w-2/3 rounded-full bg-slate-100" />
              </div>
            </div>
          ))}
        </div>
      </div>
    ))}
    <span className="sr-only">Loading the latest blog articles…</span>
  </div>
);

/* ---------------------------------- page ---------------------------------- */

const BlogPage = () => {
  const blogsQuery = useBlogs();
  const [search, setSearch] = useState("");

  // The API builds the whole landing payload: the featured pick, the category
  // chips with their counts, and the per-category rows. Nothing is derived here.
  const categories = useMemo(
    () => (blogsQuery.data?.categories ?? []).map(toBlogCategory),
    [blogsQuery.data],
  );

  const counts = useMemo(
    () =>
      (blogsQuery.data?.categories ?? []).reduce<Record<string, number>>((total, category) => {
        total[category.slug] = category.blogs_count;
        return total;
      }, {}),
    [blogsQuery.data],
  );

  const articles = useMemo(() => (blogsQuery.data?.blogs ?? []).map(toArticle), [blogsQuery.data]);

  const featured = useMemo(
    () => (blogsQuery.data?.featured ? toArticle(blogsQuery.data.featured) : undefined),
    [blogsQuery.data],
  );

  const rows = useMemo(
    () =>
      (blogsQuery.data?.sections ?? [])
        .map((section) => ({
          category: toBlogCategory(section.category),
          articles: section.blogs.map(toArticle).filter((article) => article.id !== featured?.id),
        }))
        .filter((row) => row.articles.length > 0),
    [blogsQuery.data, featured],
  );

  const query = search.trim().toLowerCase();
  // Category browsing now lives on /blog/category/{slug}; search is the only
  // filter applied in place.
  const isFiltering = query.length > 0;

  const filtered = useMemo(
    () =>
      articles.filter(
        (article) =>
          query.length === 0 ||
          article.title.toLowerCase().includes(query) ||
          article.excerpt.toLowerCase().includes(query) ||
          article.category.label.toLowerCase().includes(query),
      ),
    [articles, query],
  );

  const clearFilters = () => setSearch("");

  return (
    <main className="bg-white text-slate-950">
      <BlogHero search={search} onSearchChange={setSearch} />

      <div className="relative z-10 mx-auto -mt-16 max-w-7xl px-5 sm:px-8 lg:-mt-20 lg:px-10">
        <CategoryStrip categories={categories} counts={counts} />
      </div>

      <div className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        {blogsQuery.isPending && <BlogSkeleton />}

        {blogsQuery.isError && (
          <div role="alert" className="mx-auto max-w-xl rounded-3xl border border-red-200 bg-red-50 p-8 text-center">
            <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-red-600 shadow-sm">
              <RefreshCw size={22} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-xl font-bold text-slate-950">We couldn’t load the articles</h2>
            <p className="mt-2 text-sm font-normal leading-6 text-slate-600">
              The articles are temporarily unavailable. Please check your connection and try again.
            </p>
            <button
              type="button"
              onClick={() => blogsQuery.refetch()}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              <RefreshCw size={17} aria-hidden="true" /> Try again
            </button>
          </div>
        )}

        {blogsQuery.isSuccess && articles.length === 0 && (
          <div className="mx-auto max-w-xl rounded-3xl border border-blue-100 bg-[var(--home-color-surface-soft)] p-8 text-center sm:p-10">
            <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
              <BookOpen size={25} aria-hidden="true" />
            </span>
            <h2 className="mt-5 text-2xl font-bold">Stories are on the way</h2>
            <p className="mt-3 text-sm font-normal leading-6 text-slate-600">
              We’re preparing useful ideas and field insights. Please check back soon.
            </p>
          </div>
        )}

        {blogsQuery.isSuccess && articles.length > 0 && isFiltering && (
          <section aria-live="polite">
            <div className="mb-5 flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-bold tracking-tight text-slate-950 sm:text-2xl">
                  Search results
                </h2>
                <p className="mt-1 text-sm font-normal text-slate-600">
                  {filtered.length} {filtered.length === 1 ? "article" : "articles"}
                  {query.length > 0 && <> for “{search.trim()}”</>}
                </p>
              </div>
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex w-fit items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <X size={16} aria-hidden="true" /> Clear filters
              </button>
            </div>

            {filtered.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {filtered.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">
                <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
                  <Search size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-slate-950">No articles here yet</h3>
                <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-slate-600">
                  We are still writing for this topic. Try another category or clear your search to see everything.
                </p>
              </div>
            )}
          </section>
        )}

        {blogsQuery.isSuccess && articles.length > 0 && !isFiltering && (
          <div className="space-y-10 lg:space-y-12">
            {featured && <FeaturedArticle article={featured} />}

            {rows.map(({ category, articles: rowArticles }) => (
              <CategoryRow key={category.id} category={category} articles={rowArticles} />
            ))}
          </div>
        )}

        <div className="mt-12 lg:mt-16">
          <SubscribeSection />
        </div>
      </div>
    </main>
  );
};

export default BlogPage;
