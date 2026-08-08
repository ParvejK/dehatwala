import { CalendarCheck2, CircleHelp, MapPin, Settings, Star, type LucideIcon } from "lucide-react";

export const DASHBOARD_PATH = "/dashboard";

export type DashboardLink = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export const DASHBOARD_LINKS: DashboardLink[] = [
  { to: "/dashboard/bookings", label: "My Bookings", icon: CalendarCheck2 },
  { to: "/dashboard/addresses", label: "Saved Addresses", icon: MapPin },
  { to: "/dashboard/reviews", label: "My Reviews", icon: Star },
  { to: "/dashboard/settings", label: "Account Settings", icon: Settings },
  { to: "/dashboard/support", label: "Help & Support", icon: CircleHelp },
];

/** Two-letter monogram for the avatar tile. */
export const initialsOf = (name?: string | null) =>
  (name ?? "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "U";

/** `9012011604` → `+91 90120 11604` */
export const formatMobile = (mobile?: string | null) => {
  const digits = (mobile ?? "").replace(/\D/g, "").slice(-10);
  return digits.length === 10 ? `+91 ${digits.slice(0, 5)} ${digits.slice(5)}` : (mobile ?? "");
};
