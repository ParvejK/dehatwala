import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { API_URL } from "./constants";

export type SeoMeta = {
  title: string | null;
  description: string | null;
  keywords: string | null;
  canonical: string | null;
  robots: string | null;
  og: {
    title: string | null;
    description: string | null;
    /** Bare filename — build with `${VITE_IMAGE_PATH_URL}/seo/${image}`. */
    image: string | null;
    type: string | null;
    site_name: string | null;
  } | null;
  /** False when the URL resolved to nothing real, e.g. a dead slug. */
  matched: boolean;
};

/**
 * SEO tags for one URL path.
 *
 * `staleTime: Infinity` gives the per-path, per-session cache the contract asks
 * for: each path is fetched once and reused for the rest of the visit, since
 * these values change rarely.
 */
export const useSeo = (path: string) =>
  useQuery<SeoMeta | null, Error>({
    queryKey: ["seo", path],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/seo`, { params: { path } });
      return (data?.seo as SeoMeta) ?? null;
    },
    enabled: !!path,
    staleTime: Infinity,
    gcTime: Infinity,
    // A failed SEO lookup must never blank the page's tags or trip the
    // not-found branch, so it is not retried into a hard failure state.
    retry: 1,
  });

/**
 * The site-wide fallback, taken from the home record.
 *
 * Fetched once per session and reused, so a page with no SEO record of its own
 * still gets a real title and description rather than a bare site name. The
 * values still come from admin — nothing is authored in the frontend.
 */
export const useSeoDefaults = () =>
  useQuery<SeoMeta | null, Error>({
    queryKey: ["seo", "key:home"],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/seo`, { params: { key: "home" } });
      return (data?.seo as SeoMeta) ?? null;
    },
    staleTime: Infinity,
    gcTime: Infinity,
    retry: 1,
  });

/**
 * Fills a page's empty SEO fields from the site defaults.
 *
 * `canonical` is deliberately never inherited. It is the one field where
 * falling back is actively harmful: pointing every thin page at the homepage's
 * canonical tells Google those URLs are duplicates of the homepage and drops
 * them from the index. A page keeps its own canonical or has none.
 *
 * `og.type` is likewise left alone — the API derives it from the kind of page,
 * so "article" must not be overwritten with the homepage's "website".
 */
export const withSeoDefaults = (
  page: SeoMeta | null | undefined,
  defaults: SeoMeta | null | undefined
): SeoMeta | null => {
  if (!page) return null;
  if (!defaults) return page;

  return {
    ...page,
    title: page.title || defaults.title,
    description: page.description || defaults.description,
    keywords: page.keywords || defaults.keywords,
    robots: page.robots || defaults.robots,
    canonical: page.canonical,
    og: {
      title: page.og?.title || defaults.og?.title || page.title || defaults.title,
      description: page.og?.description || defaults.og?.description || page.description || defaults.description,
      image: page.og?.image || defaults.og?.image,
      type: page.og?.type || defaults.og?.type,
      site_name: page.og?.site_name || defaults.og?.site_name,
    },
  };
};
