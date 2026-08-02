import { ArrowUpRight, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const linkGroups = [
  { title: "Company", links: [["About us", "/about-us"], ["Contact us", "/contact"], ["Media & news", "/media-news"], ["Careers", "/jobs"], ["Blog", "/blog"]] },
  { title: "Legal", links: [["Privacy policy", "/privacy-policy"], ["Terms & conditions", "/terms-and-conditions"], ["Cancellation policy", "/cancellation-policy"], ["Refund policy", "/refund-policy"]] },
  { title: "For workers", links: [["Join Dehatwala", "/become-a-part-of-dehatwala"], ["Worker Agreement", "/terms-and-conditions"], ["Worker FAQs", "/faqs"], ["Find work opportunities", "/jobs"]] },
  { title: "For customers", links: [["Book a worker", "/#book-a-worker"], ["Explore services", "/#book-a-worker"], ["How it works", "/#how-it-works"], ["Customer FAQs", "/faqs"], ["Contact support", "/contact"]] },
];

const Footer = () => (
  <footer className="bg-gradient-to-br from-blue-950 via-blue-900 to-blue-700 text-white">
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10">
      <div className="grid gap-12 border-b border-white/15 pb-12 lg:grid-cols-[1.3fr_3fr]">
        <div>
          <Link to="/" aria-label="Dehatwala home">
            <img src="/logo/white-logo.png" alt="Dehatwala" className="h-auto w-[200px] max-w-full object-contain sm:w-[224px]" />
          </Link>
          <h2 className="mt-5 text-lg font-bold">India’s Trusted Workforce Platform</h2>
          <p className="mt-3 max-w-sm text-sm leading-6 text-blue-100/75">Connecting customers with verified independent blue-collar workers through a smarter workforce platform.</p>
          <p className="mt-7 text-xs font-black uppercase tracking-[0.18em] text-amber-300">Connect with us</p>
          <div className="mt-4 flex gap-2">
            {[[Instagram, "Instagram", "https://www.instagram.com/dehatwala1"], [Facebook, "Facebook", "https://www.facebook.com"], [Linkedin, "LinkedIn", "https://www.linkedin.com"], [Youtube, "YouTube", "https://www.youtube.com/@DehatwalaPvt"]].map(([Icon, label, href]) => { const SocialIcon = Icon as typeof Instagram; return <a key={label as string} href={href as string} target="_blank" rel="noreferrer" aria-label={label as string} className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-white hover:text-blue-800"><SocialIcon size={18} /></a>; })}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {linkGroups.map((group) => <div key={group.title}><h2 className="text-sm font-extrabold text-white">{group.title}</h2><ul className="mt-5 space-y-3">{group.links.map(([label, to]) => <li key={`${group.title}-${label}`}><Link to={to} className="group inline-flex items-center gap-1 text-sm text-blue-100/70 transition hover:text-white">{label}<ArrowUpRight size={12} className="opacity-0 transition group-hover:opacity-100" /></Link></li>)}</ul></div>)}
        </div>
      </div>
      <div className="flex flex-col gap-3 pt-7 text-xs text-blue-100/65 md:flex-row md:items-center md:justify-between">
        <p>© 2026 Dehatwala Manpower Services Pvt. Ltd. All rights reserved.</p>
        <p>Supporting local workers. Building a better India · Make in India 🇮🇳</p>
      </div>
    </div>
  </footer>
);

export default Footer;
