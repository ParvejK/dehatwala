import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  ChevronRight,
  Clock3,
  CreditCard,
  Headphones,
  Heart,
  Home,
  Lock,
  MapPin,
  Pencil,
  ShieldCheck,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import BookingSteps from "../../../components/booking/booking-steps";
import { buildServiceWorkerObj } from "../../../components/booking/service-worker-obj";
import { bookingPath } from "../../../components/booking/steps";
import SuccessBridge from "../../../components/booking/success-bridge";
import { API_URL, RAZORPAY_KEY_ID } from "../../../react-query/constants";
import { useAuthStore } from "../../../store/auth-store";
import { useBookingStore } from "../../../store/booking-store";
import { useDayRateStore } from "../../../store/day-service-store";

const CASH_SURCHARGE = 0.02;
const TIP_PRESETS = [50, 100, 200];

const formatPrice = (value: number) => new Intl.NumberFormat("en-IN").format(Math.round(value));

type PaymentMode = "Online" | "Offline";

/**
 * Readable text from a failed booking call.
 *
 * The API answers 422 with `{ errors: { field: [msg] } }` and 500 with
 * `{ message }`. Without unpacking the first, every validation failure showed
 * up as a bare "Request failed with status code 422".
 */
const bookingErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 401) return "Your session has expired. Please sign in again.";

    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    const firstError = data?.errors ? Object.values(data.errors)[0]?.[0] : undefined;

    return firstError ?? data?.message ?? error.message;
  }

  return (error as Error)?.message ?? "Something went wrong.";
};

const TRUST_POINTS = [
  { icon: ShieldCheck, title: "Verified Workers", copy: "Background-checked professionals", tone: "text-[#0b3fc4]" },
  { icon: Clock3, title: "On-Time Arrival", copy: "We value your time, always", tone: "text-[#0b3fc4]" },
  { icon: Lock, title: "Secure Payment", copy: "Safe & secure transactions", tone: "text-amber-500" },
  { icon: Headphones, title: "Assisted Support", copy: "We're here to help you", tone: "text-[#0b3fc4]" },
  { icon: Zap, title: "Fast Response", copy: "Quick service, every time", tone: "text-emerald-500" },
];

const PaymentPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  const booking = useBookingStore();
  const day = useDayRateStore();

  const [paymentMode, setPaymentMode] = useState<PaymentMode>("Online");
  const [isSubmitting, setIsSubmitting] = useState(false);
  /**
   * Set once the API confirms the booking; drives the confirmation screen.
   * Wrapped in an object so a booking whose id the API omitted still counts as
   * placed — a bare `null` id would read as "not placed yet".
   */
  const [placed, setPlaced] = useState<{ id: number | null } | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [customTip, setCustomTip] = useState("");

  /**
   * Mobile only: the real CTA now sits below the booking summary, which is far
   * enough down that it is off screen for most of the page. A docked bar keeps
   * paying one tap away until the real button is actually in view — tracked
   * here so the two are never on screen together.
   */
  const ctaRef = useRef<HTMLDivElement>(null);
  const [isCtaReached, setIsCtaReached] = useState(false);

  useEffect(() => {
    // Measured on scroll rather than watched with an IntersectionObserver: the
    // bar has to stay away for the whole rest of the page once the button has
    // been passed, and an observer reports nothing when a jump skips straight
    // over the button (hash links, scroll restoration).
    const update = () => {
      const node = ctaRef.current;
      if (!node) return;

      // 96px is roughly the docked bar, so the button counts as reached only
      // once it has risen clear of it.
      setIsCtaReached(node.getBoundingClientRect().top < window.innerHeight - 96);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Booking requires a signed-in user — bounce back here after sign-in.
  useEffect(() => {
    if (!token) {
      const currentPath = window.location.pathname + window.location.search;
      navigate(`/sign-in?path=${encodeURIComponent(currentPath)}`, { replace: true });
    }
  }, [token, navigate]);

  // Guard against landing on step 3 without completing step 2. Stands down once
  // the booking is placed, since the confirmation screen clears the address on
  // its way out and would otherwise trip this on the way past.
  //
  // A missing `addressId` counts as incomplete: the worksite reached this
  // browser but never the database, so the booking would record no site for the
  // crew to go to. Step 2 saves it and hands the id over.
  useEffect(() => {
    if (token && slug && !placed && (!booking.address || !booking.addressId)) {
      navigate(bookingPath(slug, "booking-details"), { replace: true });
    }
  }, [token, slug, booking.address, booking.addressId, placed, navigate]);

  // `totalDayPrice` already includes the tip, per the day-rate store.
  const subtotal = day.totalDayPrice;
  const discount = subtotal * (discountPercentage / 100);
  const discounted = subtotal - discount;
  const convenienceFee = paymentMode === "Offline" ? discounted * CASH_SURCHARGE : 0;
  const payableTotal = discounted + convenienceFee;

  const applyCoupon = async () => {
    const code = couponInput.trim();
    if (!code) return;

    setIsApplyingCoupon(true);
    try {
      const response = await axios.post(`${API_URL}/apply-coupon`, { coupon_code: code, user_id: user?.id });
      const percentage = response.data?.coupon?.percentage;

      if (!percentage) {
        throw new Error(response.data?.message || "Coupon could not be applied.");
      }

      setDiscountPercentage(Number(percentage));
      setAppliedCoupon(code);
      toast.success(`Coupon applied — ${percentage}% off.`);
    } catch (error) {
      const message = axios.isAxiosError(error)
        ? error.response?.data?.message || "Failed to apply coupon."
        : (error as Error).message;
      toast.error(message);
      setDiscountPercentage(0);
      setAppliedCoupon("");
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setDiscountPercentage(0);
    setAppliedCoupon("");
    setCouponInput("");
  };

  const chooseTip = (amount: number) => {
    setCustomTip("");
    day.setTipPrice(amount);
  };

  const chooseCustomTip = (raw: string) => {
    const digitsOnly = raw.replace(/\D/g, "");
    setCustomTip(digitsOnly);
    day.setTipPrice(Number(digitsOnly) || 0);
  };

  // City/state may be blank on a booking restored from an older persisted store,
  // so every part is filtered out before joining.
  const addressLine = [booking.address, booking.cityName, booking.stateName, booking.pincode]
    .filter(Boolean)
    .join(", ");

  const bookOnlyDateLabel = new Date(booking.bookDate).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const buildPayload = () => ({
    state_id: booking.stateId,
    city_id: booking.cityId,
    book_date: booking.bookDate,
    time_slot: booking.timeSlot,
    pincode: booking.pincode,
    address: booking.address,
    /** Row in `user_addresses`; null when the booking was made signed-out. */
    address_id: booking.addressId,
    address_label: booking.addressLabel,
    user_id: user?.id,
    service_id: booking.serviceId ?? undefined,
    mode: "day" as const,
    pick_and_drop: "0" as const,
    display_title: booking.serviceTitle,
    service_area_id: booking.serviceAreaId ?? undefined,
    tip: day.tipValue,
    total_amount: payableTotal,
    coupon_code: appliedCoupon,
    coupon_discounted: discount,
    instruction: booking.instructions,
    service_worker_obj: buildServiceWorkerObj(day, {
      workerLabel: booking.workerLabel,
      helperLabel: booking.helperLabel,
    }),
    // `status` is deliberately not sent — the API starts every booking as
    // `pending` and only the admin moves it on from there.
    transaction_id: "",
    payment_mode: paymentMode,
  });

  /**
   * The booking is saved at this point. The stores are deliberately NOT cleared
   * yet: the step-2 guard above redirects as soon as `booking.address` is empty,
   * which would tear the confirmation off the screen. `leaveToBookings` clears
   * them at the moment we actually navigate away.
   */
  const onBookingSaved = (bookingId?: number) => {
    // The dashboard list we are about to land on caches for 10s, so without
    // this the brand-new booking can be missing from it on arrival.
    queryClient.invalidateQueries({ queryKey: ["bookedService"] });
    setPlaced({ id: bookingId ?? null });
  };

  const leaveToBookings = () => {
    day.resetDayState();
    booking.resetBooking();
    navigate("/dashboard/bookings", { replace: true });
  };

  // Both checkout endpoints sit behind auth:sanctum, so the token has to travel
  // with them — the API files the booking against the token holder, not the
  // user_id in the body.
  const authHeaders = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const payAfterService = async () => {
    setIsSubmitting(true);
    try {
      const { data } = await axios.post(`${API_URL}/save-pay-after-service`, buildPayload(), authHeaders());
      onBookingSaved(data?.book_service?.id);
    } catch (error) {
      console.error("Failed to save booking:", error);
      toast.error(bookingErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Online checkout, in three server-anchored steps.
   *
   * 1. The server prices the booking from the database and opens a Razorpay
   *    order. The amount below is only ever displayed — it is never sent.
   * 2. Razorpay is opened against that signed order id.
   * 3. The server verifies the signature and writes the booking itself.
   *
   * Nothing is recorded on the browser's say-so at any point.
   */
  const payOnline = async () => {
    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load. Please refresh and try again.");
      return;
    }

    setIsSubmitting(true);

    // ---- Step 1: server creates the order ----
    let order;
    try {
      const { data } = await axios.post(`${API_URL}/payment/create-order`, buildPayload(), authHeaders());

      if (!data?.success || !data?.order_id) {
        throw new Error(data?.message || "Could not start payment");
      }
      order = data;
    } catch (error) {
      console.error("Could not start payment:", error);
      toast.error(bookingErrorMessage(error));
      setIsSubmitting(false);
      return;
    }

    // ---- Step 2: Razorpay, against the server's order ----
    const razorpay = new window.Razorpay({
      // The server hands back its own key id, so the build no longer needs one.
      key: order.key || RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      order_id: order.order_id,
      name: "Dehatwala",
      description: booking.serviceTitle || "Labour service booking",
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        // ---- Step 3: server verifies and records ----
        try {
          const { data } = await axios.post(
            `${API_URL}/payment/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            authHeaders(),
          );

          if (!data?.success) throw new Error(data?.message || "Payment verification failed");

          onBookingSaved(data?.book_service?.id);
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error(bookingErrorMessage(error));
        } finally {
          setIsSubmitting(false);
        }
      },
      modal: { ondismiss: () => setIsSubmitting(false) },
      prefill: { name: user?.name ?? "", contact: user?.mobile_no ?? "" },
      theme: { color: "#0b3fc4" },
    });

    razorpay.open();
  };

  const continueToPayment = () => (paymentMode === "Online" ? payOnline() : payAfterService());

  // Cash bookings never reach a payment screen, so "Continue to Payment" would
  // be a promise the flow does not keep.
  const ctaLabel = paymentMode === "Online" ? "Continue to Payment" : "Confirm Booking";

  // A rate of 0 means the service does not offer that worker — keep it out of
  // the summary rather than showing a free line item.
  const summaryRows: { label: string; detail: string; amount: number }[] = [];

  if (day.MasonRate > 0) {
    summaryRows.push({
      label: booking.workerLabel,
      detail: `${day.MasonDayCount} × ₹${formatPrice(day.MasonRate)} / day`,
      amount: day.totalMasonDayRate,
    });
  }
  if (day.helperRate > 0) {
    summaryRows.push({
      label: booking.helperLabel,
      detail: `${day.helperDayCount} × ₹${formatPrice(day.helperRate)} / day`,
      amount: day.totalHelperDayRate,
    });
  }

  if (day.MasonOvertimeCount > 0) {
    summaryRows.push({
      label: `${booking.workerLabel} Overtime`,
      detail: `${day.MasonOvertimeCount} × ₹${formatPrice(day.MasonOvertimeRate)} / hour`,
      amount: day.totalMasonOvertimeRate,
    });
  }
  if (day.helperOvertimeCount > 0) {
    summaryRows.push({
      label: `${booking.helperLabel} Overtime`,
      detail: `${day.helperOvertimeCount} × ₹${formatPrice(day.helperOvertimeRate)} / hour`,
      amount: day.totalHelperOvertimeRate,
    });
  }
  if (day.tipValue > 0) {
    summaryRows.push({ label: "Tip for workers", detail: "Goes directly to your worker", amount: day.tipValue });
  }

  return (
    <main className="bg-white pb-16 pt-6 sm:pt-8">
      {placed && (
        <SuccessBridge
          headline="Your booking is confirmed"
          refLabel={placed.id ? `Booking ref DW-${String(placed.id).padStart(6, "0")}` : undefined}
          amountText={`₹${formatPrice(payableTotal)}`}
          nextText={
            paymentMode === "Online"
              ? "Payment received. We're assigning your workers — taking you to your bookings…"
              : "Pay the worker after the job is done. Taking you to your bookings…"
          }
          ctaLabel="View my bookings"
          onDone={leaveToBookings}
        />
      )}

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-5">
          <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#5a6a90] sm:text-[13px]">
            <li>
              <Link to="/" className="inline-flex items-center gap-1.5 transition hover:text-[#0b3fc4]">
                <Home size={14} aria-hidden="true" /> Home
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-[#a8b6d4]" />
            </li>
            <li>
              <Link to={`/service/detail/${slug ?? ""}`} className="transition hover:text-[#0b3fc4]">
                {booking.serviceTitle || "Service"}
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-[#a8b6d4]" />
            </li>
            <li className="font-bold text-[#0f1e57]" aria-current="page">
              Payment
            </li>
          </ol>
        </nav>

        <BookingSteps current={3} slug={slug ?? ""} />

        <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(0,1.3fr)_minmax(320px,0.8fr)]">
          {/*
            `contents` below lg dissolves this wrapper into the grid, so the CTA
            becomes a grid item in its own right and `order-last` can push it
            underneath the summary on mobile — nobody should be asked to pay
            before the total has been on screen. From lg up the wrapper is a
            normal block again and the CTA sits back under the left column.
          */}
          <div className="contents lg:block">
            {/* ---------- Left: payment method, coupon, tip ---------- */}
            <div className="space-y-4">
              <section
                aria-labelledby="payment-heading"
                className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-22px_rgba(20,61,141,0.45)] sm:p-7"
              >
                <div className="flex items-start gap-3.5">
                  <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#eef4ff] text-[#0b3fc4]">
                    <CreditCard size={21} aria-hidden="true" />
                  </span>
                  <div>
                    <h1 id="payment-heading" className="text-xl font-extrabold tracking-tight text-[#0f1e57] sm:text-2xl">
                      Payment
                    </h1>
                    <p className="mt-1 text-xs font-normal text-[#63739a] sm:text-[13px]">
                      Complete your payment to confirm the booking
                    </p>
                  </div>
                </div>

                <h2 className="mt-6 text-sm font-extrabold text-[#0f1e57]">Payment Method</h2>

                <div className="mt-3 space-y-3">
                  <label
                    className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition sm:p-5 ${
                      paymentMode === "Online"
                        ? "border-[#0b3fc4] bg-[#f1f6ff] ring-4 ring-blue-100"
                        : "border-[#e0eafb] bg-white hover:border-[#bfd5fb]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-mode"
                      checked={paymentMode === "Online"}
                      onChange={() => setPaymentMode("Online")}
                      className="mt-1 size-4 shrink-0 border-[#9bb0d6] text-[#0b3fc4] focus:ring-[#0b3fc4]"
                    />
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e3edff] text-[#0b3fc4]">
                      <CreditCard size={19} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <strong className="text-sm font-extrabold text-[#0f1e57]">Pay Online</strong>
                        <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Recommended
                        </span>
                      </span>
                      <span className="mt-1.5 block text-xs leading-5 text-[#63739a]">
                        Pay securely using UPI, Cards, Net Banking or Wallet.
                      </span>
                    </span>
                  </label>

                  <label
                    className={`flex cursor-pointer items-start gap-3.5 rounded-2xl border p-4 transition sm:p-5 ${
                      paymentMode === "Offline"
                        ? "border-[#0b3fc4] bg-[#f1f6ff] ring-4 ring-blue-100"
                        : "border-[#e0eafb] bg-white hover:border-[#bfd5fb]"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment-mode"
                      checked={paymentMode === "Offline"}
                      onChange={() => setPaymentMode("Offline")}
                      className="mt-1 size-4 shrink-0 border-[#9bb0d6] text-[#0b3fc4] focus:ring-[#0b3fc4]"
                    />
                    <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#eaf7ee] text-emerald-600">
                      <Wallet size={19} aria-hidden="true" />
                    </span>
                    <span className="min-w-0">
                      <strong className="block text-sm font-extrabold text-[#0f1e57]">Cash After Service</strong>
                      <span className="mt-1.5 block text-xs leading-5 text-[#63739a]">Pay after work completion.</span>
                      <span className="mt-1.5 block text-xs font-bold leading-5 text-red-500">
                        *{Math.round(CASH_SURCHARGE * 100)}% Convenience Charge applies on Cash Payment
                      </span>
                    </span>
                  </label>
                </div>
              </section>

              <section
                aria-labelledby="coupon-heading"
                className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_8px_30px_-22px_rgba(20,61,141,0.45)] sm:p-6"
              >
                <h2 id="coupon-heading" className="flex items-center gap-2 text-sm font-extrabold text-[#0f1e57]">
                  <BadgeCheck size={17} className="text-[#0b3fc4]" aria-hidden="true" />
                  Apply Coupon <span className="text-xs font-semibold text-[#8fa2c8]">(Optional)</span>
                </h2>

                {appliedCoupon ? (
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
                    <p className="text-xs font-bold text-emerald-700">
                      “{appliedCoupon}” applied — {discountPercentage}% off (−₹{formatPrice(discount)})
                    </p>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-xs font-bold text-emerald-800 underline hover:no-underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <label htmlFor="coupon" className="sr-only">
                      Coupon code
                    </label>
                    <input
                      id="coupon"
                      value={couponInput}
                      onChange={(event) => setCouponInput(event.target.value.toUpperCase())}
                      placeholder="Enter coupon code"
                      className="min-h-11 flex-1 rounded-xl border border-[#d8e4f8] bg-white px-4 text-sm font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#9badd0] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100"
                    />
                    <button
                      type="button"
                      onClick={applyCoupon}
                      disabled={!couponInput.trim() || isApplyingCoupon}
                      className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#0b3fc4] bg-white px-7 text-sm font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isApplyingCoupon ? "Applying…" : "Apply"}
                    </button>
                  </div>
                )}
              </section>

              <section
                aria-labelledby="tip-heading"
                className="rounded-3xl border border-[#fbd9e2] bg-[#fff5f7] p-5 sm:p-6"
              >
                <h2 id="tip-heading" className="flex items-center gap-2 text-sm font-extrabold text-[#0f1e57]">
                  <Heart size={17} className="fill-red-500 text-red-500" aria-hidden="true" />
                  Support Our Heroes <span className="text-xs font-semibold text-[#b98a97]">(Optional)</span>
                </h2>
                <p className="mt-1.5 text-xs font-normal text-[#a4737f]">Tip goes directly to your assigned worker.</p>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  {TIP_PRESETS.map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => chooseTip(amount)}
                      aria-pressed={day.tipValue === amount && !customTip}
                      className={`min-h-11 rounded-xl border text-sm font-bold transition focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 ${
                        day.tipValue === amount && !customTip
                          ? "border-red-400 bg-red-500 text-white"
                          : "border-[#f3c9d4] bg-white text-[#0f1e57] hover:border-red-300"
                      }`}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>

                <label htmlFor="custom-tip" className="sr-only">
                  Custom tip amount
                </label>
                <input
                  id="custom-tip"
                  inputMode="numeric"
                  value={customTip}
                  onChange={(event) => chooseCustomTip(event.target.value)}
                  placeholder="Custom Amount"
                  className="mt-3 min-h-11 w-full rounded-xl border border-[#f3c9d4] bg-white px-4 text-sm font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#c9a3ac] focus:border-red-400 focus:ring-4 focus:ring-red-100"
                />

                {day.tipValue > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setCustomTip("");
                      day.setTipPrice(0);
                    }}
                    className="mt-3 text-xs font-bold text-[#a4737f] underline hover:no-underline"
                  >
                    Remove tip
                  </button>
                )}
              </section>
            </div>

            <div ref={ctaRef} className="order-last lg:order-none lg:mt-4">
              <button
                type="button"
                onClick={continueToPayment}
                disabled={isSubmitting}
                className="inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-6 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? "Processing…" : ctaLabel}
                <ArrowRight size={17} aria-hidden="true" />
              </button>

              <p className="mt-3 flex items-center justify-center gap-2 text-xs font-bold text-[#40517b]">
                <Lock size={14} className="text-[#0b3fc4]" aria-hidden="true" />
                100% Secure Payment via Razorpay
              </p>
              <p className="mt-1 text-center text-[11px] font-normal text-[#8fa2c8]">
                Your payment is encrypted and securely processed.
              </p>
            </div>
          </div>

          {/* ---------- Right: booking summary ---------- */}
          <aside
            aria-labelledby="summary-heading"
            className="rounded-3xl border border-[#dce7fb] bg-white p-5 shadow-[0_16px_42px_-24px_rgba(20,61,141,0.55)] sm:p-7 lg:sticky lg:top-24"
          >
            <div className="flex items-center justify-between gap-4">
              <h2 id="summary-heading" className="text-lg font-extrabold text-[#0f1e57] sm:text-xl">
                Booking Summary
              </h2>
              <Link
                to={bookingPath(slug ?? "", "select-worker")}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0b3fc4] hover:underline"
              >
                <Pencil size={13} aria-hidden="true" /> Edit Workers
              </Link>
            </div>

            {/* ---------- Where the workers are going ---------- */}
            <div className="mt-5 rounded-2xl border border-[#dce7fb] bg-[#f8fbff] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-white text-[#0b3fc4] shadow-sm">
                    <MapPin size={17} aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-extrabold text-[#0f1e57]">{booking.addressLabel || "Worksite"}</p>
                    <p className="mt-0.5 text-[11px] leading-5 text-[#63739a]">{addressLine}</p>
                    {booking.instructions && (
                      <p className="mt-1 text-[11px] leading-5 text-[#8fa2c8]">{booking.instructions}</p>
                    )}
                  </div>
                </div>
                <Link
                  to={bookingPath(slug ?? "", "booking-details")}
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-[#0b3fc4] hover:underline"
                >
                  <Pencil size={13} aria-hidden="true" /> Edit
                </Link>
              </div>

              <p className="mt-3 flex items-center gap-1.5 border-t border-[#dce7fb] pt-2.5 text-[11px] font-semibold text-[#40517b]">
                <CalendarDays size={13} className="text-[#0b3fc4]" aria-hidden="true" />
                {bookOnlyDateLabel}
              </p>
            </div>

            <dl className="mt-6 space-y-5">
              {summaryRows.map(({ label, detail, amount }) => (
                <div key={label} className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <dt className="text-sm font-bold text-[#0f1e57]">{label}</dt>
                    <dd className="mt-1 text-xs font-normal text-[#8fa2c8]">{detail}</dd>
                  </div>
                  <dd className="shrink-0 text-sm font-bold text-[#0f1e57]">₹{formatPrice(amount)}</dd>
                </div>
              ))}

              {discount > 0 && (
                <div className="flex items-start justify-between gap-4">
                  <dt className="text-sm font-bold text-emerald-700">Coupon discount</dt>
                  <dd className="shrink-0 text-sm font-bold text-emerald-700">−₹{formatPrice(discount)}</dd>
                </div>
              )}

              {convenienceFee > 0 && (
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <dt className="text-sm font-bold text-[#0f1e57]">Convenience charge</dt>
                    <dd className="mt-1 text-xs font-normal text-[#8fa2c8]">
                      {Math.round(CASH_SURCHARGE * 100)}% on cash payment
                    </dd>
                  </div>
                  <dd className="shrink-0 text-sm font-bold text-[#0f1e57]">₹{formatPrice(convenienceFee)}</dd>
                </div>
              )}
            </dl>

            <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-[#eef4ff] px-5 py-4">
              <span className="text-sm font-extrabold text-[#0b3fc4]">Total Amount</span>
              <strong className="text-2xl font-extrabold text-[#0b3fc4]">₹{formatPrice(payableTotal)}</strong>
            </div>

            <p className="mt-4 flex items-center gap-2 text-[11px] font-medium text-emerald-600">
              <Lock size={13} aria-hidden="true" /> Secure payments. 100% safe.
            </p>
          </aside>
        </div>

        {/* ---------- Trust strip ---------- */}
        <section
          aria-label="Why book with Dehatwala"
          className="mt-6 rounded-3xl border border-[#e0eafb] bg-white p-5 sm:p-6"
        >
          {/* Two-up on phones — five stacked blocks pushed the page terms out of
              reach. The odd one out spans the row so it stays centred. */}
          <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5">
            {TRUST_POINTS.map(({ icon: Icon, title, copy, tone }) => (
              <li
                key={title}
                className="flex flex-col items-center gap-2 text-center last:col-span-2 sm:last:col-span-1"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#f4f8ff]">
                  <Icon size={20} className={tone} aria-hidden="true" />
                </span>
                <strong className="text-xs font-extrabold text-[#0f1e57]">{title}</strong>
                <span className="text-[11px] font-normal leading-4 text-[#8fa2c8]">{copy}</span>
              </li>
            ))}
          </ul>
        </section>

        <p className="mt-4 flex items-start gap-2 rounded-2xl border border-[#e0eafb] bg-[#f8fbff] px-5 py-4 text-[11px] font-normal leading-5 text-[#63739a] sm:text-xs">
          <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[#0b3fc4]" aria-hidden="true" />
          <span>
            By continuing, you agree to our{" "}
            <Link to="/terms-and-conditions" className="font-bold text-[#0b3fc4] hover:underline">
              Terms &amp; Conditions
            </Link>
            ,{" "}
            <Link to="/cancellation-policy" className="font-bold text-[#0b3fc4] hover:underline">
              Cancellation Policy
            </Link>{" "}
            and{" "}
            <Link to="/privacy-policy" className="font-bold text-[#0b3fc4] hover:underline">
              Privacy Policy
            </Link>
            .
          </span>
        </p>
      </div>

      {/* ---------- Docked pay bar (mobile) ---------- */}
      {!placed && (
        <div
          aria-hidden={isCtaReached}
          className={`fixed inset-x-0 bottom-0 z-30 border-t border-[#dce7fb] bg-white/95 px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-3 shadow-[0_-10px_30px_-20px_rgba(20,61,141,0.8)] backdrop-blur transition-transform duration-200 lg:hidden ${
            isCtaReached ? "pointer-events-none translate-y-full" : "translate-y-0"
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wide text-[#8fa2c8]">Total</p>
              <p className="text-lg font-extrabold leading-tight text-[#0b3fc4]">₹{formatPrice(payableTotal)}</p>
            </div>
            <button
              type="button"
              onClick={continueToPayment}
              disabled={isSubmitting}
              tabIndex={isCtaReached ? -1 : 0}
              className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-[#0b3fc4] px-4 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Processing…" : ctaLabel}
              <ArrowRight size={17} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default PaymentPage;
