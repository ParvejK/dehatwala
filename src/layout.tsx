import { useEffect } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Header from "./components/shared/header";
import Footer from "./components/shared/footer";
import SmallHeader from "./components/shared/small-header";
import ScrollToTop from "./components/shared/scroll-to-top";

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

const Layout = () => {
  useHashScroll();

  return (
    <>
      <SmallHeader />
      <Header />
      <Outlet />
      <Footer />
      <ScrollToTop />
    </>
  );
};

export default Layout;
