import { useEffect } from "react";
import { useAuthStore } from "../../store/auth-store";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useServiceReview } from "../../react-query/auth-service-review-api";
import Container from "../../components/shared/container";
import ReviewTable from "../../components/table/review-table";

const ServiceReviewPage = () => {
  const navigate = useNavigate();
  const { token, user } = useAuthStore();

  const userId = user?.id;

  useEffect(() => {
    // Redirect if token or id is missing
    if (!token || !userId) {
      toast.error("Access denied. Please log in to continue.");
      navigate("/");
    }
  }, [token, userId, navigate]);

  const { data, isLoading, error } = useServiceReview(userId, token || "");

  if (isLoading)
    return (
      <div className="mt-10 mb-[100px] min-h-[50vh]">
        <Container>
          <div className="skeleton h-4 w-28 mb-4"></div>
          <div className="flex w-full flex-col gap-4">
            <div className="skeleton h-10 w-full"></div>
            <div className="skeleton h-4 w-28"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
            <div className="skeleton h-4 w-full"></div>
          </div>
        </Container>
      </div>
    );
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const renderStars = (rating: number) => {
    const r = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
    return (
      <div className="flex items-center gap-1" aria-label={`${r} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${i < r ? "text-yellow-400" : "text-gray-300"}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.37 2.449a1 1 0 00-.364 1.118l1.287 3.957c.3.922-.755 1.688-1.54 1.118l-3.37-2.45a1 1 0 00-1.175 0l-3.37 2.45c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69l1.287-3.957z" />
          </svg>
        ))}
        <span className="text-xs text-gray-600 ml-1">({r}/5)</span>
      </div>
    );
  };

  // Table
  const headers = ["#ID", "Service Detail", "Rating", "Review and comments"];
  const rows =
    data?.service_reviews.map((review) => ({
      rowData: [review.id, review.service_name, renderStars(review.rating), review.review_comments],
    })) || [];

  return (
    <div className="mt-10 mb-[100px] min-h-[50vh]">
      <Container>
        <h2 className="text-xl md:text-2xl font-bold text-black mb-10">Service Review</h2>
        <ReviewTable headers={headers} rows={rows} />
      </Container>
    </div>
  );
};

export default ServiceReviewPage;
