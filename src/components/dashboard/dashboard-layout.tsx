import { BadgeCheck, ChevronRight, Home, Menu } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";

import { useAuthStore } from "../../store/auth-store";
import LogoutButton from "../auth/logout";
import DashboardSignedOut from "../../pages/dashboard/signed-out";
import { DASHBOARD_LINKS, formatMobile, initialsOf } from "./nav";

const linkClass = (isActive: boolean) =>
  `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-[13px] font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
    isActive ? "bg-[#eef4ff] text-[#0b3fc4]" : "text-[#40517b] hover:bg-[#f4f8ff] hover:text-[#0b3fc4]"
  }`;

const DashboardLayout = () => {
  const { user, token } = useAuthStore();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  if (!token || !user) return <DashboardSignedOut />;

  const activeLabel = DASHBOARD_LINKS.find((link) => pathname.startsWith(link.to))?.label ?? "Dashboard";

  const nav = (
    <nav aria-label="Dashboard" className="space-y-1">
      {DASHBOARD_LINKS.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} onClick={() => setMenuOpen(false)} className={({ isActive }) => linkClass(isActive)}>
          <Icon size={17} aria-hidden="true" />
          {label}
        </NavLink>
      ))}

      <div className="mt-2 border-t border-[#eef2f9] pt-2">
        <LogoutButton />
      </div>
    </nav>
  );

  return (
    <main className="bg-[#f8fbff] pb-14 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-4">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
                <Home size={14} aria-hidden="true" /> Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={13} className="text-[#a8b6d4]" />
            </li>
            <li className="font-bold text-[#0f1e57]" aria-current="page">
              {activeLabel}
            </li>
          </ol>
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[minmax(240px,0.28fr)_minmax(0,1fr)]">
          {/* ---------- Sidebar ---------- */}
          <aside className="rounded-2xl border border-[#dce7fb] bg-white p-4 lg:sticky lg:top-24">
            <div className="flex items-center gap-3.5 border-b border-[#eef2f9] pb-4 lg:flex-col lg:text-center">
              <span className="grid size-14 shrink-0 place-items-center rounded-full bg-[#0b3fc4] text-lg font-extrabold text-white">
                {initialsOf(user.name)}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-extrabold text-[#0f1e57]">{user.name}</p>
                <p className="mt-0.5 text-xs font-medium text-[#63739a]">{formatMobile(user.mobile_no)}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <BadgeCheck size={13} aria-hidden="true" /> Verified Customer
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              className="mt-3 flex w-full items-center justify-between rounded-xl bg-[#f4f8ff] px-3.5 py-2.5 text-[13px] font-bold text-[#0f1e57] lg:hidden"
            >
              {activeLabel}
              <Menu size={17} aria-hidden="true" />
            </button>

            <div className={`mt-3 ${menuOpen ? "block" : "hidden"} lg:block`}>{nav}</div>
          </aside>

          {/* ---------- Section ---------- */}
          <div className="min-w-0">
            <Outlet />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardLayout;
