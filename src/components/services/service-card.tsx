import { ArrowRight, Headphones, Sparkles, Star } from "lucide-react";
import { Link } from "react-router-dom";

import RemoteImage from "../shared/remote-image";
import { formatPrice, primaryWorkerRate, WorkerPricedService } from "./pricing";

/**
 * Structural rather than tied to one API type — the home feed returns `Services`
 * and search returns `Service`, and both carry these fields.
 */
export type ServiceCardData = WorkerPricedService & {
  slug: string;
  title: string;
  short_description?: string;
  service_image?: string;
  rating?: number | null;
};

type ServiceCardProps = {
  service: ServiceCardData;
  /** Optional corner badge, e.g. "Popular". Omitted where the claim would not be true. */
  badge?: string;
};

const ServiceCard = ({ service, badge }: ServiceCardProps) => {
  const serviceUrl = `/service/detail/${service.slug}`;
  const rate = primaryWorkerRate(service);
  const price = formatPrice(rate?.amount);

  return (
    <article className="group flex overflow-hidden rounded-[1.75rem] border border-blue-100 bg-white text-slate-950 shadow-lg shadow-blue-900/5 transition duration-300 hover:-translate-y-1.5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-900/10">
      <div className="flex w-full flex-col">
        <Link
          to={serviceUrl}
          tabIndex={-1}
          aria-hidden="true"
          className="relative block overflow-hidden focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-400"
        >
          <RemoteImage
            folder="service"
            file={service.service_image}
            alt=""
            className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
          {badge && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-slate-950/80 px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
              <Sparkles size={13} className="text-amber-300" aria-hidden="true" /> {badge}
            </span>
          )}
          {service.rating ? (
            <span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-900 shadow-lg">
              <Star size={14} className="text-amber-500" fill="currentColor" aria-hidden="true" />
              {service.rating}
            </span>
          ) : null}
        </Link>

        <div className="flex flex-1 flex-col p-5">
          <h3 className="text-xl font-extrabold leading-tight">
            <Link
              to={serviceUrl}
              className="rounded-sm transition hover:text-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {service.title}
            </Link>
          </h3>
          <p className="mt-3 line-clamp-2 min-h-11 text-sm leading-6 text-slate-600">{service.short_description}</p>

          <div className="mt-auto grid gap-2 border-t border-slate-100 pt-4 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Sparkles size={17} className="text-blue-600" aria-hidden="true" /> Fast Response
            </span>
            <span className="inline-flex items-center gap-2">
              <Headphones size={17} className="text-blue-600" aria-hidden="true" /> Live Support
            </span>
          </div>

          {price ? (
            <p className="mt-4 text-lg font-black text-blue-700">
              {price} <span className="text-sm font-bold">/ Day</span>
              <span className="ml-1.5 text-xs font-bold text-slate-500">{rate?.label}</span>
            </p>
          ) : (
            <p className="mt-4 text-sm font-bold text-slate-500">Price on request</p>
          )}

          <Link
            to={serviceUrl}
            className="mt-3 inline-flex min-h-11 items-center justify-between rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200"
            aria-label={`Book ${service.title}`}
          >
            Book now{" "}
            <span className="grid size-7 place-items-center rounded-lg bg-white/15">
              <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
};

export default ServiceCard;
