import { ArrowRight, BadgeCheck, ChevronDown, ChevronRight, Headphones, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { useCategories } from "../../react-query/hooks";
import LogoutButton from "../auth/logout";
import { DASHBOARD_LINKS, formatMobile } from "../dashboard/nav";
import RemoteAvatar from "./remote-avatar";

/** "Book a worker" lands on the full service listing. */
const SERVICE_LISTING_PATH = "/services/all";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuthStore();
  const { data, isLoading, isError } = useCategories();
  const { pathname } = useLocation();
  const closeMenu = () => setMenuOpen(false);

  // Redundant once the visitor is already browsing or reading about a service.
  // `/service/` with the trailing slash so `/service-reviews` is not caught.
  const hideBookCta = pathname.startsWith("/services/") || pathname.startsWith("/service/");

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,42,95,0.06)]">
      <div className="mx-auto flex h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10">
        <Link
          to="/"
          onClick={closeMenu}
          className="shrink-0 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          aria-label="Dehatwala home"
        >
          <img
            src="/logo/blue-logo.png"
            alt="Dehatwala"
            className="h-auto w-[132px] sm:w-[180px] xl:w-[200px]"
          />
        </Link>
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
          {[
            ["/", "Home"],
            ["/about-us", "About us"]
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
          <div className="dropdown dropdown-hover">
            <button
              type="button"
              tabIndex={0}
              className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
            >
              Services <ChevronDown size={15} aria-hidden="true" />
            </button>
            <ul tabIndex={0} className="dropdown-content menu z-50 mt-0 max-h-80 w-72 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl shadow-blue-950/10">
              {isLoading && <li><span>Loading categories…</span></li>}
              {isError && <li><span>Categories unavailable</span></li>}
              {data?.categories.map((category) => <li key={category.id}><Link className="rounded-lg" to={`/services/${category.slug}`}>{category.name}</Link></li>)}
            </ul>
          </div>
          {[
            ["/media-news", "Media & news"],
            ["/become-a-part-of-dehatwala", "Join Dehatwala"],
            ["/contact", "Contact"],
          ].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <a href="tel:+91 9997982419" aria-label="Call booking support" className="hidden size-10 items-center justify-center rounded-xl border border-slate-200 text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 xl:inline-flex"><Headphones size={18} aria-hidden="true" /></a>
          {!hideBookCta && (
            <Link to={SERVICE_LISTING_PATH} className="hidden min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:inline-flex">Book a worker <ArrowRight size={16} aria-hidden="true" /></Link>
          )}
          {user ? (
            <div className="dropdown dropdown-end">
              {/* A pill with a round avatar and a chevron: the flat square
                  badge read as a disabled button rather than a menu, and its
                  shape clashed with the rounded CTA beside it. */}
              <button
                type="button"
                tabIndex={0}
                aria-label="Open account menu"
                aria-haspopup="menu"
                className="group inline-flex min-h-11 items-center gap-2 rounded-full border border-slate-200 bg-white py-1 pl-1 pr-2 transition hover:border-blue-200 hover:bg-blue-50/50 hover:shadow-sm focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 xl:pr-3"
              >
                <RemoteAvatar
                  folder="user"
                  file={user.profile_img}
                  name={user.name}
                  className="size-8 shrink-0 rounded-full object-cover shadow-sm ring-1 ring-slate-900/10"
                  fallbackClassName="grid size-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-blue-800 text-[11px] font-extrabold uppercase leading-none tracking-wide text-white shadow-sm ring-1 ring-inset ring-white/25"
                />
                {/* The first name only, and only where there is room — the CTA
                    beside this already competes for the same space. Skipped
                    entirely when there is no name, so the flex gap does not
                    leave a hole beside the avatar. */}
                {!!(user.name ?? "").trim() && (
                  <span className="hidden max-w-[6.5rem] truncate text-[13px] font-bold text-slate-700 xl:inline">
                    {(user.name ?? "").trim().split(/\s+/)[0]}
                  </span>
                )}
                <ChevronDown
                  size={14}
                  className="shrink-0 text-slate-400 transition group-hover:text-blue-600"
                  aria-hidden="true"
                />
              </button>

              <div
                tabIndex={0}
                className="dropdown-content z-50 mt-3 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-[0_28px_70px_-24px_rgba(15,30,87,0.4)]"
              >
                {/* Identity card. The tinted band separates "who you are" from
                    "what you can do" without needing a hard rule. */}
                <div className="flex items-start gap-3 bg-gradient-to-br from-blue-50 to-white p-4">
                  <RemoteAvatar
                    folder="user"
                    file={user.profile_img}
                    name={user.name}
                    className="size-12 shrink-0 rounded-full object-cover ring-4 ring-white"
                    fallbackClassName="grid size-12 shrink-0 place-items-center rounded-full bg-blue-700 text-sm font-extrabold uppercase text-white ring-4 ring-white"
                  />
                  <div className="min-w-0 pt-0.5">
                    <p className="truncate text-sm font-extrabold leading-tight text-slate-900">{user.name}</p>
                    <p className="mt-1 truncate text-xs font-medium text-slate-500">{formatMobile(user.mobile_no)}</p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-emerald-700">
                      <BadgeCheck size={11} aria-hidden="true" /> Verified
                    </span>
                  </div>
                </div>

                <nav aria-label="Account" className="border-t border-slate-100 p-2">
                  <p className="px-3 pb-1 pt-2 text-[10px] font-extrabold uppercase tracking-[0.12em] text-slate-400">
                    Manage
                  </p>
                  {DASHBOARD_LINKS.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      // `group` so the chevron only asserts itself on hover;
                      // one on every row at rest was visual noise.
                      className="group flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="inline-flex min-w-0 items-center gap-3">
                        <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-slate-50 text-slate-500 transition group-hover:bg-white group-hover:text-blue-700">
                          <Icon size={16} aria-hidden="true" />
                        </span>
                        <span className="truncate">{label}</span>
                      </span>
                      <ChevronRight
                        size={15}
                        className="shrink-0 text-slate-300 opacity-0 transition group-hover:translate-x-0.5 group-hover:text-blue-400 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-slate-100 bg-slate-50/60 p-2">
                  <LogoutButton />
                </div>
              </div>
            </div>
          ) : <Link to="/sign-in" aria-label="Sign in" className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"><UserRound size={19} aria-hidden="true" /></Link>}
          <button type="button" onClick={() => setMenuOpen((open) => !open)} aria-expanded={menuOpen} aria-controls="mobile-navigation" aria-label={menuOpen ? "Close navigation" : "Open navigation"} className="grid size-10 place-items-center rounded-xl border border-slate-200 text-slate-800 transition hover:bg-slate-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 lg:hidden">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-slate-200 bg-white px-5 py-5 shadow-xl shadow-blue-950/5 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 rounded-2xl bg-slate-50 p-2">
            {[["/", "Home"], ["/about-us", "About us"], ["/media-news", "Media & news"], ["/blog", "Blog"], ["/contact", "Contact"], ["/become-a-part-of-dehatwala", "Become a worker"]].map(([to, label]) => <Link key={to} to={to} onClick={closeMenu} className="rounded-xl px-3 py-3 text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-700">{label}</Link>)}
            <details className="rounded-xl px-3 py-3 open:bg-white"><summary className="cursor-pointer text-sm font-semibold text-slate-800">Services</summary><div className="mt-3 flex max-h-52 flex-col gap-1 overflow-y-auto border-l border-blue-200 pl-3">{isLoading && <span className="py-2 text-sm text-slate-500">Loading services…</span>}{isError && <span className="py-2 text-sm text-red-600">Services unavailable</span>}{data?.categories.map((category) => <Link key={category.id} onClick={closeMenu} to={`/services/${category.slug}`} className="rounded-lg px-2 py-2 text-sm text-slate-600 hover:bg-blue-50 hover:text-blue-700">{category.name}</Link>)}</div></details>
            {!hideBookCta && (
              <Link to={SERVICE_LISTING_PATH} onClick={closeMenu} className="mt-3 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-bold text-white shadow-lg shadow-blue-700/20 sm:hidden">Book a worker <ArrowRight size={16} aria-hidden="true" /></Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Header;
