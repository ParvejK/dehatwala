import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertCircle,
  ArrowRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Home,
  // LocateFixed,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
// import toast from "react-hot-toast";
import BookingSteps from "../../../components/booking/booking-steps";
import { bookingPath } from "../../../components/booking/steps";
import { checkAvailability, getCities, getStates, saveUserAddress } from "../../../react-query/apis";
import { apiErrorMessage, isUnauthorized } from "../../../react-query/http";
import { useUserAddresses } from "../../../react-query/hooks";
import { useAuthStore } from "../../../store/auth-store";
import { useBookingStore } from "../../../store/booking-store";
import { CitiesResponse, StateProps, UserAddress } from "../../../types";

const NOTICES = [
  { icon: CalendarDays, copy: "Cancellation charges may apply after dispatch." },
  { icon: Clock3, copy: "Overtime charges apply after 5:00 PM." },
  { icon: MapPin, copy: "Worker arrival is verified using GPS & timestamp." },
];

const POLICY_LINKS = [
  { label: "View Cancellation Policy", to: "/cancellation-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Privacy Policy", to: "/privacy-policy" },
];

const fieldClass =
  "mt-1.5 min-h-11 w-full rounded-xl border border-[#d8e4f8] bg-white px-4 text-sm font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#9badd0] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100";

const labelClass = "block text-xs font-bold uppercase tracking-[0.1em] text-[#40517b]";

/** Start time is not asked for; bookings default to the start of the working day. */
const DEFAULT_TIME_SLOT = "09:00";

const BookingDetailsPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const booking = useBookingStore();
  const { user, token } = useAuthStore();

  const [bookDate, setBookDate] = useState(booking.bookDate);
  // Start time is no longer collected — workers are scheduled by the ops team.
  // The stored slot still travels in the booking payload so its shape is unchanged.
  const timeSlot = booking.timeSlot || DEFAULT_TIME_SLOT;
  const [address, setAddress] = useState(booking.address);
  const [addressLabel, setAddressLabel] = useState(booking.addressLabel);
  const [stateId, setStateId] = useState(booking.stateId);
  const [cityId, setCityId] = useState(booking.cityId);
  const [pincode, setPincode] = useState(booking.pincode);
  const [instructions, setInstructions] = useState(booking.instructions);

  const [errors, setErrors] = useState<Record<string, string>>({});
  // const [_isLocating, setIsLocating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  /**
   * Why Save & Continue did not go through, shown beneath the button.
   * Field-level problems stay on their own inputs; this covers the whole-form
   * reasons — failed validation and anything the availability check reports —
   * which previously only appeared as a toast that vanished after a few seconds.
   */
  const [formError, setFormError] = useState("");

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

  const { data: savedAddresses } = useUserAddresses(user?.id);
  const saved = savedAddresses?.addresses ?? [];
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const applySavedAddress = (item: UserAddress) => {
    setSelectedAddressId(item.id);
    setAddressLabel(item.label);
    setAddress(item.address);
    setStateId(item.state_id ? String(item.state_id) : "");
    setCityId(item.city_id ? String(item.city_id) : "");
    setPincode(item.pincode ?? "");
    setInstructions(item.instructions ?? "");
    setErrors({});
    setFormError("");
  };

  // Pre-fill the default worksite the first time this step is opened, but never
  // overwrite an address the visitor has already started entering.
  useEffect(() => {
    if (address.trim() || selectedAddressId !== null || saved.length === 0) return;

    const preferred = saved.find((item) => item.is_default) ?? saved[0];
    if (preferred) applySavedAddress(preferred);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saved.length]);

  // A worker cannot be booked for a past date.
  const [minDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (!booking.serviceSlug && slug) {
      // Landed here directly — send the user back to pick workers first.
      navigate(bookingPath(slug, "select-worker"), { replace: true });
    }
  }, [booking.serviceSlug, slug, navigate]);

  // const _fetchLocation = () => {
  //   if (!navigator.geolocation) {
  //     toast.error("Geolocation is not supported by your browser.");
  //     return;
  //   }

  //   setIsLocating(true);
  //   navigator.geolocation.getCurrentPosition(
  //     async (position) => {
  //       const { latitude, longitude } = position.coords;
  //       try {
  //         const response = await fetch(
  //           `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${latitude}&lon=${longitude}`,
  //           { headers: { "Accept-Language": "en" } }
  //         );
  //         const data = await response.json();

  //         if (data?.display_name) setAddress(data.display_name);
  //         if (data?.address?.postcode) setPincode(String(data.address.postcode));
  //         toast.success("Location fetched.");
  //       } catch (error) {
  //         console.error("Reverse geocoding error:", error);
  //         toast.error("Unable to fetch address.");
  //       } finally {
  //         setIsLocating(false);
  //       }
  //     },
  //     (error) => {
  //       toast.error(
  //         error.code === error.PERMISSION_DENIED
  //           ? "Location permission denied. Please allow access in your browser."
  //           : "Unable to retrieve your location."
  //       );
  //       setIsLocating(false);
  //     },
  //     { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  //   );
  // };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!bookDate) nextErrors.bookDate = "Please choose the work date.";
    if (!address.trim()) nextErrors.address = "Worksite address is required.";
    if (!stateId) nextErrors.stateId = "Please select a state.";
    if (!cityId) nextErrors.cityId = "Please select a city.";
    if (!/^\d{6}$/.test(pincode)) nextErrors.pincode = "Enter a valid 6-digit pincode.";

    setErrors(nextErrors);

    const count = Object.keys(nextErrors).length;

    return {
      valid: count === 0,
      count,
      // Fields are validated in the order they appear, so the first key is the
      // topmost problem on the page.
      firstField: count ? document.querySelector<HTMLElement>(`[data-field="${Object.keys(nextErrors)[0]}"]`) : null,
    };
  };

  const saveAndContinue = async () => {
    setFormError("");

    const invalid = validate();

    if (!invalid.valid) {
      setFormError(
        invalid.count === 1
          ? "Please correct the highlighted field above."
          : `Please correct the ${invalid.count} highlighted fields above.`
      );
      // Bring the first problem into view — on mobile the fields sit well above
      // the button, so the message alone points at something off-screen.
      invalid.firstField?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setIsChecking(true);
    try {
      const availability = await checkAvailability({ state_id: stateId, city_id: cityId, pincode });

      if (!availability.available) {
        setFormError(availability.message || "We do not serve this location yet.");
        setIsChecking(false);
        return;
      }

      // Everything typed so far is kept whatever happens next, so a trip through
      // sign-in — or a failed save — comes back to a filled-in form rather than
      // an empty one.
      const remember = (addressId: number | null) => {
        booking.setSchedule({ bookDate, timeSlot });
        booking.setAddress({
          address: address.trim(),
          addressLabel: addressLabel.trim() || "Worksite",
          addressId,
          stateId,
          cityId,
          stateName: states?.states?.find((item) => String(item.id) === stateId)?.name ?? "",
          cityName: cities?.cites?.find((item) => String(item.id) === cityId)?.name ?? "",
          pincode,
          instructions: instructions.trim(),
          serviceAreaId: availability.service_area?.id ?? null,
        });
      };

      // The worksite is stored against the customer's account and the booking
      // records only its row id, so there is nothing to attach it to until they
      // are signed in. Send them to sign in and straight back here.
      if (!token || !user?.id) {
        remember(null);
        const here = window.location.pathname + window.location.search;
        navigate(`/sign-in?path=${encodeURIComponent(here)}`);
        return;
      }

      // The address must reach the database before step 3: its id is the only
      // record of where the job is, and a booking placed without one leaves the
      // crew with no site to go to. A failure keeps the visitor on this page.
      let addressId = selectedAddressId;

      try {
        const saveResult = await saveUserAddress({
          user_id: user.id,
          label: addressLabel.trim() || "Worksite",
          address: address.trim(),
          state_id: stateId,
          city_id: cityId,
          pincode,
          instructions: instructions.trim(),
          service_area_id: availability.service_area?.id ?? null,
        });

        addressId = saveResult.address?.id ?? null;

        if (!addressId) throw new Error("The API accepted the address but returned no id.");

        // Keep Saved Addresses and this picker in step with what was just stored.
        queryClient.invalidateQueries({ queryKey: ["user-addresses", user.id] });
      } catch (error) {
        console.error("Could not save the worksite address:", error);
        remember(null);

        setFormError(
          isUnauthorized(error)
            ? "Your session has expired, so the address could not be saved. Please sign in again to continue."
            : apiErrorMessage(error, "We could not save this worksite address. Please check the details and try again.")
        );
        setIsChecking(false);
        return;
      }

      remember(addressId);
      navigate(bookingPath(slug ?? "", "payment"));
    } catch (error) {
      console.error("Availability check failed:", error);
      setFormError("We could not verify service availability for this address. Please try again.");
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <main className="bg-white pb-20 pt-6 sm:pt-10">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-8 lg:px-10">
        <nav aria-label="Breadcrumb" className="mb-4">
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
              <Link to={bookingPath(slug ?? "", "select-worker")} className="transition hover:text-[#0b3fc4]">
                Select Worker
              </Link>
            </li>
            <li aria-hidden="true">
              <ChevronRight size={14} className="text-[#a8b6d4]" />
            </li>
            <li className="font-bold text-[#0f1e57]" aria-current="page">
              Booking Details
            </li>
          </ol>
        </nav>

        <BookingSteps current={2} slug={slug ?? ""} />

        <h1 className="text-[28px] font-extrabold leading-tight tracking-tight text-[#0f1e57] sm:text-[32px]">
          Booking Details
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#5a6a90]">
          Tell us when and where you need workers for {booking.serviceTitle || "this service"}.
        </p>

        <div className="mt-6 space-y-4">
          <section
            aria-labelledby="schedule-heading"
            className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7"
          >
            <div className="flex items-center gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#0b3fc4] text-white">
                <CalendarDays size={20} aria-hidden="true" />
              </span>
              <h2 id="schedule-heading" className="text-lg font-extrabold text-[#0f1e57] sm:text-xl">
                Service Schedule
              </h2>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="book-date" className={labelClass}>
                  Work date
                </label>
                <input
                  id="book-date"
                  type="date"
                  min={minDate}
                  value={bookDate}
                  onChange={(event) => setBookDate(event.target.value)}
                  data-field="bookDate"
                  aria-invalid={!!errors.bookDate}
                  className={fieldClass}
                />
                {errors.bookDate && <p className="mt-1 text-xs font-semibold text-red-600">{errors.bookDate}</p>}
              </div>

            </div>
          </section>

          <section
            aria-labelledby="address-heading"
            className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="grid size-10 shrink-0 place-items-center rounded-2xl bg-[#0b3fc4] text-white">
                  <MapPin size={20} aria-hidden="true" />
                </span>
                <h2 id="address-heading" className="text-lg font-extrabold text-[#0f1e57] sm:text-xl">
                  Worksite Address
                </h2>
              </div>

              {/* <button
                type="button"
                onClick={fetchLocation}
                disabled={isLocating}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#0b3fc4] bg-white px-4 text-xs font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LocateFixed size={15} aria-hidden="true" />
                {isLocating ? "Fetching…" : "Get Current Location"}
              </button> */}
            </div>

            <div className="mt-5 space-y-4">
              {saved.length > 0 && (
                <div>
                  <p className={labelClass}>Saved addresses</p>
                  <ul className="mt-2 grid gap-2.5 sm:grid-cols-2">
                    {saved.map((item) => {
                      const isSelected = selectedAddressId === item.id;

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            onClick={() => applySavedAddress(item)}
                            aria-pressed={isSelected}
                            className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 ${
                              isSelected
                                ? "border-[#0b3fc4] bg-[#eef4ff]"
                                : "border-[#d8e4f8] bg-white hover:border-[#bfd5fb] hover:bg-[#f6f9ff]"
                            }`}
                          >
                            <span
                              className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg ${
                                isSelected ? "bg-[#0b3fc4] text-white" : "bg-[#eef4ff] text-[#0b3fc4]"
                              }`}
                            >
                              <MapPin size={15} aria-hidden="true" />
                            </span>
                            <span className="min-w-0">
                              <span className="flex flex-wrap items-center gap-2 text-[13px] font-extrabold text-[#0f1e57]">
                                {item.label}
                                {item.is_default && (
                                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                                    Default
                                  </span>
                                )}
                              </span>
                              <span className="mt-0.5 line-clamp-2 block text-[11px] leading-5 text-[#63739a]">
                                {[item.address, item.city_name, item.state_name, item.pincode]
                                  .filter(Boolean)
                                  .join(", ")}
                              </span>
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-2 text-xs font-normal text-[#7080a4]">
                    Pick one to fill the form below, or enter a new address.
                  </p>
                </div>
              )}

              <div>
                <label htmlFor="address-label" className={labelClass}>
                  Label <span className="font-medium normal-case tracking-normal text-[#8fa2c8]">(Optional)</span>
                </label>
                <input
                  id="address-label"
                  value={addressLabel}
                  onChange={(event) => setAddressLabel(event.target.value)}
                  placeholder="Home, Office, Site – Sector 66"
                  className={fieldClass}
                />
                <p className="mt-1 text-xs font-normal text-[#7080a4]">
                  Saved under this name so you can reuse it on your next booking.
                </p>
              </div>

              <div>
                <label htmlFor="address" className={labelClass}>
                  Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={address}
                  onChange={(event) => {
                    setAddress(event.target.value);
                    // Editing the line makes this a different worksite, so it is
                    // no longer the saved row the customer picked.
                    setSelectedAddressId(null);
                  }}
                  placeholder="House / building, street, area and landmark"
                  data-field="address"
                  aria-invalid={!!errors.address}
                  className={`${fieldClass} py-3`}
                />
                {errors.address && <p className="mt-1 text-xs font-semibold text-red-600">{errors.address}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="state" className={labelClass}>
                    State
                  </label>
                  <select
                    id="state"
                    value={stateId}
                    onChange={(event) => {
                      setStateId(event.target.value);
                      setCityId("");
                    }}
                    data-field="stateId"
                  aria-invalid={!!errors.stateId}
                    className={fieldClass}
                  >
                    <option value="">{isLoadingStates ? "Loading…" : "Select state"}</option>
                    {states?.states?.map((state) => (
                      <option key={state.id} value={String(state.id)}>
                        {state.name}
                      </option>
                    ))}
                  </select>
                  {errors.stateId && <p className="mt-1 text-xs font-semibold text-red-600">{errors.stateId}</p>}
                </div>

                <div>
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <select
                    id="city"
                    value={cityId}
                    onChange={(event) => setCityId(event.target.value)}
                    disabled={!stateId}
                    data-field="cityId"
                  aria-invalid={!!errors.cityId}
                    className={`${fieldClass} disabled:cursor-not-allowed disabled:bg-[#f1f4fa]`}
                  >
                    <option value="">
                      {!stateId ? "Select state first" : isLoadingCities ? "Loading…" : "Select city"}
                    </option>
                    {/* NB: the API returns `cites`, not `cities` — typo is upstream. */}
                    {cities?.cites?.map((city) => (
                      <option key={city.id} value={String(city.id)}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                  {errors.cityId && <p className="mt-1 text-xs font-semibold text-red-600">{errors.cityId}</p>}
                </div>

                <div>
                  <label htmlFor="pincode" className={labelClass}>
                    Pincode
                  </label>
                  <input
                    id="pincode"
                    inputMode="numeric"
                    maxLength={6}
                    value={pincode}
                    onChange={(event) => {
                      setPincode(event.target.value.replace(/\D/g, ""));
                      setSelectedAddressId(null);
                    }}
                    placeholder="6-digit pincode"
                    data-field="pincode"
                  aria-invalid={!!errors.pincode}
                    className={fieldClass}
                  />
                  {errors.pincode && <p className="mt-1 text-xs font-semibold text-red-600">{errors.pincode}</p>}
                </div>
              </div>

              <div>
                <label htmlFor="instructions" className={labelClass}>
                  Instructions <span className="font-medium normal-case tracking-normal text-[#8fa2c8]">(Optional)</span>
                </label>
                <textarea
                  id="instructions"
                  rows={3}
                  value={instructions}
                  onChange={(event) => setInstructions(event.target.value)}
                  placeholder="Share any gate number, parking details, landmark or special instructions for the worker."
                  className={`${fieldClass} py-3`}
                />
                <p className="mt-1 text-xs font-normal text-[#7080a4]">This helps our workers reach your site easily.</p>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="notices-heading"
            className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7"
          >
            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-8">
              <div>
                <div className="flex items-center gap-3">
                  <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#e8f0ff] text-[#0b3fc4]">
                    <ShieldCheck size={18} aria-hidden="true" />
                  </span>
                  <h2 id="notices-heading" className="text-base font-extrabold text-[#0f1e57]">
                    Important Information
                  </h2>
                </div>

                <ul className="mt-4 space-y-3.5">
                  {NOTICES.map(({ icon: Icon, copy }) => (
                    <li key={copy} className="flex items-start gap-3 text-xs leading-5 text-[#5a6a90] sm:text-[13px]">
                      <Icon size={16} className="mt-0.5 shrink-0 text-[#0b3fc4]" aria-hidden="true" />
                      {copy}
                    </li>
                  ))}
                </ul>
              </div>

              <nav aria-label="Booking policies" className="space-y-3">
                {POLICY_LINKS.map(({ label, to }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex min-h-11 items-center justify-between gap-3 rounded-xl border border-[#dce7fb] bg-white px-4 text-[13px] font-bold text-[#0f1e57] transition hover:border-[#bfd5fb] hover:text-[#0b3fc4] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100"
                    target="_blank"
                  >
                    {label}
                    <ChevronRight
                      size={16}
                      className="shrink-0 text-[#a8b6d4] transition group-hover:translate-x-0.5 group-hover:text-[#0b3fc4]"
                      aria-hidden="true"
                    />
                  </Link>
                ))}
              </nav>
            </div>
          </section>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-between">
          <Link
            to={bookingPath(slug ?? "", "select-worker")}
            className="inline-flex min-h-12 items-center justify-center rounded-xl border border-[#d8e4f8] bg-white px-6 text-sm font-bold text-[#40517b] transition hover:bg-[#f1f6ff]"
          >
            Back
          </Link>
          <div className="flex flex-col items-stretch gap-2 sm:items-end">
            <button
              type="button"
              onClick={saveAndContinue}
              disabled={isChecking}
              aria-describedby={formError ? "booking-form-error" : undefined}
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-7 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isChecking ? "Checking availability…" : "Save & Continue"}
              <ArrowRight size={17} aria-hidden="true" />
            </button>

            {formError && (
              <p
                id="booking-form-error"
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3.5 py-2.5 text-xs font-semibold leading-5 text-red-700 sm:max-w-sm"
              >
                <AlertCircle size={15} className="mt-px shrink-0" aria-hidden="true" />
                {formError}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default BookingDetailsPage;
