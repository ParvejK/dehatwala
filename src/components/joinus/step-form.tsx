import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { getCities, getStates, stepFormeData } from "../../react-query/apis";
import { API_URL } from "../../react-query/constants";
import { ApiErrorResponse, CitiesResponse, StateProps } from "../../types";
import { FormJoinUsType } from "../../schema/step-form";

const WORK_OPTIONS = [
  { value: "labour_supply_helper", label: "लेबर / सप्लाई हेल्पर (Labour / Supply Helper)" },
  { value: "mistri_work", label: "मिस्त्री वर्क (Mistri Work)" },
  { value: "helper_work", label: "हेल्पर वर्क (Helper Work)" },
  { value: "shuttering_work", label: "शटरिंग वर्क (Shuttering Work)" },
  { value: "bar_binder_work", label: "बार बाइन्डर वर्क (Bar Binder Work)" },
  { value: "loading_unloading_work", label: "लोडिंग / अनलोडिंग वर्क (Loading / Unloading Work)" },
  { value: "painter", label: "पेन्टर (Painter)" },
  { value: "heavy_machine_operator", label: "हेवी मशीन ऑपरेटर (Heavy Machine Operator)" },
  { value: "other", label: "अन्य कार्य (Other)" },
] as const;

const EXPERIENCE_OPTIONS = ["1-3", "3-5", "5-7", "7-10", "10-More"];

type WorkValue = (typeof WORK_OPTIONS)[number]["value"];

