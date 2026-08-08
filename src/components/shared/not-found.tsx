import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Compass } from "lucide-react";

/**
 * Shown when the SEO API reports a URL that resolves to nothing real.
 *
 * `noindex` is set directly here rather than coming from the API: the point of
 * this page is to keep a dead slug out of the index, and it must hold even if
 * the SEO lookup itself is what failed.
 */
const NotFound = () => {
  useEffect(() => {
    document.title = "Page not found | Dehatwala";

    const robots = document.createElement("meta");
    robots.setAttribute("name", "robots");
    robots.setAttribute("content", "noindex,follow");
    robots.setAttribute("data-seo", "");
    document.head.appendChild(robots);

    return () => robots.remove();
  }, []);

  return (
    <main className="grid min-h-[60vh] place-items-center bg-white px-5 py-20">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
          <Compass size={30} aria-hidden="true" />
        </span>
        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fa2c8]">Error 404</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#0f1e57] sm:text-3xl">This page does not exist</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#63739a]">
          The link may be broken, or the page may have been removed.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b3fc4] px-6 text-[13px] font-bold text-white transition hover:bg-[#0932a0]"
          >
            Back to home
          </Link>
          <Link
            to="/services/all"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#cfe0fb] bg-white px-6 text-[13px] font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
          >
            Browse services
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
