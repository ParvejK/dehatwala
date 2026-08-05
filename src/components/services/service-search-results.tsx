import { Search, SearchX, X } from "lucide-react";
import { Link } from "react-router-dom";

import { Service } from "../../types";
import ServiceCard from "./service-card";

type ServiceSearchResultsProps = {
  query: string;
  services: Service[];
  onClear: () => void;
};

/**
 * Standalone section below the booking panel. Mirrors the "Most Booked Services"
 * header pattern so the two read as siblings.
 */
const ServiceSearchResults = ({ query, services, onClear }: ServiceSearchResultsProps) => (
  <section
    id="search-results"
    aria-labelledby="search-results-heading"
    // White here on purpose: the "Most Booked Services" band directly below is
    // tinted, and two identical bands in a row read as a mistake.
    className="relative scroll-mt-24 bg-white pb-4 pt-16 text-slate-950 lg:pt-20"
  >
    <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
      <div className="mb-10 flex flex-col gap-7 md:mb-12 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-blue-700 shadow-sm">
            <Search size={14} aria-hidden="true" /> Search results
          </p>
          <h2 id="search-results-heading" className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
            Results for <span className="text-blue-700">&ldquo;{query}&rdquo;</span>
          </h2>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">
            {services.length > 0
              ? `${services.length} ${services.length === 1 ? "service" : "services"} matching your search.`
              : "No services matched this title."}
          </p>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="inline-flex min-h-12 w-fit items-center justify-center gap-2 rounded-xl border border-blue-200 bg-white px-5 py-3 text-sm font-bold text-blue-700 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
        >
          <X size={17} aria-hidden="true" /> Clear search
        </button>
      </div>

      {services.length > 0 ? (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      ) : (
        <div className="rounded-[1.75rem] border border-blue-100 bg-white px-6 py-14 text-center shadow-lg shadow-blue-900/5">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-blue-50 text-blue-700">
            <SearchX size={26} aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-lg font-extrabold text-slate-950">Nothing matched &ldquo;{query}&rdquo;</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
            Try a shorter or different service title, or browse the full list of services.
          </p>
          <Link
            to="/services/all"
            className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Browse all services
          </Link>
        </div>
      )}
    </div>
  </section>
);

export default ServiceSearchResults;
