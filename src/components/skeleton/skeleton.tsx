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
/**
 * The four counters above the bookings list.
 *
 * Without these the tiles rendered real zeros while loading, so the page said
 * "0 Total Bookings" to someone who has plenty.
 */
export const SkeletonStatTiles = ({ count = 4 }: { count?: number }) => (
  <div aria-hidden="true" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="rounded-2xl border border-[#dce7fb] bg-white p-4">
        <div className={`${BASE} size-10 rounded-xl`} />
        <div className={`${BASE} mt-3 h-6 w-16`} />
        <div className={`${BASE} mt-2 h-3 w-24`} />
      </div>
    ))}
  </div>
);

/** A booking card: thumbnail, title, meta row, progress rail and actions. */
export const SkeletonBookingCard = () => (
  <div aria-hidden="true" className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
    <div className="flex gap-4">
      <div className={`${BASE} hidden size-20 shrink-0 rounded-xl sm:block`} />

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className={`${BASE} h-4 w-2/5`} />
            <div className={`${BASE} mt-2 h-3 w-28`} />
          </div>
          <div className={`${BASE} h-6 w-28 rounded-full`} />
        </div>

        {/* Meta row: date, location, workers, amount. */}
        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
          {[20, 28, 20, 14].map((width, index) => (
            <div key={index} className={`${BASE} h-3`} style={{ width: `${width}%` }} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-[#eef2f9] pt-3.5">
          {[0, 1, 2].map((index) => (
            <div key={index} className={`${BASE} h-3 w-24`} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {[26, 26, 24].map((width, index) => (
            <div key={index} className={`${BASE} h-10 rounded-lg`} style={{ width: `${width}%` }} />
          ))}
        </div>
      </div>
    </div>
  </div>
);

/** A short list row — saved addresses, reviews. */
export const SkeletonListRow = ({ lines = 2 }: { lines?: number }) => (
  <div aria-hidden="true" className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0 flex-1">
        <div className={`${BASE} h-3.5 w-1/3`} />
        <div className="mt-3 space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div key={index} className={`${BASE} h-3 ${index === lines - 1 ? "w-1/2" : "w-3/4"}`} />
          ))}
        </div>
      </div>
      <div className={`${BASE} h-8 w-20 rounded-lg`} />
    </div>
  </div>
);

/** Wraps repeated rows with the status role, so the label is announced once. */
export const SkeletonList = ({
  count = 3,
  label = "Loading",
  children,
}: {
  count?: number;
  label?: string;
  children: (index: number) => React.ReactNode;
}) => (
  <div role="status" aria-busy="true" className="space-y-4">
    <span className="sr-only">{label}</span>
    {Array.from({ length: count }).map((_, index) => children(index))}
  </div>
);

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
