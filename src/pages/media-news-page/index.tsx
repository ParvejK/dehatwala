import {
  ArrowRight,
  ArrowUpRight,
  Camera,
  ChevronRight,
  Clock3,
  Mail,
  MessageCircle,
  Mic2,
  Play,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";

const coverage = [
  {
    tag: "Business",
    title: "Dehatwala is solving India’s blue-collar hiring challenge",
    source: "YourStory",
    date: "12 May 2025",
    image: "/images/dehatwala-worker-join.png",
  },
  {
    tag: "Startup",
    title: "Dehatwala: Connecting skilled workers with opportunities",
    source: "The Economic Times",
    date: "28 Apr 2025",
    image: "/images/dehatwala-hero-worker.png",
  },
  {
    tag: "Impact",
    title: "Empowering millions of workers through technology",
    source: "Inc42",
    date: "18 Apr 2025",
    image: "/images/about/across-india-manpower-service-delivery.png",
  },
];

const videos = [
  {
    title: "Dehatwala on News18 Local",
    subtitle: "Building a Smarter Workforce Network",
    duration: "04:35",
    image: "/images/about/india-best-manpower-service-provider.png",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    title: "Founder Interview with Startup Talk India",
    subtitle: "Our journey, challenges & vision",
    duration: "06:12",
    image: "/images/vipin-web/Untitled-1.jpg",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    title: "Dehatwala in the Community",
    subtitle: "Worker registration drive at Labour Chowk",
    duration: "03:38",
    image: "/images/about/have-100000+-more-manpower.png",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

const eventPhotos = [
  { src: "/images/dehatwala-worker-join.png", alt: "Dehatwala workers at a community event" },
  { src: "/images/about/day-and-night-manpower.png", alt: "Dehatwala workforce team" },
  { src: "/images/about/24x7-consultant.png", alt: "Workforce consultation event" },
  { src: "/images/about/across-india-manpower-service-delivery.png", alt: "Dehatwala service team" },
  { src: "/images/about/easiest-way-to-get-service.png", alt: "Dehatwala worker support" },
];

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  linkLabel: string;
  href: string;
};

const SectionHeading = ({ eyebrow, title, linkLabel, href }: SectionHeadingProps) => (
  <div className="mb-7 flex items-end justify-between gap-5">
    <div>
      <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-black tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
    </div>
    <a
      href={href}
      className="group hidden items-center gap-1 text-sm font-bold text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 sm:inline-flex"
    >
      {linkLabel} <ArrowRight size={16} className="transition group-hover:translate-x-1" aria-hidden="true" />
    </a>
  </div>
);

const MediaNewsPage = () => {
  return (
    <main className="overflow-hidden bg-white">
      <div className="border-b border-slate-200 bg-slate-50/80">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-5 py-3 text-xs font-semibold text-slate-500 sm:px-8 lg:px-10">
          <Link to="/" className="transition hover:text-blue-700">Home</Link>
          <ChevronRight size={13} aria-hidden="true" />
          <span className="text-slate-800">Media &amp; News</span>
        </div>
      </div>

      <section className="px-5 pb-14 pt-7 sm:px-8 sm:pb-20 lg:px-10 lg:pt-10">
        <div className="relative mx-auto min-h-[540px] max-w-7xl overflow-hidden rounded-[2rem] bg-blue-950 text-white shadow-2xl shadow-blue-950/20">
          <img
            src="/images/media-news-hero.png"
            alt="Dehatwala workers and a media crew at a construction site"
            className="absolute inset-0 h-full w-full object-cover object-[68%_center] sm:object-[62%_center] lg:object-center"
          />
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/85 to-blue-950/20 sm:via-blue-950/60 lg:via-transparent"
            aria-hidden="true"
          />
          <div className="relative z-10 flex min-h-[540px] max-w-2xl flex-col justify-center px-7 py-12 sm:px-12 lg:px-14">
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs font-bold text-blue-100 backdrop-blur">
              <Sparkles size={14} className="text-amber-300" aria-hidden="true" /> Stories shaping India’s workforce
            </div>
            <h1 className="max-w-xl text-4xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Dehatwala <span className="text-blue-200">in the</span> <span className="text-amber-300">News</span>
            </h1>
            <p className="mt-6 max-w-lg text-sm leading-7 text-blue-100/80 sm:text-base">
              See how Dehatwala is transforming India’s blue-collar workforce through innovation, employment
              generation, and faster workforce access.
            </p>
            <a href="#coverage" className="mt-8 inline-flex min-h-12 w-fit items-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-blue-900 shadow-lg transition hover:-translate-y-0.5 hover:bg-amber-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300">
              View media coverage <ArrowRight size={17} aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      <section className="border-y border-blue-100 bg-blue-50/60 px-5 py-10 sm:px-8 lg:px-10" aria-labelledby="featured-title">
        <div className="mx-auto max-w-7xl">
          <div className="mb-5 flex items-center justify-between"><h2 id="featured-title" className="text-sm font-black text-blue-950">Featured in</h2><a href="#coverage" className="text-xs font-bold text-blue-700 hover:text-blue-900">View all <span aria-hidden="true">→</span></a></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {["The Economic Times", "YourStory", "BW BUSINESSWORLD", "Inc42", "दैनिक जागरण"].map((publication) => (
              <div key={publication} className="grid min-h-20 place-items-center rounded-2xl border border-blue-100 bg-white px-4 text-center text-sm font-black text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">{publication}</div>
            ))}
          </div>
        </div>
      </section>

      <section id="coverage" className="scroll-mt-28 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Press room" title="Latest Media Coverage" linkLabel="View all news" href="#coverage" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {coverage.map((item) => (
              <article key={item.title} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/10">
                <div className="relative h-52 overflow-hidden bg-blue-50"><img src={item.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1.5 text-[11px] font-black uppercase tracking-wider text-blue-700 shadow">{item.tag}</span></div>
                <div className="p-6"><h3 className="min-h-14 text-lg font-black leading-7 text-slate-950">{item.title}</h3><div className="mt-6 flex items-end justify-between gap-4"><div><p className="text-sm font-bold text-slate-700">{item.source}</p><p className="mt-1 text-xs text-slate-500">{item.date}</p></div><a href="#coverage" aria-label={`Read ${item.title}`} className="grid size-10 place-items-center rounded-xl bg-blue-50 text-blue-700 transition hover:bg-blue-700 hover:text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"><ArrowUpRight size={18} /></a></div></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="videos" className="scroll-mt-28 bg-slate-950 px-5 py-16 text-white sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="[&_h2]:text-white [&_p]:text-blue-300 [&_a]:text-blue-200"><SectionHeading eyebrow="Watch & listen" title="Videos & Interviews" linkLabel="View all videos" href="#videos" /></div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <a key={video.title} href={video.href} target="_blank" rel="noreferrer" aria-label={`Play ${video.title} on YouTube`} className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-blue-400/50 hover:bg-white/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-400">
                <div className="relative h-56 overflow-hidden bg-blue-900"><img src={video.image} alt="" className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" /><span className="absolute inset-0 grid place-items-center"><span className="grid size-14 place-items-center rounded-full bg-white text-blue-800 shadow-xl transition group-hover:scale-110"><Play size={22} fill="currentColor" className="ml-1" /></span></span><span className="absolute bottom-4 right-4 inline-flex items-center gap-1 rounded-lg bg-slate-950/80 px-2 py-1 text-xs font-bold"><Clock3 size={12} />{video.duration}</span></div>
                <div className="p-6"><h3 className="text-lg font-black leading-7">{video.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{video.subtitle}</p></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section id="photos" className="scroll-mt-28 px-5 py-16 sm:px-8 sm:py-20 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="From the field" title="Latest Event Photos" linkLabel="View all photos" href="#photos" />
          <div className="grid auto-rows-[190px] grid-cols-2 gap-3 sm:auto-rows-[230px] lg:grid-cols-4">
            {eventPhotos.map((photo, index) => (
              <figure key={photo.src} className={`group relative overflow-hidden rounded-2xl bg-blue-100 ${index === 0 ? "col-span-2 row-span-2" : ""}`}><img src={photo.src} alt={photo.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-blue-950/45 to-transparent opacity-40 transition group-hover:opacity-70" /><Camera className="absolute bottom-4 right-4 text-white opacity-0 transition group-hover:opacity-100" size={20} aria-hidden="true" /></figure>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 pb-16 sm:px-8 sm:pb-20 lg:px-10">
        <div className="relative mx-auto flex max-w-7xl flex-col items-start gap-7 overflow-hidden rounded-[2rem] bg-gradient-to-r from-blue-950 to-blue-700 px-7 py-9 text-white shadow-xl shadow-blue-950/15 sm:px-10 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="absolute -right-12 -top-20 size-64 rounded-full border-[40px] border-white/5" aria-hidden="true" />
          <div className="relative flex max-w-2xl gap-4"><span className="hidden size-14 shrink-0 place-items-center rounded-2xl bg-white/10 sm:grid"><Mic2 size={25} className="text-amber-300" /></span><div><h2 className="text-2xl font-black tracking-tight sm:text-3xl">Want to feature Dehatwala in your news stories?</h2><p className="mt-2 text-sm leading-6 text-blue-100/80">We’d love to connect with journalists, publishers and content creators.</p></div></div>
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row"><a href="https://wa.me/918600999922" target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 text-sm font-extrabold transition hover:bg-emerald-400 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"><MessageCircle size={18} />Chat on WhatsApp</a><Link to="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-extrabold text-blue-900 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"><Mail size={18} />Contact us</Link></div>
        </div>
      </section>
    </main>
  );
};

export default MediaNewsPage;
