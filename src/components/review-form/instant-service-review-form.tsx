import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { API_URL } from "../../react-query/constants";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types";

interface ReviewFormData {
  service_id: number;
  name: string;
  mobile_no: string;
  rating: number;
  review_comments: string;
  status: number;
  user_id: number;
}

export default function InstantServiceReviewForm() {
  const [selectedRating, setSelectedRating] = useState(0);

  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  // Select service_id from url
  const { serviceId: instantServiceId } = useParams();
  const serviceId = parseInt(atob(instantServiceId), 10);

  const userId = user?.id;
  const userName = user?.name;
  const mobileNumber = user?.mobile_no;

  useEffect(() => {
    if (!token || !userId || !serviceId) {
      toast.error("Access denied. Please log in to continue.");
      navigate("/"); // Redirect to home page
    }
  }, [token, userId, serviceId, navigate]);

  // Check if user exist or not
  if (!user?.id && !user?.name && user?.mobile_no) {
    toast.error("user id, user name and mobile not required");
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ReviewFormData>({
    defaultValues: {
      service_id: serviceId,
      status: 1,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ReviewFormData) => {
      const response = await fetch(`${API_URL}/save-service-review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit review");
      }

      return response.json();
    },
    onSuccess: () => {
      reset();
      toast.success("Review submitted successfully!");
    },
    onError: (error: unknown) => {
      // Check if the error is an AxiosError and has a response
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        toast.error(apiError.response?.data.message || "An unexpected error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });

  const onSubmit = (data: ReviewFormData) => {
    mutate({ ...data, name: userName, mobile_no: mobileNumber, user_id: userId, rating: Number(data.rating) });
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-4 mb-[100px]">
      <h2 className="text-2xl font-semibold mb-4">Add Reviews</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Rating</span>
          </label>
          <div className="rating rating-lg">
            {[1, 2, 3, 4, 5].map((value) => (
              <input
                key={value}
                type="radio"
                value={value}
                {...register("rating", {
                  required: "Please select a rating",
                  valueAsNumber: true,
                })}
                onChange={() => setSelectedRating(value)} // Update selected rating
                className={`mask mask-star-2 ${value <= selectedRating ? "bg-orange-400" : "bg-orange-200"}`}
              />
            ))}
          </div>
          {errors.rating && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.rating.message}</span>
            </label>
          )}
        </div>

        <div className="form-control">
          <label className="label">
            <span className="label-text">Review Comments</span>
          </label>
          <textarea
            {...register("review_comments", { required: "Please provide your review" })}
            className="textarea textarea-bordered h-24"
            placeholder="Write your review here"
          />
          {errors.review_comments && (
            <label className="label">
              <span className="label-text-alt text-error">{errors.review_comments.message}</span>
            </label>
          )}
        </div>

        <button type="submit" className={`btn btn-primary w-full ${isPending ? "loading" : ""}`} disabled={isPending}>
          {isPending ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
