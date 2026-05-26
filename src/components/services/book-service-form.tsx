import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { getCities, getStates, postEmployeeData } from "../../react-query/apis";
import { EmployeeFormData, employeeSchema } from "../../schema/permanent-service/schema";
import { useEffect, useState } from "react";
import { ApiErrorResponse, CitiesResponse, StateProps } from "../../types";
import { X } from "lucide-react";
import axios, { AxiosError } from "axios";

const BookServicesForm = ({ serviceId, permanentServiceId }: { serviceId: number; permanentServiceId: number }) => {
  const navigation = useNavigate();

  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

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
    setValue,
    getValues,
    watch,
    control,
    formState: { errors },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      faculties: [],
      upload_photos: [],
    },
  });

  const mutation = useMutation({
    mutationFn: postEmployeeData,
    onSuccess: (data) => {
      console.log("Data successfully saved:", data);
      toast.success("Form submitted successfully!");
      navigation("/");
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

  const stateValue = watch("state_id");
  useEffect(() => {
    setSelectedStateId(Number(stateValue));
  }, [stateValue]);

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    const faculties = getValues("faculties");

    if (checked) {
      setValue("faculties", [...faculties, value]); // Add value if checked
    } else {
      setValue(
        "faculties",
        faculties.filter((item) => item !== value)
      ); // Remove value if unchecked
    }
  };

  const onSubmit = (data: EmployeeFormData) => {
    const formData = new FormData();

    // Always-present context fields
    formData.append("service_id", serviceId.toString());
    formData.append("permanent_service_id", permanentServiceId.toString());
    const displayTitle = (localStorage.getItem("service-title") || "").trim();
    if (displayTitle) formData.append("display_title", displayTitle);

    // Photos array
    selectedFiles.forEach((file) => formData.append("upload_photos[]", file));

    // Append every other registered field, skipping empty/optional ones
    Object.entries(data).forEach(([key, value]) => {
      if (key === "upload_photos") return;
      if (value === undefined || value === null || value === "") return;

      if (Array.isArray(value)) {
        (value as unknown[]).forEach((item) => {
          if (item !== undefined && item !== null && item !== "") {
            formData.append(`${key}[]`, String(item));
          }
        });
        return;
      }

      if (typeof value === "boolean") {
        formData.append(key, value ? "1" : "0");
        return;
      }

      formData.append(key, String(value));
    });

    mutation.mutate(formData as unknown as EmployeeFormData);
  };

  const removeFile = (index: number) => {
    setSelectedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  if (isErrorStates || isErrorCities) return <p>Error loading data...</p>;

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Content */}
          <div className="space-y-2">
            <div>
              <label htmlFor="" className="font-medium text-sm">
                Company name
              </label>
              <input
                type="text"
                disabled={mutation.isPending}
                {...register("company_name")}
                placeholder="Type here"
                className="input input-bordered w-full font-medium text-sm"
              />
              {errors.company_name && (
                <p className="text-xs text-red-600 font-normal mt-2">{errors.company_name.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="" className="font-medium text-sm">
                Email Address
              </label>
              <input
                type="text"
                disabled={mutation.isPending}
                {...register("email")}
                placeholder="Type here"
                className="input input-bordered w-full font-medium text-sm"
              />
              {errors.email && <p className="text-xs text-red-600 font-normal mt-2">{errors.email.message}</p>}
            </div>
            <div>
              <label htmlFor="" className="font-medium text-sm">
                Which shifts workers do you need
              </label>
              <select
                disabled={mutation.isPending}
                defaultValue=""
                {...register("shift")}
                className="select select-bordered w-full"
              >
                <option value="" disabled>
                  Select shift
                </option>
                <option value="Day Shift">8 hrs + overtime</option>
                <option value="Night Shift">12 hrs + overtime</option>
              </select>
              {errors.shift && <p className="text-xs text-red-600 font-normal mt-2">{errors.shift.message}</p>}
            </div>
            
            <div>
              <label htmlFor="" className="font-medium text-sm">
                Address{" "}
              </label>
              <textarea
                {...register("address")}
                disabled={mutation.isPending}
                className="textarea textarea-bordered w-full font-medium text-sm"
                placeholder="Type here"
              ></textarea>
              {errors.address && <p className="text-xs text-red-600 font-normal">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <div>
              <label htmlFor="" className="font-medium text-sm">
                Pin Code
              </label>
              <input
                {...register("pincode")}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={mutation.isPending}
                placeholder="Type here"
                className="input input-bordered w-full font-medium text-sm"
              />
              {errors?.pincode && (
                <p className="text-xs text-red-600 font-normal mt-2">{errors?.pincode?.message}</p>
              )}
            </div>
            </div>

            
            <div>
              <h3 className="text-[16px] font-medium">How many workers are you looking for?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div>
                  <label htmlFor="" className="font-medium text-sm">
                    Skilled Mason
                  </label>
                  <div className="flex gap-2">
                    <select
                      {...register("Mason")}
                      disabled={mutation.isPending}
                      defaultValue=""
                      className="select select-bordered w-full font-medium text-sm flex-1"
                    >
                      <option value="" disabled>
                        Select: Skilled Mason
                      </option>
                      <option value="tile_brick_plaster_mason">Tile | Brick | Plaster Mason</option>
                      <option value="shuttering_mason">Shuttering Mason</option>
                      <option value="bar_bender_fitter">Bar Bender Fitter</option>
                      <option value="skilled_painter">Skilled Painter</option>
                      <option value="loading_unloading_workers">Loading Unloading Workers</option>
                      <option value="material_shifting_workers">Material Shifting Workers</option>
                    </select>
                    <input
                      {...register("mason_quantity", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      disabled={mutation.isPending}
                      placeholder="Qty"
                      className="input input-bordered w-24 font-medium text-sm"
                    />
                  </div>
                  {errors.Mason && <p className="text-xs text-red-600 font-normal mt-2">{errors.Mason.message}</p>}
                  {errors.mason_quantity && (
                    <p className="text-xs text-red-600 font-normal mt-2">{errors.mason_quantity.message}</p>
                  )}
                </div>
                <div>
                  <label htmlFor="" className="font-medium text-sm">
                    Unskilled Helper
                  </label>
                  <div className="flex gap-2">
                    <select
                      {...register("helper")}
                      disabled={mutation.isPending}
                      defaultValue=""
                      className="select select-bordered w-full font-medium text-sm flex-1"
                    >
                      <option value="" disabled>
                        Select: Unskilled Helper
                      </option>
                      <option value="general_helper">General Helper</option>
                    </select>
                    <input
                      {...register("helper_quantity", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      disabled={mutation.isPending}
                      placeholder="Qty"
                      className="input input-bordered w-24 font-medium text-sm"
                    />
                  </div>
                  {errors.helper && <p className="text-xs text-red-600 font-normal mt-2">{errors.helper.message}</p>}
                  {errors.helper_quantity && (
                    <p className="text-xs text-red-600 font-normal mt-2">{errors.helper_quantity.message}</p>
                  )}
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-[16px] font-medium mt-4">What faculties do you provide to workers?</h3>
              <div className="flex flex-wrap gap-6 mt-4">
                {["food", "stay", "over_time", "medical_insurance", "transport", "first_aid", "ppe_kit"].map(
                  (facility) => (
                    <label key={facility} className="font-medium text-sm flex items-center gap-2">
                      <input type="checkbox" value={facility} onChange={handleCheckboxChange} className="checkbox" />
                      {facility.replace("_", " ")} {/* Display facility name */}
                    </label>
                  )
                )}
              </div>
            </div>
          </div>
          {/* Right Content */}
          <div className="md:space-y-6 md:mt-6">
            <div>
              <h3 className="text-[16px] font-medium mt-4">For how many days/months do you need the workers?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="" className="font-medium text-sm">
                    Day{" "}
                  </label>
                  <input
                    {...register("day", { valueAsNumber: true })}
                    type="number"
                    disabled={mutation.isPending}
                    placeholder="ex:23"
                    className="input input-bordered w-full font-medium text-sm"
                  />
                  {errors.day && <p className="text-xs text-red-600 font-normal mt-2">{errors.day.message}</p>}
                </div>
                <div>
                  <label htmlFor="" className="font-medium text-sm">
                    Month{" "}
                  </label>
                  <input
                    {...register("month", { valueAsNumber: true })}
                    type="number"
                    disabled={mutation.isPending}
                    placeholder="ex: 3"
                    className="input input-bordered w-full font-medium text-sm"
                  />
                  {errors.month && <p className="text-xs text-red-600 font-normal mt-2">{errors.month.message}</p>}
                </div>
                <div>
                  <label htmlFor="" className="font-medium text-sm">
                    Year{" "}
                  </label>
                  <input
                    {...register("year", { valueAsNumber: true })}
                    type="number"
                    disabled={mutation.isPending}
                    placeholder="ex: 2024"
                    className="input input-bordered w-full font-medium text-sm"
                  />
                  {/* {errors.year && <p className="text-xs text-red-600 font-normal mt-2">{errors.year.message}</p>} */}
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="" className="font-medium text-sm">
                What is your position in the company?
              </label>
              <select
                disabled={mutation.isPending}
                defaultValue=""
                {...register("employee_position")}
                className="select select-bordered w-full"
              >
                <option value="" disabled>
                  Select your position
                </option>
                <option value="Managing director">Managing director</option>
                <option value="Project Manager">Project Manager</option>
                <option value="Senior engineer">Senior engineer</option>
                <option value="Junior engineer">Junior engineer</option>
                <option value="Supervisor">Supervisor</option>
                <option value="Other">Other</option>
              </select>
              {errors.employee_position && (
                <p className="text-xs text-red-600 font-normal mt-2">{errors.employee_position.message}</p>
              )}
            </div>
            <div>
              <label htmlFor="" className="font-medium text-sm">
                Phone number
              </label>
              <input
                {...register("mobile_number")}
                type="text"
                disabled={mutation.isPending}
                placeholder="Type here"
                className="input input-bordered w-full font-medium text-sm"
              />
              {errors.mobile_number && (
                <p className="text-xs text-red-600 font-normal mt-2">{errors.mobile_number.message}</p>
              )}
            </div>
            <>
              <div>
                <label htmlFor="upload_photos" className="block text-sm font-medium mt-3">
                  Upload Photos of site work
                </label>
                <Controller
                  name="upload_photos"
                  control={control}
                  render={({ field: { onChange, onBlur, name, ref } }) => (
                    <input
                      id="upload_photos"
                      type="file"
                      multiple
                      ref={ref}
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const updatedFiles = [...selectedFiles, ...files];

                        setSelectedFiles(updatedFiles);
                        onChange(updatedFiles); // Pass all selected files to the form state
                      }}
                      onBlur={onBlur}
                      name={name}
                      className="mt-1 block w-full text-sm text-gray-500
                   file:mr-4 file:py-2 file:px-4
                   file:rounded-md file:border-0
                   file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-700
                   hover:file:bg-blue-100"
                    />
                  )}
                />
                {errors.upload_photos && <p className="mt-2 text-sm text-red-600">{errors.upload_photos.message}</p>}
              </div>

              {selectedFiles.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Selected Files:</h4>
                  <ul className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                    {selectedFiles.map((file, index) => (
                      <li key={index} className="relative">
                        <div className="group aspect-w-10 aspect-h-7 block w-full overflow-hidden rounded-lg bg-gray-100">
                          {file.type.startsWith("image/") ? (
                            <img src={URL.createObjectURL(file)} alt={file.name} className="object-cover" />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <span className="text-gray-500">{file.name}</span>
                            </div>
                          )}
                          <button
                            type="button"
                            className="absolute top-0 right-0 p-1 bg-white rounded-bl-lg"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                        <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">
                          {file.name}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
            <div>
              <label htmlFor="" className="font-medium text-sm">
                How many alternative types of work do you want to our workers perform
              </label>
              <input
                {...register("alternative_work")}
                type="text"
                disabled={mutation.isPending}
                placeholder="Alternative work: Brick work / Plaster work / etc."
                className="input input-bordered w-full font-medium text-sm"
              />
            </div>
          </div>
        </div>
        <div className="mt-10">
          <div className="flex items-center gap-2 my-4">
            <input type="checkbox" {...register("term_and_conditions")} className="checkbox" />
            <label htmlFor="" className="font-medium text-xs md:text-sm">
              Do you accept our terms and conditions?{" "}
              <Link to="/terms-and-conditions" title="Terms & Condition" className="text-blue-700">
                View our T&C
              </Link>
            </label>
          </div>
          {errors.term_and_conditions && (
            <p className="text-xs text-red-600 font-normal mb-8">{errors.term_and_conditions.message}</p>
          )}
          <button
            type="submit"
            className="btn btn-primary w-full md:w-auto min-w-[120px]"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Submitting..." : "Permanent Service Request"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookServicesForm;
