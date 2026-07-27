import {
  BadgeCheck,
  Building2,
  Clock3,
  CreditCard,
  Headphones,
  IndianRupee,
  LocateFixed,
  MapPin,
  MessageCircleMore,
  Search,
  ShieldCheck,
  UserCheck,
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

export const recognition = [
  { icon: Building2, title: "DPIIT recognised", copy: "A recognised startup building dependable workforce access." },
  { icon: BadgeCheck, title: "Udyam registered", copy: "Registered enterprise supporting local jobs and businesses." },
  {
    icon: LocateFixed,
    title: "Startup UP recognised",
    copy: "Part of a growing ecosystem for entrepreneurship and impact.",
  },
  {
    icon: ShieldCheck,
    title: "Secure online payments",
    copy: "Protected transactions through trusted payment technology.",
  },
];
