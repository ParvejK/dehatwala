import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Star } from "lucide-react";

import Modal from "./modal";
import { API_URL } from "../../react-query/constants";
import { useAuthStore } from "../../store/auth-store";
import { BookedService } from "../../react-query/booking-type";

const RATING_WORDS = ["", "Poor", "Fair", "Good", "Very Good", "Excellent"];

const WriteReviewModal = ({ booking, onClose }: { booking: BookedService; onClose: () => void }) => {
  const { user, token } = useAuthStore();

  const [rating, setRating] = useState(0);
  /** Star under the cursor, so the row previews before committing. */
  const [hovered, setHovered] = useState(0);
  const [comments, setComments] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const shown = hovered || rating;

  const submit = async () => {
    if (rating === 0) {
      setError("Please choose a rating.");
      return;
    }

    setError("");
    setIsSaving(true);

    try {
      await axios.post(
        `${API_URL}/save-service-review`,
        {
          service_id: booking.service_id,
          user_id: user?.id,
          name: user?.name ?? "Customer",
          // The API requires a mobile number; the account's is the only one we
          // have, and the review form does not ask for one.
          mobile_no: user?.mobile_no ?? "",
          rating,
          review_comments: comments.trim() || null,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Thanks for your review!");
      onClose();
    } catch (submitError) {
      const data = axios.isAxiosError(submitError)
        ? (submitError.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined)
        : undefined;

      setError(
        (data?.errors ? Object.values(data.errors)[0]?.[0] : undefined) ??
          data?.message ??
          "We could not save your review. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      title="Write Review"
      subtitle={`DW-${booking.id} · ${booking.service_title}`}
      onClose={onClose}
      footer={
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-4 text-[12px] font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={isSaving}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Submitting…" : "Submit Review"}
          </button>
        </div>
      }
    >
      <p className="text-center text-[12px] font-bold text-[#0f1e57]">How was your experience with the worker?</p>

      <div className="mt-4 flex justify-center gap-1.5" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setRating(value);
              setError("");
            }}
            onMouseEnter={() => setHovered(value)}
            aria-label={`${value} star${value === 1 ? "" : "s"}`}
            aria-pressed={rating === value}
            className="rounded p-1 transition focus:outline-none focus-visible:ring-4 focus-visible:ring-[#dce7fb]"
          >
            <Star
              size={30}
              className={value <= shown ? "fill-amber-400 text-amber-400" : "fill-[#eef2f9] text-[#dce7fb]"}
              aria-hidden="true"
            />
          </button>
        ))}
      </div>

      <p className="mt-2 h-5 text-center text-[12px] font-extrabold text-amber-600">{RATING_WORDS[shown] ?? ""}</p>

      <label htmlFor="review-comments" className="mt-4 block text-[11px] font-extrabold text-[#0f1e57]">
        Your Review
      </label>
      <textarea
        id="review-comments"
        rows={4}
        value={comments}
        maxLength={1000}
        onChange={(event) => setComments(event.target.value)}
        placeholder="Share your experience (optional)"
        className="mt-1.5 w-full rounded-xl border border-[#d8e4f8] bg-white p-3 text-[12px] font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#9badd0] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100"
      />
      <p className="mt-1 text-right text-[10px] font-semibold text-[#8fa2c8]">{comments.length}/1000</p>

      {error && (
        <p role="alert" className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700">
          {error}
        </p>
      )}
    </Modal>
  );
};

export default WriteReviewModal;
