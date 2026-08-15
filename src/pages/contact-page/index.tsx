import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowRight,
  CalendarCheck2,
  CheckCircle2,
  Headphones,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
  Zap,
} from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";
import { API_URL } from "../../react-query/constants";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Invalid phone number"),
  message: z.string().min(1, "Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const contactDetails = [
  {
    icon: Phone,
    label: "Call our team",
    value: "+91 9997982419",
    supportingText: "For bookings and general support",
    href: "tel:+919997982419",
  },
  {
    icon: Mail,
    label: "Email us",
    value: "info@dehatwala.com",
    supportingText: "We will respond as soon as possible",
    href: "mailto:info@dehatwala.com",
  },
  {
    icon: MapPin,
    label: "Visit our office",
    value: "161/56 Joga Bai, Jamia Nagar",
    supportingText: "New Delhi 110025",
    href: "https://www.google.com/maps/search/?api=1&query=161%2F56%20Joga%20Bai%20Jamia%20Nagar%20New%20Delhi%20110025",
  },
] as const;

const supportHighlights = [
  {
    icon: Zap,
    title: "Quick Response",
  },
  {
    icon: Headphones,
    title: "24×7 Support",
  },
  {
    icon: CalendarCheck2,
    title: "Booking Assistant",
  },
  {
    icon: MapPin,
    title: "Local Workforce",
  },
] as const;

const inputClassName =
  "mt-2 min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-100";

const ContactUsPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const mutation = useMutation<unknown, unknown, ContactFormValues>({
    mutationFn: (data) => axios.post(`${API_URL}/contact-us`, data),
    onSuccess: () => {
      toast.success("Message sent successfully!");
      reset();
    },
    onError: () => {
      toast.error("Failed to send message. Please try again.");
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    mutation.mutate(data);
  };

  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <section className="bg-white px-4 pt-5 sm:px-8 sm:pt-7 lg:px-10">
        <div className="relative isolate mx-auto max-w-7xl overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-[0_28px_80px_-46px_rgba(15,47,112,0.45)]">
          <img
            src="/images/contact-us-hero.png"
            alt="A Dehatwala support agent on a headset helping customers from her desk"
            className="absolute inset-y-0 right-0 -z-20 hidden h-full w-[57%] object-cover object-right lg:block"
          />
          <div
            className="pointer-events-none absolute inset-0 -z-10 hidden bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.99)_40%,rgba(255,255,255,0.9)_50%,rgba(255,255,255,0.16)_72%,transparent_100%)] lg:block"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -left-24 -top-24 -z-10 size-64 rounded-full bg-blue-100/70 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative z-10 px-6 py-9 sm:px-10 sm:py-12 lg:flex lg:min-h-[600px] lg:w-[58%] lg:flex-col lg:justify-center lg:px-14 lg:py-16">
            <div className="max-w-xl">
            <p className="inline-flex items-center gap-2.5 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-[0.68rem] font-bold uppercase tracking-[0.22em] text-blue-800 shadow-sm backdrop-blur">
              <span className="size-1.5 rounded-full bg-yellow-400 ring-4 ring-yellow-100" aria-hidden="true" />
              We are here to help
            </p>
            <h1 className="mt-6 text-4xl font-black leading-[1.04] tracking-[-0.05em] text-[#08255c] sm:text-5xl lg:text-[3.75rem]">
              How can we
              <span className="block text-blue-700">help you today?</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
              Need help finding a worker, managing a booking, or joining our network? Share a few details and our team
              will point you in the right direction.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a
                href="#contact-form"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-blue-700/20 transition hover:-translate-y-0.5 hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Send us a message <ArrowRight size={17} aria-hidden="true" />
              </a>
              <a
                href="tel:+919997982419"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white/80 px-5 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <Phone size={17} aria-hidden="true" /> Call our team
              </a>
            </div>
            </div>

            <div className="mt-9 grid max-w-xl grid-cols-2 gap-x-5 gap-y-5 border-t border-blue-100 pt-6 sm:gap-x-8">
              {supportHighlights.map(({ icon: Icon, title }) => (
                <div key={title} className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700 shadow-sm">
                    <Icon size={17} strokeWidth={2.2} aria-hidden="true" />
                  </span>
                  <p className="text-xs font-extrabold leading-4 text-slate-700 sm:text-[13px]">{title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative border-t border-blue-100 lg:hidden">
            <img
              src="/images/contact-us-hero.png"
              alt="A Dehatwala support agent on a headset helping customers from her desk"
              className="aspect-[4/3] w-full object-cover object-right sm:aspect-[16/10]"
            />
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-white/35 to-transparent"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      <section id="contact-form" className="home-surface-soft scroll-mt-24 py-14 sm:py-18 lg:py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          <div className="grid gap-6 md:grid-cols-3">
            {contactDetails.map(({ icon: Icon, label, value, supportingText, href }) => (
              <a
                key={label}
                href={href}
                target={label === "Visit our office" ? "_blank" : undefined}
                rel={label === "Visit our office" ? "noreferrer" : undefined}
                className="group rounded-[1.5rem] border border-blue-100 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-950/[0.07] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                <span className="grid size-12 place-items-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">{label}</p>
                <p className="mt-2 text-base font-extrabold text-slate-950">{value}</p>
                <p className="mt-1 text-sm leading-6 text-slate-500">{supportingText}</p>
              </a>
            ))}
          </div>

          <div className="mt-8 grid overflow-hidden rounded-[2rem] border border-blue-100 bg-white shadow-xl shadow-blue-950/[0.06] lg:grid-cols-[0.72fr_1.28fr]">
            <aside className="relative isolate overflow-hidden bg-blue-700 p-7 text-white sm:p-10 lg:p-12">
              <div
                className="pointer-events-none absolute -bottom-28 -left-28 -z-10 size-72 rounded-full border-[48px] border-white/5"
                aria-hidden="true"
              />
              <span className="grid size-12 place-items-center rounded-2xl bg-white/10 text-blue-100">
                <MessageSquareText size={23} aria-hidden="true" />
              </span>
              <p className="mt-8 text-xs font-bold uppercase tracking-[0.2em] text-blue-200">Send a message</p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">Tell us how we can help.</h2>
              <p className="mt-5 text-sm leading-7 text-blue-100">
                Give us enough detail to understand what you need. Our support team will review your message and get
                back to you.
              </p>
              <ul className="mt-8 space-y-4 text-sm font-semibold text-white">
                {[
                  "Booking and service questions",
                  "Worker registration support",
                  "Partnership and general enquiries",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-blue-200" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-10 rounded-2xl border border-white/15 bg-white/10 p-5">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <Headphones size={18} aria-hidden="true" /> Prefer to speak with us?
                </p>
                <a
                  href="tel:+919997982419"
                  className="mt-3 inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white"
                >
                  Call +91 9997982419 <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </aside>

            <div className="p-7 sm:p-10 lg:p-12">
              <div className="max-w-2xl">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Contact form</p>
                <h2 className="mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">Drop us a line</h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">Fields marked with an asterisk are required.</p>
              </div>

              <form className="mt-8 grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="name">
                    Full name <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("name")}
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? "name-error" : undefined}
                    className={inputClassName}
                  />
                  {errors.name && (
                    <p id="name-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700" htmlFor="phone">
                    Phone number <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("phone")}
                    id="phone"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    maxLength={10}
                    placeholder="10-digit mobile number"
                    aria-invalid={Boolean(errors.phone)}
                    aria-describedby={errors.phone ? "phone-error" : undefined}
                    className={inputClassName}
                  />
                  {errors.phone && (
                    <p id="phone-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-slate-700" htmlFor="email">
                    Email address <span className="text-red-600">*</span>
                  </label>
                  <input
                    {...register("email")}
                    id="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    className={inputClassName}
                  />
                  {errors.email && (
                    <p id="email-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="text-sm font-bold text-slate-700" htmlFor="message">
                    How can we help? <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    {...register("message")}
                    id="message"
                    rows={6}
                    placeholder="Tell us about your question or requirement"
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? "message-error" : "message-help"}
                    className={`${inputClassName} resize-y py-3`}
                  />
                  {errors.message ? (
                    <p id="message-error" role="alert" className="mt-2 text-xs font-medium text-red-600">
                      {errors.message.message}
                    </p>
                  ) : (
                    <p id="message-help" className="mt-2 text-xs text-slate-500">
                      Please do not include payment details or sensitive personal information.
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none sm:w-auto"
                  >
                    {mutation.isPending ? (
                      <>
                        <span className="loading loading-spinner loading-sm" aria-hidden="true" /> Sending message…
                      </>
                    ) : (
                      <>
                        Send message <Send size={17} aria-hidden="true" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactUsPage;
