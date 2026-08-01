import DOMPurify from "dompurify";
import {
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  CreditCard,
  Headphones,
  MessageCircle,
  Search,
  ShieldCheck,
  UserRoundPlus,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Container from "../../components/shared/container";
import { useFetchFaqs } from "../../react-query/hooks";

type CategoryDefinition = {
  id: string;
  label: string;
  icon: typeof CircleHelp;
  iconClassName: string;
  iconBackground: string;
};

type FaqItem = {
  id: number;
  category_id: number | null;
  question: string;
  answer: string;
};

type FaqGroup = CategoryDefinition & {
  faqs: FaqItem[];
};

const CATEGORY_DEFINITIONS: Record<string, CategoryDefinition> = {
  "1": {
    id: "1",
    label: "Booking & Services",
    icon: CalendarDays,
    iconClassName: "text-blue-700",
    iconBackground: "bg-blue-50",
  },
  "2": {
    id: "2",
    label: "Payments",
    icon: CreditCard,
    iconClassName: "text-emerald-700",
    iconBackground: "bg-emerald-50",
  },
  "3": {
    id: "3",
    label: "Worker Registration",
    icon: UserRoundPlus,
    iconClassName: "text-violet-700",
    iconBackground: "bg-violet-50",
  },
  "4": {
    id: "4",
    label: "Safety & Support",
    icon: ShieldCheck,
    iconClassName: "text-amber-700",
    iconBackground: "bg-amber-50",
  },
};

const FALLBACK_CATEGORY: CategoryDefinition = {
  id: "general",
  label: "Common Questions",
  icon: CircleHelp,
  iconClassName: "text-slate-700",
  iconBackground: "bg-slate-100",
};

const stripMarkup = (value: string) => DOMPurify.sanitize(value, { ALLOWED_TAGS: [] }).trim();

const getCategory = (categoryId: number | null): CategoryDefinition => {
  if (categoryId === null) return FALLBACK_CATEGORY;

  return (
    CATEGORY_DEFINITIONS[String(categoryId)] ?? {
      ...FALLBACK_CATEGORY,
      id: String(categoryId),
      label: "More Questions",
    }
  );
};

const FaqHero = ({ search, onSearchChange }: { search: string; onSearchChange: (value: string) => void }) => (
  <section className="relative isolate overflow-hidden bg-[#062b79] text-white">
    <img
      src="/images/faq-hero.png"
      alt=""
      className="absolute inset-0 h-full w-full object-cover object-[62%_center] sm:object-center"
      aria-hidden="true"
    />
    <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(2,26,89,0.96)_0%,rgba(3,38,116,0.88)_38%,rgba(4,54,157,0.35)_66%,rgba(4,54,157,0.08)_100%)]" />

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

const FaqCategoryFilter = ({
  groups,
  totalCount,
  selected,
  onSelect,
}: {
  groups: FaqGroup[];
  totalCount: number;
  selected: string;
  onSelect: (category: string) => void;
}) => (
  <nav
    className="rounded-[1.75rem] border border-slate-200/80 bg-white p-2.5 shadow-[0_24px_70px_rgba(15,23,42,0.12)] sm:p-3"
    aria-label="FAQ categories"
  >
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
      <button
        type="button"
        onClick={() => onSelect("all")}
        aria-pressed={selected === "all"}
        className={`col-span-2 flex min-h-[76px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:px-4 lg:col-span-1 ${
          selected === "all"
            ? "border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-700/20"
            : "border-transparent bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
        }`}
      >
        <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${selected === "all" ? "bg-white/15" : "bg-white text-blue-700 shadow-sm"}`}>
          <BriefcaseBusiness size={19} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold">All FAQs</span>
          <span className={`mt-0.5 block text-xs font-normal ${selected === "all" ? "text-blue-100" : "text-slate-500"}`}>
            {totalCount} questions
          </span>
        </span>
      </button>
      {groups.map(({ id, label, icon: Icon, iconBackground, iconClassName, faqs }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          aria-pressed={selected === id}
          className={`flex min-h-[76px] items-center gap-3 rounded-2xl border px-3 py-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:px-4 ${
            selected === id
              ? "border-blue-700 bg-blue-700 text-white shadow-lg shadow-blue-700/20"
              : "border-transparent bg-slate-50 text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-800"
          }`}
        >
          <span className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${selected === id ? "bg-white/15" : `${iconBackground} ${iconClassName}`}`}>
            <Icon size={19} aria-hidden="true" />
          </span>
          <span className="min-w-0">
            <span className="block text-sm font-bold leading-5">{label}</span>
            <span className={`mt-0.5 block text-xs font-normal ${selected === id ? "text-blue-100" : "text-slate-500"}`}>
              {faqs.length} {faqs.length === 1 ? "question" : "questions"}
            </span>
          </span>
        </button>
      ))}
    </div>
  </nav>
);

