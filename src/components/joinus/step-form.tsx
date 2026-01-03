import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { getCities, getStates, stepFormeData } from "../../react-query/apis";
import { useCategories, useSubFormCategories } from "../../react-query/hooks";
import { ApiErrorResponse, CitiesResponse, StateProps } from "../../types";
import { FormJoinUsType } from "../../schema/step-form";
import toast from "react-hot-toast";
import axios, { AxiosError } from "axios";

export default function StepForm() {
  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState(1);

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

  const { data: categories, isLoading: categoryLoading, isError: categoryError } = useCategories();
  const {
    data: subCategoriesData,
    isLoading: subCategoryLoading,
    isError: subCategoryError,
  } = useSubFormCategories(selectedCategoryIds);

  const subCategories = subCategoriesData ? subCategoriesData.flatMap((item) => item.sub_category) : [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    trigger,
    control,
    reset,
  } = useForm<FormJoinUsType>({
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      state_id: "0",
      city_id: "0",
      work_experience: 0,
      shift: "",
      joining: "",
      mobile_number: "",
      // password: "",
      // password_confirmation: "",
      skills: [
        {
          skill_name: "",
          skill_type: "",
          work_with_skill: [],
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "skills",
  });

  const stateValue = watch("state_id");
  useEffect(() => {
    setSelectedStateId(Number(stateValue));
  }, [stateValue]);

  // Handle category check and uncheck
  const handleCategoryChange = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  // useEffect to handle the appending and removing of skills based on selectedCategoryIds
  useEffect(() => {
    selectedCategoryIds.forEach((categoryId) => {
      const category = categories?.categories.find((c) => c.id === categoryId);
      if (category) {
        const existingSkillIndex = fields.findIndex((field) => field.skill_name === category.name);

        // Only append if the skill does not already exist
        if (existingSkillIndex === -1) {
          append({
            skill_name: category.name,
            skill_type: "",
            work_with_skill: [],
          });
        }
      }
    });

    // Remove skills that are no longer in selectedCategoryIds
    fields.forEach((field, index) => {
      const categoryExists = selectedCategoryIds.some(
        (categoryId) => categories?.categories.find((c) => c.id === categoryId)?.name === field.skill_name
      );

      if (!categoryExists) {
        remove(index);
      }
    });
  }, [selectedCategoryIds, categories, fields, append, remove]);

  // END Handle category check and uncheck

  const mutation = useMutation({
    mutationFn: stepFormeData,
    onSuccess: () => {
      toast.success("Data added successfully!");
      reset();
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
  const onSubmit = (data: FormJoinUsType) => {
    const cleanedData = {
      ...data,
      skills: data.skills.filter((skill) => skill.work_with_skill.length > 0 && !skill.skill_name.startsWith("/")),
    };
    mutation.mutate(cleanedData);
  };

  const nextStep = async () => {
    let fieldsToValidate: (keyof FormJoinUsType)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["first_name", "last_name", "email", "state_id", "city_id"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["skills"];
    } else if (currentStep === 3) {
      fieldsToValidate = ["work_experience", "shift", "joining", "mobile_number"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => (prev < 3 ? prev + 1 : prev));
    }
  };

  const prevStep = () => setCurrentStep((prev) => (prev > 1 ? prev - 1 : prev));

  if (isErrorStates || isErrorCities || categoryError || subCategoryError) return <p>Error loading data...</p>;

  // Password
  // const [password, setPassword] = useState("");
  // const [confirmPassword, setConfirmPassword] = useState("");
  // const [error, setError] = useState("");

  // const handlePasswordChange = (e) => {
  //   setPassword(e.target.value);
  //   setError("");
  // };

  // const handleConfirmPasswordChange = (e) => {
  //   setConfirmPassword(e.target.value);
  //   if (e.target.value !== password) {
  //     setError("Passwords do not match");
  //   } else {
  //     setError("");
  //   }
  // };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Join Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {currentStep === 1 && (
          <div className="space-y-6 border-b pb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label" htmlFor="first_name">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  id="first_name"
                  {...register("first_name", { required: "First name is required" })}
                  placeholder="First Name"
                  className={`input input-bordered ${errors.first_name ? "input-error" : ""}`}
                />
                {errors.first_name && <span className="text-error text-sm mt-1">{errors.first_name.message}</span>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="last_name">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  id="last_name"
                  {...register("last_name", { required: "Last name is required" })}
                  placeholder="Last Name"
                  className={`input input-bordered ${errors.last_name ? "input-error" : ""}`}
                />
                {errors.last_name && <span className="text-error text-sm mt-1">{errors.last_name.message}</span>}
              </div>
              <div className="form-control">
                <label className="label" htmlFor="last_name">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  id="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Your email"
                  className={`input input-bordered ${errors.email ? "input-error" : ""}`}
                />
                {errors.email && <span className="text-error text-sm mt-1">{errors.email.message}</span>}
              </div>
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
                    <option value="" disabled>
                      Select a city
                    </option>
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
          <div>
            <h3 className="text-base md:text-[20px] font-semibold my-6">Select Category</h3>
            {categoryLoading ? (
              <div className="flex flex-wrap gap-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="skeleton h-8 w-[200px]" />
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-4">
                {categories?.categories.map((category) => (
                  <div key={category.id} className="form-control">
                    <label className="cursor-pointer label bg-primary/20 text-primary capitalize px-4 py-3 rounded-md flex items-center gap-3">
                      <span className="label-text">{category.name}</span>
                      <input
                        type="checkbox"
                        value={category.id}
                        onChange={() => handleCategoryChange(category.id)}
                        checked={selectedCategoryIds.includes(category.id)}
                        className="checkbox checkbox-primary"
                      />
                    </label>
                  </div>
                ))}
              </div>
            )}
            {selectedCategoryIds.length > 0 && (
              <h3 className="text-base md:text-lg font-semibold my-6">Select Skill Type and Sub Categories</h3>
            )}
            {subCategoryLoading ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="skeleton h-5 w-16" />
                  <div className="skeleton h-5 w-16" />
                </div>
                <div className="max-w-[400px] space-y-3">
                  <div className="skeleton h-8 w-full" />
                  <div className="skeleton h-8 w-full" />
                  <div className="skeleton h-8 w-full" />
                  <div className="skeleton h-8 w-full" />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {fields.map((field, index) => {
                  const category = categories?.categories.find((c) => field.skill_name.startsWith(c.name));
                  const relatedSubCategories = subCategories.filter((sub) => sub.parent_id === category?.id);
                  // If no category return null
                  if (!category || relatedSubCategories.length === 0) return null;
                  return (
                    <div key={field.id} className="space-y-4 border-b pb-4">
                      <h4 className="font-medium text-base md:text-lg capitalize">{field.skill_name}</h4>
                      <Controller
                        name={`skills.${index}.skill_type`}
                        control={control}
                        rules={{ required: "Skill type is required" }}
                        render={({ field: { onChange, value } }) => (
                          <div className="form-control">
                            <div className="flex space-x-4">
                              <label className="label cursor-pointer">
                                <input
                                  type="radio"
                                  className="radio radio-primary"
                                  value="Mason"
                                  checked={value === "Mason"}
                                  onChange={() => onChange("Mason")}
                                />
                                <span className="label-text ml-2">Mason</span>
                              </label>
                              <label className="label cursor-pointer">
                                <input
                                  type="radio"
                                  className="radio radio-primary"
                                  value="Helper"
                                  checked={value === "Helper"}
                                  onChange={() => onChange("Helper")}
                                />
                                <span className="label-text ml-2">Helper</span>
                              </label>
                            </div>
                          </div>
                        )}
                      />
                      {errors.skills?.[index]?.skill_type && (
                        <span className="text-error text-sm">{errors.skills[index].skill_type.message}</span>
                      )}
                      <div className="space-y-2">
                        {relatedSubCategories.map((subcategory) => (
                          <div key={subcategory.id} className="form-control">
                            <label className="label cursor-pointer justify-start gap-2">
                              <Controller
                                name={`skills.${index}.work_with_skill`}
                                control={control}
                                render={({ field: { onChange, value } }) => (
                                  <input
                                    type="checkbox"
                                    className="checkbox checkbox-primary"
                                    checked={value.includes(subcategory.name)}
                                    onChange={(e) => {
                                      const updatedValue = e.target.checked
                                        ? [...value, subcategory.name]
                                        : value.filter((name: string) => name !== subcategory.name);
                                      onChange(updatedValue);
                                    }}
                                  />
                                )}
                              />
                              <span className="label-text">{subcategory.name}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-control">
                <label className="label" htmlFor="work_experience">
                  <span className="label-text">Work Experience (years)</span>
                </label>
                <input
                  type="number"
                  id="work_experience"
                  {...register("work_experience", { required: "Work experience is required", min: 1 })}
                  className={`input input-bordered ${errors.work_experience ? "input-error" : ""}`}
                />
                {errors.work_experience && (
                  <span className="text-error text-sm mt-1">{errors.work_experience.message}</span>
                )}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="shift">
                  <span className="label-text">Shift</span>
                </label>
                <select
                  id="shift"
                  {...register("shift", { required: "Shift is required" })}
                  className={`select select-bordered w-full ${errors.shift ? "select-error" : ""}`}
                >
                  <option value="">Select a shift</option>
                  <option value="Day">Day</option>
                  <option value="Night">Night</option>
                </select>
                {errors.shift && <span className="text-error text-sm mt-1">{errors.shift.message}</span>}
              </div>

              <div className="form-control">
                <label className="label" htmlFor="joining">
                  <span className="label-text">Joining</span>
                </label>
                <select
                  id="joining"
                  {...register("joining", { required: "Joining preference is required" })}
                  className={`select select-bordered w-full ${errors.joining ? "select-error" : ""}`}
                >
                  <option value="">Select joining preference</option>
                  <option value="urgent">Urgent</option>
                  <option value="later">Later</option>
                </select>
                {errors.joining && <span className="text-error text-sm mt-1">{errors.joining.message}</span>}
              </div>
            </div>
            <div className="form-control">
              <label className="label" htmlFor="mobile_number">
                <span className="label-text">Mobile Number</span>
              </label>
              <input
                type="tel"
                id="mobile_number"
                {...register("mobile_number", {
                  required: "Mobile number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Please enter a valid 10-digit mobile number",
                  },
                })}
                placeholder="Mobile Number"
                className={`input input-bordered ${errors.mobile_number ? "input-error" : ""}`}
              />
              {errors.mobile_number && <span className="text-error text-sm mt-1">{errors.mobile_number.message}</span>}
            </div>
            {/* <div className="form-control">
              <label className="label" htmlFor="password">
                <span className="label-text">Password</span>
              </label>
              <input
                type="password"
                id="password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters long",
                  },
                })}
                value={password}
                onChange={handlePasswordChange}
                placeholder="Password"
                className={`input input-bordered ${errors.password ? "input-error" : ""}`}
              />
              {errors.password && <span className="text-error text-sm mt-1">{errors.password.message}</span>}
            </div> */}

            {/* <div className="form-control">
              <label className="label" htmlFor="password_confirmation">
                <span className="label-text">Confirm Password</span>
              </label>
              <input
                type="password"
                id="password_confirmation"
                {...register("password_confirmation", {
                  required: "Password confirmation is required",
                  minLength: {
                    value: 8,
                    message: "Password confirmation must be at least 8 characters long",
                  },
                })}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                placeholder="Confirm Password"
                className={`input input-bordered ${
                  errors.password_confirmation || errors.password ? "input-error" : ""
                }`}
              />
              {errors.password_confirmation && (
                <span className="text-error text-sm mt-1">{errors.password_confirmation.message}</span>
              )}
              {error && <p className="text-error text-sm mt-1">{error}</p>}
            </div> */}
          </div>
        )}

        <div className="flex justify-between">
          {currentStep > 1 && (
            <button type="button" onClick={prevStep} className="btn btn-link px-0">
              Previous
            </button>
          )}
          {currentStep < 3 && (
            <button type="button" onClick={nextStep} className="btn btn-link px-0">
              Next
            </button>
          )}
        </div>

        {currentStep === 3 && (
          <button type="submit" className="btn btn-primary mt-4 min-w-[200px]">
            {mutation.isPending ? "Submitting..." : "Submit"}
          </button>
        )}
      </form>
    </div>
  );
}
