import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookedServicesResponse } from "./booking-type";
import { API_URL } from "./constants";

/**
 * The signed-in customer's bookings.
 *
 * No user id travels in the URL — the API scopes the list to the token holder.
 * The previous route took one in the path, which let any signed-in caller read
 * someone else's bookings just by changing the number.
 */
const fetchBookedService = async (token: string) => {
  const response = await axios.get<BookedServicesResponse>(`${API_URL}/get-booked-services`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const useBookedService = (token: string) => {
  return useQuery<BookedServicesResponse, Error>({
    // The token is part of the key so one customer's list is never served from
    // another's cache after a sign-out and sign-in on the same device.
    queryKey: ["bookedService", token],
    queryFn: () => fetchBookedService(token),
    enabled: !!token,
    staleTime: 10 * 1000,
  });
};

/**
 * Cancels a booking. The API scopes it to the token holder, so a booking id
 * belonging to someone else reads as "not found" rather than cancelling it.
 */
export const useCancelBooking = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { bookingId: number; reasonIds: Array<number | string> }) => {
      const response = await axios.post(
        `${API_URL}/cancel-booked-service`,
        { booking_id: input.bookingId, cancel_reason_ids: input.reasonIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookedService", token] }),
  });
};

/**
 * Confirms a Razorpay payment with the server.
 *
 * Lives here rather than inline in the modal so it goes through the one place
 * that invalidates the bookings query — a bare axios call left the list showing
 * the booking as unpaid until the page was reloaded.
 */
export const useVerifyPayment = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { orderId: string; paymentId: string; signature: string }) => {
      const response = await axios.post(
        `${API_URL}/payment/verify`,
        {
          razorpay_order_id: input.orderId,
          razorpay_payment_id: input.paymentId,
          razorpay_signature: input.signature,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookedService", token] }),
  });
};

/**
 * Moves a booking to a new date. The API refuses once work has started.
 *
 * Only the date is sent — `time_slot` is left off so the API keeps whatever the
 * booking already had, matching the booking flow, which no longer asks for a
 * start time either.
 */
export const useRescheduleBooking = (token: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { bookingId: number; bookDate: string }) => {
      const response = await axios.post(
        `${API_URL}/reschedule-booked-service`,
        { booking_id: input.bookingId, book_date: input.bookDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["bookedService", token] }),
  });
};
