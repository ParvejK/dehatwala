import {
  Boxes,
  Clock,
  HardHat,
  IndianRupee,
  Package,
  PackageCheck,
  ShieldCheck,
  Timer,
  Truck,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type ServiceDetail = {
  slug: string;
  title: string;
  category: string;
  categoryHref: string;
  icon: LucideIcon;
  image: string;
  shortDescription: string[];
  heroFeatures: { icon: LucideIcon; label: string }[];
  about: { heading: string; description: string };
  benefits: { icon: LucideIcon; title: string; copy: string }[];
  included: string[];
  idealFor: string[];
  reviews: { name: string; role: string; rating: number; quote: string }[];
  trustBanner: { heading: string; description: string };
};

const CATEGORY = "Loading & Material Handling Services";
const CATEGORY_HREF = "/service/loading-material-handling";

const heroFeatures = [
  { icon: HardHat, label: "Trained & Verified Workers" },
  { icon: Clock, label: "On-Time Service" },
  { icon: IndianRupee, label: "Transparent Pricing" },
];

export const serviceDetails: Record<string, ServiceDetail> = {
  "material-handling": {
    slug: "material-handling",
    title: "Material Handling",
    category: CATEGORY,
    categoryHref: CATEGORY_HREF,
    icon: Boxes,
    image: "/images/services/loading-material-handling/material-handling.jpg",
    shortDescription: [
      "Hire skilled workers for safe material shifting and professional on-site handling.",
      "Perfect for warehouses, factories and construction sites.",
    ],
    heroFeatures,
    about: {
      heading: "About Material Handling",
      description:
        "We provide trained workers for safe and efficient material handling, so your goods move across your site without damage or delay.",
    },
    benefits: [
      { icon: ShieldCheck, title: "Safe Material Shifting", copy: "Every item is moved with utmost care." },
      { icon: Wrench, title: "Right Equipment", copy: "Trolleys and tools for heavy material movement." },
      { icon: Clock, title: "On-Time Service", copy: "Timely manpower to keep your work on schedule." },
      { icon: Users, title: "Skilled Workers", copy: "Experienced and trained workers for every site." },
    ],
    included: [
      "Lifting and shifting of materials",
      "Stacking and arranging at the right place",
      "Trolley and pallet movement support",
      "Careful handling of fragile materials",
      "Loading assistance (if required)",
    ],
    idealFor: [
      "Warehouses",
      "Construction Sites",
      "Factories & Industries",
      "Godowns & Storage Units",
      "Event & Exhibition Setups",
    ],
    reviews: [
      {
        name: "Rohit Sharma",
        role: "Gurugram",
        rating: 5,
        quote:
          "Dehatwala ki material handling service bahut achhi hai. Workers skilled aur time par aaye. Highly recommended!",
      },
      {
        name: "Amit Verma",
        role: "Construction Site",
        rating: 5,
        quote: "Very professional team. Saara material bina damage ke shift ho gaya. Bahut aasan raha.",
      },
      {
        name: "Mohd. Arif",
        role: "Warehouse Owner",
        rating: 5,
        quote: "Trained workers, proper equipment aur timely service. Great experience!",
      },
      {
        name: "Sandeep Yadav",
        role: "Factory Manager",
        rating: 5,
        quote: "Dehatwala se workers book karna easy aur reliable hai. Price bhi transparent hai.",
      },
    ],
    trustBanner: {
      heading: "Safe Handling, Zero Damage.",
      description: "Your materials are moved by our trained and verified handling experts.",
    },
  },

  "loading-unloading-work": {
    slug: "loading-unloading-work",
    title: "Loading/Unloading Work",
    category: CATEGORY,
    categoryHref: CATEGORY_HREF,
    icon: Truck,
    image: "/images/services/loading-material-handling/loading-unloading.jpg",
    shortDescription: [
      "Hire dependable workers for truck and container loading or unloading work.",
      "Perfect for transporters, warehouses and industries.",
    ],
    heroFeatures,
    about: {
      heading: "About Loading/Unloading Work",
      description:
        "We provide trained loading and unloading workers who handle trucks, containers and heavy consignments quickly and safely.",
    },
    benefits: [
      { icon: Timer, title: "Fast Turnaround", copy: "Trucks are cleared without long waiting time." },
      { icon: ShieldCheck, title: "Safe Handling", copy: "Goods are loaded and stacked with care." },
      { icon: Clock, title: "On-Time Service", copy: "Workers reach your site at the promised time." },
      { icon: Users, title: "Skilled Workers", copy: "Experienced teams for heavy loading work." },
    ],
    included: [
      "Truck and container loading",
      "Unloading and unstacking of goods",
      "Manual and trolley based movement",
      "Careful handling of heavy consignments",
      "Stacking at the right location",
    ],
    idealFor: [
      "Transport Companies",
      "Warehouses",
      "Construction Sites",
      "Factories & Industries",
      "E-commerce Businesses",
    ],
    reviews: [
      {
        name: "Rohit Sharma",
        role: "Gurugram",
        rating: 5,
        quote: "Dehatwala ki loading service bahut achhi hai. Workers time par aaye aur kaam jaldi hua!",
      },
      {
        name: "Amit Verma",
        role: "Transport Owner",
        rating: 5,
        quote: "Very professional team. Container unloading fast thi aur koi damage nahi hua.",
      },
      {
        name: "Mohd. Arif",
        role: "Warehouse Owner",
        rating: 5,
        quote: "Trained workers aur timely service. Truck ka waiting time kaafi kam ho gaya!",
      },
      {
        name: "Sandeep Yadav",
        role: "Factory Manager",
        rating: 5,
        quote: "Dehatwala se loading karwana easy aur reliable hai. Price bhi transparent hai.",
      },
    ],
    trustBanner: {
      heading: "On-Time Loading, Every Time.",
      description: "Your consignments are handled by our trained and verified loading experts.",
    },
  },

  "material-packing": {
    slug: "material-packing",
    title: "Material Packing",
    category: CATEGORY,
    categoryHref: CATEGORY_HREF,
    icon: Package,
    image: "/images/services/loading-material-handling/packing.jpg",
    shortDescription: [
      "Hire skilled workers for safe, secure and professional material packing services.",
      "Perfect for warehouses, sites and industries.",
    ],
    heroFeatures,
    about: {
      heading: "About Material Packing",
      description:
        "We provide safe, secure and professional material packing services to protect your goods during storage, transportation or shifting.",
    },
    benefits: [
      { icon: ShieldCheck, title: "Safe & Secure Packing", copy: "Items are packed with utmost care." },
      { icon: PackageCheck, title: "Quality Materials", copy: "We use the best packing materials for maximum protection." },
      { icon: Clock, title: "On-Time Service", copy: "Timely packing services to keep your work on schedule." },
      { icon: Users, title: "Skilled Workers", copy: "Experienced and trained workers for efficient packing solutions." },
    ],
    included: [
      "Sorting and organizing materials",
      "High-quality packing with proper materials",
      "Labeling and categorization",
      "Secure sealing and wrapping",
      "Loading assistance (if required)",
    ],
    idealFor: [
      "Warehouses",
      "Construction Sites",
      "Factories & Industries",
      "Shifting & Relocation",
      "E-commerce Businesses",
    ],
    reviews: [
      {
        name: "Rohit Sharma",
        role: "Gurugram",
        rating: 5,
        quote:
          "Dehatwala ki material packing service bahut achhi hai. Workers skilled aur time par aaye. Highly recommended!",
      },
      {
        name: "Amit Verma",
        role: "Construction Site",
        rating: 5,
        quote: "Very professional team. Packing quality excellent thi. Saara material safe aur secure raha.",
      },
      {
        name: "Mohd. Arif",
        role: "Warehouse Owner",
        rating: 5,
        quote: "Trained workers, proper packing materials aur timely service. Great experience!",
      },
      {
        name: "Sandeep Yadav",
        role: "Factory Manager",
        rating: 5,
        quote: "Dehatwala se packing karwana easy aur reliable hai. Price bhi transparent hai.",
      },
    ],
    trustBanner: {
      heading: "Trusted Packing, Total Protection.",
      description: "Your materials are safe with our trained and verified packing experts.",
    },
  },
};
