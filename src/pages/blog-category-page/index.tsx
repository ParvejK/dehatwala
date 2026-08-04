import { useMemo, useState } from "react";
import { ArrowLeft, ChevronRight, Home, Search, X } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { ArticleCard } from "../../components/blog/article";
import { toArticle } from "../../components/blog/article-model";
import { useBlogs } from "../../react-query/hooks";
import { BLOG_CATEGORIES } from "../blog-page/data";

const CategorySkeleton = () => (
  <div role="status" aria-live="polite" className="grid gap-4 motion-safe:animate-pulse sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="aspect-[16/10] bg-slate-200" />
        <div className="space-y-3 p-4">
          <div className="h-5 w-24 rounded-md bg-blue-100" />
          <div className="h-4 w-full rounded bg-slate-200" />
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/2 rounded-full bg-slate-100" />
        </div>
      </div>
    ))}
    <span className="sr-only">Loading articles…</span>
  </div>
);

const BlogCategoryPage = () => {
  const { categorySlug } = useParams();
  const blogsQuery = useBlogs();
  const [search, setSearch] = useState("");

  const category = BLOG_CATEGORIES.find((item) => item.id === categorySlug);

  const articles = useMemo(
    () =>
      (blogsQuery.data?.blogs ?? [])
        .map(toArticle)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    [blogsQuery.data],
  );

  const counts = useMemo(
    () =>
      articles.reduce<Record<string, number>>((total, article) => {
        total[article.category.id] = (total[article.category.id] ?? 0) + 1;
        return total;
      }, {}),
    [articles],
  );

  const query = search.trim().toLowerCase();

  const categoryArticles = useMemo(
    () =>
      articles
        .filter((article) => article.category.id === categorySlug)
        .filter(
          (article) =>
            query.length === 0 ||
            article.title.toLowerCase().includes(query) ||
            article.excerpt.toLowerCase().includes(query),
        ),
    [articles, categorySlug, query],
  );

  if (!category) {
    return (
      <main className="bg-white pb-16 pt-8">
        <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">Category not found</h1>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">
              This blog category does not exist. Browse all articles instead.
            </p>
            <Link
              to="/blog"
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-bold text-white transition hover:bg-blue-800"
            >
              <ArrowLeft size={17} aria-hidden="true" /> Back to blog
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const Icon = category.icon;
  const total = counts[category.id] ?? 0;

  return (
    <main className="bg-white pb-16 pt-6 text-slate-950 sm:pt-8">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500 sm:text-[13px]">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-blue-700">
                <Home size={14} aria-hidden="true" /> Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} className="text-slate-300" />
            </li>
            <li>
              <Link to="/blog" className="transition hover:text-blue-700">
                Blog
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} className="text-slate-300" />
            </li>
            <li className="font-bold text-slate-900" aria-current="page">
              {category.label}
            </li>
          </ol>
        </nav>

        {/* ---------- Category header ---------- */}
        <header className="rounded-3xl border border-blue-100 bg-[var(--home-color-surface-tint)] p-5 sm:p-7">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <span className={`grid size-14 shrink-0 place-items-center rounded-2xl ${category.iconClassName}`}>
                <Icon size={26} aria-hidden="true" />
              </span>
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{category.label}</h1>
                <p className="mt-2 max-w-2xl text-sm font-normal leading-6 text-slate-600">{category.description}</p>
                <p className="mt-2 text-xs font-semibold text-blue-700">
                  {total} {total === 1 ? "article" : "articles"}
                </p>
              </div>
            </div>

            <label className="flex w-full items-center gap-2 rounded-xl border border-slate-200 bg-white p-1.5 pl-4 shadow-sm focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-100 lg:w-80">
              <Search size={17} className="shrink-0 text-slate-400" aria-hidden="true" />
              <span className="sr-only">Search {category.label} articles</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder={`Search in ${category.shortLabel}`}
                className="h-9 w-full border-0 bg-transparent text-sm font-normal text-slate-900 outline-none placeholder:text-slate-400"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={15} aria-hidden="true" />
                </button>
              )}
            </label>
          </div>
        </header>

        {/* ---------- Sibling categories ---------- */}
        <nav aria-label="Blog categories" className="mt-5 flex flex-wrap gap-2">
          <Link
            to="/blog"
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-600 transition hover:border-blue-200 hover:text-blue-700"
          >
            <ArrowLeft size={14} aria-hidden="true" /> All articles
          </Link>

          {BLOG_CATEGORIES.map((item) => {
            const isActive = item.id === category.id;
            return (
              <Link
                key={item.id}
                to={`/blog/category/${item.id}`}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-4 text-xs font-semibold transition ${
                  isActive
                    ? "border-blue-700 bg-blue-700 text-white"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                }`}
              >
                {item.label}
                <span className={isActive ? "text-blue-100" : "text-slate-400"}>{counts[item.id] ?? 0}</span>
              </Link>
            );
          })}
        </nav>

        {/* ---------- Articles ---------- */}
        <section aria-label={`${category.label} articles`} className="mt-7">
          {blogsQuery.isLoading && <CategorySkeleton />}

          {blogsQuery.isError && (
            <p
              role="alert"
              className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm font-medium text-red-700"
            >
              Articles could not be loaded right now. Please try again shortly.
            </p>
          )}

          {!blogsQuery.isLoading && !blogsQuery.isError && categoryArticles.length === 0 && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-14 text-center">
              <h2 className="text-lg font-bold tracking-tight text-slate-950">
                {query ? "No matching articles" : "No articles here yet"}
              </h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
                {query
                  ? `Nothing in ${category.label} matches “${search.trim()}”.`
                  : `We have not published anything under ${category.label} yet. Check back soon.`}
              </p>
              {query && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
                >
                  Clear search
                </button>
              )}
            </div>
          )}

          {categoryArticles.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {categoryArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default BlogCategoryPage;
