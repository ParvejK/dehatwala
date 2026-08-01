import {
  ArrowRight,
  BadgeIndianRupee,
  Bolt,
  CreditCard,
  Headphones,
  Heart,
  MapPin,
  ShieldCheck,
  Star,
  Truck,
  UserRoundCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

type Service = {
  title: string;
  description: string;
  image: string;
  rating: string;
  price: string;
  slug: string;
};

const services: Service[] = [
  {
    title: "Material Handling",
    description: "Hire workers for material shifting and professional loading & shifting services.",
    image: "/images/services/loading-material-handling/material-handling.jpg",
    rating: "4.6",
    price: "₹1,000",
    slug: "material-handling",
  },
  {
    title: "Loading/Unloading Work",
    description: "Hire workers for truck and container loading or unloading work.",
    image: "/images/services/loading-material-handling/loading-unloading.jpg",
    rating: "4.7",
    price: "₹1,000",
    slug: "loading-unloading-work",
  },
  {
    title: "Material Packing",
    description: "Hire trained workers for careful and secure packing of commercial materials.",
    image: "/images/services/loading-material-handling/packing.jpg",
    rating: "4.5",
    price: "₹1,000",
    slug: "material-packing",
  },
];

const serviceHighlights = [
  { label: "Verified Workers", icon: ShieldCheck },
  { label: "Background Checked", icon: UserRoundCheck },
  { label: "Fast Response", icon: Bolt },
];

const trustBenefits = [
  { icon: Heart, title: "Easy Booking", copy: "A quick, guided booking process." },
  { icon: MapPin, title: "Local Workers", copy: "Workers available in your area." },
  { icon: ShieldCheck, title: "Trusted Professionals", copy: "Verified and background-checked workers." },
  { icon: Bolt, title: "Quick Response", copy: "Get workers on time, when you need them." },
  { icon: CreditCard, title: "Flexible Payment", copy: "Convenient payment options for every booking." },
  { icon: Headphones, title: "Assisted Support", copy: "Our support team is ready to help." },
];

const proofPoints = [
  { icon: ShieldCheck, title: "Verified Workers", copy: "Background Verified" },
  { icon: Bolt, title: "On-Time Service", copy: "Punctual & Reliable" },
  { icon: BadgeIndianRupee, title: "Transparent Pricing", copy: "No Hidden Charges" },
];

const DotGrid = ({ className }: { className?: string }) => (
  <div
    aria-hidden="true"
    className={`pointer-events-none absolute bg-[radial-gradient(circle,#c3d6f5_1.6px,transparent_1.6px)] [background-size:13px_13px] ${className ?? ""}`}
  />
);

const ServiceHero = () => (
  <section className="relative overflow-hidden rounded-3xl border border-[#dce7fb] bg-[#f2f6fe] shadow-[0_18px_50px_-24px_rgba(20,61,141,0.45)]">
    <DotGrid className="left-5 top-6 h-24 w-16 sm:h-32 sm:w-20" />
    <DotGrid className="bottom-6 left-3 hidden h-24 w-8 lg:block" />

    <div className="grid lg:grid-cols-[1fr_1.05fr]">
      <div className="relative z-10 flex flex-col justify-center px-6 py-9 sm:px-10 sm:py-11 lg:pl-12 lg:pr-6">
        <div className="mb-5 grid size-16 place-items-center rounded-[20px] bg-[#0b3fc4] text-white shadow-lg shadow-blue-800/25 sm:size-[72px]">
          <Truck size={36} strokeWidth={1.6} aria-hidden="true" />
        </div>

        <h1 className="text-[32px] font-extrabold leading-[1.12] tracking-tight text-[#0f1e57] sm:text-[38px] lg:text-[40px]">
          <span className="block">Loading &amp;</span>
          Material Handling
        </h1>
        <p className="mt-4 max-w-sm text-sm font-normal leading-6 text-[#4a5b83] sm:text-[15px] sm:leading-7">
          Men&apos;s loading, unloading and material shifting services for all your site needs.
        </p>

        <ul className="mt-7 flex flex-wrap gap-x-5 gap-y-4 sm:mt-9">
          {proofPoints.map(({ icon: Icon, title, copy }) => (
            <li key={title} className="flex items-center gap-2 whitespace-nowrap">
              <span className="grid size-8 shrink-0 place-items-center rounded-full border border-[#bed2f6] bg-white/70 text-[#0b3fc4]">
                <Icon size={15} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <strong className="block text-[11px] font-bold text-[#0f1e57]">{title}</strong>
                <span className="block text-[10px] font-normal text-[#65769c]">{copy}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative min-h-64 overflow-hidden sm:min-h-72 lg:min-h-full">
        <img
          src="/images/services/loading-material-handling/hero.jpg"
          alt="Dehatwala workers loading packed materials into a truck"
          className="absolute inset-0 size-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(to_top,#f2f6fe_0%,rgba(242,246,254,0)_45%)] lg:bg-[linear-gradient(to_right,#f2f6fe_0%,rgba(242,246,254,0)_26%)]"
        />
      </div>
    </div>
  </section>
);

const ServiceCard = ({ service }: { service: Service }) => {
  const detailUrl = `/services/detail/${service.slug}`;

  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e0eafb] bg-white shadow-[0_4px_14px_rgba(26,64,135,0.06)] transition duration-300 hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-12px_rgba(26,64,135,0.35)] md:grid md:h-[206px] md:grid-cols-[36%_64%]">
      <Link to={detailUrl} tabIndex={-1} aria-hidden="true" className="block h-52 overflow-hidden md:h-full">
        <img
          src={service.image}
          alt=""
          className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
        />
      </Link>

      <div className="flex min-w-0 flex-col px-5 py-4 sm:px-6 lg:px-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link to={detailUrl} className="rounded focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
              <h3 className="text-lg font-extrabold leading-tight tracking-tight text-[#0f1e57] lg:text-xl">
                {service.title}
              </h3>
            </Link>
            <p className="mt-1.5 line-clamp-2 max-w-md text-xs font-normal leading-[1.5] text-[#5a6a90] md:min-h-[39px] lg:text-[13px]">
              {service.description}
            </p>
          </div>
          <span
            className="inline-flex shrink-0 items-center gap-1.5 text-base font-extrabold text-[#0f1e57]"
            aria-label={`Rated ${service.rating} out of 5`}
          >
            <Star size={18} className="fill-[#ff9f1a] text-[#ff9f1a]" aria-hidden="true" />
            {service.rating}
          </span>
        </div>

        <ul className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#eaf1fd] pb-3.5 text-[10px] font-semibold text-[#0b3fc4] sm:gap-x-7 lg:text-[11px]">
          {serviceHighlights.map(({ label, icon: Icon }) => (
            <li key={label} className="inline-flex items-center gap-1.5">
              <Icon size={16} strokeWidth={1.9} aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-auto flex flex-col gap-3 pt-3.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <div className="rounded-lg bg-[#0b3fc4] px-3.5 py-1.5 text-white">
              <span className="block text-[9px] font-medium leading-none text-blue-200">Starting from</span>
              <strong className="mt-1 block text-sm font-bold leading-none">
                {service.price} <span className="text-[10px] font-medium">/ Worker</span>
              </strong>
            </div>
            <span className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#eaf7ee] px-4 text-[10px] font-semibold text-emerald-700 lg:text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Available Today
            </span>
          </div>

          <Link
            to={detailUrl}
            className="inline-flex h-9 min-w-[136px] items-center justify-center gap-3 rounded-lg bg-[#0b3fc4] px-5 text-xs font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Book Now
            <ArrowRight size={16} className="transition group-hover:translate-x-0.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
};

const TrustSection = () => (
  <section
    aria-labelledby="trust-heading"
    className="rounded-3xl border border-[#dce7fb] bg-gradient-to-br from-[#f2f6fe] to-white px-5 py-10 sm:px-8 lg:px-10"
  >
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#0b3fc4] sm:text-sm">
        The Dehatwala Difference
      </p>
      <h2 id="trust-heading" className="mt-2 text-2xl font-extrabold tracking-tight text-[#0f1e57] sm:text-[32px]">
        Why Customers Prefer Dehatwala
      </h2>
      <p className="mt-3 text-sm font-normal leading-6 text-[#5a6a90] sm:text-base">
        Reliable workers, transparent pricing and a simple assisted booking experience.
      </p>
    </div>

    <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {trustBenefits.map(({ icon: Icon, title, copy }) => (
        <article
          key={title}
          className="rounded-2xl border border-[#e0eafb] bg-white p-5 text-center shadow-[0_4px_14px_rgba(26,64,135,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_24px_-14px_rgba(26,64,135,0.4)]"
        >
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#0b3fc4] text-white shadow-md shadow-blue-800/20">
            <Icon size={25} aria-hidden="true" />
          </span>
          <h3 className="mt-4 flex min-h-[35px] items-center justify-center text-sm font-extrabold leading-tight text-[#0f1e57]">
            {title}
          </h3>
          <p className="mt-2 text-xs font-normal leading-5 text-[#5a6a90]">{copy}</p>
        </article>
      ))}
    </div>
  </section>
);

const ServiceListingPage = () => (
  <main className="bg-white pb-20 pt-6 sm:pt-10">
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
      <ServiceHero />

      <section aria-labelledby="services-heading" className="py-10 sm:py-12">
        <div className="mb-4">
          <h2 id="services-heading" className="text-2xl font-extrabold tracking-tight text-[#0f1e57] sm:text-[30px]">
            Loading &amp; Material Handling Services
          </h2>
          <p className="mt-1 text-xs font-normal text-[#5a6a90] sm:text-sm">Choose the service you need</p>
        </div>

        <div className="space-y-4">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </section>

      <TrustSection />
    </div>
  </main>
);

export default ServiceListingPage;
