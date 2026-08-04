export type Publication = {
  name: string;
  className: string;
};

export type CoverageItem = {
  slug: string;
  tag: string;
  title: string;
  source: string;
  date: string;
  readTime: string;
  image: string;
  /**
   * The original article on the publisher's site. Placeholder for now — replace
   * with the real permalink; the detail page hides the outbound CTA until it is
   * a real URL.
   */
  externalUrl: string;
  excerpt: string;
  /** Opening line of Dehatwala's summary of the coverage. */
  lead: string;
  /** Remaining summary paragraphs. Placeholder copy — replace before launch. */
  body: string[];
  quote?: { text: string; author: string };
};

export type VideoItem = {
  title: string;
  subtitle: string;
  duration: string;
  image: string;
  href: string;
  channel: string;
  date: string;
};

export type EventPhoto = {
  src: string;
  alt: string;
  caption: string;
  location: string;
  date: string;
};

export const PUBLICATIONS: Publication[] = [
  { name: "The Economic Times", className: "font-serif text-[15px] font-semibold tracking-tight text-slate-800" },
  { name: "YourStory", className: "text-[17px] font-extrabold tracking-tight text-slate-900" },
  { name: "BW BUSINESSWORLD", className: "text-[13px] font-extrabold tracking-tight text-red-600" },
  { name: "Inc42", className: "text-[17px] font-extrabold tracking-tight text-slate-900" },
  { name: "दैनिक जागरण", className: "text-[15px] font-extrabold tracking-tight text-slate-900" },
];

