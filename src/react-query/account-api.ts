import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { API_URL } from "./constants";

/**
 * Account settings calls.
 *
 * Every one is scoped server-side to the token holder, so none of them takes a
 * user id — passing one would only invite the API to trust it.
 */
const auth = (token: string) => ({ headers: { Authorization: `Bearer ${token}` } });

export type AccountUser = {
  id: number;
  name: string;
  email: string | null;
  mobile_no: string;
};

export const useUpdateProfile = (token: string) =>
  useMutation({
    mutationFn: async (input: { name: string; email: string }) => {
      const { data } = await axios.put(
        `${API_URL}/account/profile`,
        { name: input.name, email: input.email || null },
        auth(token)
      );
      return data as { success: boolean; user: AccountUser; message?: string };
    },
  });

export const useRequestMobileOtp = (token: string) =>
  useMutation({
    mutationFn: async (mobileNo: string) => {
      const { data } = await axios.post(`${API_URL}/account/mobile/otp`, { mobile_no: mobileNo }, auth(token));
      // `otp` comes back in the body because no SMS gateway is wired yet — the
      // same dev-only behaviour as the sign-in and register endpoints.
      return data as { success: boolean; otp?: string; message?: string };
    },
  });

export const useChangeMobile = (token: string) =>
  useMutation({
    mutationFn: async (input: { mobileNo: string; otp: string }) => {
      const { data } = await axios.post(
        `${API_URL}/account/mobile`,
        { mobile_no: input.mobileNo, otp: input.otp },
        auth(token)
      );
      return data as { success: boolean; user: AccountUser; message?: string };
    },
  });

/** Column names on the API; the UI never invents its own keys for these. */
export type NotificationKey = "notify_booking_updates" | "notify_payment_reminders" | "notify_offers";

export type NotificationPrefs = Record<NotificationKey, boolean>;

/**
 * The signed-in customer's notification settings.
 *
 * Read through its own query rather than the auth store so a toggle flipped on
 * one device is picked up here, instead of showing whatever was cached at
 * sign-in.
 */
export const useNotificationPrefs = (token: string) =>
  useQuery<NotificationPrefs, Error>({
    queryKey: ["notification-prefs", token],
    queryFn: async () => {
      const { data } = await axios.get(`${API_URL}/user`, auth(token));
      return {
        notify_booking_updates: data?.notify_booking_updates ?? true,
        notify_payment_reminders: data?.notify_payment_reminders ?? true,
        notify_offers: data?.notify_offers ?? true,
      };
    },
    enabled: !!token,
    staleTime: 30 * 1000,
  });

/**
 * Flips one preference.
 *
 * Only the changed key is sent, so a stale value for the other two can never be
 * written back over a change made elsewhere. The cache is updated optimistically
 * so the switch moves immediately, and rolled back if the call fails.
 */
export const useUpdateNotifications = (token: string) => {
  const queryClient = useQueryClient();
  const key = ["notification-prefs", token];

  return useMutation({
    mutationFn: async (change: Partial<NotificationPrefs>) => {
      const { data } = await axios.put(`${API_URL}/account/notifications`, change, auth(token));
      return data as { success: boolean; notifications: NotificationPrefs };
    },
    onMutate: async (change) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<NotificationPrefs>(key);
      if (previous) queryClient.setQueryData<NotificationPrefs>(key, { ...previous, ...change });
      return { previous };
    },
    onError: (_error, _change, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    // Settle on whatever the server actually stored.
    onSuccess: (data) => {
      if (data?.notifications) queryClient.setQueryData(key, data.notifications);
    },
  });
};

export const useDeleteAccount = (token: string) =>
  useMutation({
    mutationFn: async () => {
      const { data } = await axios.delete(`${API_URL}/account`, auth(token));
      return data as { success: boolean; message?: string };
    },
  });

/** Readable text from any of the above; the API answers 422 with field errors. */
export const accountErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return (error as Error)?.message || fallback;

  const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
  return (data?.errors ? Object.values(data.errors)[0]?.[0] : undefined) ?? data?.message ?? fallback;
};
