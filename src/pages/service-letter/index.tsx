import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CartPrices from "../../components/shared/cart-prices";
import Container from "../../components/shared/container";
import { getCities, getStates } from "../../react-query/apis";
import { RAZORPAY_KEY_ID } from "../../react-query/constants";
import { useDayRateStore } from "../../store/day-service-store";
import { useHourRateStore } from "../../store/hour-service-store";
import { CitiesResponse, StateProps } from "../../types";
import DayService from "../../components/services/instant-service-tab.tsx/day-service";
import HourService from "../../components/services/instant-service-tab.tsx/hour-service";
import toast from "react-hot-toast";
import { useNavigate, useSearchParams } from "react-router-dom";
import { API_URL } from "../../react-query/constants";
import { useAuthStore } from "../../store/auth-store";
import axios from "axios";

interface CouponFormValues {
  coupon: string;
}

function ServiceLetterPage() {
  //COD State
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  //END COD State

  const [selectedStateId, setSelectedStateId] = useState<number | null>(null);
  const [active, setActive] = useState(true);
  const navigate = useNavigate();

  // Manage Radio button open button
  const [selectedPayment, setSelectedPayment] = useState("Pay Online");
  const [isButtonOpen, setIsButtonOpen] = useState(true);

  //Google Gio Locatoon
    const [coords, setCoords] = useState({ lat: '', lon: '' });
  const [loading, setLoading] = useState(false);

    const fetchLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ lat: latitude, lon: longitude });

        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          console.log(data.display_name || 'Address not found.');
        } catch (error) {
          console.error('Error:', error);
          console.log('Unable to fetch address.');
        }

        setLoading(false);
      },
      () => {
        alert('Unable to retrieve your location.');
        setLoading(false);
      }
    );
  };

  const handleRadioChange = (e) => {
    setSelectedPayment(e.target.value);
    if (e.target.value === "Pay Online") {
      setIsButtonOpen(true);
    } else {
      setIsButtonOpen(false);
    }
  };

  // Manage Radio button open button end

  // Get user and token
  const { token, user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("service");

  const { totalDayPrice, resetDayState } = useDayRateStore();
  const { totalHourPrice, resetHourState } = useHourRateStore();

  const dayRateStoreData = JSON.parse(localStorage.getItem("day-rate-store") || "{}");
  const hourRateStoreData = JSON.parse(localStorage.getItem("hour-rate-store") || "{}");
  const instantServiceStoreData = JSON.parse(localStorage.getItem("service-store") || "{}");

  // const price = useMemo(() => {
  //   return mode === "day" ? totalDayPrice : totalHourPrice;
  // }, [mode, totalDayPrice, totalHourPrice]);

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

  // Instant Service
  const instantServiceObjSchema = z.object({
    MasonDayCount: z.number(),
    helperDayCount: z.number(),
    MasonRate: z.number(),
    helperRate: z.number(),
    MasonOvertimeCount: z.number(),
    helperOvertimeCount: z.number(),
    MasonOvertimeRate: z.number(),
    helperOvertimeRate: z.number(),
    totalMasonDayRate: z.number(),
    totalHelperDayRate: z.number(),
    totalMasonOvertimeRate: z.number(),
    totalHelperOvertimeRate: z.number(),
    totalDayPrice: z.number(),
    tipValue: z.number(),
  });
  const instantHourServiceObjSchema = z.object({
    MasonHourCount: z.number(),
    helperHourCount: z.number(),

    MasonRate: z.number(),
    helperRate: z.number(),

    totalMasonHourRate: z.number(),
    totalHelperHourRate: z.number(),

    totalHourPrice: z.number(),

    tipValue: z.number(),
  });

  const formSchema = z.object({
    state_id: z.string(),
    city_id: z.string(),
    book_date: z
      .string()
      .refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      })
      .optional(),
    time_slot: z.string().regex(/^([0-1][0-9]|2[0-3]):([0-5][0-9])$/, {
      message: "Invalid time format. Please use HH:MM (24-hour format).",
    }),
    pincode: z.string().min(6, "Pincode must be at least 6 digits"),
    address: z.string().min(1, "Address is required"),
    user_id: z.number().optional(),
    service_id: z.number().optional(),
    instant_service_id: z.number().optional(),
    mode: z.enum(["day", "hour"]).optional(),
    pick_and_drop: z.enum(["0", "1"]).optional(),
    tip: z.number().optional(),
    coupon_code: z.string().optional(),
    coupon_discounted: z.number().optional(),
    instant_service_obj: mode === "day" ? instantServiceObjSchema.optional() : instantHourServiceObjSchema.optional(),
    status: z.enum(["0", "1"]).optional(),
    transaction_id: z.string().optional(),
    total_amount: z.number().optional(),
    payment_mode: z.enum(["Online", "Offline"]).optional(),
  });

  type FormData = z.infer<typeof formSchema>;

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const stateValue = watch("state_id");
  useEffect(() => {
    setSelectedStateId(stateValue ? Number(stateValue) : null);
  }, [stateValue]);

  const tip = mode === "day" ? dayRateStoreData?.state?.tipValue ?? 0 : hourRateStoreData?.state?.tipValue ?? 0;
  const totalPrice = mode === "day" ? dayRateStoreData.state.totalDayPrice : hourRateStoreData.state.totalHourPrice;

  //-----------
  // ONLINE
  const TotalCouponDiscountedPrice =
    mode === "day" ? totalDayPrice * (discountPercentage / 100) : totalHourPrice * (discountPercentage / 100);
  const discountedDayPrice = totalDayPrice - TotalCouponDiscountedPrice;
  const discountedHourPrice = totalHourPrice - TotalCouponDiscountedPrice;
  const TotalCouponPrice = mode === "day" ? discountedDayPrice : discountedHourPrice;

  // 2% Charge on COD
  const codSurcharge = 0.02; // 2% surcharge for COD
  const finalDayPrice = selectedPayment === "COD" ? discountedDayPrice * (1 + codSurcharge) : discountedDayPrice;
  const finalHourPrice = selectedPayment === "COD" ? discountedHourPrice * (1 + codSurcharge) : discountedHourPrice;
  const TotalCODPrice = mode === "day" ? finalDayPrice : finalHourPrice;

  // END

  // Handle coupon
  const form = useForm<CouponFormValues>();
  const {
    handleSubmit: handleCouponSubmit,
    formState: { errors: couponErrors },
  } = form;
  // const [responseMessage, setResponseMessage] = useState("");
  // const [discountPercentage, setDiscountPercentage] = useState(0);
  // const [appliedCouponCode, setAppliedCouponCode] = useState("");
  // const [couponDiscount, setCouponDiscount] = useState(0);

  const onApplySubmit = async (data: CouponFormValues) => {
    try {
      const response = await axios.post(`${API_URL}/apply-coupon`, {
        coupon_code: data.coupon,
        user_id: user.id,
      });

      // setResponseMessage(response.data.message || "Coupon applied successfully!");
      if (response.data.coupon) {
        const percentage = response.data.coupon.percentage;
        setDiscountPercentage(percentage);
        setAppliedCouponCode(data.coupon); // Store applied coupon code
        // setCouponDiscount(totalPrice * (percentage / 100)); // Calculate discount
        setCouponDiscount(TotalCODPrice * (percentage / 100)); // Calculate discount
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || "Failed to apply coupon.";
        toast.error(errorMessage);
      } else {
        // Handle non-Axios errors
        toast.error("An unexpected error occurred.");
      }
      // setResponseMessage(error.response?.data?.message || "Failed to apply coupon.");
      setDiscountPercentage(0);
      setAppliedCouponCode("");
      setCouponDiscount(0);
    }
  };

  // const TotalCouponDiscountedPrice =
  //   mode === "day" ? totalDayPrice * (discountPercentage / 100) : totalHourPrice * (discountPercentage / 100);

  // // ONLINE
  // const discountedDayPrice = totalDayPrice - TotalCouponDiscountedPrice;
  // const discountedHourPrice = totalHourPrice - TotalCouponDiscountedPrice;
  // const TotalCouponPrice = mode === "day" ? discountedDayPrice : discountedHourPrice;

  // // 2% Charge on COD
  // const codSurcharge = 0.02; // 2% surcharge for COD
  // const finalDayPrice = selectedPayment === "COD" ? discountedDayPrice * (1 + codSurcharge) : discountedDayPrice;
  // const finalHourPrice = selectedPayment === "COD" ? discountedHourPrice * (1 + codSurcharge) : discountedHourPrice;
  // const TotalCODPrice = mode === "day" ? finalDayPrice : finalHourPrice;

  // // console.log(finalDayPrice, "finalDayPrice");
  // // console.log(finalHourPrice, "finalHourPrice");
  // console.log(TotalCODPrice, "TotalCouponPrice");

  const codChargeAmount =
    mode === "day"
      ? discountedDayPrice * (1 + codSurcharge) - discountedDayPrice
      : discountedHourPrice * (1 + codSurcharge) - discountedHourPrice;

  const handleRemoveCoupon = () => {
    setDiscountPercentage(0);
    setAppliedCouponCode("");
    setCouponDiscount(0);
  };

  // 2%

  //Coupon

  useEffect(() => {
    const currentPath = window.location.pathname + window.location.search;

    if (!token && !currentPath.startsWith("/sign-in")) {
      navigate(`/sign-in?path=${encodeURIComponent(currentPath)}`);
    }
  }, [token, navigate]);

  const onSubmit = async (data: FormData) => {
    const isCouponApplied = discountPercentage > 0;
    const totalAmountToSend = isCouponApplied ? TotalCouponPrice : totalPrice;

    const extendedData: FormData = {
      ...data,
      user_id: user.id,
      service_id: instantServiceStoreData.state.serviceId,
      instant_service_id: instantServiceStoreData.state.instantServiceId,
      mode: mode as "day" | "hour",
      pick_and_drop: "0" as "0" | "1",
      tip: tip,
      total_amount: totalAmountToSend,
      // total_amount: totalPrice,
      coupon_code: isCouponApplied ? appliedCouponCode : "",
      coupon_discounted: isCouponApplied ? couponDiscount : 0,
      instant_service_obj: mode === "day" ? dayRateStoreData.state : hourRateStoreData.state,
      status: "1" as "0" | "1",
      transaction_id: "",
      payment_mode: selectedPayment === "Pay Online" ? "Online" : "Offline",
    };

    try {
      const validatedData = formSchema.parse(extendedData);

      await handlePayment(validatedData).then(() => {
        // if (mode === "day") {
        //   resetDayState();
        // } else {
        //   resetHourState();
        // }
        console.log("Success...");
      });
    } catch (error) {
      console.error("Error in onSubmit:", error);
    }
  };

  const handlePayment = async (extendedData: FormData) => {
    const validatedData = formSchema.parse(extendedData);
    const final_price = (100 * validatedData.total_amount).toFixed(2);

    const options = {
      key: RAZORPAY_KEY_ID,
      amount: final_price,
      currency: "INR",
      name: "Dehatwala",
      description: "Provide service for labor",
      image: `${API_URL}/storage/category/1728384957images - 2024-10-08T162501.156.jpeg`,
      handler: async function (response: { razorpay_payment_id: string }) {
        if (response.razorpay_payment_id) {
          validatedData.transaction_id = response.razorpay_payment_id;

          const formData = new FormData();
          Object.entries(validatedData).forEach(([key, value]) => {
            formData.append(key, typeof value === "object" ? JSON.stringify(value) : String(value));
          });

          try {
            const APIURL = `${API_URL}/save-book-service`;
            const result = await fetch(APIURL, {
              method: "POST",
              body: formData,
            });

            if (result.ok) {
              await result.json();
              toast.success("Booking saved successfully!");
              setTimeout(() => {
                navigate("/booked-services");
              }, 400);
              if (mode === "day") {
                resetDayState();
              } else {
                resetHourState();
              }
            } else {
              // console.error("Failed to save booking:", result.status, result.statusText);
              // toast.error("Failed to save booking.",);
              const errorData = await result.json(); // Parse error response
              const errorMessage = errorData?.message || result.statusText; // Default to statusText if message is not available
              console.error("Failed to save booking:", result.status, result.statusText);
              toast.error(`Failed to save booking: ${errorMessage}`);
            }
          } catch (error) {
            console.error("Error while saving booking:", error);
            toast.error("An error occurred while saving the booking.");
          }
        }
      },
      prefill: {
        name: "Your Name",
        email: "your-email@example.com",
        contact: "",
      },
      notes: {
        address: "",
      },
      theme: {
        color: "#F37256",
      },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  //COD

  // Define the API call
  const savePayAfterService = async (data: FormData) => {
    const response = await axios.post(`${API_URL}/save-pay-after-service`, data);
    console.log(response, "response");
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: savePayAfterService,
    onSuccess: () => {
      toast.success("Booking saved successfully!");
      setTimeout(() => {
        navigate("/booked-services");
      }, 400);
      if (mode === "day") {
        resetDayState();
      } else {
        resetHourState();
      }
    },
    onError: (error: unknown) => {
      console.error("Error:", error);
      toast.error("Failed to save booking.");
    },
  });

  const handleCODSubmit = (data: FormData) => {
    const isCouponApplied = discountPercentage > 0;
    const totalAmountToSend = isCouponApplied
      ? TotalCODPrice
      : selectedPayment === "COD"
      ? totalPrice * (1 + codSurcharge)
      : totalPrice;

    const extendedData: FormData = {
      ...data,
      user_id: user.id,
      service_id: instantServiceStoreData.state.serviceId,
      instant_service_id: instantServiceStoreData.state.instantServiceId,
      mode: mode as "day" | "hour",
      pick_and_drop: "0" as "0" | "1",
      tip: tip,
      total_amount: totalAmountToSend,
      coupon_code: isCouponApplied ? appliedCouponCode : "",
      coupon_discounted: isCouponApplied ? couponDiscount : 0,
      instant_service_obj: mode === "day" ? dayRateStoreData.state : hourRateStoreData.state,
      status: "1" as "0" | "1",
      transaction_id: "",
      payment_mode: "Offline",
    };

    mutation.mutate(extendedData);
  };

  if (isErrorStates || isErrorCities) return <p>Error loading data...</p>;

  return (
    <div className="min-h-[60vh] mb-[100px] ">
      <Container className="min-h-[60vh] mb-[100px]">
        <div className="mt-7 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* user form */}
          <div>
            <h2 className="text-lg lg:text-xl font-semibold mb-4">Fill Out All Required Details</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="label" htmlFor="book_date">
                    <span className="label-text">Date</span>
                  </label>
                  <input
                    type="date"
                    {...register("book_date")}
                    placeholder="Type here"
                    className="input input-bordered w-full flex-1"
                    min={new Date().toISOString().split("T")[0]}
                  />
                  {errors.book_date && <span className="text-error text-xs mt-1">{errors.book_date.message}</span>}
                </div>
                <div className="mb-2 md:mb-0">
                  <label className="label" htmlFor="time_slot">
                    <span className="label-text">Time slot</span>
                  </label>
                  <input
                    type="time"
                    {...register("time_slot")}
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                  {errors.time_slot && <span className="text-error text-xs mt-1">{errors.time_slot.message}</span>}
                </div>
              </div>

              <div>
                 <button onClick={fetchLocation} disabled={loading}>
                    {loading ? 'Fetching...' : 'Get My Location (Free)'}
                  </button>
                <label className="label" htmlFor="address">
                  <span className="label-text">Address</span>
                </label>
                <textarea
                  {...register("address")}
                  id="address"
                  className="textarea textarea-bordered w-full"
                  placeholder="Address"
                ></textarea>
                {errors.address && <span className="text-error text-xs mt-1">{errors.address.message}</span>}
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
                    {errors.state_id && <span className="text-error text-xs mt-1">{errors.state_id.message}</span>}
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
                    {errors.city_id && <span className="text-error text-xs mt-1">{errors.city_id.message}</span>}
                  </div>
                )}
                <div>
                  <label className="label" htmlFor="pin">
                    <span className="label-text">Pin code</span>
                  </label>
                  <input
                    {...register("pincode")}
                    id="pin"
                    type="text"
                    placeholder="Type here"
                    className="input input-bordered w-full"
                  />
                  {errors.pincode && <span className="text-error text-xs mt-1">{errors.pincode.message}</span>}
                </div>
              </div>
            </form>
            {!appliedCouponCode && (
              <div className="my-6">
                <hr className="my-4" />
                <div className="text-sm font-semibold mb-2">Apply Coupon:</div>
                <form onSubmit={handleCouponSubmit(onApplySubmit)} className="flex items-center gap-3">
                  <div>
                    <input
                      id="coupon"
                      type="text"
                      placeholder="Coupon code"
                      className="input input-bordered w-full input-sm max-w-[200px]"
                      {...form.register("coupon", { required: "Coupon code is required" })}
                    />
                    {couponErrors.coupon && <p className="text-red-500 text-xs mt-1">{couponErrors.coupon.message}</p>}
                  </div>

                  <button type="submit" className="btn btn-primary btn-sm">
                    Apply
                  </button>
                </form>
                <hr className="my-6" />
              </div>
            )}
            {appliedCouponCode && (
              <div className="my-6">
                <div className="text-sm font-semibold mb-2">Coupon applied:</div>
                <div className="flex items-center">
                  <span className="bg-green-200 text-green-600 rounded-md block px-2 py-1">{appliedCouponCode}</span>
                  <button className="btn-link btn" onClick={handleRemoveCoupon}>
                    Remove
                  </button>
                </div>
              </div>
            )}
            <div>
              <h3 className="font-medium">Select Payment mode</h3>
              <div className="payment-methods mt-4 flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="cod"
                    className={`flex items-center gap-3 cursor-pointer payment-label ${
                      selectedPayment === "COD" ? "checked" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      id="cod"
                      name="radio-1"
                      value="COD"
                      className="radio radio-primary"
                      checked={selectedPayment === "COD"}
                      onChange={handleRadioChange}
                    />
                    Pay with cash after service
                  </label>
                  <div className="text-sm text-gray-500 mt-2 pl-8">
                    A 2% surcharge will be added to the total amount for cash on delivery.
                  </div>
                </div>

                <label
                  htmlFor="payOnline"
                  className={`flex items-center gap-3 cursor-pointer payment-label ${
                    selectedPayment === "Pay Online" ? "checked" : ""
                  }`}
                >
                  <input
                    type="radio"
                    id="payOnline"
                    name="radio-1"
                    value="Pay Online"
                    className="radio radio-primary"
                    checked={selectedPayment === "Pay Online"}
                    onChange={handleRadioChange}
                  />
                  Pay Online
                </label>
              </div>
            </div>
          </div>
          {/* Total Amount table */}
          <div>
            <div className="relative mb-8">
              <button
                className="btn btn-primary btn-xs mt-10 absolute right-0 -top-[41px]"
                onClick={() => setActive(!active)}
              >
                {active ? "Edit" : "Save"}
              </button>
              {active && (
                // <CartPrices
                //   couponDayPrice={discountedDayPrice}
                //   couponHourPrice={discountedHourPrice}
                //   couponDiscountedAmount={TotalCouponDiscountedPrice}
                // />
                <CartPrices
                  couponDayPrice={finalDayPrice}
                  couponHourPrice={finalHourPrice}
                  couponDiscountedAmount={couponDiscount}
                  // couponDiscountedAmount={TotalCouponDiscountedPrice}
                  isCOD={selectedPayment === "COD"}
                  codChargeAmount={codChargeAmount}
                />
              )}
              {!active && mode === "day" && <DayService />}
              {!active && mode === "hour" && <HourService />}
            </div>

            <hr className="my-8" />
            <div className="flex items-center gap-6">
              {isButtonOpen ? (
                <button
                  onClick={handleSubmit(onSubmit)}
                  type="submit"
                  disabled={!active}
                  className="btn btn-primary flex-1 mt-4"
                >
                  Proceed to pay
                </button>
              ) : (
                <button
                  onClick={handleSubmit(handleCODSubmit)}
                  disabled={mutation.isPending}
                  type="submit"
                  className="btn btn-primary flex-1 mt-4"
                >
                  Pay with cash after service
                </button>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

export default ServiceLetterPage;