export const COVERAGE: CoverageItem[] = [
  {
    slug: "solving-indias-blue-collar-hiring-challenge",
    tag: "Business",
    title: "Dehatwala is solving India’s blue-collar hiring challenge",
    source: "YourStory",
    date: "2025-05-12",
    readTime: "5 min read",
    image: "/images/dehatwala-worker-join.png",
    externalUrl: "#",
    excerpt:
      "How a verified-worker marketplace is cutting the time it takes for sites to find skilled labour from days to hours.",
    lead: "India’s blue-collar workforce is massive, yet access to skilled and reliable workers remains a challenge for businesses and individuals alike.",
    body: [
      "Dehatwala is building a technology-enabled platform that connects businesses and individuals with verified blue-collar workers across construction, logistics, maintenance, and more — quickly, reliably, and transparently.",
      "With a mission to make workforce access simpler and more organised, Dehatwala is empowering lakhs of workers with better opportunities and helping businesses get the right talent, right when they need it.",
      "The platform offers verified worker profiles, real-time availability, and an easy booking process — all designed to solve real-world hiring problems.",
      "As India’s infra and industrial sector continues to grow, Dehatwala is committed to building the backbone of a stronger, more inclusive economy.",
    ],
    quote: {
      text: "Our goal is to build India’s most trusted workforce network that brings dignity, transparency, and growth to every worker.",
      author: "Team Dehatwala",
    },
  },
  {
    slug: "connecting-skilled-workers-with-opportunities",
    tag: "Startup",
    title: "Dehatwala: Connecting skilled workers with opportunities",
    source: "The Economic Times",
    date: "2025-04-28",
    readTime: "4 min read",
    image: "/images/dehatwala-hero-worker.png",
    externalUrl: "#",
    excerpt:
      "A look at the platform bringing masons, helpers and operators onto a single verified network across North India.",
    lead: "Masons, helpers and equipment operators have long depended on labour chowks and word of mouth to find their next day of work.",
    body: [
      "Dehatwala brings those workers onto a single verified network, matching them to nearby jobs based on skill, availability and location rather than who happened to be standing at the right corner that morning.",
      "For businesses, that means a shortlist of background-checked workers in hours instead of days. For workers, it means steadier income and far less time lost waiting for work that may never arrive.",
      "The network now spans multiple service categories across North India, with assisted booking support in Hindi and English for customers who prefer to talk to a person.",
    ],
  },
  {
    slug: "empowering-millions-of-workers-through-technology",
    tag: "Impact",
    title: "Empowering millions of workers through technology",
    source: "Inc42",
    date: "2025-04-18",
    readTime: "6 min read",
    image: "/images/about/across-india-manpower-service-delivery.png",
    externalUrl: "#",
    excerpt:
      "Digital onboarding, timely payments and GPS-verified attendance are changing how informal work gets done.",
    lead: "Technology in the informal workforce is rarely about sophistication — it is about removing the small frictions that cost workers a day’s wage.",
    body: [
      "Dehatwala’s onboarding is built for low-end phones and noisy environments: a worker registers with a mobile number, a few documents and a skill selection, and can start receiving work in days.",
      "Attendance is verified with GPS and a timestamp, which protects both sides of the booking — customers know when workers arrived, and workers have a record backing their payout.",
      "The result is a system where payment disputes fall, repeat bookings rise, and workers can plan around a predictable income.",
    ],
    quote: {
      text: "When a worker knows exactly when they will be paid, everything else in their life becomes easier to plan.",
      author: "Team Dehatwala",
    },
  },
  {
    slug: "formalising-informal-work-the-dehatwala-approach",
    tag: "Business",
    title: "Formalising informal work: the Dehatwala approach",
    source: "BW Businessworld",
    date: "2025-03-30",
    readTime: "5 min read",
    image: "/images/about/india-best-manpower-service-provider.png",
    externalUrl: "#",
    excerpt: "Transparent pricing and background checks are bringing structure to a historically unorganised market.",
    lead: "The gap between organised and unorganised labour in India is rarely about skill. It is about structure.",
    body: [
      "Dehatwala publishes a clear day rate and overtime rate for every worker type on every service, so customers know the cost before they book and workers know what they will earn before they travel.",
      "Every worker on the network is background checked before deployment, and each booking carries a written scope, a schedule and a verified arrival record.",
      "None of this is complicated on its own. Applied consistently across thousands of bookings, it is what turns a daily-wage transaction into a dependable livelihood.",
    ],
  },
  {
    slug: "gaon-ke-hunar-ko-shahar-ke-kaam-se-jodna",
    tag: "Impact",
    title: "देहात वाला: गाँव के हुनर को शहर के काम से जोड़ना",
    source: "दैनिक जागरण",
    date: "2025-03-11",
    readTime: "4 min read",
    image: "/images/about/have-100000+-more-manpower.png",
    externalUrl: "#",
    excerpt: "ग्रामीण कामगारों को नज़दीकी शहरों में भरोसेमंद काम दिलाने की पहल पर एक रिपोर्ट।",
    lead: "गाँवों में हुनर की कमी नहीं है — कमी है भरोसेमंद काम तक पहुँच की।",
    body: [
      "देहातवाला ग्रामीण क्षेत्रों के कुशल और सामान्य कामगारों को नज़दीकी शहरों में उपलब्ध कामों से जोड़ता है, जिससे उन्हें काम की तलाश में लंबी दूरी तय नहीं करनी पड़ती।",
      "हर कामगार का सत्यापन किया जाता है और काम शुरू होने से पहले ही मज़दूरी की दर स्पष्ट कर दी जाती है।",
      "इस पहल से कामगारों को नियमित आमदनी मिल रही है और नियोक्ताओं को समय पर भरोसेमंद श्रमिक।",
    ],
  },
  {
    slug: "building-trust-in-indias-workforce-marketplace",
    tag: "Startup",
    title: "Building trust in India’s workforce marketplace",
    source: "YourStory",
    date: "2025-02-19",
    readTime: "5 min read",
    image: "/images/about/day-and-night-manpower.png",
    externalUrl: "#",
    excerpt: "Why verification and on-time payouts matter more than discounts when hiring skilled site workers.",
    lead: "In most marketplaces, price wins. In workforce hiring, it barely registers.",
    body: [
      "A site manager who saves two hundred rupees on a day rate but loses a day of work to a no-show has not saved anything. What they want is certainty.",
      "Dehatwala’s answer is verification before deployment, a named worker with a profile and history, and support that stays on the line until the job is done.",
      "Workers, in turn, stay on a platform that pays on time. Trust compounds on both sides — and that, more than any discount, is what keeps the network growing.",
    ],
  },
];

