import { useForm, SubmitHandler } from "react-hook-form";
import { ApiErrorResponse, CitiesResponse, FormInputs, StateProps } from "../../types";
import { useMutation, useQuery } from "@tanstack/react-query";
import { applyJob, getCities, getStates } from "../../react-query/apis";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios, { AxiosError } from "axios";

export default function ApplyJobForm() {
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const { id } = useParams();
  const redirect = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormInputs>();

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

  const stateValue = watch("state_id");
  useEffect(() => {
    setSelectedStateId(Number(stateValue));
    console.log(selectedStateId);
  }, [stateValue]);

  if (!id) {
    toast.error("Job id required!");
  }

  const mutation = useMutation({
    mutationFn: applyJob,
    onSuccess: () => {
      toast.success("Apply job successfully!");
      reset();
      redirect("/jobs");
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        const apiError = error as AxiosError<ApiErrorResponse>;
        toast.error(apiError.response?.data.message || "An unexpected error occurred");
      } else {
        toast.error("An unknown error occurred");
      }
    },
  });
  const onSubmit: SubmitHandler<FormInputs> = (data) => {
    const newData = {
      ...data, // Spread the existing form data
      job_id: parseInt(id),
    };
    mutation.mutate(newData);
  };

  return (
    <div className="max-w-md mx-auto px-4 mt-10 mb-[100px]">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="label">
            <span className="label-text">Name</span>
          </label>
          <input
            id="name"
            type="text"
            {...register("name", { required: "Name is required" })}
            className="input input-bordered w-full"
          />
          {errors.name && <p className="text-error mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label htmlFor="email" className="label">
            <span className="label-text">Email</span>
          </label>
          <input
            id="email"
            type="email"
            {...register("email", { required: "Email is required" })}
            className="input input-bordered w-full"
          />
          {errors.email && <p className="text-error mt-1">{errors.email.message}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isErrorStates && <div className="text-xs font-normal">State is not loading</div>}
          {isErrorCities && <div className="text-xs font-normal">City is not loading</div>}
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

        <div>
          <label htmlFor="skills" className="label">
            <span className="label-text">Your Skills</span>
          </label>
          <input
            id="skills"
            type="text"
            {...register("skill", { required: "Skills are required" })}
            className="input input-bordered w-full"
          />
          {errors.skill && <p className="text-error mt-1">{errors.skill.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="label">
            <span className="label-text">Mobile No.</span>
          </label>
          <input
            id="phone"
            type="tel"
            {...register("mobile_number", { required: "Phone is required" })}
            className="input input-bordered w-full"
          />
          {errors.mobile_number && <p className="text-error mt-1">{errors.mobile_number.message}</p>}
        </div>

        <div>
          <label htmlFor="aboutYourself" className="label">
            <span className="label-text">Tell me about yourself (Optional)</span>
          </label>
          <textarea
            id="aboutYourself"
            {...register("aboutYourself")}
            className="textarea textarea-bordered w-full"
            rows={4}
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-full">
          {mutation.isPending ? "Submitting..." : " Submit"}
        </button>
      </form>
    </div>
  );
}
