import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, ChevronRight, Clock3, Home, LocateFixed, MapPin, ShieldCheck } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import BookingSteps from "../../../components/booking/booking-steps";
import { bookingPath } from "../../../components/booking/steps";
import { checkAvailability, getCities, getStates } from "../../../react-query/apis";
import { useBookingStore } from "../../../store/booking-store";
import { CitiesResponse, StateProps } from "../../../types";

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

  const [bookDate, setBookDate] = useState(booking.bookDate);
  // Start time is no longer collected — workers are scheduled by the ops team.
  // The stored slot still travels in the booking payload so its shape is unchanged.
  const timeSlot = booking.timeSlot || DEFAULT_TIME_SLOT;
  const [address, setAddress] = useState(booking.address);
  const [stateId, setStateId] = useState(booking.stateId);
  const [cityId, setCityId] = useState(booking.cityId);
  const [pincode, setPincode] = useState(booking.pincode);
  const [instructions, setInstructions] = useState(booking.instructions);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLocating, setIsLocating] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

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

  // A worker cannot be booked for a past date.
  const [minDate] = useState(() => new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (!booking.serviceSlug && slug) {
      // Landed here directly — send the user back to pick workers first.
      navigate(bookingPath(slug, "select-worker"), { replace: true });
    }
  }, [booking.serviceSlug, slug, navigate]);

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&addressdetails=1&lat=${latitude}&lon=${longitude}`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await response.json();

          if (data?.display_name) setAddress(data.display_name);
          if (data?.address?.postcode) setPincode(String(data.address.postcode));
          toast.success("Location fetched.");
        } catch (error) {
          console.error("Reverse geocoding error:", error);
          toast.error("Unable to fetch address.");
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        toast.error(
          error.code === error.PERMISSION_DENIED
            ? "Location permission denied. Please allow access in your browser."
            : "Unable to retrieve your location."
        );
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const validate = () => {
    const nextErrors: Record<string, string> = {};

    if (!bookDate) nextErrors.bookDate = "Please choose the work date.";
    if (!address.trim()) nextErrors.address = "Worksite address is required.";
    if (!stateId) nextErrors.stateId = "Please select a state.";
    if (!cityId) nextErrors.cityId = "Please select a city.";
    if (!/^\d{6}$/.test(pincode)) nextErrors.pincode = "Enter a valid 6-digit pincode.";

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const saveAndContinue = async () => {
    if (!validate()) return;

    setIsChecking(true);
    try {
      const availability = await checkAvailability({ state_id: stateId, city_id: cityId, pincode });

      if (!availability.available) {
        toast.error(availability.message || "We do not serve this location yet.");
        setIsChecking(false);
        return;
      }

      booking.setSchedule({ bookDate, timeSlot });
      booking.setAddress({
        address: address.trim(),
        stateId,
        cityId,
        pincode,
        instructions: instructions.trim(),
        serviceAreaId: availability.service_area?.id ?? null,
      });

      navigate(bookingPath(slug ?? "", "payment"));
    } catch (error) {
      console.error("Availability check failed:", error);
      toast.error("We could not verify service availability for this address.");
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

              <button
                type="button"
                onClick={fetchLocation}
                disabled={isLocating}
                className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-[#0b3fc4] bg-white px-4 text-xs font-bold text-[#0b3fc4] transition hover:bg-[#eef4ff] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <LocateFixed size={15} aria-hidden="true" />
                {isLocating ? "Fetching…" : "Get Current Location"}
              </button>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="address" className={labelClass}>
                  Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  placeholder="House / building, street, area and landmark"
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
                    onChange={(event) => setPincode(event.target.value.replace(/\D/g, ""))}
                    placeholder="6-digit pincode"
                    aria-invalid={!!errors.pincode}
                    className={fieldClass}
                  />
                  {errors.pincode && <p className="mt-1 text-xs font-semibold text-red-600">{errors.pincode}</p>}
                </div>
              </div>
            </div>
          </section>

          <section
            aria-labelledby="instructions-heading"
            className="rounded-3xl border border-[#dce7fb] bg-[#f6f9ff] p-5 sm:p-7"
          >
            <h2 id="instructions-heading" className="text-lg font-extrabold text-[#0f1e57] sm:text-xl">
              Additional Instructions <span className="text-sm font-semibold text-[#0b3fc4]">(Optional)</span>
            </h2>
            <label htmlFor="instructions" className="sr-only">
              Additional instructions
            </label>
            <textarea
              id="instructions"
              rows={3}
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              placeholder="Share any gate number, parking details, landmark or special instructions for the worker."
              className={`${fieldClass} py-3`}
            />
            <p className="mt-2 text-xs font-normal text-[#7080a4]">This helps our workers reach your site easily.</p>
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
          <button
            type="button"
            onClick={saveAndContinue}
            disabled={isChecking}
            className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-[#0b3fc4] px-7 text-sm font-bold text-white transition hover:bg-[#0932a0] focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-200 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isChecking ? "Checking availability…" : "Save & Continue"}
            <ArrowRight size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </main>
  );
};

export default BookingDetailsPage;
