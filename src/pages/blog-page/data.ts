import DOMPurify from "dompurify";
import { BrickWall, HardHat, Home, LucideIcon, Megaphone, Newspaper, ShieldCheck, TrendingUp, UserRound } from "lucide-react";
import { Blog, BlogCardCategory, BlogCategoryApi } from "../../types";

export type BlogCategory = {
  /** The category `slug` — also the `/blog/category/:categorySlug` route param. */
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  /** Pill shown on top of the article thumbnail. */
  badgeClassName: string;
  /** Tile behind the category icon in the "Explore by Category" strip. */
  iconClassName: string;
};

type CategoryStyle = Pick<BlogCategory, "icon" | "badgeClassName" | "iconClassName">;

/**
 * Icons and colours are chosen per category `slug`. The API does expose an
 * `icon_link`, but it is an absolute URL on a different host to the configured
 * storage root, so a local lucide icon is used instead. An unrecognised slug
 * falls back to the neutral style rather than being dropped.
 */
const CATEGORY_STYLES: Record<string, CategoryStyle> = {
  "hiring-workers": {
    icon: HardHat,
    badgeClassName: "bg-blue-50 text-blue-700 ring-blue-100",
    iconClassName: "bg-blue-50 text-blue-700",
  },
  "construction-services": {
    icon: BrickWall,
    badgeClassName: "bg-amber-50 text-amber-700 ring-amber-100",
    iconClassName: "bg-amber-50 text-amber-700",
  },
  "worker-stories": {
    icon: UserRound,
    badgeClassName: "bg-violet-50 text-violet-700 ring-violet-100",
    iconClassName: "bg-violet-50 text-violet-700",
  },
  "safety-compliance": {
    icon: ShieldCheck,
    badgeClassName: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    iconClassName: "bg-emerald-50 text-emerald-700",
  },
  "industry-trends": {
    icon: TrendingUp,
    badgeClassName: "bg-sky-50 text-sky-700 ring-sky-100",
    iconClassName: "bg-sky-50 text-sky-700",
  },
  announcements: {
    icon: Megaphone,
    badgeClassName: "bg-rose-50 text-rose-700 ring-rose-100",
    iconClassName: "bg-rose-50 text-rose-700",
  },
  "home-services": {
    icon: Home,
    badgeClassName: "bg-teal-50 text-teal-700 ring-teal-100",
    iconClassName: "bg-teal-50 text-teal-700",
  },
};

const DEFAULT_STYLE: CategoryStyle = {
  icon: Newspaper,
  badgeClassName: "bg-slate-100 text-slate-700 ring-slate-200",
  iconClassName: "bg-slate-100 text-slate-700",
};

/** Shown when a blog row carries no category at all. */
export const UNCATEGORISED: BlogCategory = {
  id: "uncategorised",
  label: "Articles",
  shortLabel: "Articles",
  description: "Updates and stories from the Dehatwala team.",
  ...DEFAULT_STYLE,
};

/**
 * Maps any category shape the API returns — the full `blog_categories` row from
 * `/get-blog-categories`, or the trimmed one nested on a blog card.
 */
export const toBlogCategory = (category: BlogCategoryApi | BlogCardCategory): BlogCategory => ({
  id: category.slug,
  label: category.name,
  // The strip has little room, so fall back to the first word on long names.
  shortLabel: category.name.length > 14 ? category.name.split(" ")[0] : category.name,
  description: "description" in category ? (category.description ?? "") : "",
  ...(CATEGORY_STYLES[category.slug] ?? DEFAULT_STYLE),
});

export const stripMarkup = (value: string | null | undefined) =>
  value ? DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).replace(/\s+/g, " ").trim() : "";

/** The detail endpoint still returns a full row, so its category is resolved here. */
export const resolveCategory = (blog: Blog): BlogCategory =>
  blog.category ? toBlogCategory(blog.category) : UNCATEGORISED;

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
