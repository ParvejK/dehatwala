import React from "react";
import { useDayRateStore } from "../../../store/day-service-store";
import { useHourRateStore } from "../../../store/hour-service-store";
import useModeStore from "../../../store/mode-store";
import { InstantService } from "../../../types";

interface InstantServiceProps {
  instantServiceData: InstantService;
}

const InstantServicesTab = ({ instantServiceData }: InstantServiceProps) => {
  const { mode, setMode } = useModeStore();

  const {
    MasonDayCount,
    helperDayCount,
    totalMasonDayRate,
    incrementMasonDay,
    decrementMasonDay,
    totalHelperDayRate,
    incrementHelperDay,
    decrementHelperDay,
    MasonOvertimeCount,
    helperOvertimeCount,
    totalMasonOvertimeRate,
    totalHelperOvertimeRate,
    incrementMasonOvertime,
    decrementMasonOvertime,
    incrementHelperOvertime,
    decrementHelperOvertime,

    setMasonDayRate,
    setHelperDayRate,
    setMasonOvertimeRate,
    setHelperOvertimeRate,
  } = useDayRateStore((state) => state);

  const {
    decrementHelperHour,
    decrementMasonHour,
    helperHourCount,
    incrementHelperHour,
    incrementMasonHour,
    MasonHourCount,
    totalHelperHourRate,
    totalMasonHourRate,

    setMasonRate,
    setHelperRate,
  } = useHourRateStore((state) => state);

  React.useEffect(() => {
    if (instantServiceData) {
      setMasonRate(instantServiceData.per_hour_meason_rate || 200);
      setHelperRate(instantServiceData.per_hour_helper_rate || 150);
      // Day

      setMasonDayRate(instantServiceData.per_day_meason_rate);
      setHelperDayRate(instantServiceData.per_day_helper_rate);
      setMasonOvertimeRate(instantServiceData.overtime_meason_rate);
      setHelperOvertimeRate(instantServiceData.overtime_helper_rate);
    }
  }, [instantServiceData, setMasonRate, setHelperRate, setMasonDayRate, setHelperDayRate, setHelperOvertimeRate]);

  console.log(instantServiceData);

  return (
    <div role="tablist" className="tabs tabs-lifted">
      {/* DAYS RATE */}
      <input
        defaultChecked
        checked={mode === "day"}
        type="radio"
        name="my_tabs_2"
        role="tab"
        className="tab font-semibold"
        aria-label="Day basis"
        onChange={() => setMode("day")}
      />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box md:p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center my-6">
          <div className="font-semibold">Mason</div>
          <div>{instantServiceData.per_day_meason_rate || 800}/day</div>
          <div className="flex items-center w-[180px]">
            <button className="w-[50px] font-semibold" onClick={decrementMasonDay}>
              -
            </button>
            <input
              type="number"
              value={MasonDayCount}
              className="input input-bordered input-xs w-full flex-1 text-center"
            />
            <button className="w-[50px] font-semibold" onClick={incrementMasonDay}>
              +
            </button>
          </div>
          <div className="w-[120px]">
            <input
              type="number"
              readOnly
              value={totalMasonDayRate}
              className="input input-bordered input-xs w-full text-center  font-medium"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center my-6">
          <div className="font-semibold">Helper</div>
          <div>{instantServiceData.per_day_helper_rate || 600}/day</div>
          <div className="flex items-center w-[180px]">
            <button className="w-[50px] font-semibold" onClick={decrementHelperDay}>
              -
            </button>
            <input
              type="number"
              value={helperDayCount}
              className="input input-bordered input-xs w-full flex-1 text-center"
            />
            <button className="w-[50px] font-semibold" onClick={incrementHelperDay}>
              +
            </button>
          </div>
          <div className="w-[120px]">
            <input
              type="number"
              value={totalHelperDayRate}
              readOnly
              className="input input-bordered input-xs w-full text-center  font-medium"
            />
          </div>
        </div>
        <div>
          <hr className="my-4 md:my-10" />
          <div className="px-4 md:px-0">
            <h3 className="font-semibold">Over Time</h3>
            <p>After 5 pm if you want these Mason helpers to work overtime then then per hours Rs. will be chared.</p>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center my-6">
            <div className="font-semibold">Mason</div>
            <div>{instantServiceData.overtime_meason_rate || 200}/hrs</div>
            <div className="flex items-center w-[180px]">
              <button className="w-[50px] font-semibold" onClick={decrementMasonOvertime}>
                -
              </button>
              <input
                type="number"
                value={MasonOvertimeCount}
                className="input input-bordered input-xs w-full flex-1 text-center"
              />
              <button className="w-[50px] font-semibold" onClick={incrementMasonOvertime}>
                +
              </button>
            </div>
            <div className="w-[120px]">
              <input
                type="number"
                readOnly
                value={totalMasonOvertimeRate}
                className="input input-bordered input-xs w-full text-center  font-medium"
              />
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center my-6">
            <div className="font-semibold">Helper</div>
            <div>{instantServiceData.overtime_helper_rate || 150}/hrs</div>
            <div className="flex items-center w-[180px]">
              <button className="w-[50px] font-semibold" onClick={decrementHelperOvertime}>
                -
              </button>
              <input
                type="number"
                value={helperOvertimeCount}
                className="input input-bordered input-xs w-full flex-1 text-center"
              />
              <button className="w-[50px] font-semibold" onClick={incrementHelperOvertime}>
                +
              </button>
            </div>
            <div className="w-[120px]">
              <input
                type="number"
                value={totalHelperOvertimeRate}
                readOnly
                className="input input-bordered input-xs w-full text-center font-medium"
              />
            </div>
          </div>
        </div>
      </div>

      {/* HOURS RATE */}
      <input
        checked={mode === "hour"}
        type="radio"
        onChange={() => setMode("hour")}
        name="my_tabs_2"
        role="tab"
        className="tab font-semibold"
        aria-label="Hours basis"
      />
      <div role="tabpanel" className="tab-content bg-base-100 border-base-300 rounded-box p-6">
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center my-6">
          <div className="font-semibold">Mason</div>
          <div>{instantServiceData.per_hour_meason_rate || 200}/hour</div>
          <div className="flex items-center w-[180px]">
            <button className="w-[50px] font-semibold" onClick={decrementMasonHour}>
              -
            </button>
            <input
              type="number"
              value={MasonHourCount}
              className="input input-bordered input-xs w-full flex-1 text-center"
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
              className="input input-bordered input-xs w-full text-center  font-medium"
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center my-6">
          <div className="font-semibold">Helper</div>
          <div>{instantServiceData.per_hour_helper_rate || 150}/hour</div>
          <div className="flex items-center w-[180px]">
            <button className="w-[50px] font-semibold" onClick={decrementHelperHour}>
              -
            </button>
            <input
              type="number"
              value={helperHourCount}
              className="input input-bordered input-xs w-full flex-1 text-center"
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
              className="input input-bordered input-xs w-full text-center  font-medium"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstantServicesTab;
