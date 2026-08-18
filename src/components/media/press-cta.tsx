import { Mail, Megaphone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

/** Shared closing banner for the media pages. */
const PressCta = () => (
  <section
    aria-labelledby="press-cta-heading"
    className="overflow-hidden rounded-2xl bg-[#0a2a6b] px-5 py-6 sm:px-8 sm:py-7"
  >
    <div className="flex flex-col items-start gap-5 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex items-start gap-4">
        <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10 text-white">
          <Megaphone size={20} aria-hidden="true" />
        </span>
        <div>
          <h2 id="press-cta-heading" className="text-base font-extrabold leading-snug text-white sm:text-lg">
            Want to feature Dehatwala in your news stories?
          </h2>
          <p className="mt-1 text-xs leading-5 text-blue-100/80">
            We&rsquo;d love to connect with journalists, publishers and content creators.
          </p>
        </div>
      </div>

      <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
        <a
          href="https://wa.me/919997982419"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 text-[13px] font-bold text-white transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
        >
          <MessageCircle size={16} aria-hidden="true" /> Chat on WhatsApp
        </a>
        <Link
          to="/contact"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-white px-5 text-[13px] font-bold text-[#0a2a6b] transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-300"
        >
          <Mail size={16} aria-hidden="true" /> Contact Us
        </Link>
      </div>
    </div>
  </section>
);

export default PressCta;
