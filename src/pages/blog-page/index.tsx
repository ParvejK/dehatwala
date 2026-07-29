import { ArrowRight, ArrowUpRight, BookOpen, CalendarDays, RefreshCw, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { useBlogs } from "../../react-query/hooks";

type BlogArticle = NonNullable<ReturnType<typeof useBlogs>["data"]>["blogs"][number];

const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date));

const ArticleCard = ({ blog, featured = false }: { blog: BlogArticle; featured?: boolean }) => {
  const articleUrl = `/blog/${blog.slug}`;

  if (featured) {
    return (
      <article className="group overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl shadow-blue-950/[0.07]">
        <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
          <Link
            to={articleUrl}
            className="relative block min-h-72 overflow-hidden bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-400 sm:min-h-96 lg:min-h-[31rem]"
            aria-label={`Read ${blog.title}`}
          >
            <img
              src={`${VITE_IMAGE_PATH_URL}/blog/${blog.blogimg}`}
              alt=""
              className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.035]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 via-transparent to-transparent" />
            <span className="absolute left-5 top-5 inline-flex items-center gap-2 rounded-full bg-white/95 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.16em] text-blue-700 shadow-lg backdrop-blur">
              <Sparkles size={14} aria-hidden="true" /> Featured story
            </span>
          </Link>

          <div className="flex flex-col justify-between p-7 sm:p-9 lg:p-10">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-slate-500">
                <CalendarDays size={15} className="text-blue-600" aria-hidden="true" />
                <time dateTime={blog.created_at}>{formatDate(blog.created_at)}</time>
              </div>
              <h2 className="mt-6 text-2xl font-extrabold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
                <Link
                  to={articleUrl}
                  className="transition hover:text-blue-700 focus:outline-none focus-visible:rounded focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  {blog.title}
                </Link>
              </h2>
              <p className="mt-5 line-clamp-4 text-base leading-7 text-slate-600">{blog.short_description}</p>
            </div>
            <Link
              to={articleUrl}
              className="mt-9 inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            >
              Read article <ArrowRight size={17} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.07]">
      <Link
        to={articleUrl}
        className="relative block aspect-[16/10] overflow-hidden bg-slate-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-400"
        aria-label={`Read ${blog.title}`}
      >
        <img
          src={`${VITE_IMAGE_PATH_URL}/blog/${blog.blogimg}`}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/20 via-transparent to-transparent opacity-70" />
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <time
            dateTime={blog.created_at}
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500"
          >
            <CalendarDays size={14} className="text-blue-600" aria-hidden="true" />
            {formatDate(blog.created_at)}
          </time>
          <span className="grid size-9 place-items-center rounded-full bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
            <ArrowUpRight size={17} aria-hidden="true" />
          </span>
        </div>
        <h2 className="mt-5 line-clamp-2 text-xl font-extrabold leading-7 tracking-tight text-slate-950">
          <Link
            to={articleUrl}
            className="transition hover:text-blue-700 focus:outline-none focus-visible:rounded focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            {blog.title}
          </Link>
        </h2>
        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">{blog.short_description}</p>
        <Link
          to={articleUrl}
          className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-extrabold text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:rounded focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          Continue reading <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
};

const BlogSkeleton = () => (
  <div role="status" aria-live="polite" aria-label="Loading articles" className="motion-safe:animate-pulse">
    <div className="overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl shadow-blue-950/[0.05]">
      <div className="grid lg:grid-cols-[1.18fr_0.82fr]">
        <div className="relative min-h-72 overflow-hidden bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50 sm:min-h-96 lg:min-h-[31rem]">
          <div className="absolute left-5 top-5 h-8 w-36 rounded-full border border-white/80 bg-white/75 shadow-sm" />
          <div className="absolute -bottom-16 -right-16 size-48 rounded-full border-[32px] border-white/30" />
        </div>
        <div className="flex min-h-[24rem] flex-col justify-between p-7 sm:p-9 lg:min-h-0 lg:p-10">
          <div>
            <div className="flex items-center gap-3">
              <div className="size-4 rounded-md bg-blue-100" />
              <div className="h-3 w-32 rounded-full bg-slate-200" />
            </div>
            <div className="mt-7 space-y-3">
              <div className="h-8 w-full rounded-lg bg-slate-200 sm:h-9" />
              <div className="h-8 w-4/5 rounded-lg bg-slate-200 sm:h-9" />
              <div className="h-8 w-2/3 rounded-lg bg-slate-100 sm:h-9" />
            </div>
            <div className="mt-7 space-y-3">
              <div className="h-4 w-full rounded-full bg-slate-100" />
              <div className="h-4 w-11/12 rounded-full bg-slate-100" />
              <div className="h-4 w-3/4 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="mt-9 h-12 w-36 rounded-xl bg-blue-100" />
        </div>
      </div>
    </div>
    <div className="mt-16 lg:mt-20">
      <div className="mb-9 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="h-3 w-28 rounded-full bg-blue-100" />
          <div className="h-9 w-64 max-w-full rounded-lg bg-slate-200" />
        </div>
        <div className="space-y-2 sm:w-80">
          <div className="h-3 w-full rounded-full bg-slate-100" />
          <div className="h-3 w-4/5 rounded-full bg-slate-100 sm:ml-auto" />
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm"
          >
            <div className="aspect-[16/10] bg-gradient-to-br from-blue-100 via-slate-100 to-blue-50" />
            <div className="flex flex-1 flex-col p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <div className="size-3.5 rounded bg-blue-100" />
                  <div className="h-3 w-28 rounded-full bg-slate-200" />
                </div>
                <div className="size-9 rounded-full bg-blue-50" />
              </div>
              <div className="mt-5 space-y-2.5">
                <div className="h-6 w-full rounded-md bg-slate-200" />
                <div className="h-6 w-4/5 rounded-md bg-slate-200" />
              </div>
              <div className="mt-4 space-y-2">
                <div className="h-3.5 w-full rounded-full bg-slate-100" />
                <div className="h-3.5 w-11/12 rounded-full bg-slate-100" />
                <div className="h-3.5 w-2/3 rounded-full bg-slate-100" />
              </div>
              <div className="mt-7 h-4 w-32 rounded-full bg-blue-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
    <span className="sr-only">Loading the latest blog articles…</span>
  </div>
);

