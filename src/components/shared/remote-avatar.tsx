import { useState } from "react";

import { VITE_IMAGE_PATH_URL } from "../../react-query/constants";

/**
 * A person's photo from the API, falling back to their initials.
 *
 * Two things bite when building these URLs by hand, and both are handled here
 * so callers cannot forget either:
 *
 *  - Uploaded filenames contain spaces and brackets ("image-5-1 (1).jpg"),
 *    which do not survive being dropped into a URL raw.
 *  - Plenty of rows reference files that were never uploaded, so a missing
 *    image has to degrade to initials rather than a broken-image icon.
 */
type RemoteAvatarProps = {
  /** Storage folder, e.g. "client" or "labour". */
  folder: string;
  /** Bare filename from the API row. */
  file?: string | null;
  /** Used for the initials, and for the alt text. */
  name?: string | null;
  className: string;
  /** Applied to the initials circle instead of `className`'s image styling. */
  fallbackClassName: string;
};

const initialsOf = (name?: string | null) =>
  (name ?? "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase() || "?";

const RemoteAvatar = ({ folder, file, name, className, fallbackClassName }: RemoteAvatarProps) => {
  const [failed, setFailed] = useState(false);

  if (!file || failed) {
    return <span className={fallbackClassName}>{initialsOf(name)}</span>;
  }

  return (
    <img
      src={`${VITE_IMAGE_PATH_URL}/${folder}/${encodeURIComponent(file)}`}
      alt={name ? `${name}` : ""}
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
};

export default RemoteAvatar;