export default function StepForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedWorks, setSelectedWorks] = useState<WorkValue[]>([]);
  const [otherWorkText, setOtherWorkText] = useState("");
  const [aboutWork, setAboutWork] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [serverOtp, setServerOtp] = useState<string | null>(null);
  const [otpInput, setOtpInput] = useState("");
  const [sendingOtp, setSendingOtp] = useState(false);

  const {
    data: states,
    isLoading: isLoadingStates,
    isError: isErrorStates,
  } = useQuery<StateProps, Error>({
    queryKey: ["states"],
    queryFn: getStates,
    staleTime: Infinity,
  });

  const {
    data: cities,
    isLoading: isLoadingCities,
    isError: isErrorCities,
  } = useQuery<CitiesResponse, Error>({
    queryKey: ["cities", selectedStateId],
    queryFn: () => getCities(selectedStateId),
    enabled: !!selectedStateId,
    staleTime: Infinity,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    reset,
  } = useForm<FormJoinUsType>({
    defaultValues: {
      full_name: "",
      email: "",
      state_id: "",
      city_id: "",
      work_experience: "",
      mobile_number: "",
      works: [],
    },
  });

  const stateValue = watch("state_id");
  useEffect(() => {
    setSelectedStateId(Number(stateValue) || null);
  }, [stateValue]);

  const mobileValue = watch("mobile_number");
  useEffect(() => {
    if (otpSent) {
      setOtpSent(false);
      setOtpVerified(false);
      setServerOtp(null);
      setOtpInput("");
    }
  }, [mobileValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleWork = (value: WorkValue) => {
    setSelectedWorks((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));
  };

  const buildWorksPayload = () =>
    selectedWorks.map((value) => {
      if (value === "other" && otherWorkText.trim()) return otherWorkText.trim();
      return WORK_OPTIONS.find((o) => o.value === value)?.label || value;
    });

  const sendOtp = async () => {
    const valid = await trigger("mobile_number");
    if (!valid) return;
    setSendingOtp(true);
    try {
      const res = await fetch(`${API_URL}/register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_no: mobileValue }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      const data = await res.json();
      setServerOtp(data.otp ? String(data.otp) : null);
      setOtpSent(true);
      toast.success("OTP sent to your mobile number");
    } catch (err) {
      console.error(err);
      toast.error("Could not send OTP. Try again.");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = () => {
    if (!otpInput || otpInput.length < 4) {
      toast.error("Enter the OTP");
      return false;
    }
    if (serverOtp && otpInput !== serverOtp) {
      toast.error("Invalid OTP");
      return false;
    }
    setOtpVerified(true);
    toast.success("OTP verified");
    return true;
  };

  const mutation = useMutation({
    mutationFn: stepFormeData,
    onSuccess: () => {
      reset();
      setSelectedWorks([]);
      setOtherWorkText("");
      setAboutWork("");
      setOtpSent(false);
      setOtpVerified(false);
      setServerOtp(null);
      setOtpInput("");
      setCurrentStep(1);
      navigate("/become-a-part-of-dehatwala/success");
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        toast.error(apiError.response?.data.message || "An unexpected error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });

  const onSubmit = (data: FormJoinUsType) => {
    if (!otpVerified) {
      if (!verifyOtp()) return;
    }
    const payload = {
      ...data,
      other_work_text: selectedWorks.includes("other") ? otherWorkText.trim() : "",
      works: buildWorksPayload(),
    };
    mutation.mutate(payload);
  };

  const nextStep = async () => {
    if (currentStep === 1) {
      const isValid = await trigger(["full_name", "email", "state_id", "city_id"]);
      if (!isValid) return;
    } else if (currentStep === 2) {
      if (selectedWorks.length === 0) {
        toast.error("Please select at least one work type");
        return;
      }
      if (selectedWorks.includes("other") && !otherWorkText.trim()) {
        toast.error("Please type your work in the Other field");
        return;
      }
    }
    setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
  };

  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  if (isErrorStates || isErrorCities) return <p>Error loading data...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Join Us</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {currentStep === 1 && (
          <div className="space-y-6 border-b pb-4">
            <div className="form-control">
              <label className="label" htmlFor="full_name">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                id="full_name"
                {...register("full_name", { required: "Full name is required" })}
                placeholder="Full Name"
                className={`input input-bordered ${errors.full_name ? "input-error" : ""}`}
              />
              {errors.full_name && <span className="text-error text-sm mt-1">{errors.full_name.message}</span>}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="email">
                <span className="label-text">Email</span>
              </label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                })}
                placeholder="Email"
                className={`input input-bordered ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingStates ? (
                <div className="space-y-3">
                  <div className="skeleton h-5 w-16" />
                  <div className="skeleton h-8 w-full" />
                </div>
              ) : (
                <div className="form-control">
                  <label className="label" htmlFor="state_id">
                    <span className="label-text">State</span>
                  </label>
                  <select
                    id="state_id"
                    {...register("state_id", { required: "State is required" })}
                    className={`select select-bordered w-full ${errors.state_id ? "select-error" : ""}`}
                  >
                    <option value="">Select a state</option>
                    {states?.states.map((state) => (
                      <option key={state.id} value={state.id}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.state_id && <span className="text-error text-sm mt-1">{errors.state_id.message}</span>}
                </div>
              )}

              {isLoadingCities ? (
                <div className="space-y-3">
                  <div className="skeleton h-5 w-16" />
                  <div className="skeleton h-8 w-full" />
                </div>
              ) : (
                <div className="form-control">
                  <label className="label" htmlFor="city_id">
                    <span className="label-text">City</span>
                  </label>
                  <select
                    id="city_id"
                    {...register("city_id", { required: "City is required" })}
                    className={`select select-bordered w-full ${errors.city_id ? "select-error" : ""}`}
                    disabled={!selectedStateId || isLoadingCities}
                  >
                    <option value="">Select a city</option>
                    {(cities?.cites || []).map((city) => (
                      <option key={city.id} value={city.id}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.city_id && <span className="text-error text-sm mt-1">{errors.city_id.message}</span>}
                </div>
              )}
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4 border-b pb-4">
            <h3 className="text-base md:text-lg font-semibold">
              आप कौनसा कार्य करते हैं? <span className="text-sm font-normal text-gray-600">(What work do you do?)</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {WORK_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className="flex items-center gap-3 cursor-pointer bg-white border border-base-300 rounded-md px-3 py-2 hover:border-primary"
                >
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary"
                    checked={selectedWorks.includes(opt.value)}
                    onChange={() => toggleWork(opt.value)}
                  />
                  <span className="text-sm md:text-base">{opt.label}</span>
                </label>
              ))}
            </div>
            {selectedWorks.includes("other") && (
              <div className="form-control">
                <label className="label" htmlFor="other_work">
                  <span className="label-text">अन्य कार्य का विवरण (Specify other work)</span>
                </label>
                <input
                  type="text"
                  id="other_work"
                  value={otherWorkText}
                  onChange={(e) => setOtherWorkText(e.target.value)}
                  placeholder="Type your work here"
                  className="input input-bordered"
                />
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="form-control">
              <label className="label" htmlFor="work_experience">
                <span className="label-text">
                  आपको कितने साल का अनुभव है?{" "}
                  <span className="text-xs text-gray-600">(Years of experience)</span>
                </span>
              </label>
              <select
                id="work_experience"
                {...register("work_experience", { required: "Experience is required" })}
                className={`select select-bordered w-full ${errors.work_experience ? "select-error" : ""}`}
              >
                <option value="">Select experience</option>
                {EXPERIENCE_OPTIONS.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp} years
                  </option>
                ))}
              </select>
              {errors.work_experience && (
                <span className="text-error text-sm mt-1">{errors.work_experience.message}</span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="about_work">
                <span className="label-text">
                  अपने काम के बारे में बताएं <span className="text-xs text-gray-600">(Tell about your work)</span>
                </span>
              </label>
              <textarea
                id="about_work"
                value={aboutWork}
                onChange={(e) => setAboutWork(e.target.value)}
                placeholder="Briefly describe your work"
                className="textarea textarea-bordered w-full"
                rows={3}
              />
            </div>

            <div className="form-control">
              <label className="label" htmlFor="mobile_number">
                <span className="label-text">
                  मोबाइल नं. <span className="text-xs text-gray-600">(Mobile Number)</span>
                </span>
              </label>
              <div className="flex gap-2">
                <input
                  type="tel"
                  id="mobile_number"
                  {...register("mobile_number", {
                    required: "Mobile number is required",
                    pattern: { value: /^[0-9]{10}$/, message: "Please enter a valid 10-digit mobile number" },
                  })}
                  placeholder="10-digit mobile number"
                  className={`input input-bordered flex-1 ${errors.mobile_number ? "input-error" : ""}`}
                  disabled={otpVerified}
                />
                <button
                  type="button"
                  className="btn btn-outline btn-primary"
                  onClick={sendOtp}
                  disabled={sendingOtp || otpVerified}
                >
                  {sendingOtp ? "Sending..." : otpSent ? "Resend OTP" : "Send OTP"}
                </button>
              </div>
              {errors.mobile_number && (
                <span className="text-error text-sm mt-1">{errors.mobile_number.message}</span>
              )}
            </div>

            {otpSent && (
              <div className="form-control">
                <label className="label" htmlFor="otp">
                  <span className="label-text">Enter OTP</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="otp"
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value);
                      if (otpVerified) setOtpVerified(false);
                    }}
                    placeholder="Enter OTP"
                    className="input input-bordered flex-1"
                    disabled={otpVerified}
                  />
                  <button
                    type="button"
                    className="btn btn-outline btn-primary"
                    onClick={verifyOtp}
                    disabled={otpVerified || otpInput.length < 4}
                  >
                    {otpVerified ? "Verified ✓" : "Verify"}
                  </button>
                </div>
                {otpVerified && (
                  <span className="text-success text-sm mt-1">Mobile number verified</span>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-2">
          {currentStep > 1 ? (
            <button type="button" onClick={prevStep} className="btn btn-link px-0">
              Previous
            </button>
          ) : (
            <span />
          )}
          {currentStep < 3 && (
            <button type="button" onClick={nextStep} className="btn btn-primary min-w-[120px]">
              Next
            </button>
          )}
        </div>

        {currentStep === 3 && (
          <button
            type="submit"
            className="btn btn-primary mt-4 min-w-[200px]"
            disabled={mutation.isPending || !otpVerified}
          >
            {mutation.isPending ? "Submitting..." : "Submit"}
          </button>
        )}
      </form>
    </div>
  );
}
