import { useMemo, useState } from "react";
import { Play, Search, X } from "lucide-react";
import MediaPageHeader from "../../components/media/media-page-header";
import { formatMediaDate, mediaImage } from "../media-news-page/data";
import { useMediaVideos } from "../../react-query/hooks";

const ALL = "All";

const MediaVideosPage = () => {
  const [search, setSearch] = useState("");
  const [channel, setChannel] = useState<string>(ALL);
  const videosQuery = useMediaVideos();
  const VIDEOS = useMemo(() => videosQuery.data?.videos ?? [], [videosQuery.data]);

  const channels = useMemo(() => [ALL, ...Array.from(new Set(VIDEOS.map((video) => video.channel)))], [VIDEOS]);

  const query = search.trim().toLowerCase();

  const videos = useMemo(
    () =>
      VIDEOS.filter((video) => channel === ALL || video.channel === channel)
        .filter(
          (video) =>
            query.length === 0 ||
            video.title.toLowerCase().includes(query) ||
            video.subtitle.toLowerCase().includes(query) ||
            video.channel.toLowerCase().includes(query),
        )
        .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime()),
    [VIDEOS, channel, query],
  );

  return (
    <main className="bg-white pb-14 pt-5 sm:pt-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <MediaPageHeader
          title="Videos & Interviews"
          description="Television features, founder interviews and on-ground films about how Dehatwala works."
          count={VIDEOS.length}
          countLabel={VIDEOS.length === 1 ? "video" : "videos"}
        />

        <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {channels.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setChannel(item)}
                aria-pressed={channel === item}
                className={`inline-flex min-h-9 items-center rounded-full border px-4 text-xs font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                  channel === item
                    ? "border-[#0b3fc4] bg-[#0b3fc4] text-white"
                    : "border-[#dce7fb] bg-white text-[#40517b] hover:border-[#bfd5fb] hover:text-[#0b3fc4]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="flex w-full items-center gap-2 rounded-lg border border-[#dce7fb] bg-white px-3 focus-within:border-[#0b3fc4] focus-within:ring-4 focus-within:ring-blue-100 sm:w-72">
            <Search size={16} className="shrink-0 text-[#a9b8d6]" aria-hidden="true" />
            <span className="sr-only">Search videos</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search videos or channels"
              className="min-h-10 w-full bg-transparent text-[13px] font-medium text-[#0f1e57] outline-none placeholder:font-normal placeholder:text-[#a9b8d6]"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="shrink-0 text-[#a9b8d6] transition hover:text-[#40517b]"
              >
                <X size={15} aria-hidden="true" />
              </button>
            )}
          </label>
        </div>

        {videos.length > 0 ? (
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map(({ id, title, subtitle, duration, thumbnail, video_url, channel: videoChannel, published_at }) => (
              <a
                key={id}
                href={video_url}
                target="_blank"
                rel="noreferrer"
                aria-label={`Play ${title} on YouTube`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#dce7fb] bg-white transition hover:border-[#bfd5fb] hover:shadow-[0_12px_28px_-18px_rgba(20,61,141,0.5)] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
              >
                <div className="relative h-40 overflow-hidden bg-[#0a2a6b] sm:h-44">
                  <img
                    src={mediaImage(thumbnail)}
                    alt=""
                    loading="lazy"
                    className="size-full object-cover opacity-85 transition duration-500 group-hover:scale-105 group-hover:opacity-100"
                  />
                  <span className="absolute inset-0 grid place-items-center">
                    <span className="grid size-12 place-items-center rounded-full bg-[#0b3fc4]/90 text-white shadow-lg transition group-hover:scale-110">
                      <Play size={18} fill="currentColor" className="ml-0.5" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="absolute bottom-3 right-3 rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-bold text-white">
                    {duration}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-4 sm:p-5">
                  <h2 className="text-[13px] font-extrabold leading-[1.45] text-[#0f1e57] sm:text-sm">{title}</h2>
                  <p className="mt-1.5 text-[11px] font-normal leading-4 text-[#8fa2c8]">{subtitle}</p>

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#eef2f9] pt-3 text-[11px]">
                    <span className="truncate font-bold text-[#40517b]">{videoChannel}</span>
                    <span className="shrink-0 font-normal text-[#8fa2c8]">{formatMediaDate(published_at)}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-2xl border border-[#dce7fb] bg-[#f8fbff] px-6 py-14 text-center">
            <h2 className="text-base font-extrabold text-[#0f1e57]">No videos found</h2>
            <p className="mx-auto mt-2 max-w-md text-xs leading-5 text-[#63739a]">
              Nothing matches your current filters. Try a different channel or search term.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setChannel(ALL);
              }}
              className="mt-5 inline-flex min-h-10 items-center rounded-lg border border-[#cfe0fb] bg-white px-5 text-xs font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </main>
  );
};

export default MediaVideosPage;
