import DOMPurify from "dompurify";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Headphones,
  Lightbulb,
  MessageCircle,
  Search,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/shared/container";
import { useFetchFaqCategories, useFetchFaqs } from "../../react-query/hooks";
import { FaqCategory } from "../../types";

const ALL = "all";

type FaqItem = {
  id: number;
  category_id: number | null;
  question: string;
  answer: string;
  /** Nested by the API on every FAQ row. */
  category?: FaqCategory | null;
};

type CategoryStyle = {
  icon: typeof CircleHelp;
  iconClassName: string;
  iconBackground: string;
};

type CategoryTab = CategoryStyle & {
  id: string;
  label: string;
  count: number;
};

/**
 * The API currently provides no usable icon key, so match both category slug
 * and name. This tolerates wording such as "Payments & Refunds" while keeping
 * a neutral fallback for new categories.
 */
const BOOKING_STYLE: CategoryStyle = {
  icon: CalendarDays,
  iconClassName: "text-blue-700",
  iconBackground: "bg-blue-50",
};

const GENERAL_STYLE: CategoryStyle = {
  icon: Lightbulb,
  iconClassName: "text-cyan-700",
  iconBackground: "bg-cyan-50",
};

const PAYMENT_STYLE: CategoryStyle = {
  icon: CreditCard,
  iconClassName: "text-emerald-700",
  iconBackground: "bg-emerald-50",
};

const WORKER_STYLE: CategoryStyle = {
  icon: UserRoundPlus,
  iconClassName: "text-violet-700",
  iconBackground: "bg-violet-50",
};

const SAFETY_STYLE: CategoryStyle = {
  icon: ShieldCheck,
  iconClassName: "text-amber-700",
  iconBackground: "bg-amber-50",
};

const DEFAULT_STYLE: CategoryStyle = {
  icon: CircleHelp,
  iconClassName: "text-slate-700",
  iconBackground: "bg-slate-100",
};

const styleFor = (slug?: string | null, name?: string | null) => {
  const categoryKey = `${slug ?? ""} ${name ?? ""}`.toLocaleLowerCase();

  if (categoryKey.includes("book") || categoryKey.includes("service")) return BOOKING_STYLE;
  if (categoryKey.includes("payment") || categoryKey.includes("refund")) return PAYMENT_STYLE;
  if (categoryKey.includes("worker") || categoryKey.includes("registration")) return WORKER_STYLE;
  if (categoryKey.includes("safety") || categoryKey.includes("support")) return SAFETY_STYLE;
  if (categoryKey.includes("general")) return GENERAL_STYLE;

  return DEFAULT_STYLE;
};

const stripMarkup = (value: string) => DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).trim();
const stripQuestionNumber = (value: string) => value.replace(/^\s*\d+\s*[.)-]\s*/, "");

const FaqHero = ({ search, onSearchChange }: { search: string; onSearchChange: (value: string) => void }) => (
  <section className="relative isolate overflow-hidden bg-[#062b79] text-white">
    <img
      src="/images/faq-hero.png"
      alt=""
      className="absolute inset-0 h-full w-full object-contain object-right-bottom opacity-70 sm:opacity-90 lg:opacity-100"
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,26,89,0.98)_0%,rgba(3,38,116,0.94)_38%,rgba(4,54,157,0.35)_68%,rgba(4,54,157,0.03)_100%)]" />

    <Container className="relative flex min-h-[460px] items-center pb-24 pt-14 lg:min-h-[500px] lg:pb-28 lg:pt-16">
      <div className="relative z-10 max-w-2xl">
        <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-blue-100 backdrop-blur">
          <CircleHelp size={15} aria-hidden="true" /> Dehatwala help centre
        </p>
        <h1 className="max-w-xl text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          Frequently Asked <span className="text-amber-400">Questions</span>
        </h1>
        <p className="mt-6 max-w-xl text-sm font-normal leading-7 text-blue-100 sm:text-base">
          Find answers about booking workers, worker matching, service requests, payments, and joining the Dehatwala
          worker network.
        </p>

        <label className="mt-8 flex max-w-xl items-center gap-3 rounded-2xl border border-white/20 bg-white p-2.5 pl-4 text-slate-900 shadow-2xl shadow-blue-950/25 focus-within:ring-4 focus-within:ring-blue-300/40">
          <Search className="shrink-0 text-blue-700" size={20} aria-hidden="true" />
          <span className="sr-only">Search frequently asked questions</span>
          <input
            type="search"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Search your question..."
            className="min-w-0 flex-1 bg-transparent px-1 py-2 text-sm font-normal outline-none placeholder:text-slate-400"
          />
        </label>
      </div>
    </Container>
  </section>
);

