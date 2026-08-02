import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { API_URL } from "../../react-query/constants";
import toast from "react-hot-toast";
import { ArrowLeft, ArrowRight, CheckCircle2, Mail } from "lucide-react";
import AuthLayout from "../../components/auth/auth-layout";

type ForgotPasswordInputs = {
  email: string;
};

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const postData = async (url: string, data: object) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Password reset request failed");
      }
      const result = await response.json();
      setSuccess(result.message || "Password reset email sent successfully");
      return result;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password reset request failed");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { postData, loading, error, success };
};

export default function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInputs>();
  const { postData, loading, error, success } = useApi();

  const onSubmit: SubmitHandler<ForgotPasswordInputs> = async (data) => {
    const result = await postData(`${API_URL}/forgot-password`, data);
    if (result) {
      // Successful password reset request
      // You can choose to redirect or stay on the same page
      // router('/check-email')
      toast.success("Please check your email.");
    }
  };

  return (
    <AuthLayout
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter the email linked to your account. We’ll send you secure instructions to choose a new password."
    >
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-800" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} aria-hidden="true" />
                <input
                  type="email"
                  id="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : "email-help"}
                  className={`h-13 w-full rounded-xl border bg-white py-3.5 pl-12 pr-4 text-base font-normal text-slate-950 outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.email ? "border-red-500 focus:ring-red-100" : "border-slate-300 hover:border-slate-400 focus:border-blue-600 focus:ring-blue-100"}`}
                  {...register("email", {
                    required: "Email is required",
                    pattern: { value: /\S+@\S+\.\S+/, message: "Enter a valid email address" },
                  })}
                />
              </div>
              {errors.email ? <p id="email-error" className="mt-2 text-sm font-normal text-red-600" role="alert">{errors.email.message}</p> : <p id="email-help" className="mt-2 text-xs font-normal text-slate-500">Check your inbox and spam folder after submitting.</p>}
            </div>
            {error && <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-normal text-red-700" role="alert">{error}</div>}
            {success && <div className="mt-4 flex gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-normal text-emerald-800" role="status"><CheckCircle2 className="mt-0.5 shrink-0" size={17} aria-hidden="true" />{success}</div>}
            <div className="mt-7">
              <button type="submit" className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-700/20 transition hover:bg-blue-800 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60" disabled={loading}>
                {loading ? <><span className="loading loading-spinner loading-sm" /> Sending instructions…</> : <>Send reset instructions <ArrowRight size={17} aria-hidden="true" /></>}
              </button>
            </div>
          </form>
          <div className="mt-7 text-center">
            <Link to="/sign-in" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-slate-600 transition hover:text-blue-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100">
              <ArrowLeft size={16} aria-hidden="true" /> Back to sign in
            </Link>
          </div>
    </AuthLayout>
  );
}
