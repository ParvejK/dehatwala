import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";

interface ServiceReview {
  id: number;
  service_id: number;
  user_id: number;
  name: string;
  mobile_no: string;
  rating: number;
  review_comments: string;
  status: string; // Assuming status is always a string, as shown in your example.
  deleted_at: string | null; // null if not deleted, else a string timestamp.
  created_at: string; // ISO string for the created date.
  updated_at: string; // ISO string for the updated date.
  service_name: string; // Name of the service.
}

interface ServiceReviewsApiResponse {
  service_reviews: ServiceReview[];
}

const fetchServiceReview = async (userId: number, token: string) => {
  const response = await axios.get<ServiceReviewsApiResponse>(`${API_URL}/get-service-reviews/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useServiceReview = (userId: number, token: string) => {
  return useQuery<ServiceReviewsApiResponse, Error>({
    queryKey: ["serviceReview", userId],
    queryFn: () => fetchServiceReview(userId, token),
    enabled: !!userId && !!token, // Only run if userId and token are available
  });
};
