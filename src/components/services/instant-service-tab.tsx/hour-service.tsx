import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHourRateStore } from "../../../store/hour-service-store";
import { InstantService } from "../../../types";

const HourService = () => {
  const navigate = useNavigate();
  const {
    decrementHelperHour,
    decrementMasonHour,
    helperHourCount,
    incrementHelperHour,
    incrementMasonHour,
    MasonHourCount,
    totalHelperHourRate,
    totalMasonHourRate,
  } = useHourRateStore();

  const [instantService, setInstantService] = useState<InstantService | null>(null);
  const [serviceTitle, setServiceTitle] = useState<string>("");

  useEffect(() => {
    const prices = localStorage.getItem("day-prices");
    if (prices) {
      setInstantService(JSON.parse(prices));
    } else {
      navigate("/error-page", { replace: true }); // Redirect if no data
    }
    setServiceTitle(localStorage.getItem("service-title") || "");
  }, [navigate]);

  if (!instantService) {
    return null; // Prevent rendering if data is not loaded
  }

  const masonLabel =
    instantService.worker_1_label?.trim() || (serviceTitle ? `${serviceTitle} Mason` : "Mason");
  const helperLabel =
    instantService.worker_2_label?.trim() || (serviceTitle ? `${serviceTitle} Helper` : "Helper");

  return (
    <div className="mt-8 border p-4 rounded-md">
      <div className="flex justify-between items-center my-6">
        <div className="font-semibold">{masonLabel}</div>
        <div>{instantService.per_day_meason_rate || 200}/hour</div>
        <div className="flex items-center w-[180px]">
          <button className="w-[50px] font-semibold" onClick={decrementMasonHour}>
            -
          </button>
          <input
            type="number"
            value={MasonHourCount}
            className="input input-bordered input-xs w-full flex-1 text-center"
            readOnly
          />
          <button className="w-[50px] font-semibold" onClick={incrementMasonHour}>
            +
          </button>
        </div>
        <div className="w-[120px]">
          <input
            type="number"
            readOnly
            value={totalMasonHourRate}
            className="input input-bordered input-xs w-full text-center font-medium"
          />
        </div>
      </div>
      <div className="flex justify-between items-center my-6">
        <div className="font-semibold">{helperLabel}</div>
        <div>{instantService.per_hour_helper_rate || 200}/hour</div>
        <div className="flex items-center w-[180px]">
          <button className="w-[50px] font-semibold" onClick={decrementHelperHour}>
            -
          </button>
          <input
            type="number"
            value={helperHourCount}
            className="input input-bordered input-xs w-full flex-1 text-center"
            readOnly
          />
          <button className="w-[50px] font-semibold" onClick={incrementHelperHour}>
            +
          </button>
        </div>
        <div className="w-[120px]">
          <input
            type="number"
            value={totalHelperHourRate}
            readOnly
            className="input input-bordered input-xs w-full text-center font-medium"
          />
        </div>
      </div>
    </div>
  );
};

export default HourService;
