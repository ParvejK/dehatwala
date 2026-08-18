import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../../react-query/constants";
import { z } from "zod";
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "../../store/auth-store";
import { useMutation } from "@tanstack/react-query";
import { twMerge } from "tailwind-merge";
import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types";
import { ArrowLeft, ArrowRight, LockKeyhole, Mail, Phone, UserRound } from "lucide-react";

const formSchemaStep1 = z.object({
  mobile_no: z
    .string()
    .length(10, "Mobile number must be exactly 10 digits.")
    .regex(/^\d+$/, "Mobile number must contain only numbers."),
});

const formSchemaStep2 = z.object({
  name: z.string().min(3, "Name is required"),
  otp: z.string().min(4, "OTP is required."),
  email: z.string().optional(),
  mobile_no: z.string().min(10, "Mobile number is required."),
});

type FormDataStep1 = z.infer<typeof formSchemaStep1>;
type FormDataStep2 = z.infer<typeof formSchemaStep2>;

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const postData = async (url: string, data: object) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Data format not good");
        } else if (response.status === 401) {
          throw new Error("Invalid or expired OTP");
        } else if (response.status === 500) {
          throw new Error("Server error");
        } else {
          throw new Error("Request failed");
        }
      }
      return await response.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error };
};

interface SignUpProps {
  className?: string;
}

export default function SignUp({ className }: SignUpProps) {
  const [step, setStep] = useState(1); // Tracks the current step
  const [mobileNumber, setMobileNumber] = useState(""); // Store the mobile number after Step 1
  const { postData, loading, error } = useApi();
  const navigate = useNavigate();
  const location = useLocation();

  // Parse the query string
  const searchParams = new URLSearchParams(location.search);
  // Get the value of the `path` query parameter
  const redirectPath = searchParams.get("path") || "/";

  // Form handlers for Step 1 and Step 2
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<FormDataStep1>({
    resolver: zodResolver(formSchemaStep1),
  });

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    setValue,
    formState: { errors: errorsStep2 },
  } = useForm<FormDataStep2>({
    mode: "onSubmit",
  });

  const handleMobileSubmit: SubmitHandler<FormDataStep1> = async (data) => {
    const result = await postData(`${API_URL}/register-otp`, data);
    if (result) {
      setMobileNumber(data.mobile_no);
      setStep(2);

      // Programmatically set the OTP value in the input field
      setValue("otp", result.otp.toString());
    }
  };

  const mutation = useMutation({
    mutationFn: async (data: FormDataStep2) => {
      const result = await postData(`${API_URL}/register`, {
        name: data.name,
        email: data.email,
        mobile_no: mobileNumber,
        otp: data.otp,
      });
      if (result) {
        const { token, user } = result;
        useAuthStore.getState().setUserData(user, token);
      } else {
        throw new Error("Registration failed");
      }
    },
    onSuccess: () => {
      toast.success("You are register & login successful");
      // Extract redirect path from the query parameters
      navigate(redirectPath, { replace: true });
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

  const handleOtpSubmit: SubmitHandler<FormDataStep2> = async (data) => {
    if (!mobileNumber) {
      toast.error("Mobile number is required");
      return;
    }
    mutation.mutate({ name: data.name, email: data.email, mobile_no: mobileNumber, otp: data.otp });
  };

  return (
    <div className={twMerge("w-full", className)}>
          {step === 1 && (
            <form onSubmit={handleSubmitStep1(handleMobileSubmit)} noValidate>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="signup-mobile">
                  Mobile number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    id="signup-mobile"
                    placeholder="Enter your 10-digit number"
                    aria-invalid={Boolean(errorsStep1.mobile_no)}
                    aria-describedby={errorsStep1.mobile_no ? "signup-mobile-error" : "signup-mobile-help"}
                    className={`h-13 w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errorsStep1.mobile_no ? "border-red-500 focus:ring-red-100" : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100"}`}
                    {...registerStep1("mobile_no", { required: "Mobile number is required" })}
                  />
                </div>
                {errorsStep1.mobile_no && (
                  <p id="signup-mobile-error" className="mt-2 text-sm font-normal text-red-600" role="alert">{errorsStep1.mobile_no.message}</p>
                )}
                {!errorsStep1.mobile_no && <p id="signup-mobile-help" className="mt-2 text-xs font-normal text-slate-500">We’ll send a one-time password to verify this number.</p>}
              </div>
              {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-normal text-red-700" role="alert">{error}</div>}
              <div className="mt-7">
                <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
                  {loading ? <><span className="loading loading-spinner loading-sm" /> Sending OTP…</> : <>Continue <ArrowRight size={17} aria-hidden="true" /></>}
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitStep2(handleOtpSubmit)} noValidate>
              <div className="mb-5 flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-normal text-blue-950">
                <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-700 text-white"><LockKeyhole size={17} aria-hidden="true" /></span>
                <span>OTP sent to <strong className="font-semibold">{mobileNumber}</strong></span>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="signup-otp">
                  One-time password
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  id="signup-otp"
                  placeholder="Enter your OTP"
                  aria-invalid={Boolean(errorsStep2.otp)}
                  aria-describedby={errorsStep2.otp ? "signup-otp-error" : undefined}
                  className={`h-13 w-full rounded-xl border bg-white px-4 py-3.5 text-center text-lg font-semibold tracking-[0.35em] text-slate-950 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:ring-4 ${errorsStep2.otp ? "border-red-500 focus:ring-red-100" : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100"}`}
                  {...registerStep2("otp", { required: "OTP is required" })}
                />
                {errorsStep2.otp && <p id="signup-otp-error" className="mt-2 text-sm font-normal text-red-600" role="alert">{errorsStep2.otp.message}</p>}
                <div className="mt-3 flex items-center justify-between">
                  <button type="button" className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" onClick={() => setStep(1)}>
                    <ArrowLeft size={16} aria-hidden="true" /> Back
                  </button>
                  <button type="button" className="min-h-11 rounded-lg px-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:opacity-60" onClick={handleSubmitStep1(handleMobileSubmit)} disabled={loading}>
                    Resend OTP
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="signup-name">
                  Full name
                </label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                  <input type="text" id="signup-name" autoComplete="name" placeholder="Enter your full name" aria-invalid={Boolean(errorsStep2.name)} aria-describedby={errorsStep2.name ? "signup-name-error" : undefined} className={`h-13 w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errorsStep2.name ? "border-red-500 focus:ring-red-100" : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100"}`} {...registerStep2("name", { required: "Full name is required" })} />
                </div>
                {errorsStep2.name && <p id="signup-name-error" className="mt-2 text-sm font-normal text-red-600" role="alert">{errorsStep2.name.message}</p>}
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="signup-email">
                  Email address <span className="font-normal text-slate-500">(optional)</span>
                </label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                  <input type="email" id="signup-email" autoComplete="email" placeholder="you@example.com" className="h-13 w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-12 pr-4 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100" {...registerStep2("email")} />
                </div>
              </div>
              {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-normal text-red-700" role="alert">{error}</div>}
              <div className="mt-7">
                <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || mutation.isPending}>
                  {loading || mutation.isPending ? <><span className="loading loading-spinner loading-sm" /> Creating account…</> : "Create account"}
                </button>
              </div>
            </form>
          )}

          <p className="mt-7 text-center text-sm font-normal text-slate-600">
            Already have an account?{" "}
            <Link to={redirectPath ? `/sign-in?path=${encodeURIComponent(redirectPath)}` : "/sign-in"} className="rounded font-semibold text-blue-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
              Sign in
            </Link>
          </p>
    </div>
  );
}
