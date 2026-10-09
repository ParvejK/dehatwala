import { SquareArrowOutUpRight } from "lucide-react";
import { Link } from "react-router-dom";

import { isRealUrl, mediaArticlePath } from "../../pages/media-news-page/data";

type ArticleLinkIconProps = {
  slug: string;
  title: string;
  source: string;
  externalUrl: string;
};

/**
 * Corner action on a coverage card. Goes to the publisher once a real permalink
 * is set; until then it opens our own article page rather than a dead `#`.
 */
const ArticleLinkIcon = ({ slug, title, source, externalUrl }: ArticleLinkIconProps) => {
  const className =
    "shrink-0 text-[#0b3fc4] transition hover:text-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100";

  if (isRealUrl(externalUrl)) {
    return (
      <a
        href={externalUrl}
        target="_blank"
        rel="noreferrer"
        aria-label={`Read “${title}” on ${source} (opens in a new tab)`}
        className={className}
      >
        <SquareArrowOutUpRight size={16} aria-hidden="true" />
      </a>
    );
  }

  return (
    <Link to={mediaArticlePath(slug)} aria-label={`Read “${title}”`} className={className}>
      <SquareArrowOutUpRight size={16} aria-hidden="true" />
    </Link>
  );
};

export default ArticleLinkIcon;
