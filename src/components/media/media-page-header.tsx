import { ArrowLeft, ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

const MediaPageHeader = ({
  title,
  description,
  count,
  countLabel,
}: {
  title: string;
  description: string;
  count: number;
  countLabel: string;
}) => (
  <>
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
        <li>
          <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
            <Home size={14} aria-hidden="true" /> Home
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={13} className="text-[#a8b6d4]" />
        </li>
        <li>
          <Link to="/media-news" className="transition hover:text-[#0b3fc4]">
            Media &amp; News
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight size={13} className="text-[#a8b6d4]" />
        </li>
        <li className="font-bold text-[#0f1e57]" aria-current="page">
          {title}
        </li>
      </ol>
    </nav>

    <header className="rounded-2xl border border-[#dce7fb] bg-[#f2f6fe] px-5 py-6 sm:px-7 sm:py-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#0f1e57] sm:text-[30px]">{title}</h1>
          <p className="mt-2 max-w-2xl text-xs leading-6 text-[#63739a] sm:text-sm">{description}</p>
          <p className="mt-2 text-xs font-bold text-[#0b3fc4]">
            {count} {countLabel}
          </p>
        </div>

        <Link
          to="/media-news"
          className="inline-flex min-h-10 w-fit shrink-0 items-center gap-2 rounded-lg border border-[#cfe0fb] bg-white px-4 text-xs font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
        >
          <ArrowLeft size={15} aria-hidden="true" /> Back to Media &amp; News
        </Link>
      </div>
    </header>
  </>
);

export default MediaPageHeader;
