import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { BlogCard } from "../../types";
import { BlogCategory, stripMarkup, toBlogCategory, UNCATEGORISED } from "../../pages/blog-page/data";

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: BlogCategory;
  /** Pre-formatted by the API, e.g. "5 min read". */
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  pinned: boolean;
};

/** Maps a card from `/get-blogs` onto the shape the article components render. */
export const toArticle = (card: BlogCard): Article => ({
  id: card.id,
  title: card.title,
  slug: card.slug,
  excerpt: stripMarkup(card.excerpt),
  image: `${VITE_IMAGE_PATH_URL}/blog/${card.image}`,
  category: card.category ? toBlogCategory(card.category) : UNCATEGORISED,
  readTime: card.read_time,
  publishedAt: card.published_at,
  updatedAt: card.updated_at,
  pinned: card.is_featured,
});
