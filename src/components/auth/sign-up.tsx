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

export type FormDataStep1 = z.infer<typeof formSchemaStep1>;
export type FormDataStep2 = z.infer<typeof formSchemaStep2>;

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
      setError(err.message);
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
  const [otp, setOtp] = useState(null);
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
      setOtp(result.otp);
      setMobileNumber(data.mobile_no);
      setStep(2);

      // Programmatically set the OTP value in the input field
      setValue("otp", result.otp.toString());
      console.log(otp);
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
    <div className={twMerge("card w-full max-w-sm shadow-2xl bg-base-100", className)}>
      <div className="card w-full max-w-sm shadow-2xl bg-base-100">
        <div className="card-body">
          <h2 className="text-center text-2xl font-bold">Create an Account</h2>
          {step === 1 && (
            <form onSubmit={handleSubmitStep1(handleMobileSubmit)}>
              <div className="form-control">
                <label className="label" htmlFor="mobile">
                  <span className="label-text">Mobile number</span>
                </label>
                <input
                  type="text"
                  id="mobile"
                  placeholder="+91-9000000000"
                  className={`input input-bordered ${errorsStep1.mobile_no ? "input-error" : ""}`}
                  {...registerStep1("mobile_no", {
                    required: "Mobile number is required",
                  })}
                />
                {errorsStep1.mobile_no && (
                  <span className="text-error text-sm mt-1">{errorsStep1.mobile_no.message}</span>
                )}
              </div>
              {error && <div className="text-error mt-2">{error}</div>}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary">
                  Next
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmitStep2(handleOtpSubmit)}>
              <div className="form-control">
                <label className="label" htmlFor="otp">
                  <span className="label-text">OTP</span>
                </label>
                <input
                  type="text"
                  id="otp"
                  placeholder="Your otp"
                  className={`input input-bordered ${errorsStep2.otp ? "input-error" : ""}`}
                  {...registerStep2("otp", {
                    required: "OTP is required",
                  })}
                />
                <div className="flex justify-between items-center">
                  <button className="btn btn-link" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button className="btn btn-link" onClick={handleSubmitStep1(handleMobileSubmit)}>
                    Resend OTP
                  </button>
                </div>
                {errorsStep2.otp && <span className="text-error text-sm mt-1">{errorsStep2.otp.message}</span>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="name">
                  <span className="label-text">Full Name</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className={`input input-bordered ${errorsStep2.name ? "input-error" : ""}`}
                  {...registerStep2("name", { required: "Full name is required" })}
                />
                {errorsStep2.name && <span className="text-error text-sm mt-1">{errorsStep2.name.message}</span>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="email">
                  <span className="label-text">Email (optional)</span>
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="John Doe"
                  className="input input-bordered"
                  {...registerStep2("email")}
                />
              </div>
              {error && <div className="text-error mt-2">{error}</div>}
              <div className="form-control mt-6">
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <span className="loading loading-spinner"></span> : "Sign Up"}
                </button>
              </div>
            </form>
          )}

          <p className="text-center mt-4">
            Already have an account?{" "}
            <Link to="/sign-in" className="link link-primary">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