const CategoryTabs = ({
  tabs,
  totalCount,
  selected,
  onSelect,
}: {
  tabs: CategoryTab[];
  totalCount: number;
  selected: string;
  onSelect: (category: string) => void;
}) => {
  const tabClass = (isActive: boolean) =>
    `flex min-h-[76px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:px-4 ${
      isActive
        ? "border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-700/20"
        : "border-transparent bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
    }`;

  return (
    <nav
      className="rounded-[1.75rem] border border-slate-200/80 bg-white p-2.5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3"
      aria-label="FAQ categories"
    >
      <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
        <button
          type="button"
          onClick={() => onSelect(ALL)}
          aria-pressed={selected === ALL}
          className={`col-span-2 lg:col-span-1 ${tabClass(selected === ALL)}`}
        >
          <span
            className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
              selected === ALL ? "bg-white/15" : "bg-white text-blue-700 shadow-sm"
            }`}
          >
            <BriefcaseBusiness size={19} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold">All FAQs</span>
            <span className={`mt-0.5 block text-xs font-normal ${selected === ALL ? "text-blue-100" : "text-slate-500"}`}>
              {totalCount} questions
            </span>
          </span>
        </button>

        {tabs.map(({ id, label, icon: Icon, iconBackground, iconClassName, count }) => (
          <button
            key={id}
            type="button"
            onClick={() => onSelect(id)}
            aria-pressed={selected === id}
            className={tabClass(selected === id)}
          >
            <span
              className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${
                selected === id ? "bg-white/15" : `${iconBackground} ${iconClassName}`
              }`}
            >
              <Icon size={19} aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-bold leading-5">{label}</span>
              <span className={`mt-0.5 block text-xs font-normal ${selected === id ? "text-blue-100" : "text-slate-500"}`}>
                {count} {count === 1 ? "question" : "questions"}
              </span>
            </span>
          </button>
        ))}
      </div>
    </nav>
  );
};

const FaqList = ({ title, style, faqs }: { title: string; style: CategoryStyle; faqs: FaqItem[] }) => {
  const Icon = style.icon;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-5">
        <span className={`flex size-11 items-center justify-center rounded-2xl ${style.iconBackground}`}>
          <Icon className={style.iconClassName} size={21} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950">{title}</h2>
          <p className="mt-0.5 text-xs font-normal text-slate-500">
            {faqs.length} {faqs.length === 1 ? "answer" : "answers"}
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {faqs.map((faq, index) => (
          <details key={faq.id} className="group py-1">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-2 py-3 text-sm font-semibold leading-6 text-slate-800 transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 [&::-webkit-details-marker]:hidden">
              <span className="flex min-w-0 items-start gap-2">
                <span className="min-w-6 shrink-0 text-right font-bold text-blue-700">
                  {index + 1}.
                </span>
                <span>{stripQuestionNumber(faq.question)}</span>
              </span>
              <ChevronDown
                className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180 group-open:text-blue-700"
                size={18}
                aria-hidden="true"
              />
            </summary>
            <div
              className="faq-answer px-2 pb-4 pr-8 text-sm font-normal leading-7 text-slate-600"
              dangerouslySetInnerHTML={{
                __html: faq.answer ? DOMPurify.sanitize(faq.answer) : "<p>No content available.</p>",
              }}
            />
          </details>
        ))}
      </div>
    </section>
  );
};

const SupportCard = () => (
  <aside className="relative overflow-hidden rounded-3xl bg-[#062b79] p-6 text-white shadow-xl shadow-blue-950/10 sm:p-8">
    <div className="absolute -right-14 -top-20 size-64 rounded-full bg-blue-500/25 blur-2xl" />
    <div className="relative grid items-center gap-6 lg:grid-cols-[1fr_auto]">
      <div className="flex items-start gap-4">
        <span className="hidden size-14 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:flex">
          <Headphones size={27} className="text-amber-400" aria-hidden="true" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-200">Assisted support</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Still have questions?</h2>
          <p className="mt-3 max-w-2xl text-sm font-normal leading-7 text-blue-100">
            Need help with a service request, worker registration, or workforce requirement? Dehatwala&rsquo;s support
            team is here to guide you.
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href="https://wa.me/919997982419"
          target="_blank"
          rel="noreferrer"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600 focus:outline-none focus-visible:ring-4 focus-visible:ring-emerald-200"
        >
          <MessageCircle size={18} aria-hidden="true" /> Chat on WhatsApp
        </a>
        <Link
          to="/contact"
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white px-5 py-3 text-sm font-semibold text-blue-900 transition hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          Contact support <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
    </div>
  </aside>
);

