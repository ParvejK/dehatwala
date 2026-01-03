import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { API_URL } from "./constants";

const fetchBookedService = async (userId: number, token: string) => {
  const response = await axios.get<BookedServicesResponse>(`${API_URL}/get-booked-services/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const useBookedService = (userId: number, token: string) => {
  return useQuery<BookedServicesResponse, Error>({
    queryKey: ["bookedService", userId],
    queryFn: () => fetchBookedService(userId, token),
    enabled: !!userId && !!token,
  });
};
