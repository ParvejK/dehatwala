import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ArrowRight, CheckCircle2, CloudUpload, FileText, Mail, TriangleAlert, X } from "lucide-react";
import { Link } from "react-router-dom";

import { getCities, getStates, submitCareerApplication } from "../../react-query/apis";
import {
  ACCEPTED_CV_EXTENSIONS,
  CareerApplicationForm,
  CareerApplicationSchema,
} from "../../schema/careers";
import { CareerApplicationPayload, CitiesResponse, StateProps } from "../../types";
import { CAREERS_EMAIL, careerMailto, OPEN_POSITIONS_PATH } from "./data";

const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-xl border border-[#d8e4f8] bg-white px-4 text-sm font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#9badd0] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100 disabled:bg-[#f4f7fd] disabled:text-[#63739a]";

const labelClass = "block text-xs font-bold text-[#0f1e57]";

const errorClass = "mt-1.5 block text-[11px] font-semibold text-[#d63a3a]";

const formatSize = (bytes: number) => `${(bytes / (1024 * 1024)).toFixed(2)} MB`;

const Required = () => (
  <span className="text-[#d63a3a]" aria-hidden="true">
    {" "}
    *
  </span>
);

type ApplicationFormProps = {
  heading: string;
  description: string;
  source: "open-position" | "send-profile";
  /** Set when applying to a specific opening — the role becomes read-only. */
  role?: string;
  submitLabel: string;
  /** Free-text box, used on the general "send your profile" page. */
  showMessage?: boolean;
};

const ApplicationForm = ({ heading, description, source, role, submitLabel, showMessage }: ApplicationFormProps) => {
  const [isDragging, setIsDragging] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    resetField,
    formState: { errors },
  } = useForm<CareerApplicationForm>({
    resolver: zodResolver(CareerApplicationSchema),
    defaultValues: { role: role ?? "", state_id: "", city_id: "" },
  });

  const stateId = watch("state_id");
  const cv = watch("cv");

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

  const mutation = useMutation({
    // `strict: false` makes every z.infer key optional, so the cast restores what
    // the resolver has already guaranteed at runtime.
    mutationFn: (values: CareerApplicationForm) =>
      submitCareerApplication({ ...values, source } as CareerApplicationPayload),
  });

  const pickFile = (file?: File) => {
    if (!file) return;
    setValue("cv", file, { shouldValidate: true });
  };

  if (mutation.isSuccess) {
    return (
      <section
        aria-labelledby="application-success-heading"
        className="rounded-3xl border border-[#dce7fb] bg-white p-6 text-center sm:p-9"
      >
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-[#e8f6ee] text-[#188a4d]">
          <CheckCircle2 size={28} aria-hidden="true" />
        </span>
        <h2 id="application-success-heading" className="mt-4 text-lg font-extrabold text-[#0f1e57]">
          Application received
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-[#63739a] sm:text-[13px]">
          Thank you for applying{role ? ` for ${role}` : ""}. Our team reviews every profile and will get in touch if
          there is a match.
        </p>
        <Link
          to={OPEN_POSITIONS_PATH}
          className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[12px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
        >
          Back to Open Positions <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="application-heading"
      className="rounded-3xl border border-[#dce7fb] bg-white p-5 sm:p-7 lg:p-8"
    >
      <div className="text-center">
        <h2 id="application-heading" className="text-base font-extrabold text-[#0f1e57] sm:text-lg">
          {heading}
        </h2>
        <span aria-hidden="true" className="mx-auto mt-2 block h-[3px] w-11 rounded-full bg-[#0b3fc4]" />
        <p className="mx-auto mt-3 max-w-lg text-xs leading-6 text-[#63739a]">{description}</p>
      </div>

      <form noValidate onSubmit={handleSubmit((values) => mutation.mutate(values))} className="mt-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="career-name" className={labelClass}>
              Full Name
              <Required />
            </label>
            <input
              id="career-name"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              aria-invalid={!!errors.name}
              className={fieldClass}
              {...register("name")}
            />
            {errors.name && <span className={errorClass}>{errors.name.message}</span>}
          </div>

          <div>
            <label htmlFor="career-mobile" className={labelClass}>
              Mobile Number
              <Required />
            </label>
            <input
              id="career-mobile"
              type="tel"
              inputMode="numeric"
              maxLength={10}
              autoComplete="tel-national"
              placeholder="Enter your mobile number"
              aria-invalid={!!errors.mobile_number}
              className={fieldClass}
              {...register("mobile_number")}
            />
            {errors.mobile_number && <span className={errorClass}>{errors.mobile_number.message}</span>}
          </div>

          <div>
            <label htmlFor="career-email" className={labelClass}>
              Email Address
              <Required />
            </label>
            <input
              id="career-email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email address"
              aria-invalid={!!errors.email}
              className={fieldClass}
              {...register("email")}
            />
            {errors.email && <span className={errorClass}>{errors.email.message}</span>}
          </div>

          <div>
            <label htmlFor="career-role" className={labelClass}>
              {role ? "Applying For" : "Role / Area of Interest"}
              <Required />
            </label>
            <input
              id="career-role"
              type="text"
              readOnly={!!role}
              placeholder="e.g. Operations, Customer Support, Engineering"
              aria-invalid={!!errors.role}
              className={fieldClass}
              {...register("role")}
            />
            {errors.role && <span className={errorClass}>{errors.role.message}</span>}
          </div>

          <div>
            <label htmlFor="career-state" className={labelClass}>
              State
              <Required />
            </label>
            <select
              id="career-state"
              aria-invalid={!!errors.state_id}
              className={fieldClass}
              {...register("state_id", {
                onChange: () => resetField("city_id", { defaultValue: "" }),
              })}
            >
              <option value="">{isLoadingStates ? "Loading states…" : "Select your state"}</option>
              {states?.states?.map((state) => (
                <option key={state.id} value={state.id}>
                  {state.name}
                </option>
              ))}
            </select>
            {errors.state_id && <span className={errorClass}>{errors.state_id.message}</span>}
          </div>

          <div>
            <label htmlFor="career-city" className={labelClass}>
              City
              <Required />
            </label>
            <select
              id="career-city"
              disabled={!stateId || isLoadingCities}
              aria-invalid={!!errors.city_id}
              className={fieldClass}
              {...register("city_id")}
            >
              <option value="">
                {!stateId ? "Select a state first" : isLoadingCities ? "Loading cities…" : "Select your city"}
              </option>
              {/* `cites` is the upstream response key — the typo is in the API. */}
              {cities?.cites?.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
            {errors.city_id && <span className={errorClass}>{errors.city_id.message}</span>}
          </div>

          {showMessage && (
            <div className="sm:col-span-2">
              <label htmlFor="career-message" className={labelClass}>
                Anything you would like us to know?
              </label>
              <textarea
                id="career-message"
                rows={4}
                placeholder="A few lines about your experience and what you are looking for."
                className={`${fieldClass} py-3 leading-6`}
                {...register("message")}
              />
              {errors.message && <span className={errorClass}>{errors.message.message}</span>}
            </div>
          )}

          <div className="sm:col-span-2">
            <span className={labelClass}>
              Upload Your CV here
              <Required />
            </span>

            <div className="relative mt-1.5">
              <input
                id="career-cv"
                type="file"
                accept={ACCEPTED_CV_EXTENSIONS.join(",")}
                className="peer sr-only"
                onChange={(event) => pickFile(event.target.files?.[0])}
              />
              <label
                htmlFor="career-cv"
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(event) => {
                  event.preventDefault();
                  setIsDragging(false);
                  pickFile(event.dataTransfer.files?.[0]);
                }}
                className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-7 text-center transition peer-focus-visible:border-[#0b3fc4] peer-focus-visible:ring-4 peer-focus-visible:ring-blue-100 ${
                  isDragging ? "border-[#0b3fc4] bg-[#eef4ff]" : "border-[#c9dcfb] bg-[#f8fbff] hover:bg-[#f2f6fe]"
                }`}
              >
                <CloudUpload size={26} className="text-[#0b3fc4]" aria-hidden="true" />
                <span className="mt-2 text-[13px] font-extrabold text-[#0f1e57]">Upload Your CV here</span>
                <span className="mt-1 text-[11px] font-medium text-[#63739a]">
                  PDF, DOC, DOCX (Max. 5MB) — or drag and drop
                </span>
              </label>
            </div>

            {cv instanceof File && (
              <div className="mt-2.5 flex items-center gap-3 rounded-xl border border-[#dce7fb] bg-[#f8fbff] px-3.5 py-2.5">
                <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-white text-[#0b3fc4] shadow-sm">
                  <FileText size={17} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-xs font-bold text-[#0f1e57]">{cv.name}</span>
                  <span className="block text-[11px] font-medium text-[#63739a]">{formatSize(cv.size)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => resetField("cv")}
                  aria-label={`Remove ${cv.name}`}
                  className="grid size-8 shrink-0 place-items-center rounded-lg text-[#63739a] transition hover:bg-white hover:text-[#d63a3a] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                >
                  <X size={16} aria-hidden="true" />
                </button>
              </div>
            )}

            {errors.cv && <span className={errorClass}>{errors.cv.message as string}</span>}
          </div>
        </div>

        {mutation.isError && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-xl border border-[#f3d6b8] bg-[#fff8ef] px-4 py-3.5"
          >
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-[#b7791f]" aria-hidden="true" />
            <p className="text-[11px] font-medium leading-5 text-[#7a5a1f]">
              We could not submit your application right now. Please email your CV to{" "}
              <a
                href={careerMailto(role)}
                className="inline-flex items-center gap-1 font-extrabold text-[#0b3fc4] underline-offset-4 hover:underline"
              >
                <Mail size={12} aria-hidden="true" /> {CAREERS_EMAIL}
              </a>{" "}
              instead, and we will pick it up from there.
            </p>
          </div>
        )}

        <button
          type="submit"
          disabled={mutation.isPending}
          className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-6 text-[13px] font-extrabold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:bg-[#7f9adf]"
        >
          {mutation.isPending ? "Submitting…" : submitLabel}
        </button>

        <p className="mt-3 text-center text-[11px] leading-5 text-[#63739a]">
          Prefer email? Send your CV to{" "}
          <a href={careerMailto(role)} className="font-bold text-[#0b3fc4] underline-offset-4 hover:underline">
            {CAREERS_EMAIL}
          </a>
        </p>
      </form>
    </section>
  );
};

export default ApplicationForm;
