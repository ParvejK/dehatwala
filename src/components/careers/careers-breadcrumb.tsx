import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

import { CAREERS_PATH } from "./data";

type Crumb = { label: string; to?: string };

/** Home › Careers › {current}. Omit `current` on the careers landing page. */
const CareersBreadcrumb = ({ current }: { current?: string }) => {
  const crumbs: Crumb[] = [
    { label: "Home", to: "/" },
    { label: "Careers", to: current ? CAREERS_PATH : undefined },
    ...(current ? [{ label: current }] : []),
  ];

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
        {crumbs.map((crumb, index) => (
          <li key={crumb.label} className="flex items-center gap-2">
            {index > 0 && <ChevronRight size={13} className="text-[#a8b6d4]" aria-hidden="true" />}
            {crumb.to ? (
              <Link to={crumb.to} className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
                {index === 0 && <Home size={14} aria-hidden="true" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="font-bold text-[#0f1e57]" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default CareersBreadcrumb;
