import { FC, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";
import { z } from "zod";
import { API_URL } from "../../react-query/constants";
import { useMutation } from "@tanstack/react-query";
import { useAuthStore } from "../../store/auth-store";
import axios, { AxiosError } from "axios";
import { ApiErrorResponse } from "../../types";
import { ArrowLeft, ArrowRight, LockKeyhole, Phone } from "lucide-react";

const formSchemaStep1 = z.object({
  mobile_no: z.string().min(10, "Mobile number is required."),
});

const formSchemaStep2 = z.object({
  mobile_no: z.string().min(10, "Mobile number is required."),
  otp: z.string().min(4, "OTP is required."),
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
          throw new Error("User not found");
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

interface SignInProps {
  className?: string;
}
const SignIn: FC<SignInProps> = ({ className }) => {
  const [otp, setOtp] = useState(null);
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const redirectPath = searchParams.get("path") ? decodeURIComponent(searchParams.get("path")) : "/";
  // const location = useLocation();

  const [step, setStep] = useState(1); // Tracks the current step
  const [mobileNumber, setMobileNumber] = useState(""); // Store the mobile number after Step 1
  const { postData, loading, error } = useApi();

  // Form handlers for Step 1 and Step 2
  const {
    register: registerStep1,
    handleSubmit: handleSubmitStep1,
    formState: { errors: errorsStep1 },
  } = useForm<FormDataStep1>();

  const {
    register: registerStep2,
    handleSubmit: handleSubmitStep2,
    setValue,
    formState: { errors: errorsStep2 },
  } = useForm<FormDataStep2>();

  const handleMobileSubmit: SubmitHandler<FormDataStep1> = async (data) => {
    const result = await postData(`${API_URL}/request-otp`, data);
    if (result) {
      setOtp(result.otp);
      setMobileNumber(data.mobile_no);
      setStep(2);

      // Programmatically set the OTP value in the input field
      setValue("otp", result.otp.toString());
    }
    console.log(otp);
  };

  const mutation = useMutation({
    mutationFn: async (data: FormDataStep2) => {
      const result = await postData(`${API_URL}/login`, { mobile_no: mobileNumber, otp: data.otp });
      if (result) {
        const { token, user } = result;
        useAuthStore.getState().setUserData(user, token);
      } else {
        throw new Error("Login failed");
      }
    },
    onSuccess: () => {
      toast.success("Login successful");
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

  const handleOtpSubmit: SubmitHandler<FormDataStep2> = (data) => {
    if (!mobileNumber) {
      toast.error("Mobile number is required");
      return;
    }
    mutation.mutate({ mobile_no: mobileNumber, otp: data.otp });
  };

  return (
    <div className={twMerge("w-full", className)}>
      <div>
        {step === 1 && (
          <form onSubmit={handleSubmitStep1(handleMobileSubmit)} noValidate>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="mobile">
                Mobile number
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                <input
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  id="mobile"
                  placeholder="Enter your 10-digit number"
                  aria-invalid={Boolean(errorsStep1.mobile_no)}
                  aria-describedby={errorsStep1.mobile_no ? "mobile-error" : "mobile-help"}
                  className={`h-13 w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errorsStep1.mobile_no ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100"}`}
                  {...registerStep1("mobile_no", { required: "Mobile number is required" })}
                />
              </div>
              {errorsStep1.mobile_no && (
                <p id="mobile-error" className="mt-2 text-sm font-normal text-red-600" role="alert">{errorsStep1.mobile_no.message}</p>
              )}
              {!errorsStep1.mobile_no && <p id="mobile-help" className="mt-2 text-xs font-normal text-slate-500">We’ll use this number only to verify your account.</p>}
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
              <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="otp">
                One-time password
              </label>
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                id="otp"
                placeholder="Enter your OTP"
                aria-invalid={Boolean(errorsStep2.otp)}
                aria-describedby={errorsStep2.otp ? "otp-error" : undefined}
                className={`h-13 w-full rounded-xl border bg-white px-4 py-3.5 text-center text-lg font-semibold tracking-[0.35em] text-slate-950 outline-none transition placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:ring-4 ${errorsStep2.otp ? "border-red-500 focus:ring-red-100" : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100"}`}
                {...registerStep2("otp", {
                  required: "OTP is required",
                })}
              />
              {errorsStep2.otp && <p id="otp-error" className="mt-2 text-sm font-normal text-red-600" role="alert">{errorsStep2.otp.message}</p>}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <button type="button" className="inline-flex min-h-11 items-center gap-1 rounded-lg px-2 text-sm font-semibold text-slate-600 transition hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" onClick={() => setStep(1)}>
                <ArrowLeft size={16} aria-hidden="true" /> Back
              </button>
              <button type="button" className="min-h-11 rounded-lg px-2 text-sm font-semibold text-blue-700 transition hover:text-blue-900 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100" onClick={handleSubmitStep1(handleMobileSubmit)} disabled={loading}>
                Resend OTP
              </button>
            </div>

            {error && <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-normal text-red-700" role="alert">{error}</div>}

            <div className="mt-5">
              <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading || mutation.isPending}>
                {loading || mutation.isPending ? <><span className="loading loading-spinner loading-sm" /> Signing in…</> : "Sign in securely"}
              </button>
            </div>
          </form>
        )}

        <p className="mt-7 text-center text-sm font-normal text-slate-600">
          New to DehatWala?{" "}
          <Link to={redirectPath ? `/sign-up?path=${redirectPath}` : "/sign-up"} className="rounded font-semibold text-blue-700 underline-offset-4 hover:underline focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
