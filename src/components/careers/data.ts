import {
  BriefcaseBusiness,
  Code2,
  FileCheck2,
  Headphones,
  Lightbulb,
  LineChart,
  Megaphone,
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

/**
 * `career_openings` has no icon column, so one is picked from the department
 * name. An unlisted department falls back to the generic briefcase.
 */
const DEPARTMENT_ICONS: Record<string, LucideIcon> = {
  operations: UserCog,
  "customer support": Headphones,
  support: Headphones,
  engineering: Code2,
  product: Code2,
  technology: Code2,
  marketing: Megaphone,
  growth: Megaphone,
  sales: BriefcaseBusiness,
  partnerships: BriefcaseBusiness,
  finance: LineChart,
  people: Users,
  hr: Users,
};

export const departmentIcon = (department: string): LucideIcon =>
  DEPARTMENT_ICONS[department.trim().toLowerCase()] ?? BriefcaseBusiness;

/** Splits the one-bullet-per-line textareas the API returns. */
export const toBulletList = (raw?: string | null, preParsed?: string[] | null): string[] => {
  if (preParsed?.length) return preParsed.map((item) => item.trim()).filter(Boolean);

  return (raw ?? "")
    .split(/\r?\n/)
    .map((item) => item.replace(/^[-•*\s]+/, "").trim())
    .filter(Boolean);
};
