import {
  FileCheck2,
  Headphones,
  Lightbulb,
  MessagesSquare,
  PhoneCall,
  Rocket,
  Send,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export const CAREERS_PATH = "/careers";
export const OPEN_POSITIONS_PATH = "/careers/open-positions";
export const SEND_PROFILE_PATH = "/careers/send-profile";
export const WORKER_JOIN_PATH = "/become-a-part-of-dehatwala";

export const positionPath = (slug: string) => `${OPEN_POSITIONS_PATH}/${slug}`;

export const CAREERS_EMAIL = "dehatwalainfo@gmail.com";
export const CAREERS_SUBJECT = "Career Application – [Role Name]";
export const CAREERS_MAILTO = `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(CAREERS_SUBJECT)}`;

/** Subject line pre-filled with the role the applicant was looking at. */
export const careerMailto = (role?: string) =>
  `mailto:${CAREERS_EMAIL}?subject=${encodeURIComponent(`Career Application – ${role || "[Role Name]"}`)}`;

type Highlight = {
  icon: LucideIcon;
  title: string;
  copy: string;
};

export const WHY_JOIN: Highlight[] = [
  {
    icon: Lightbulb,
    title: "Work on Real Problems",
    copy: "Help build solutions for real workforce and service challenges.",
  },
  {
    icon: Rocket,
    title: "Build From the Ground Up",
    copy: "Be part of a growing startup and contribute to systems, operations and ideas from an early stage.",
  },
  {
    icon: Users,
    title: "Create Meaningful Impact",
    copy: "Work towards improving access to workers and work opportunities across India.",
  },
];

export const HIRING_PROCESS: (Highlight & { step: string })[] = [
  {
    step: "01",
    icon: Send,
    title: "Apply or Share Profile",
    copy: "Pick an open role, or email us your profile if nothing fits right now.",
  },
  {
    step: "02",
    icon: PhoneCall,
    title: "Intro Call",
    copy: "A short conversation about your experience and what you want to do next.",
  },
  {
    step: "03",
    icon: MessagesSquare,
    title: "Role Discussion",
    copy: "A practical task or a deep-dive with the team you would be joining.",
  },
  {
    step: "04",
    icon: FileCheck2,
    title: "Offer & Onboarding",
    copy: "Clear terms, a start date and an onboarding plan from day one.",
  },
];

export type OpenPosition = {
  slug: string;
  title: string;
  icon: LucideIcon;
  department: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  requirements: string[];
};

/**
 * Single source of truth for both the listing and the apply page.
 * Empty this array when there are no live openings — the listing then shows the
 * "no open positions" state and points people at Send Your Profile.
 */
export const OPEN_POSITIONS: OpenPosition[] = [
  {
    slug: "operations-executive",
    title: "Operations Executive",
    icon: UserCog,
    department: "Operations",
    location: "Gurugram",
    type: "Full Time",
    summary:
      "Own day-to-day service delivery — matching customer requirements with the right workers and keeping every booking on track from request to completion.",
    responsibilities: [
      "Coordinate worker assignment against incoming service requests.",
      "Verify worker documents and keep onboarding records accurate.",
      "Track live bookings and resolve on-ground issues with customers and workers.",
      "Share daily reporting on fulfilment, delays and repeat requirements.",
    ],
    requirements: [
      "0–3 years in operations, field coordination or customer service.",
      "Comfortable working in Hindi and English, on phone and on site.",
      "Working knowledge of Excel or Google Sheets.",
      "Willing to spend part of the week on field visits around Gurugram.",
    ],
  },
  {
    slug: "customer-support-associate",
    title: "Customer Support Associate",
    icon: Headphones,
    department: "Customer Support",
    location: "Gurugram",
    type: "Full Time",
    summary:
      "Be the first voice customers hear — help them place the right booking, answer questions during the service and follow up after it is done.",
    responsibilities: [
      "Handle inbound calls, WhatsApp and assisted-booking requests.",
      "Capture requirements accurately and hand them to the operations team.",
      "Follow up post-service and record feedback and complaints.",
    ],
    requirements: [
      "0–2 years in a voice or chat support role.",
      "Clear spoken Hindi and functional English.",
      "Patience with first-time and low-digital-literacy users.",
    ],
  },
];

export const findPosition = (slug?: string) => OPEN_POSITIONS.find((position) => position.slug === slug);