const LoadingState = () => (
  <div
    className="animate-pulse rounded-3xl border border-slate-200 bg-white p-6"
    aria-label="Loading frequently asked questions"
    aria-busy="true"
  >
    <div className="mb-6 flex items-center gap-3 border-b border-slate-100 pb-5">
      <div className="size-11 rounded-2xl bg-slate-100" />
      <div className="h-5 w-40 rounded bg-slate-100" />
    </div>
    <div className="space-y-5">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="h-4 rounded bg-slate-100" style={{ width: `${95 - item * 6}%` }} />
      ))}
    </div>
  </div>
);

const FaqsPage = () => {
  const { data, isLoading, isError, refetch } = useFetchFaqs();
  const categoriesQuery = useFetchFaqCategories();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(ALL);

  const allFaqs = useMemo<FaqItem[]>(() => data?.faqs ?? [], [data]);

  /** Tabs come from the categories endpoint; counts from the FAQ list itself. */
  const tabs = useMemo<CategoryTab[]>(() => {
    const counts = new Map<string, number>();
    allFaqs.forEach((faq) => {
      const key = String(faq.category_id ?? "");
      counts.set(key, (counts.get(key) ?? 0) + 1);
    });

    return (categoriesQuery.data?.categories ?? [])
      .map((category) => ({
        id: String(category.id),
        label: category.name,
        count: counts.get(String(category.id)) ?? 0,
        ...styleFor(category.slug, category.name),
      }))
      .filter((tab) => tab.count > 0);
  }, [categoriesQuery.data, allFaqs]);

  const activeTab = selected === ALL ? null : tabs.find((tab) => tab.id === selected);

  const visibleFaqs = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();

    return allFaqs
      .filter((faq) => selected === ALL || String(faq.category_id) === selected)
      .filter(
        (faq) =>
          !normalizedSearch ||
          faq.question.toLocaleLowerCase().includes(normalizedSearch) ||
          stripMarkup(faq.answer).toLocaleLowerCase().includes(normalizedSearch),
      );
  }, [allFaqs, selected, search]);

  const isBusy = isLoading || categoriesQuery.isLoading;

  return (
    <main className="bg-slate-50">
      <FaqHero search={search} onSearchChange={setSearch} />

      <Container className="relative -mt-12 pb-10 sm:-mt-14 sm:pb-14 lg:-mt-16 lg:pb-20">
        {!isBusy && !isError && tabs.length > 0 && (
          <CategoryTabs tabs={tabs} totalCount={allFaqs.length} selected={selected} onSelect={setSelected} />
        )}

        <div className="mt-8 grid items-start gap-5 sm:mt-10">
          {isBusy ? (
            <LoadingState />
          ) : isError ? (
            <div className="rounded-3xl border border-red-200 bg-white px-6 py-14 text-center shadow-sm" role="alert">
              <CircleHelp className="mx-auto text-red-500" size={36} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">We couldn&rsquo;t load the FAQs</h2>
              <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-slate-600">
                Please check your connection and try again. You can still contact our support team for immediate help.
              </p>
              <button
                type="button"
                onClick={() => void refetch()}
                className="mt-6 min-h-11 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
              >
                Try again
              </button>
            </div>
          ) : visibleFaqs.length > 0 ? (
            <FaqList
              title={activeTab ? activeTab.label : "All Questions"}
              style={activeTab ?? { icon: CircleHelp, iconClassName: "text-blue-700", iconBackground: "bg-blue-50" }}
              faqs={visibleFaqs}
            />
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white px-6 py-14 text-center shadow-sm">
              <Search className="mx-auto text-blue-700" size={36} aria-hidden="true" />
              <h2 className="mt-4 text-xl font-bold text-slate-950">No matching questions found</h2>
              <p className="mx-auto mt-2 max-w-md text-sm font-normal leading-6 text-slate-600">
                Try a shorter search, choose another category, or contact our support team for help.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setSelected(ALL);
                }}
                className="mt-6 min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                Clear filters
              </button>
            </div>
          )}

          <SupportCard />
        </div>
      </Container>
    </main>
  );
};

export default FaqsPage;
