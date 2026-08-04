import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";
import { RotateCw, ShieldCheck } from "lucide-react";
import { getCities, getStates, stepFormeData } from "../../react-query/apis";
import { API_URL } from "../../react-query/constants";
import { ApiErrorResponse, CitiesResponse, StateProps } from "../../types";
import { FormJoinUsType } from "../../schema/step-form";

const OTP_RESEND_SECONDS = 59;

const WORK_OPTIONS = [
  "राज मिस्त्री (Building Work)",
  "लेबर / हेल्पर",
  "लोडिंग / अनलोडिंग",
  "पेंटर",
  "इलेक्ट्रिशियन",
  "प्लंबर",
  "सफाई कार्य",
  "टाइल्स कार्य",
  "फिनिशिंग कार्य",
  "शटरिंग कार्य",
  "स्टील बार बेंडर",
  "कारपेंटर",
  "अन्य",
];

const OTHER_WORK = "अन्य";

const EXPERIENCE_OPTIONS = [
  { value: "0-1", label: "1 साल से कम" },
  { value: "1-3", label: "1 - 3 साल" },
  { value: "3-5", label: "3 - 5 साल" },
  { value: "5-7", label: "5 - 7 साल" },
  { value: "7-10", label: "7 - 10 साल" },
  { value: "10-More", label: "10 साल से ज़्यादा" },
];

const TRANSPORT_OPTIONS = ["पैदल", "साइकिल", "बाइक"];
const AVAILABILITY_OPTIONS = ["हाँ, आज से", "कल से", "बाद में"];

