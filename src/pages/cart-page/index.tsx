import { IndianRupee } from "lucide-react";
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

  // Retrieve the query parameters &
  // Get and decode the `id` parameter
  const queryParams = new URLSearchParams(location.search);
  const id = decodeURIComponent(queryParams.get("id") || "");

  // Handle quick tip selection and apply directly
  const handleTipSelect = (value: number) => {
    if (mode === "day") {
      setTipPrice(value);
    } else {
      setHourTipPrice(value);
    }
  };

  const { data, status } = useInstantServices(parseInt(id));
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

              <div className="mt-6 flex items-center gap-2">
                <input type="checkbox" defaultChecked className="checkbox" />
                <p className="flex items-center text-[16px] gap-2">
                  Pick & drop services free
                  <s className="flex items-center text-[21px] italic">
                    <IndianRupee size={18} />
                    500
                  </s>
                </p>
              </div>

              <div className="mt-6">
                <h3 className="text-[17px] font-medium">Note</h3>
                <p className="text-xs leading-5 font-normal">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                </p>
              </div>
            </div>
          )}

          <div className="py-6 px-1 md:px-10">
            <CartPrices />
            <div className="mb-6 md:mb-[60px]">
              <label htmlFor="" className="font-medium text-xs">
                Add tip
              </label>
              <p className="text-xs text-gray-600 italic mb-2">**Select a quick tip.</p>
              <div className="flex items-center gap-2 mb-4">
                {[50, 100, 200, 500].map((amount) => (
                  <button key={amount} className="btn btn-outline btn-xs" onClick={() => handleTipSelect(amount)}>
                    +{amount}
                  </button>
                ))}
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
