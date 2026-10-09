import { useEffect } from "react";

import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { SeoMeta } from "../../react-query/seo-api";

/**
 * Writes the API's SEO values into <head>.
 *
 * Done imperatively rather than with a helmet library: the project has no such
 * dependency, and the whole job is create-or-update a fixed list of tags.
 * Every tag this writes is marked `data-seo`, so a route change can clear
 * exactly what it added without touching the tags in index.html.
 */

const MARK = "data-seo";

/** Removes every tag a previous route added. */
const clearManaged = () => {
  document.head.querySelectorAll(`[${MARK}]`).forEach((node) => node.remove());
};

/**
 * Adds one meta/link tag. A null or empty value writes nothing at all — the
 * contract asks for the tag to be omitted rather than printed as "null".
 */
const setTag = (
  tag: "meta" | "link",
  attr: "name" | "property" | "rel",
  key: string,
  valueAttr: "content" | "href",
  value?: string | null
) => {
  if (!value) return;

  const node = document.createElement(tag);
  node.setAttribute(attr, key);
  node.setAttribute(valueAttr, value);
  node.setAttribute(MARK, "");
  document.head.appendChild(node);
};

const SeoHead = ({ seo }: { seo: SeoMeta | null | undefined }) => {
  useEffect(() => {
    if (!seo) return;

    clearManaged();

    if (seo.title) document.title = seo.title;

    const og = seo.og;
    // Bare filename from the API; skipped entirely when null so no empty
    // image URL is ever emitted.
    const ogImage = og?.image ? `${VITE_IMAGE_PATH_URL}/seo/${encodeURIComponent(og.image)}` : null;

    setTag("meta", "name", "description", "content", seo.description);
    setTag("meta", "name", "keywords", "content", seo.keywords);
    setTag("meta", "name", "robots", "content", seo.robots);
    setTag("link", "rel", "canonical", "href", seo.canonical);

    setTag("meta", "property", "og:title", "content", og?.title);
    setTag("meta", "property", "og:description", "content", og?.description);
    setTag("meta", "property", "og:type", "content", og?.type);
    setTag("meta", "property", "og:site_name", "content", og?.site_name);
    setTag("meta", "property", "og:url", "content", seo.canonical);
    setTag("meta", "property", "og:image", "content", ogImage);

    // Only meaningful alongside an image; without one the large-image card
    // degrades to a plain summary anyway.
    if (ogImage) setTag("meta", "name", "twitter:card", "content", "summary_large_image");
    setTag("meta", "name", "twitter:title", "content", og?.title);
    setTag("meta", "name", "twitter:description", "content", og?.description);
    setTag("meta", "name", "twitter:image", "content", ogImage);

    return clearManaged;
  }, [seo]);

  return null;
};

export default SeoHead;
