import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { API_URL } from "../../react-query/constants";
import toast from "react-hot-toast";

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
      setError(err.message);
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
    <div className="min-h-screen bg-base-200 flex items-center justify-center">
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Forgot Password</h2>
          <p className="text-center text-sm text-base-content/70 mt-2">
            Enter your email address and we'll send you a link to reset your password.
          </p>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                placeholder="email@example.com"
                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
            </div>
            {error && <div className="text-error mt-2">{error}</div>}
            {success && <div className="text-success mt-2">{success}</div>}
            <div className="form-control mt-6">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? <span className="loading loading-spinner"></span> : "Reset Password"}
              </button>
            </div>
          </form>
          <div className="text-center mt-4">
            <Link to="/sign-in" className="link link-primary">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