const labelClass = "block text-[13px] font-bold text-[#0f1e57]";
const required = <span className="text-red-500">*</span>;
const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-lg border border-[#d8e4f8] bg-white px-3.5 text-[13px] font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#a9b8d6] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100";
const errorClass = "mt-1 text-[11px] font-semibold text-red-600";
const radioRowClass =
  "flex cursor-pointer items-center gap-2.5 text-[13px] font-medium text-[#40517b] transition hover:text-[#0f1e57]";
const radioInputClass = "size-4 shrink-0 border-[#9bb0d6] text-[#0b3fc4] focus:ring-[#0b3fc4]";

const RegistrationForm = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [stateId, setStateId] = useState("");
  const [cityId, setCityId] = useState("");
  const [works, setWorks] = useState<string[]>([]);
  const [otherWork, setOtherWork] = useState("");
  const [experience, setExperience] = useState("");
  const [currentLocation, setCurrentLocation] = useState("");
  const [transport, setTransport] = useState("");
  const [availability, setAvailability] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [serverOtp, setServerOtp] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);

  const { data: states, isLoading: isLoadingStates } = useQuery<StateProps, Error>({
    queryKey: ["states"],
    queryFn: getStates,
    staleTime: Infinity,
  });

  const { data: cities, isLoading: isLoadingCities } = useQuery<CitiesResponse, Error>({
    queryKey: ["cities", stateId],
    queryFn: () => getCities(Number(stateId)),
    enabled: !!stateId,
    staleTime: Infinity,
  });

  // Resend countdown.
  useEffect(() => {
    if (secondsLeft <= 0) return;
    const timer = setTimeout(() => setSecondsLeft((value) => value - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft]);

  // Changing the number invalidates any OTP already sent.
  useEffect(() => {
    setOtpSent(false);
    setServerOtp(null);
    setOtp("");
    setSecondsLeft(0);
  }, [mobile]);

  const toggleWork = (work: string) =>
    setWorks((prev) => (prev.includes(work) ? prev.filter((item) => item !== work) : [...prev, work]));

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(mobile)) {
      setErrors((prev) => ({ ...prev, mobile: "10 अंकों का सही मोबाइल नंबर दर्ज करें।" }));
      return;
    }

    setSendingOtp(true);
    try {
      const response = await fetch(`${API_URL}/register-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile_no: mobile }),
      });
      if (!response.ok) throw new Error("Failed to send OTP");

      const data = await response.json();
      setServerOtp(data.otp ? String(data.otp) : null);
      setOtpSent(true);
      setSecondsLeft(OTP_RESEND_SECONDS);
      setErrors((prev) => ({ ...prev, mobile: "" }));
      toast.success("ओटीपी भेज दिया गया है।");
    } catch (error) {
      console.error(error);
      toast.error("ओटीपी नहीं भेजा जा सका। कृपया दोबारा कोशिश करें।");
    } finally {
      setSendingOtp(false);
    }
  };

  const mutation = useMutation({
    mutationFn: stepFormeData,
    onSuccess: () => navigate("/become-a-part-of-dehatwala/success"),
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        toast.error(apiError.response?.data.message || "कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।");
      } else {
        toast.error("कुछ गड़बड़ हो गई। कृपया दोबारा कोशिश करें।");
      }
    },
  });

  const validate = () => {
    const next: Record<string, string> = {};

    if (!name.trim()) next.name = "कृपया अपना नाम दर्ज करें।";
    if (!stateId) next.stateId = "कृपया राज्य चुनें।";
    if (!cityId) next.cityId = "कृपया शहर चुनें।";
    if (works.length === 0) next.works = "कम से कम एक कार्य चुनें।";
    if (works.includes(OTHER_WORK) && !otherWork.trim()) next.otherWork = "कृपया अपना कार्य लिखें।";
    if (!experience) next.experience = "कृपया अनुभव चुनें।";
    if (!currentLocation.trim()) next.currentLocation = "कृपया अपनी वर्तमान लोकेशन दर्ज करें।";
    if (!transport) next.transport = "कृपया आने-जाने का साधन चुनें।";
    if (!availability) next.availability = "कृपया बताएं कि आप कब से काम शुरू कर सकते हैं।";
    if (!/^\d{10}$/.test(mobile)) next.mobile = "10 अंकों का सही मोबाइल नंबर दर्ज करें।";
    else if (!otpSent) next.mobile = "कृपया पहले ओटीपी भेजें।";
    if (!otp.trim()) next.otp = "कृपया ओटीपी दर्ज करें।";
    else if (serverOtp && otp !== serverOtp) next.otp = "ओटीपी गलत है।";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    const payload: FormJoinUsType = {
      full_name: name.trim(),
      state_id: stateId,
      city_id: cityId,
      work_experience: experience,
      mobile_number: mobile,
      works: works.map((work) => (work === OTHER_WORK && otherWork.trim() ? otherWork.trim() : work)),
      other_work_text: works.includes(OTHER_WORK) ? otherWork.trim() : "",
      current_location: currentLocation.trim(),
      transport,
      availability,
    };

    mutation.mutate(payload);
  };

  return (
    <section className="rounded-2xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-26px_rgba(20,61,141,0.5)] sm:p-6 lg:p-7">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <div>
          <label htmlFor="name" className={labelClass}>
            आपका नाम {required}
          </label>
          <input
            id="name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="अपना नाम दर्ज करें"
            aria-invalid={!!errors.name}
            className={fieldClass}
          />
          {errors.name && <p className={errorClass}>{errors.name}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="state" className={labelClass}>
              राज्य {required}
            </label>
            <select
              id="state"
              value={stateId}
              onChange={(event) => {
                setStateId(event.target.value);
                setCityId("");
              }}
              aria-invalid={!!errors.stateId}
              className={fieldClass}
            >
              <option value="">{isLoadingStates ? "लोड हो रहा है…" : "राज्य चुनें"}</option>
              {states?.states?.map((state) => (
                <option key={state.id} value={String(state.id)}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.stateId && <p className={errorClass}>{errors.stateId}</p>}
          </div>

          <div>
            <label htmlFor="city" className={labelClass}>
              शहर {required}
            </label>
            <select
              id="city"
              value={cityId}
              onChange={(event) => setCityId(event.target.value)}
              disabled={!stateId}
              aria-invalid={!!errors.cityId}
              className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-[#f4f7fc]`}
            >
              <option value="">
                {!stateId ? "पहले राज्य चुनें" : isLoadingCities ? "लोड हो रहा है…" : "शहर चुनें"}
              </option>
              {/* NB: the API returns `cites`, not `cities` — typo is upstream. */}
              {cities?.cites?.map((city) => (
                <option key={city.id} value={String(city.id)}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.cityId && <p className={errorClass}>{errors.cityId}</p>}
          </div>
        </div>

        <fieldset>
          <legend className={labelClass}>
            आप कौन सा कार्य करते हैं? {required}{" "}
            <span className="font-medium text-[#8fa2c8]">(एक या एक से अधिक चुनें)</span>
          </legend>

          <div className="mt-2.5 grid gap-x-6 gap-y-2.5 sm:grid-cols-2">
            {WORK_OPTIONS.map((work) => (
              <label key={work} className="flex cursor-pointer items-center gap-2.5 text-[13px] text-[#40517b]">
                <input
                  type="checkbox"
                  checked={works.includes(work)}
                  onChange={() => toggleWork(work)}
                  className="size-4 shrink-0 rounded border-[#9bb0d6] text-[#0b3fc4] focus:ring-[#0b3fc4]"
                />
                {work}
              </label>
            ))}
          </div>
          {errors.works && <p className={errorClass}>{errors.works}</p>}

          {works.includes(OTHER_WORK) && (
            <div className="mt-3">
              <label htmlFor="other-work" className="sr-only">
                अन्य कार्य
              </label>
              <input
                id="other-work"
                value={otherWork}
                onChange={(event) => setOtherWork(event.target.value)}
                placeholder="अपना कार्य लिखें"
                aria-invalid={!!errors.otherWork}
                className={fieldClass}
              />
              {errors.otherWork && <p className={errorClass}>{errors.otherWork}</p>}
            </div>
          )}
        </fieldset>

        <div>
          <label htmlFor="experience" className={labelClass}>
            कुल अनुभव (साल में) {required}
          </label>
          <select
            id="experience"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            aria-invalid={!!errors.experience}
            className={fieldClass}
          >
            <option value="">अनुभव चुनें</option>
            {EXPERIENCE_OPTIONS.map(({ value, label }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.experience && <p className={errorClass}>{errors.experience}</p>}
        </div>

        <div>
          <label htmlFor="current-location" className={labelClass}>
            वर्तमान Location <span className="font-medium text-[#8fa2c8]">(जहाँ आप अभी रह रहे हैं)</span> {required}
          </label>
          <input
            id="current-location"
            value={currentLocation}
            onChange={(event) => setCurrentLocation(event.target.value)}
            placeholder="उदाहरण: सेक्टर 56, गुरुग्राम"
            aria-invalid={!!errors.currentLocation}
            className={fieldClass}
          />
          {errors.currentLocation && <p className={errorClass}>{errors.currentLocation}</p>}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <fieldset>
            <legend className={labelClass}>क्या आपके पास आने-जाने का साधन है? {required}</legend>
            <div className="mt-2.5 space-y-2.5">
              {TRANSPORT_OPTIONS.map((option) => (
                <label key={option} className={radioRowClass}>
                  <input
                    type="radio"
                    name="transport"
                    value={option}
                    checked={transport === option}
                    onChange={() => setTransport(option)}
                    className={radioInputClass}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.transport && <p className={errorClass}>{errors.transport}</p>}
          </fieldset>

          <fieldset>
            <legend className={labelClass}>क्या आप आज से काम शुरू कर सकते हैं? {required}</legend>
            <div className="mt-2.5 space-y-2.5">
              {AVAILABILITY_OPTIONS.map((option) => (
                <label key={option} className={radioRowClass}>
                  <input
                    type="radio"
                    name="availability"
                    value={option}
                    checked={availability === option}
                    onChange={() => setAvailability(option)}
                    className={radioInputClass}
                  />
                  {option}
                </label>
              ))}
            </div>
            {errors.availability && <p className={errorClass}>{errors.availability}</p>}
          </fieldset>
        </div>

        <div>
          <label htmlFor="mobile" className={labelClass}>
            मोबाइल नंबर {required}
          </label>
          <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row">
            <div className="flex flex-1 items-stretch overflow-hidden rounded-lg border border-[#d8e4f8] bg-white transition focus-within:border-[#0b3fc4] focus-within:ring-4 focus-within:ring-blue-100">
              <span className="grid min-h-11 place-items-center border-r border-[#e6edf9] bg-[#f6f9ff] px-3 text-[13px] font-bold text-[#40517b]">
                +91
              </span>
              <input
                id="mobile"
                inputMode="numeric"
                maxLength={10}
                value={mobile}
                onChange={(event) => setMobile(event.target.value.replace(/\D/g, ""))}
                placeholder="मोबाइल नंबर दर्ज करें"
                aria-invalid={!!errors.mobile}
                className="min-h-11 w-full px-3.5 text-[13px] font-medium text-[#0f1e57] outline-none placeholder:font-normal placeholder:text-[#a9b8d6]"
              />
            </div>
            <button
              type="button"
              onClick={sendOtp}
              disabled={sendingOtp || (otpSent && secondsLeft > 0)}
              className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-lg bg-[#0b3fc4] px-5 text-[13px] font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {sendingOtp ? "भेजा जा रहा है…" : "ओटीपी भेजें"}
            </button>
          </div>
          {errors.mobile && <p className={errorClass}>{errors.mobile}</p>}
        </div>

        {otpSent && (
          <div>
            <label htmlFor="otp" className={labelClass}>
              ओटीपी दर्ज करें {required}
            </label>
            <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row sm:items-center">
              <input
                id="otp"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ""))}
                placeholder="6 अंकों का ओटीपी दर्ज करें"
                aria-invalid={!!errors.otp}
                className="min-h-11 flex-1 rounded-lg border border-[#d8e4f8] bg-white px-3.5 text-[13px] font-medium tracking-[0.2em] text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:tracking-normal placeholder:text-[#a9b8d6] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100"
              />
              <div className="flex shrink-0 items-center gap-2.5">
                <button
                  type="button"
                  onClick={sendOtp}
                  disabled={secondsLeft > 0 || sendingOtp}
                  className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#0b3fc4] transition hover:underline disabled:cursor-not-allowed disabled:text-[#a9b8d6] disabled:no-underline"
                >
                  <RotateCw size={13} aria-hidden="true" /> ओटीपी पुनः भेजें
                </button>
                {secondsLeft > 0 && (
                  <span className="text-[12px] font-bold tabular-nums text-[#0f1e57]">
                    00:{String(secondsLeft).padStart(2, "0")}
                  </span>
                )}
              </div>
            </div>
            {errors.otp && <p className={errorClass}>{errors.otp}</p>}
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-[#0b3fc4] px-6 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {mutation.isPending ? "भेजा जा रहा है…" : "पंजीकरण करें"}
        </button>

        <p className="flex items-start gap-2 text-[11px] font-normal leading-5 text-[#8fa2c8]">
          <ShieldCheck size={14} className="mt-0.5 shrink-0 text-[#0b3fc4]" aria-hidden="true" />
          आपकी जानकारी सुरक्षित है और केवल वेरिफिकेशन के लिए उपयोग की जाएगी.
        </p>
      </form>
    </section>
  );
};

export default RegistrationForm;