/** Detail route for a coverage article. */
export const mediaArticlePath = (slug: string) => `/media-news/news/${slug}`;

export const findCoverage = (slug?: string) => COVERAGE.find((item) => item.slug === slug);

/** Publication wordmark styling, so a source renders the same everywhere. */
export const publicationClass = (source: string) =>
  PUBLICATIONS.find((publication) => publication.name.toLowerCase() === source.toLowerCase())?.className ??
  "text-[15px] font-extrabold tracking-tight text-slate-900";

/** Placeholder hrefs must not render as outbound links. */
export const isRealUrl = (url: string) => /^https?:\/\//i.test(url);

export const VIDEOS: VideoItem[] = [
  {
    title: "Dehatwala on News18 Local",
    subtitle: "Building a Smarter Workforce Network",
    duration: "04:35",
    image: "/images/about/india-best-manpower-service-provider.png",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "News18 Local",
    date: "2025-05-02",
  },
  {
    title: "Founder Interview with Startup Talk India",
    subtitle: "Our journey, challenges & vision",
    duration: "06:12",
    image: "/images/vipin-web/Untitled-1.jpg",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "Startup Talk India",
    date: "2025-04-21",
  },
  {
    title: "Dehatwala in the Community",
    subtitle: "Worker registration drive at Labour Chowk",
    duration: "03:38",
    image: "/images/about/have-100000+-more-manpower.png",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "Dehatwala",
    date: "2025-04-05",
  },
  {
    title: "How workers get paid on time",
    subtitle: "Inside our payout and attendance system",
    duration: "05:20",
    image: "/images/about/24x7-consultant.png",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "Dehatwala",
    date: "2025-03-18",
  },
  {
    title: "A day on site with a Dehatwala team",
    subtitle: "From booking to job completion",
    duration: "07:04",
    image: "/images/about/easiest-way-to-get-service.png",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "Dehatwala",
    date: "2025-02-27",
  },
  {
    title: "Skilling India’s construction workforce",
    subtitle: "Panel discussion on workforce readiness",
    duration: "12:46",
    image: "/images/about/across-india-manpower-service-delivery.png",
    href: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    channel: "Startup Talk India",
    date: "2025-01-30",
  },
];

export const EVENT_PHOTOS: EventPhoto[] = [
  {
    src: "/images/dehatwala-worker-join.png",
    alt: "Dehatwala workers at a community event",
    caption: "Worker registration drive",
    location: "Labour Chowk, Gurugram",
    date: "2025-04-05",
  },
  {
    src: "/images/about/day-and-night-manpower.png",
    alt: "Dehatwala workforce team on site",
    caption: "Night shift deployment",
    location: "Sector 62, Noida",
    date: "2025-03-22",
  },
  {
    src: "/images/about/24x7-consultant.png",
    alt: "Workforce consultation event",
    caption: "Employer consultation desk",
    location: "Faridabad",
    date: "2025-03-08",
  },
  {
    src: "/images/about/across-india-manpower-service-delivery.png",
    alt: "Dehatwala service team",
    caption: "Site handover walkthrough",
    location: "Ghaziabad",
    date: "2025-02-14",
  },
  {
    src: "/images/about/easiest-way-to-get-service.png",
    alt: "Dehatwala worker support desk",
    caption: "Worker support helpdesk",
    location: "Delhi NCR",
    date: "2025-01-25",
  },
  {
    src: "/images/about/india-best-manpower-service-provider.png",
    alt: "Dehatwala team at a workforce meet",
    caption: "Workforce partner meet",
    location: "Jaipur",
    date: "2024-12-19",
  },
  {
    src: "/images/about/have-100000+-more-manpower.png",
    alt: "Dehatwala workers gathered for training",
    caption: "Safety training session",
    location: "Gurugram",
    date: "2024-12-02",
  },
  {
    src: "/images/dehatwala-hero-worker.png",
    alt: "Dehatwala worker on a construction site",
    caption: "On-site skill assessment",
    location: "Sonipat",
    date: "2024-11-15",
  },
];

export const formatMediaDate = (value: string) =>
  new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
