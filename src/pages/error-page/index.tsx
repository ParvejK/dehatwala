import { AlertTriangle } from "lucide-react";
import { Link, useRouteError } from "react-router-dom";

/**
 * The router's `errorElement` — what a visitor sees when a route throws.
 *
 * It sits outside the layout, so it carries its own spacing and its own way
 * back; the header and footer are not rendered around it.
 */
export default function ErrorPage() {
  const error = useRouteError();

  // Logged rather than shown: the message is for us, not the visitor, and can
  // leak internals.
  if (error) console.error("Route error:", error);

  return (
    <main className="grid min-h-screen place-items-center bg-white px-5 py-20">
      <div className="text-center">
        <span className="mx-auto grid size-16 place-items-center rounded-full bg-red-50 text-red-600">
          <AlertTriangle size={30} aria-hidden="true" />
        </span>

        <p className="mt-5 text-xs font-extrabold uppercase tracking-[0.18em] text-[#8fa2c8]">Something went wrong</p>
        <h1 className="mt-2 text-2xl font-extrabold text-[#0f1e57] sm:text-3xl">This page could not be loaded</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#63739a]">
          The link may be broken, or the page may have moved. Please try again, or head back and start over.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[#0b3fc4] px-6 text-[13px] font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
          >
            Try again
          </button>
          <Link
            to="/"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#cfe0fb] bg-white px-6 text-[13px] font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
          >
            Back to home
          </Link>
        </div>
      </div>
    </main>
  );
}
