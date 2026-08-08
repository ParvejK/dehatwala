import { PenLine, Star } from "lucide-react";
import { Link } from "react-router-dom";

import SectionHeader from "../../components/dashboard/section-header";
import StatTile from "../../components/dashboard/stat-tile";
import { useServiceReview } from "../../react-query/auth-service-review-api";
import { useAuthStore } from "../../store/auth-store";

const Stars = ({ rating }: { rating: number }) => (
  <span className="flex items-center gap-0.5" aria-label={`Rated ${rating} out of 5`}>
    {Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={14}
        aria-hidden="true"
        className={index < Math.round(rating) ? "fill-[#ff9f1a] text-[#ff9f1a]" : "fill-[#e2e8f5] text-[#e2e8f5]"}
      />
    ))}
  </span>
);

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

const DashboardReviews = () => {
  const { user, token } = useAuthStore();
  const { data, isPending, isError } = useServiceReview(user?.id ?? 0, token ?? "");

  const reviews = data?.service_reviews ?? [];
  const average = reviews.length
    ? reviews.reduce((total, review) => total + Number(review.rating || 0), 0) / reviews.length
    : 0;

  return (
    <div className="space-y-5">
      <SectionHeader title="My Reviews" description="Reviews you have submitted for completed services." />

      <div className="grid gap-4 sm:grid-cols-2">
        <StatTile icon={PenLine} value={String(reviews.length)} label="Total Reviews" tone="brand" />
        <StatTile
          icon={Star}
          value={reviews.length ? `${average.toFixed(1)} ★` : "—"}
          label="Average Rating"
          hint={average >= 4.5 ? "Excellent" : average >= 3.5 ? "Good" : undefined}
          tone="warning"
        />
      </div>

      {isPending ? (
        <div className="space-y-4" aria-busy="true">
          {[0, 1, 2].map((item) => (
            <div key={item} className="h-32 animate-pulse rounded-2xl border border-[#dce7fb] bg-white" />
          ))}
        </div>
      ) : isError ? (
        <div className="rounded-2xl border border-[#f3d6b8] bg-[#fff8ef] p-8 text-center" role="alert">
          <h3 className="text-sm font-extrabold text-[#7a5a1f]">We could not load your reviews</h3>
          <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#7a5a1f]">Please try again shortly.</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="rounded-2xl border border-[#dce7fb] bg-white p-10 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#eef4ff] text-[#0b3fc4]">
            <Star size={26} aria-hidden="true" />
          </span>
          <h3 className="mt-4 text-sm font-extrabold text-[#0f1e57] sm:text-[15px]">No reviews yet</h3>
          <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#63739a]">
            After a booking is completed you can rate the worker and share your experience here.
          </p>
          <Link
            to="/dashboard/bookings"
            className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0]"
          >
            View My Bookings
          </Link>
        </div>
      ) : (
        <ul className="space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-extrabold text-[#0f1e57] sm:text-[15px]">
                    {review.service_name ?? "Service"}
                  </h3>
                  <p className="mt-1 text-[11px] font-bold text-[#0b3fc4]">
                    Service ID: {review.service_id} &middot;{" "}
                    <span className="font-medium text-[#8fa2c8]">{formatDate(review.created_at)}</span>
                  </p>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-extrabold text-emerald-700">
                  Completed
                </span>
              </div>

              <div className="mt-2.5">
                <Stars rating={Number(review.rating)} />
              </div>

              {review.review_comments && (
                <p className="mt-2.5 text-xs leading-6 text-[#5a6a90] sm:text-[13px]">{review.review_comments}</p>
              )}

              <Link
                to={`/service-reviews`}
                className="mt-4 inline-flex min-h-10 items-center justify-center gap-1.5 rounded-lg border border-[#cfe0fb] bg-white px-4 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
              >
                <PenLine size={13} aria-hidden="true" /> Edit Review
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DashboardReviews;
