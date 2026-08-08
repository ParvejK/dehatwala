import { ArrowRight, BadgeCheck, ChevronDown, ChevronRight, Headphones, Menu, UserRound, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { useCategories } from "../../react-query/hooks";
import LogoutButton from "../auth/logout";
import { DASHBOARD_LINKS, formatMobile, initialsOf } from "../dashboard/nav";

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
            ["/about-us", "About us"],
            ["/media-news", "Media & news"],
            ["/blog", "Blogs"],
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
        </nav>
        <div className="flex items-center gap-2">
          <a href="tel:+918600999922" aria-label="Call booking support" className="hidden size-10 items-center justify-center rounded-xl border border-slate-200 text-blue-700 transition hover:border-blue-200 hover:bg-blue-50 xl:inline-flex"><Headphones size={18} aria-hidden="true" /></a>
          {!hideBookCta && (
            <Link to={SERVICE_LISTING_PATH} className="hidden min-h-11 items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 sm:inline-flex">Book a worker <ArrowRight size={16} aria-hidden="true" /></Link>
          )}
          {user ? (
            <div className="dropdown dropdown-end">
              <button
                type="button"
                tabIndex={0}
                aria-label="Open account menu"
                className="grid size-10 place-items-center rounded-xl border border-blue-100 bg-blue-50 font-bold text-blue-700 transition hover:bg-blue-100 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <span className="uppercase">{initialsOf(user.name)}</span>
              </button>

              <div
                tabIndex={0}
                className="dropdown-content z-50 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl shadow-blue-950/10"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-700 text-sm font-extrabold uppercase text-white">
                    {initialsOf(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900">{user.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{formatMobile(user.mobile_no)}</p>
                    <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                      <BadgeCheck size={12} aria-hidden="true" /> Verified Customer
                    </p>
                  </div>
                </div>

                <nav aria-label="Account" className="p-2">
                  {DASHBOARD_LINKS.map(({ to, label, icon: Icon }) => (
                    <Link
                      key={to}
                      to={to}
                      className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-700"
                    >
                      <span className="inline-flex items-center gap-3">
                        <Icon size={17} className="text-blue-700" aria-hidden="true" />
                        {label}
                      </span>
                      <ChevronRight size={15} className="text-slate-300" aria-hidden="true" />
                    </Link>
                  ))}
                </nav>

                <div className="border-t border-slate-100 p-2">
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