const BlogPage = () => {
  const blogsQuery = useBlogs();
  const blogs = blogsQuery.data?.blogs ?? [];
  const [featuredBlog, ...otherBlogs] = blogs;

  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="relative isolate overflow-hidden bg-[var(--home-color-brand-deep)] pb-28 pt-16 text-white sm:pt-20 lg:pb-36 lg:pt-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.055] [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:64px_64px]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-32 -top-32 -z-10 size-[32rem] rounded-full border-[88px] border-blue-500/10"
          aria-hidden="true"
        />
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-20 lg:px-10">
          <div>
            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.28em] text-blue-300">
              <span className="h-px w-10 bg-blue-400" aria-hidden="true" />
              The field notes
            </p>
            <h1 className="mt-7 max-w-4xl text-4xl font-black leading-[1.04] tracking-[-0.04em] sm:text-5xl lg:text-7xl">
              Work, skills and the future of <span className="text-blue-300">building.</span>
            </h1>
          </div>

          <div className="lg:pb-2">
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              Clear, useful perspectives on construction, skilled work, safer sites, and the people shaping the
              industry.
            </p>
            <div className="mt-8 grid grid-cols-3 border-y border-white/15 py-5">
              {["Site insights", "Skilled work", "Industry ideas"].map((topic, index) => (
                <span
                  key={topic}
                  className={`text-xs font-bold leading-5 text-slate-300 sm:text-sm ${
                    index > 0 ? "border-l border-white/15 pl-4 sm:pl-5" : ""
                  }`}
                >
                  <span className="mb-1 block text-[10px] font-black tracking-[0.18em] text-blue-400">0{index + 1}</span>
                  {topic}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-12 pb-16 lg:-mt-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {blogsQuery.isPending && <BlogSkeleton />}

          {blogsQuery.isError && (
            <div
              role="alert"
              className="mx-auto max-w-xl rounded-[2rem] border border-red-200 bg-red-50 p-8 text-center"
            >
              <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-white text-red-600 shadow-sm">
                <RefreshCw size={22} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-xl font-extrabold text-slate-950">We couldn’t load the journal</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                The articles are temporarily unavailable. Please check your connection and try again.
              </p>
              <button
                type="button"
                onClick={() => blogsQuery.refetch()}
                className="mt-6 inline-flex min-h-12 items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
              >
                <RefreshCw size={17} aria-hidden="true" /> Try again
              </button>
            </div>
          )}

          {blogsQuery.isSuccess && blogs.length === 0 && (
            <div className="mx-auto max-w-xl rounded-[2rem] border border-blue-100 bg-[var(--home-color-surface-soft)] p-8 text-center sm:p-10">
              <span className="mx-auto grid size-14 place-items-center rounded-2xl bg-white text-blue-700 shadow-sm">
                <BookOpen size={25} aria-hidden="true" />
              </span>
              <h2 className="mt-5 text-2xl font-extrabold">Stories are on the way</h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                We’re preparing useful ideas and field insights. Please check back soon.
              </p>
            </div>
          )}

          {blogsQuery.isSuccess && featuredBlog && (
            <>
              <ArticleCard blog={featuredBlog} featured />

              {otherBlogs.length > 0 && (
                <div className="mt-16 lg:mt-20">
                  <div className="mb-9 flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-700">Latest insights</p>
                      <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">More from the journal</h2>
                    </div>
                    <p className="max-w-md text-sm leading-6 text-slate-600 sm:text-right">
                      Explore practical guidance, industry perspectives, and stories from the field.
                    </p>
                  </div>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {otherBlogs.map((blog) => (
                      <ArticleCard key={blog.id} blog={blog} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default BlogPage;
