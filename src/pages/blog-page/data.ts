import DOMPurify from "dompurify";
import { BrickWall, HardHat, Home, LucideIcon, Megaphone, ShieldCheck, TrendingUp, UserRound } from "lucide-react";
import { Blog } from "../../types";

export type BlogCategory = {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  /** Pill shown on top of the article thumbnail. */
  badgeClassName: string;
  /** Tile behind the category icon in the "Explore by Category" strip. */
  iconClassName: string;
  /** `category_id` values coming from the API that map to this category. */
  legacyIds: number[];
  /** Used to resolve a category while the API does not return one. */
  keywords: string[];
  /** Lower wins when two categories score the same. */
  matchPriority: number;
};

/** Order follows the design: it drives the category strip and the category rows. */
export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    id: "hiring-workers",
    label: "Hiring Workers",
    shortLabel: "Hiring",
    description: "Find, compare and hire the right worker for your requirement.",
    icon: HardHat,
    badgeClassName: "bg-blue-50 text-blue-700 ring-blue-100",
    iconClassName: "bg-blue-50 text-blue-700",
    legacyIds: [1],
    keywords: [
      "hire",
      "hiring",
      "recruit",
      "manpower",
      "staffing",
      "mason",
      "plumber",
      "electrician",
      "painter",
      "carpenter",
      "helper",
    ],
    matchPriority: 5,
  },
  {
    id: "construction-services",
    label: "Construction Services",
    shortLabel: "Services",
    description: "How construction work is planned, priced and executed on site.",
    icon: BrickWall,
    badgeClassName: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    iconClassName: "bg-emerald-50 text-emerald-700",
    legacyIds: [2],
    keywords: [
      "construction",
      "brick",
      "plaster",
      "rcc",
      "tiling",
      "cement",
      "concrete",
      "building",
      "architect",
      "renovation",
      "site work",
    ],
    matchPriority: 7,
  },
  {
    id: "worker-guide",
    label: "Worker Guide",
    shortLabel: "Worker",
    description: "Everything a Dehatwala worker needs, from registration to payouts.",
    icon: UserRound,
    badgeClassName: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    iconClassName: "bg-indigo-50 text-indigo-700",
    legacyIds: [3],
    keywords: [
      "register",
      "registration",
      "profile",
      "verified",
      "verification",
      "payout",
      "earning",
      "opportunit",
      "join dehatwala",
      "worker guide",
    ],
    matchPriority: 2,
  },
  {
    id: "safety-awareness",
    label: "Safety & Awareness",
    shortLabel: "Safety",
    description: "Site safety, protective gear and everyday risk awareness.",
    icon: ShieldCheck,
    badgeClassName: "bg-amber-50 text-amber-700 ring-amber-100",
    iconClassName: "bg-amber-50 text-amber-700",
    legacyIds: [4],
    keywords: [
      "safety",
      "safe",
      "hazard",
      "accident",
      "injury",
      "precaution",
      "protective",
      "helmet",
      "awareness",
      "emergency",
    ],
    matchPriority: 1,
  },
  {
    id: "customer-guide",
    label: "Customer Guide",
    shortLabel: "Customer",
    description: "Booking, pricing, rescheduling and everything after you book.",
    icon: Home,
    badgeClassName: "bg-sky-50 text-sky-700 ring-sky-100",
    iconClassName: "bg-sky-50 text-sky-700",
    legacyIds: [5],
    keywords: [
      "book a worker",
      "booking",
      "pricing",
      "charges",
      "refund",
      "cancellation",
      "reschedule",
      "customer",
      "invoice",
    ],
    matchPriority: 3,
  },
  {
    id: "workforce-insights",
    label: "Workforce Insights",
    shortLabel: "Insights",
    description: "Wages, labour market trends and the future of skilled work.",
    icon: TrendingUp,
    badgeClassName: "bg-violet-50 text-violet-700 ring-violet-100",
    iconClassName: "bg-violet-50 text-violet-700",
    legacyIds: [6],
    keywords: [
      "workforce",
      "labour market",
      "labour law",
      "labour",
      "wage",
      "salary",
      "trend",
      "industry",
      "insight",
      "future of work",
      "employment",
      "female",
      "women",
      "child labour",
      "law",
    ],
    matchPriority: 6,
  },
  {
    id: "dehatwala-updates",
    label: "Dehatwala Updates",
    shortLabel: "Updates",
    description: "Product updates, new cities and stories from our community.",
    icon: Megaphone,
    badgeClassName: "bg-rose-50 text-rose-700 ring-rose-100",
    iconClassName: "bg-rose-50 text-rose-700",
    legacyIds: [7],
    keywords: [
      "dehatwala",
      "new feature",
      "announcement",
      "launch",
      "expand",
      "community stories",
      "recognition",
      "milestone",
    ],
    matchPriority: 4,
  },
];

const DEFAULT_CATEGORY = BLOG_CATEGORIES[5];

const TITLE_WEIGHT = 3;
const SUMMARY_WEIGHT = 1;
const WORDS_PER_MINUTE = 200;

export const stripMarkup = (value: string | null | undefined) =>
  value ? DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).replace(/\s+/g, " ").trim() : "";

const parseTags = (tags: string | null) =>
  (tags ?? "")
    .split(/[,|]/)
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

const slugifyTag = (tag: string) => tag.replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

/**
 * The API does not expose blog categories yet, so a category is resolved from
 * `category_id` first, then `tags`, and finally from the article wording.
 * Once the backend sends real categories, only `legacyIds` needs updating.
 */
export const resolveCategory = (blog: Blog): BlogCategory => {
  if (blog.category_id !== null) {
    const byId = BLOG_CATEGORIES.find((category) => category.legacyIds.includes(blog.category_id as number));
    if (byId) return byId;
  }

  const tags = parseTags(blog.tags);
  if (tags.length > 0) {
    const byTag = BLOG_CATEGORIES.find((category) =>
      tags.some((tag) => slugifyTag(tag) === category.id || tag === category.label.toLowerCase()),
    );
    if (byTag) return byTag;
  }

  const title = blog.title.toLowerCase();
  const summary = stripMarkup(blog.short_description).toLowerCase();

  let best = DEFAULT_CATEGORY;
  let bestScore = 0;

  for (const category of BLOG_CATEGORIES) {
    const score = category.keywords.reduce(
      (total, keyword) =>
        total + (title.includes(keyword) ? TITLE_WEIGHT : 0) + (summary.includes(keyword) ? SUMMARY_WEIGHT : 0),
      0,
    );

    if (score > bestScore || (score === bestScore && score > 0 && category.matchPriority < best.matchPriority)) {
      best = category;
      bestScore = score;
    }
  }

  return best;
};

/** A blog can be pinned to the top of the page with a `featured` tag from the CMS. */
export const isFeaturedBlog = (blog: Blog) => parseTags(blog.tags).includes("featured");

export const estimateReadTime = (blog: Blog) => {
  const words = stripMarkup(blog.description).split(" ").filter(Boolean).length;
  return Math.max(2, Math.round(words / WORDS_PER_MINUTE));
};

export const formatDate = (date: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(date));
