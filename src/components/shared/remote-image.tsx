import { useEffect, useState } from "react";

import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";

/** Used when a row has no image, or the file it names is not on the server. */
export const FALLBACK_IMAGE = "/images/services/loading-material-handling/hero.jpg";

/**
 * An image stored under `public/storage/<folder>/`.
 *
 * Most rows in the database name a file that is not actually on disk — the
 * category table alone references 62 images, none of which exist. Without a
 * fallback every one of those renders as a broken-image icon, so this component
 * swaps in a placeholder instead, and every caller gets that for free.
 *
 * Filenames are URL-encoded: they routinely contain spaces, and while browsers
 * cope with those, they do not cope with `#` or `?`.
 */
type RemoteImageProps = {
  /** Storage folder, e.g. "service", "category", "blog". */
  folder: string;
  /** Bare filename from the API row. */
  file?: string | null;
  alt: string;
  className?: string;
  /** Above the fold — skips lazy loading so it is not deferred. */
  priority?: boolean;
  fallback?: string;
};

const RemoteImage = ({ folder, file, alt, className, priority = false, fallback = FALLBACK_IMAGE }: RemoteImageProps) => {
  const src = file ? `${VITE_IMAGE_PATH_URL}/${folder}/${encodeURIComponent(file)}` : fallback;
  const [current, setCurrent] = useState(src);

  // A new row can arrive in the same mounted component — a carousel slide, or
  // a query refetch — so a previous failure must not stick to the new image.
  useEffect(() => setCurrent(src), [src]);

  return (
    <img
      src={current}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      // Guarded: if the fallback itself is missing, swapping again would loop.
      onError={() => setCurrent((now) => (now === fallback ? now : fallback))}
      className={className}
    />
  );
};

export default RemoteImage;
