import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";
import { Blog } from "../../types";
import {
  BlogCategory,
  estimateReadTime,
  isFeaturedBlog,
  resolveCategory,
  stripMarkup,
} from "../../pages/blog-page/data";

export type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image: string;
  category: BlogCategory;
  readTime: number;
  publishedAt: string;
  updatedAt: string;
  pinned: boolean;
};

/** Maps a DB blog row onto the shape the article cards render. */
export const toArticle = (blog: Blog): Article => ({
  id: blog.id,
  title: blog.title,
  slug: blog.slug,
  excerpt: stripMarkup(blog.short_description),
  image: `${VITE_IMAGE_PATH_URL}/blog/${blog.blogimg}`,
  category: resolveCategory(blog),
  readTime: estimateReadTime(blog),
  publishedAt: blog.created_at,
  updatedAt: blog.updated_at,
  pinned: isFeaturedBlog(blog),
});
