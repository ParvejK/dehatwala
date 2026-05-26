import Container from "../../components/shared/container";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import CartPrices from "../../components/shared/cart-prices";
import { useDayRateStore } from "../../store/day-service-store";
import { useHourRateStore } from "../../store/hour-service-store";
import { useInstantServices } from "../../react-query/hooks";

const CartPage = () => {
  const location = useLocation();
  const { setTipPrice } = useDayRateStore();
  const { setHourTipPrice } = useHourRateStore();

  const navigation = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("service");

  // Retrieve the query parameters & get/decode the `slug` parameter
  const queryParams = new URLSearchParams(location.search);
  const slug = decodeURIComponent(queryParams.get("slug") || "");

  // Handle quick tip selection and apply directly
  const handleTipSelect = (value: number) => {
    if (mode === "day") {
      setTipPrice(value);
    } else {
      setHourTipPrice(value);
    }
  };

  const { data, status } = useInstantServices(slug);
  if (status === "error") {
    return <p>Something went wrong..</p>;
  }

  return (
    <div className="min-h-[60vh]">
      <Container>
        <div className="rounded-md grid grid-cols-1 md:grid-cols-2 mb-[100px]">
          {status === "pending" ? (
            "Loading..."
          ) : (
            <div className="bg-white py-6 px-5 md:px-10 hidden md:block">
              <h2 className="text-[20px] font-semibold">{data.service.title}</h2>
              <div className="mt-[20px] space-y-4">
                <div>
                  <strong className="text-lg">Description</strong>
                  <div className="text-sm leading-7" dangerouslySetInnerHTML={{ __html: data.service.description }} />
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-[17px] font-semibold">Cancellation &amp; Reschedule Policy</h3>
                <ul className="mt-2 space-y-1 text-sm leading-6 list-disc pl-5">
                  <li>Cancellation within 30 minutes of booking &rarr; Free</li>
                  <li>
                    Cancellation after 30 minutes of booking, if the worker has reached the site &rarr; ₹100 per head
                    will be charged
                  </li>
                  <li>Reschedule within 30 minutes of booking &rarr; Free</li>
                  <li>
                    Reschedule after 30 minutes, if the worker has reached the site &rarr; ₹100 per head (advance) will
                    be charged
                  </li>
                </ul>
                <p className="mt-2 text-sm italic text-gray-600">
                  All cancellation charges are transferred directly to the workers. Our workers travel to your location
                  immediately upon booking. Kindly avoid last-minute cancellations to respect their time and effort.
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-[17px] font-semibold">Important Notes</h3>
                <ul className="mt-2 space-y-1 text-sm leading-6 list-disc pl-5">
                  <li>
                    If you have selected Cash on Delivery as the payment method, full payment (cash or online) must be
                    made as soon as the worker reaches the site, before work begins.
                  </li>
                  <li>Day-basis services (8 hours) end by 5:00 PM. Please book your service accordingly.</li>
                  <li>
                    Any work required after 5:00 PM must be added as Overtime at the time of booking. Overtime cannot
                    be added later.
                  </li>
                  <li>The worker&rsquo;s arrival time at the site (GPS + timestamp) will be considered as final proof.</li>
                </ul>
              </div>
            </div>
          )}

          <div className="py-6 px-1 md:px-10">
            <CartPrices />
            <div className="mb-6 md:mb-[60px]">
              <label htmlFor="" className="font-medium text-sm">
                Add a Tip
              </label>
              <p className="text-xs text-gray-600 italic mb-2">
                Your generous tip goes directly to our hardworking workers who serve you with dedication.
              </p>
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                {[50, 100, 200, 500].map((amount) => (
                  <button key={amount} className="btn btn-outline btn-xs" onClick={() => handleTipSelect(amount)}>
                    ₹{amount}
                  </button>
                ))}
                <div className="flex items-center gap-1">
                  <span className="text-xs font-medium">Custom Amount ₹</span>
                  <input
                    type="number"
                    min={0}
                    onChange={(e) => handleTipSelect(Number(e.target.value) || 0)}
                    className="input input-bordered input-xs w-20"
                  />
                </div>
              </div>
            </div>

            <button className="btn btn-primary w-full" onClick={() => navigation(`/service-letter?service=${mode}`)}>
              Proceed Now
            </button>
          </div>

          {/* FOR MOBILE */}
          {status === "pending" ? (
            "Loading..."
          ) : (
            <div className="bg-white py-2 px-4 md:px-10 md:hidden">
              <h2 className="text-base font-semibold">{data.service.title}</h2>
              <div className="mt-4 space-y-2">
                <div>
                  <strong className="text-sm font-semibold">Description</strong>
                  <div className="text-sm leading-7" dangerouslySetInnerHTML={{ __html: data.service.description }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
};

export default CartPage;
