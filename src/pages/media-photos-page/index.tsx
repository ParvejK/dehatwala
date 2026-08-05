import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin, X } from "lucide-react";
import MediaPageHeader from "../../components/media/media-page-header";
import { formatMediaDate, mediaImage } from "../media-news-page/data";
import { useMediaPhotos } from "../../react-query/hooks";

const MediaPhotosPage = () => {
  const photosQuery = useMediaPhotos();
  const EVENT_PHOTOS = useMemo(() => photosQuery.data?.photos ?? [], [photosQuery.data]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const close = useCallback(() => setOpenIndex(null), []);

  const step = useCallback((direction: -1 | 1) => {
    setOpenIndex((current) => {
      if (current === null) return current;
      return (current + direction + EVENT_PHOTOS.length) % EVENT_PHOTOS.length;
    });
  }, [EVENT_PHOTOS.length]);

  // Keyboard control for the lightbox.
  useEffect(() => {
    if (openIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "ArrowRight") step(1);
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [openIndex, close, step]);

  const active = openIndex === null ? null : EVENT_PHOTOS[openIndex];

  return (
    <main className="bg-white pb-14 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <MediaPageHeader
          title="Event Photos"
          description="Registration drives, training sessions and on-site moments from across the Dehatwala network."
          count={EVENT_PHOTOS.length}
          countLabel={EVENT_PHOTOS.length === 1 ? "photo" : "photos"}
        />

        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {EVENT_PHOTOS.map((photo, index) => (
            <figure
              key={photo.id}
              className="group overflow-hidden rounded-2xl border border-[#dce7fb] bg-white transition hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-18px_rgba(20,61,141,0.5)]"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(index)}
                aria-label={`Open photo: ${photo.caption}`}
                className="relative block h-40 w-full overflow-hidden bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-inset focus-visible:ring-blue-200 sm:h-44"
              >
                <img
                  src={mediaImage(photo.image)}
                  alt={photo.alt}
                  loading="lazy"
                  className="size-full object-cover transition duration-500 group-hover:scale-105"
                />
              </button>

              <figcaption className="p-4">
                <p className="text-[13px] font-extrabold leading-tight text-[#0f1e57]">{photo.caption}</p>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[11px] font-normal text-[#8fa2c8]">
                  <MapPin size={12} aria-hidden="true" /> {photo.location}
                </p>
                <p className="mt-1 inline-flex items-center gap-1.5 text-[11px] font-normal text-[#8fa2c8]">
                  <CalendarDays size={12} aria-hidden="true" /> {formatMediaDate(photo.taken_at)}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>

      {active && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={active.caption}
          onClick={close}
          className="fixed inset-0 z-50 grid place-items-center bg-black/80 p-4 backdrop-blur-sm"
        >
          <button
            type="button"
            onClick={close}
            aria-label="Close photo"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40"
          >
            <X size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(-1);
            }}
            aria-label="Previous photo"
            className="absolute left-3 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:left-6"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              step(1);
            }}
            aria-label="Next photo"
            className="absolute right-3 grid size-10 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/40 sm:right-6"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          <figure onClick={(event) => event.stopPropagation()} className="max-h-full w-full max-w-4xl">
            <img
              src={mediaImage(active.image)}
              alt={active.alt}
              className="mx-auto max-h-[72vh] w-auto rounded-xl object-contain"
            />
            <figcaption className="mt-4 text-center text-white">
              <p className="text-sm font-bold">{active.caption}</p>
              <p className="mt-1 text-xs font-normal text-white/70">
                {active.location} · {formatMediaDate(active.taken_at)}
              </p>
              <p className="mt-1 text-[11px] font-normal text-white/50">
                {(openIndex ?? 0) + 1} / {EVENT_PHOTOS.length}
              </p>
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
};

export default MediaPhotosPage;
