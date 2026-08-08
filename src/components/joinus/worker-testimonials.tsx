import { MapPin } from "lucide-react";
import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import { useFetchLabourTestimonials } from "../../react-query/hooks";
import RemoteAvatar from "../shared/remote-avatar";

/**
 * "हमारे श्रमिकों का अनुभव" — what workers already on the platform say.
 *
 * Sits under the registration button to give a hesitant applicant a reason to
 * finish signing up. Renders nothing at all when the API has no testimonials,
 * rather than showing an empty blue panel.
 */
const WorkerTestimonials = () => {
  const { data, isLoading, isError } = useFetchLabourTestimonials();
  const testimonials = data?.labour_testimonials ?? [];

  if (isLoading) {
    return <div className="mt-5 h-64 animate-pulse rounded-3xl bg-[#eef4ff]" aria-busy="true" />;
  }

  // A failed or empty fetch simply hides the section — it is supporting
  // content, and an error box here would only distract from the form above.
  if (isError || testimonials.length === 0) return null;

  return (
    <section
      aria-labelledby="worker-testimonials-heading"
      className="mt-5 overflow-hidden rounded-3xl bg-[#0b3fc4] px-4 py-7 sm:px-6 sm:py-9"
    >
      <header className="text-center">
        <h2 id="worker-testimonials-heading" className="text-lg font-extrabold text-white sm:text-xl">
          हमारे श्रमिकों का अनुभव
        </h2>
        <p className="mx-auto mt-1.5 max-w-xl text-[11px] leading-5 text-[#c3d5ff] sm:text-xs">
          देखिए हमसे जुड़े श्रमिक देहातवाला के बारे में क्या कहते हैं।
        </p>
      </header>

      {/* One row always. Beyond what fits, the rest are swipeable rather than
          wrapping onto a second row and leaving an orphan card. Slides are
          `h-auto` and the card `h-full` so a short quote does not shrink its
          card next to a long one. */}
      <Swiper
        modules={[Pagination]}
        pagination={{ clickable: true }}
        spaceBetween={16}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
          1280: { slidesPerView: 4 },
        }}
        aria-label="श्रमिकों के अनुभव"
        className="worker-testimonials-carousel mt-6 !pb-10 [&_.swiper-slide]:h-auto"
      >
        {testimonials.map((testimonial) => (
          <SwiperSlide key={testimonial.id} className="!h-auto">
            <article className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-4 pb-7 shadow-[0_16px_38px_-24px_rgba(6,26,80,0.7)]">
              <div className="flex items-center gap-3">
                <RemoteAvatar
                  folder="labour"
                  file={testimonial.labour_image}
                  name={testimonial.name}
                  className="size-14 shrink-0 rounded-full object-cover ring-2 ring-[#dce7fb]"
                  fallbackClassName="grid size-14 shrink-0 place-items-center rounded-full bg-[#eef4ff] text-sm font-extrabold text-[#0b3fc4] ring-2 ring-[#dce7fb]"
                />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-extrabold leading-tight text-[#0f1e57]">{testimonial.name}</p>
                  {/* Trade and city on one line, as "राज मिस्त्री • गुरुग्राम".
                    The separator only appears when both halves exist. */}
                  {(testimonial.post || testimonial.city) && (
                    <p className="mt-1 flex items-center gap-1 truncate text-[11px] font-semibold text-[#63739a]">
                      <MapPin size={11} className="shrink-0 text-[#0b3fc4]" aria-hidden="true" />
                      <span className="truncate">
                        {[testimonial.post, testimonial.city].filter(Boolean).join(" • ")}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {testimonial.description && (
                <blockquote className="mt-3 pr-6 text-[11px] leading-5 text-[#40517b]">
                  {/* Some rows end with a stray closing quote. Stripping both
                    straight and curly forms keeps the pair we add balanced.
                    Escapes rather than literals, so the class cannot silently
                    collapse to three identical ASCII quotes. */}
                  &ldquo;{testimonial.description.replace(/["“”]/g, "").trim()}&rdquo;
                </blockquote>
              )}

              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-3 right-2 select-none font-serif text-[56px] font-black leading-none text-[#0b3fc4]/25"
              >
                &rdquo;
              </span>
            </article>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="mx-auto mt-2 max-w-3xl rounded-full bg-[#0935a8] px-5 py-3 text-center text-[11px] font-bold leading-5 text-white sm:text-xs">
        हजारों श्रमिकों की तरह आप भी आज ही देहातवाला से जुड़ें और अपने हुनर को सही पहचान दिलाएं।
      </p>
    </section>
  );
};

export default WorkerTestimonials;
