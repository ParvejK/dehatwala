import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** How far down the page before the button is worth offering. */
const SHOW_AFTER = 400;

/**
 * Floating "back to top" control.
 *
 * Appears once the visitor is far enough down that scrolling back would be a
 * chore, and animates in rather than popping. Sits above the chat bubble, which
 * occupies the bottom-right corner on the home page.
 */
const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;

    const onScroll = () => {
      // Coalesced into one frame: scroll fires far more often than the state
      // needs to change, and each set would otherwise risk a re-render.
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = 0;
        setVisible(window.scrollY > SHOW_AFTER);
      });
    };

    onScroll(); // Reflect the position on mount, e.g. after a refresh mid-page.
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const toTop = () => {
    // Honour a reduced-motion preference: a long smooth scroll is exactly the
    // kind of movement that setting exists to avoid.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={toTop}
      aria-label="Scroll back to top"
      title="Back to top"
      // `invisible` rather than unmounting, so the fade-out can play out.
      className={`fixed bottom-24 right-5 z-40 grid size-11 place-items-center rounded-full bg-[#0b3fc4] text-white shadow-[0_12px_30px_-10px_rgba(11,63,196,0.8)] transition-all duration-300 ease-out hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 motion-reduce:transition-none sm:size-12 ${
        visible ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none invisible translate-y-3 scale-90 opacity-0"
      }`}
    >
      <ArrowUp size={20} aria-hidden="true" />
    </button>
  );
};

export default ScrollToTop;
