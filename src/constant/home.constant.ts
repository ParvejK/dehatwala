import {
  BadgeCheck,
  BriefcaseBusiness,
  ClipboardList,
  Clock3,
  CreditCard,
  Headphones,
  IndianRupee,
  LocateFixed,
  Lock,
  MapPin,
  MessageCircleMore,
  Search,
  ShieldCheck,
  Smartphone,
  UserCheck,
  UsersRound,
  Wrench,
} from "lucide-react";

export const benefits = [
  { icon: BadgeCheck, label: "Verified workers" },
  { icon: Clock3, label: "On-time service" },
  { icon: IndianRupee, label: "Transparent pricing" },
  { icon: Headphones, label: "Dedicated support" },
];

export const steps = [
  { icon: Search, title: "Book Online", copy: "Choose your service, date, time and number of workers." },
  { icon: UserCheck, title: "Worker Assigned", copy: "We match you with a verified worker near your site." },
  { icon: MapPin, title: "Worker Arrives", copy: "Your worker reaches the location at the scheduled time." },
  { icon: Wrench, title: "Work In Progress", copy: "The job gets done with professional care and updates." },
  { icon: CreditCard, title: "Pay & Rate", copy: "Pay securely through Dehatwala and share your experience." },
];

export const impact = [
  { icon: Wrench, value: "20+", label: "Services", copy: "Skilled workforce services for everyday site needs." },
  {
    icon: Clock3,
    value: "30 min",
    label: "Response target",
    copy: "Aiming to connect you with the right worker quickly.",
  },
  {
    icon: LocateFixed,
    value: "Gurugram",
    label: "& nearby areas",
    copy: "Local coverage backed by a trusted worker network.",
  },
  {
    icon: MessageCircleMore,
    value: "Assisted",
    label: "Booking process",
    copy: "Real support from selection through completion.",
  },
];

/** "क्यों जुड़ें देहातवाला से?" — reasons listed beside the worker photo. */
export const workerBenefits = [
  { icon: ClipboardList, title: "नि:शुल्क पंजीकरण", copy: "बिना किसी रजिस्ट्रेशन शुल्क के जुड़ें।" },
  { icon: BriefcaseBusiness, title: "नियमित काम के अवसर", copy: "अपनी उपलब्धता के अनुसार काम पाएँ।" },
  { icon: IndianRupee, title: "समय पर भुगतान", copy: "पारदर्शी और भरोसेमंद भुगतान।" },
  { icon: MapPin, title: "अपने आस-पास काम", copy: "अपने क्षेत्र के नज़दीक काम के अवसर।" },
];

/** Strip below the worker section. */
export const workerAssurances = [
  { icon: ShieldCheck, title: "सुरक्षित और भरोसेमंद", copy: "आपकी सुरक्षा हमारी प्राथमिकता" },
  { icon: Smartphone, title: "काम के अपडेट", copy: "नए काम की जानकारी सीधे आपके फोन पर" },
  { icon: UsersRound, title: "सम्मान और भरोसा", copy: "हम आपको देते हैं सम्मान और पहचान" },
  { icon: Headphones, title: "सहायता हमेशा साथ", copy: "हमारी टीम हमेशा आपके साथ है" },
];

/**
 * The four assurances beside the "Trust and Recognised" heading.
 *
 * Distinct from `recognition` on the right of that section: those are the
 * external registrations (DPIIT, Udyam), these are what the platform itself
 * guarantees.
 */
export const trustAssurances = [
  { icon: BadgeCheck, label: "Verified Credentials" },
  { icon: Lock, label: "Secure Platform" },
  { icon: MapPin, label: "Local Workforce" },
  { icon: Smartphone, label: "Digital Booking" },
];

export const recognition = [
  {
    icon: ShieldCheck,
    title: "Verified Credentials",
    copy: "Every worker is background checked before they are sent to a site.",
  },
  {
    icon: Lock,
    title: "Secure Platform",
    copy: "Bookings and payments run over protected, trusted technology.",
  },
  {
    icon: MapPin,
    title: "Local Workforce",
    copy: "Workers matched from your own area, so they reach you sooner.",
  },
  {
    icon: Smartphone,
    title: "Digital Booking",
    copy: "Raise a request, track it and pay — all from your phone.",
  },
];
