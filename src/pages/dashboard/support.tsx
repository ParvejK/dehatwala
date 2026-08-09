import { ArrowUpRight, CircleHelp, Clock3, Mail, MessageCircle, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import SectionHeader from "../../components/dashboard/section-header";

const SUPPORT_PHONE = "+91 9997982419";
const SUPPORT_EMAIL = "support@dehatwala.com";
const WHATSAPP_URL = "https://wa.me/919997982419";

const CHANNELS = [
  {
    icon: MessageCircle,
    tone: "bg-emerald-50 text-emerald-600",
    title: "Chat on WhatsApp",
    copy: "Chat with our support team on WhatsApp.",
    action: "Open WhatsApp",
    href: WHATSAPP_URL,
    external: true,
    accent: "bg-emerald-500 hover:bg-emerald-600",
  },
  {
    icon: Phone,
    tone: "bg-[#eef4ff] text-[#0b3fc4]",
    title: "Call Support",
    copy: "Talk to our support executive now.",
    action: "Call Now",
    href: `tel:${SUPPORT_PHONE}`,
    external: false,
    accent: "bg-[#0b3fc4] hover:bg-[#0932a0]",
  },
  {
    icon: Mail,
    tone: "bg-violet-50 text-violet-600",
    title: "Email Support",
    copy: "Drop us an email, we will get back to you.",
    action: SUPPORT_EMAIL,
    href: `mailto:${SUPPORT_EMAIL}`,
    external: false,
    accent: "bg-violet-600 hover:bg-violet-700",
  },
];

const LINKS = [
  { icon: CircleHelp, title: "Frequently Asked Questions", copy: "Find answers to common questions.", to: "/faqs", action: "View FAQs" },
  { icon: ArrowUpRight, title: "Contact Us", copy: "Visit our contact page for more options.", to: "/contact", action: "Open Contact Page" },
];

const DashboardSupport = () => (
  <div className="space-y-5">
    <SectionHeader title="Help & Support" description="Our support team is here to assist you." />

    <ul className="space-y-3">
      {CHANNELS.map(({ icon: Icon, tone, title, copy, action, href, external, accent }) => (
        <li
          key={title}
          className="flex flex-col gap-3 rounded-2xl border border-[#dce7fb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex items-start gap-3.5">
            <span className={`grid size-11 shrink-0 place-items-center rounded-xl ${tone}`}>
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[13px] font-extrabold text-[#0f1e57]">{title}</h3>
              <p className="mt-0.5 text-[11px] leading-5 text-[#63739a]">{copy}</p>
            </div>
          </div>
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noreferrer" : undefined}
            className={`inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg px-5 text-[11px] font-extrabold text-white transition ${accent}`}
          >
            {action}
          </a>
        </li>
      ))}

      {LINKS.map(({ icon: Icon, title, copy, to, action }) => (
        <li
          key={title}
          className="flex flex-col gap-3 rounded-2xl border border-[#dce7fb] bg-white p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5"
        >
          <div className="flex items-start gap-3.5">
            <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-600">
              <Icon size={20} aria-hidden="true" />
            </span>
            <div>
              <h3 className="text-[13px] font-extrabold text-[#0f1e57]">{title}</h3>
              <p className="mt-0.5 text-[11px] leading-5 text-[#63739a]">{copy}</p>
            </div>
          </div>
          <Link
            to={to}
            className="inline-flex min-h-10 shrink-0 items-center justify-center rounded-lg border border-[#cfe0fb] bg-white px-5 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
          >
            {action}
          </Link>
        </li>
      ))}
    </ul>

    <div className="flex items-center gap-3 rounded-2xl border border-[#dce7fb] bg-[#f2f6fe] p-4 sm:p-5">
      <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white text-[#0b3fc4] shadow-sm">
        <Clock3 size={20} aria-hidden="true" />
      </span>
      <div>
        <h3 className="text-[13px] font-extrabold text-[#0f1e57]">24×7 Support</h3>
        <p className="mt-0.5 text-[11px] leading-5 text-[#63739a]">We are here for you, anytime you need us.</p>
      </div>
    </div>
  </div>
);

export default DashboardSupport;
