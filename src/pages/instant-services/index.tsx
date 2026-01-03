import { Link, useNavigate, useParams } from "react-router-dom";
import Container from "../../components/shared/container";
import ServicesCarouselCard from "../../components/shared/services-carousel-card";
import { IndianRupee } from "lucide-react";
import { useInstantServices } from "../../react-query/hooks";
import { useDayRateStore } from "../../store/day-service-store";
import { useHourRateStore } from "../../store/hour-service-store";
import InstantServicesTab from "../../components/services/instant-service-tab.tsx";
import useModeStore from "../../store/mode-store.tsx";
import InstantServiceLoading from "../../components/services/loader/instant-service-loading.tsx";
import { useServiceStore } from "../../store/instant-service-store.ts";
import DOMPurify from "dompurify";

const InstantServices = () => {
  const { id } = useParams();
  //Need to pass over cart

  const setInstantServiceId = useServiceStore((state) => state.setInstantServiceId);
  const setServiceId = useServiceStore((state) => state.setServiceId);

  // Save the values to Zustand store

  const navigation = useNavigate();
  const mode = useModeStore((state) => state.mode);

  const { totalDayPrice } = useDayRateStore();

  const { totalHourPrice } = useHourRateStore();

  const { data, status } = useInstantServices(parseInt(id));
  if (status === "error") {
    return <p>Something went wrong..</p>;
  }

  if (status === "pending") {
    return <InstantServiceLoading />;
  }

  // Set Id in local storage

  setInstantServiceId(data.instant_service.id);
  setServiceId(data.instant_service.service_id);
  localStorage.setItem("day-prices", JSON.stringify(data.instant_service));

  const { instant_service } = data;

  return (
    <div>
      <Container className="my-10 min-h-[60vh]">
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>Instant Services</li>
          </ul>
        </div>
        <h2 className="text-xl md:text-[24px] font-semibold mb-6 mt-6">Instant Services</h2>
        <ServicesCarouselCard data={data.slider_slogans} />
        <div className="mt-10">
          <InstantServicesTab instantServiceData={data.instant_service} />
        </div>
        <div className="flex justify-end mt-[50px] bg-accent p-[50px] rounded-md">
          <div className="flex items-center gap-4">
            <p className="text-base md:text-[32px]">Total Price:</p>
            <div className="flex items-center font-medium text-lg md:text-[32px]">
              <IndianRupee className="w-4 h-4 md:w-8 md:h-8" />
              {mode === "day" && <p>{totalDayPrice}</p>}
              {mode === "hour" && <p>{totalHourPrice}</p>}
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-[50px] mb-[100px]">
          <button
            className="btn btn-primary min-w-[300px]"
            onClick={() => navigation(`/cart/?service=${mode === "day" ? "day" : "hour"}&id=${encodeURIComponent(id)}`)}
          >
            View Cart
          </button>
        </div>
        <div>
          <div className="mt-6">
            <h3 className="text-base font-semibold md:text-lg mb-4">Notes:</h3>
            <div className="space-y-3">
              <div
                className="bg-gray-100 rounded-md px-3 py-2"
                dangerouslySetInnerHTML={{
                  __html: instant_service.includes_instument
                    ? DOMPurify.sanitize(instant_service.includes_instument)
                    : "<p>No content available</p>",
                }}
              />
              <div
                className="bg-gray-100 rounded-md px-3 py-2"
                dangerouslySetInnerHTML={{
                  __html: instant_service.excludes_instument
                    ? DOMPurify.sanitize(instant_service.excludes_instument)
                    : "<p>No content available</p>",
                }}
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default InstantServices;
