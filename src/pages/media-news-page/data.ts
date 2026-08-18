import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";

/** Detail route for a coverage article. */
export const mediaArticlePath = (slug: string) => `/media-news/news/${slug}`;

/** Placeholder hrefs must not render as outbound links. */
export const isRealUrl = (url?: string | null) => !!url && /^https?:\/\//i.test(url);

/**
 * A placeholder rather than "" when the row has no image: an empty `src` makes
 * the browser re-request the current page, which is both a wasted round trip
 * and a broken-looking box.
 */
const FALLBACK = "/images/services/loading-material-handling/hero.jpg";

export const mediaImage = (filename?: string | null) =>
  filename ? `${VITE_IMAGE_PATH_URL}/media/${encodeURIComponent(filename)}` : FALLBACK;

export const publicationLogo = (filename?: string | null) =>
  filename ? `${VITE_IMAGE_PATH_URL}/publication/${encodeURIComponent(filename)}` : FALLBACK;

export const formatMediaDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

/** The admin stores either a bare number ("2") or a full phrase ("2 min read"). */
export const formatReadTime = (value?: string | null) => {
  const trimmed = value?.trim();
  if (!trimmed) return "";
  return /^\d+$/.test(trimmed) ? `${trimmed} min read` : trimmed;
};

/** Body copy is one paragraph per line; `body_list` is the pre-split form. */
export const toParagraphs = (raw?: string | null, preParsed?: string[] | null): string[] => {
  if (preParsed?.length) return preParsed.map((item) => item.trim()).filter(Boolean);

  return (raw ?? "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
};