const FaqGroupCard = ({ group }: { group: FaqGroup }) => {
  const Icon = group.icon;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.06)] sm:p-6">
      <div className="mb-3 flex items-center gap-3 border-b border-slate-100 pb-5">
        <span className={`flex size-11 items-center justify-center rounded-2xl ${group.iconBackground}`}>
          <Icon className={group.iconClassName} size={21} aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-lg font-bold tracking-tight text-slate-950">{group.label}</h2>
          <p className="mt-0.5 text-xs font-normal text-slate-500">
            {group.faqs.length} {group.faqs.length === 1 ? "answer" : "answers"}
          </p>
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {group.faqs.map((faq) => (
          <details key={faq.id} className="group py-1">
            <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 rounded-xl px-2 py-3 text-sm font-semibold leading-6 text-slate-800 transition hover:bg-blue-50 hover:text-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 [&::-webkit-details-marker]:hidden">
              <span>{faq.question}</span>
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
          href="https://wa.me/918600999922"
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
  <div className="grid gap-5 md:grid-cols-2" aria-label="Loading frequently asked questions" aria-busy="true">
    {[0, 1, 2, 3].map((item) => (
      <div key={item} className="h-72 animate-pulse rounded-3xl border border-slate-200 bg-white p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="size-11 rounded-2xl bg-slate-100" />
          <div className="h-5 w-40 rounded bg-slate-100" />
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full rounded bg-slate-100" />
          <div className="h-4 w-5/6 rounded bg-slate-100" />
          <div className="h-4 w-4/5 rounded bg-slate-100" />
        </div>
      </div>
    ))}
  </div>
);

const FaqsPage = () => {
  const { data, isLoading, isError, refetch } = useFetchFaqs();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const groups = useMemo<FaqGroup[]>(() => {
    const grouped = new Map<string, FaqGroup>();
    const normalizedSearch = search.trim().toLocaleLowerCase();

    (data?.faqs ?? []).forEach((faq) => {
      const category = getCategory(faq.category_id);
      const matchesSearch =
        !normalizedSearch ||
        faq.question.toLocaleLowerCase().includes(normalizedSearch) ||
        stripMarkup(faq.answer).toLocaleLowerCase().includes(normalizedSearch);

      if (!matchesSearch) return;

      const existing = grouped.get(category.id);
      if (existing) {
        existing.faqs.push(faq);
      } else {
        grouped.set(category.id, { ...category, faqs: [faq] });
      }
    });

    return Array.from(grouped.values());
  }, [data, search]);

  const availableGroups = useMemo<FaqGroup[]>(() => {
    const grouped = new Map<string, FaqGroup>(
      Object.values(CATEGORY_DEFINITIONS).map((category) => [category.id, { ...category, faqs: [] }]),
    );
    (data?.faqs ?? []).forEach((faq) => {
      const category = getCategory(faq.category_id);
      if (category.id === FALLBACK_CATEGORY.id) return;
      const existing = grouped.get(category.id);
      if (existing) existing.faqs.push(faq);
      else grouped.set(category.id, { ...category, faqs: [faq] });
    });
    return Array.from(grouped.values());
  }, [data]);

  const visibleGroups = selectedCategory === "all" ? groups : groups.filter(({ id }) => id === selectedCategory);

  return (
    <main className="bg-slate-50">
      <FaqHero search={search} onSearchChange={setSearch} />

      <Container className="relative -mt-12 pb-10 sm:-mt-14 sm:pb-14 lg:-mt-16 lg:pb-20">
        {!isLoading && !isError && (
          <FaqCategoryFilter
            groups={availableGroups}
            totalCount={data?.faqs.length ?? 0}
            selected={selectedCategory}
            onSelect={setSelectedCategory}
          />
        )}

        <div className="mt-8 sm:mt-10">
          {isLoading ? (
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
          ) : visibleGroups.length > 0 ? (
            <div className="grid items-start gap-5">
              {visibleGroups.map((group) => (
                <FaqGroupCard key={group.id} group={group} />
              ))}
              <SupportCard />
            </div>
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
                  setSelectedCategory("all");
                }}
                className="mt-6 min-h-11 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </Container>
    </main>
  );
};

export default FaqsPage;
