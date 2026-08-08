/**
 * Shared loading placeholders.
 *
 * Pages had been hand-rolling these, so the pulse timing, tint and radius
 * drifted between them — and several newer pages skipped the loading state
 * altogether and rendered an empty section until the data arrived.
 *
 * The pulse is `motion-safe:` so it does not animate for anyone who has asked
 * for reduced motion; the shapes still convey that content is coming.
 */

const BASE = "motion-safe:animate-pulse rounded-lg bg-[#e8eefb]";

/** A single block. Pass the size through `className`. */
export const Skeleton = ({ className = "" }: { className?: string }) => (
  <div aria-hidden="true" className={`${BASE} ${className}`} />
);

/**
 * Stacked lines of text. The last line is short, which is what makes a block
 * read as a paragraph rather than a rectangle.
 */
export const SkeletonText = ({ lines = 3, className = "" }: { lines?: number; className?: string }) => (
  <div aria-hidden="true" className={`space-y-2 ${className}`}>
    {Array.from({ length: lines }).map((_, index) => (
      <div
        key={index}
        className={`${BASE} h-3 ${index === lines - 1 ? "w-2/3" : "w-full"}`}
      />
    ))}
  </div>
);

/** A card with an image on top and a couple of lines beneath. */
export const SkeletonCard = ({ aspect = "aspect-[16/10]" }: { aspect?: string }) => (
  <div aria-hidden="true" className="overflow-hidden rounded-2xl border border-[#e6edf9] bg-white p-3">
    <div className={`${BASE} ${aspect} w-full rounded-xl`} />
    <div className="mt-3 space-y-2">
      <div className={`${BASE} h-3.5 w-4/5`} />
      <div className={`${BASE} h-3 w-3/5`} />
    </div>
  </div>
);

/**
 * A grid of cards, matching the real grid it stands in for.
 *
 * `role="status"` with a label so a screen reader announces that something is
 * loading — the shapes themselves are hidden from it.
 */
export const SkeletonGrid = ({
  count = 6,
  className = "grid gap-5 sm:grid-cols-2 lg:grid-cols-3",
  aspect,
  label = "Loading",
}: {
  count?: number;
  className?: string;
  aspect?: string;
  label?: string;
}) => (
  <div role="status" aria-busy="true" className={className}>
    <span className="sr-only">{label}</span>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} aspect={aspect} />
    ))}
  </div>
);
