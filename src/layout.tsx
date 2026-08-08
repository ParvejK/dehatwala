import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/shared/header";
import Footer from "./components/shared/footer";
import SmallHeader from "./components/shared/small-header";
import ScrollToTop from "./components/shared/scroll-to-top";
import SeoHead from "./components/shared/seo-head";
import { useSeo, useSeoDefaults, withSeoDefaults } from "./react-query/seo-api";

/**
 * Scrolls to `#section` links.
 *
 * React Router navigates on a hash link but never scrolls to the target, so
 * footer links like `/#how-it-works` appeared dead — and completely dead from
 * the home page itself, where the route does not even change.
 *
 * The element is looked up after paint, since a link arriving from another
 * route renders the destination page in the same tick.
 */
const useHashScroll = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) return;

    const id = decodeURIComponent(hash.slice(1));
    // Two frames: one for the new route to commit, one for layout to settle.
    const raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
      })
    );

    return () => cancelAnimationFrame(raf);
  }, [pathname, hash]);
};

/**
 * SEO here is for meta tags only — it deliberately does not decide what is a
 * 404.
 *
 * Gating the 404 on `matched: false` sounds right but is wrong in practice: it
 * reports false for any URL shape the resolver does not model, not just for
 * dead records. That took real pages off the site — `/service/detail/{slug}`
 * and `/blog/category/{slug}` both render fine but resolve to nothing.
 *
 * The pages that own the data already handle a missing record ("Service not
 * found", "Article not found") and they cannot be wrong about it, because they
 * are asking the endpoint that actually holds the record.
 */
const Layout = () => {
  useHashScroll();

  const { pathname } = useLocation();
  const { data: seo } = useSeo(pathname);
  const { data: seoDefaults } = useSeoDefaults();

  // A page with no record of its own still gets a real title and description.
  const meta = withSeoDefaults(seo, seoDefaults);

  return (
    <>
      <SeoHead seo={meta} />
      <SmallHeader />
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Layout;
