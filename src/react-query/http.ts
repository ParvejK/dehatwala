import axios from "axios";

import { useAuthStore } from "../store/auth-store";
import { API_URL } from "./constants";

/**
 * Attach the signed-in customer's token to every call to our own API.
 *
 * The address endpoints (and several others) sit behind `auth:sanctum`, but the
 * fetchers in `apis.ts` were written when those routes were public and sent no
 * token — so saving a worksite from booking step 2 answered 401 and the address
 * silently never reached the database.
 *
 * Doing it here rather than per call means a route moving behind the token does
 * not quietly break the frontend a second time.
 *
 * Two deliberate limits:
 *  - only requests to `API_URL` are touched, so a token is never handed to a
 *    third-party host (reverse geocoding, Razorpay);
 *  - an `Authorization` header already on the request wins, so the call sites
 *    that set their own keep working unchanged.
 */
axios.interceptors.request.use((config) => {
  const url = config.url ?? "";

  if (!API_URL || !url.startsWith(API_URL)) return config;
  if (config.headers.get("Authorization")) return config;

  const { token } = useAuthStore.getState();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);

  return config;
});

/** True for the API answering "your token is missing, expired or revoked". */
export const isUnauthorized = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 401;

/**
 * The API's own words for a failure, when it has any.
 *
 * Laravel answers a failed `validate()` with `{ errors: { field: [msg] } }` and
 * most other failures with `{ message }`; anything else falls back to `fallback`
 * rather than showing a visitor "Request failed with status code 500".
 */
export const apiErrorMessage = (error: unknown, fallback: string) => {
  if (!axios.isAxiosError(error)) return fallback;

  const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
  const firstFieldError = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined;

  return firstFieldError ?? data?.message ?? fallback;
};
