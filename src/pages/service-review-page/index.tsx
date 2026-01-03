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

  // Table
  const headers = ["#ID", "Service Detail", "Rating", "Review and comments"];
  const rows =
    data?.service_reviews.map((review) => ({
      rowData: [review.id, review.service_name, `${review.rating} *`, review.review_comments],
    })) || [];

  return (
    <div className="mt-10 mb-[100px] min-h-[50vh]">
      <Container>
        <h2 className="text-xl md:text-2xl font-semibold mb-10">Service Review</h2>
        <ReviewTable headers={headers} rows={rows} />
      </Container>
    </div>
  );
};

export default ServiceReviewPage;
