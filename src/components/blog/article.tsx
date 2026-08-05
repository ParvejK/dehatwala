import { CalendarDays, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import { BlogCategory, formatDate } from "../../pages/blog-page/data";
import { Article } from "./article-model";

export const CategoryBadge = ({ category }: { category: BlogCategory }) => (
  <span
    className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-semibold leading-none ring-1 ${category.badgeClassName}`}
  >
    {category.label}
  </span>
);

export const ArticleMeta = ({ article, className = "" }: { article: Article; className?: string }) => (
  <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-normal text-slate-500 ${className}`}>
    <span className="inline-flex items-center gap-1.5">
      <Clock3 size={14} aria-hidden="true" /> {article.readTime}
    </span>
    <span className="hidden text-slate-300 sm:inline" aria-hidden="true">
      •
    </span>
    <time dateTime={article.publishedAt} className="inline-flex items-center gap-1.5">
      <CalendarDays size={14} className="sm:hidden" aria-hidden="true" />
      {formatDate(article.publishedAt)}
    </time>
  </div>
);

export const ArticleCard = ({ article }: { article: Article }) => (
  <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-[0_20px_50px_rgba(15,23,42,0.1)]">
    <Link
      to={`/blog/${article.slug}`}
      tabIndex={-1}
      aria-hidden="true"
      className="relative block aspect-[16/10] overflow-hidden bg-slate-100"
    >
      <img
        src={article.image}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
      />
    </Link>

    <div className="flex flex-1 flex-col gap-3 p-4">
      <CategoryBadge category={article.category} />
      <h3 className="text-[15px] font-bold leading-6 tracking-tight text-slate-950">
        <Link
          to={`/blog/${article.slug}`}
          className="line-clamp-2 transition hover:text-blue-700 focus:outline-none focus-visible:rounded focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          {article.title}
        </Link>
      </h3>
      <ArticleMeta article={article} className="mt-auto border-t border-slate-100 pt-3" />
    </div>
  </article>
);
