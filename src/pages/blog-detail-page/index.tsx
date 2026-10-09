import { ArrowLeft, ArrowRight, CalendarDays, ChevronRight, Clock3, Home, RefreshCw, Tag } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { CategoryBadge } from "../../components/blog/article";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { useSingleBlog } from "../../react-query/hooks";
import { Blog } from "../../types";
import { formatDate, resolveCategory, stripMarkup } from "../blog-page/data";

/** `tags` is stored either as a JSON array of {value} or as a comma-separated string. */
const parseTags = (tags: string | null | undefined): string[] => {
  if (!tags) return [];
  try {
    const parsed = JSON.parse(tags);
    if (Array.isArray(parsed)) {
      return parsed
        .map((tag) => (typeof tag === "string" ? tag : (tag?.value ?? "")))
        .map((tag) => String(tag).trim())
        .filter(Boolean);
    }
  } catch {
    // Not JSON — fall through to the comma-separated form.
  }
  return tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
};

const DetailSkeleton = () => (
  <main className="bg-white pb-16 pt-6 sm:pt-8">
    <div className="mx-auto w-full max-w-7xl animate-pulse px-5 sm:px-8 lg:px-10">
      <div className="h-4 w-64 rounded bg-slate-200" />
      <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,20rem)]">
        <div className="space-y-5">
          <div className="h-6 w-32 rounded-md bg-blue-100" />
          <div className="h-10 w-full rounded-lg bg-slate-200" />
          <div className="h-10 w-3/4 rounded-lg bg-slate-200" />
          <div className="aspect-[16/9] rounded-2xl bg-slate-200" />
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
          <div className="h-4 w-4/6 rounded bg-slate-100" />
        </div>
        <div className="h-80 rounded-2xl bg-slate-100" />
      </div>
    </div>
  </main>
);

const NotFound = ({ message }: { message: string }) => (
  <main className="bg-white pb-16 pt-8">
    <div className="mx-auto w-full max-w-3xl px-5 text-center sm:px-8">
      <div className="rounded-3xl border border-slate-200 bg-slate-50 px-6 py-16">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">Article not found</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-600">{message}</p>
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

/** `recent_blogs` are full rows from the detail endpoint, not `/get-blogs` cards. */
const RecentCard = ({ blog }: { blog: Blog }) => {
  const article = {
    slug: blog.slug,
    title: blog.title,
    image: `${VITE_IMAGE_PATH_URL}/blog/${blog.blogimg}`,
    publishedAt: blog.created_at,
  };

  return (
    <li>
      <Link
        to={`/blog/${article.slug}`}
        className="group flex gap-3 rounded-xl border border-transparent p-2 transition hover:border-blue-100 hover:bg-blue-50/40 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
      >
        <span className="relative block size-16 shrink-0 overflow-hidden rounded-lg bg-slate-100">
          <img
            src={article.image}
            alt=""
            loading="lazy"
            className="size-full object-cover transition duration-500 group-hover:scale-105"
          />
        </span>
        <span className="min-w-0">
          <span className="line-clamp-2 block text-[13px] font-bold leading-5 text-slate-900 transition group-hover:text-blue-700">
            {article.title}
          </span>
          <span className="mt-1 block text-[11px] font-normal text-slate-500">{formatDate(article.publishedAt)}</span>
        </span>
      </Link>
    </li>
  );
};

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { data, isLoading, isError, error } = useSingleBlog(slug ?? "");

  if (isLoading) return <DetailSkeleton />;
  if (isError) return <NotFound message={error?.message ?? "We could not load this article."} />;

  const blog = data?.blog;
  if (!blog) return <NotFound message="This article is not available or may have been removed." />;

  const category = resolveCategory(blog);
  const readTime = blog.read_time;
  const tags = parseTags(blog.tags);
  const recent = (data?.recent_blogs ?? []).filter((item) => item.slug !== blog.slug);
  const excerpt = stripMarkup(blog.short_description);
  const wasUpdated = blog.updated_at && blog.updated_at !== blog.created_at;

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
            <li>
              <Link to={`/blog/category/${category.id}`} className="transition hover:text-blue-700">
                {category.label}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} className="text-slate-300" />
            </li>
            <li className="line-clamp-1 font-bold text-slate-900" aria-current="page">
              {blog.title}
            </li>
          </ol>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(300px,20rem)] lg:gap-10">
          {/* ---------- Article ---------- */}
          <article>
            <CategoryBadge category={category} />

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-4xl">
              {blog.title}
            </h1>

            {excerpt && <p className="mt-4 text-base font-normal leading-7 text-slate-600">{excerpt}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 border-y border-slate-100 py-3 text-xs font-normal text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={14} aria-hidden="true" /> {readTime}
              </span>
              <time dateTime={blog.created_at} className="inline-flex items-center gap-1.5">
                <CalendarDays size={14} aria-hidden="true" /> Published {formatDate(blog.created_at)}
              </time>
              {wasUpdated && (
                <time dateTime={blog.updated_at} className="inline-flex items-center gap-1.5">
                  <RefreshCw size={14} aria-hidden="true" /> Updated {formatDate(blog.updated_at)}
                </time>
              )}
            </div>

            {blog.blogimg && (
              <figure className="mt-6 overflow-hidden rounded-2xl bg-slate-100">
                <img
                  src={`${VITE_IMAGE_PATH_URL}/blog/${blog.blogimg}`}
                  alt={blog.title}
                  className="h-auto w-full object-cover"
                />
              </figure>
            )}

            {blog.description && (
              <div
                className="prose prose-slate mt-7 max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-700 prose-img:rounded-xl"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            )}

            {tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <Tag size={14} aria-hidden="true" /> Tags
                </span>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/blog"
                className="inline-flex min-h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:text-blue-700"
              >
                <ArrowLeft size={16} aria-hidden="true" /> Back to blog
              </Link>
              <Link
                to={`/blog/category/${category.id}`}
                className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-5 text-sm font-bold text-white transition hover:bg-blue-800"
              >
                More in {category.shortLabel} <ArrowRight size={16} aria-hidden="true" />
              </Link>
            </div>
          </article>

          {/* ---------- Sidebar ---------- */}
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {blog.category?.name && (
              <section className="rounded-2xl border border-blue-100 bg-[var(--home-color-surface-tint)] p-5">
                <h2 className="text-sm font-bold tracking-tight text-slate-950">Category</h2>
                <p className="mt-2 text-sm font-semibold text-blue-700">{blog.category.name}</p>
                {blog.category.description && (
                  <p className="mt-1.5 text-xs font-normal leading-5 text-slate-600">{blog.category.description}</p>
                )}
              </section>
            )}

            {recent.length > 0 && (
              <section className="rounded-2xl border border-slate-200 bg-white p-5">
                <h2 className="text-sm font-bold tracking-tight text-slate-950">Recent Articles</h2>
                <ul className="mt-3 space-y-1">
                  {recent.map((item) => (
                    <RecentCard key={item.id} blog={item} />
                  ))}
                </ul>
              </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5">
              <h2 className="text-sm font-bold tracking-tight text-slate-950">Browse by Category</h2>
              <Link
                to="/blog"
                className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 transition hover:text-blue-900"
              >
                View all articles <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default BlogDetailPage;
