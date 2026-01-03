import { useDayRateStore } from "../../../store/day-service-store";
import { InstantService } from "../../../types";
import { useState, useEffect } from "react";

const DayService = () => {
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
  } = useDayRateStore();

  const [instantService, setInstantService] = useState<InstantService | null>(null);

  useEffect(() => {
    const prices = localStorage.getItem("day-prices");
    if (prices) {
      setInstantService(JSON.parse(prices));
    }
  }, []);

  // Show a message if no data is found in local storage
  if (!instantService) {
    return (
      <div className="mt-8 border p-4 rounded-md text-center">
        <p className="text-red-500 font-semibold">No pricing data available. Please set pricing data first.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 border p-4 rounded-md">
      {/* Mason Section */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center my-6">
        <div className="font-semibold">Mason</div>
        <div>{instantService.per_day_meason_rate || 800}/day</div>
        <div className="flex items-center w-[180px]">
          <button className="w-[50px] font-semibold" onClick={decrementMasonDay}>
            -
          </button>
          <input
            type="number"
            value={MasonDayCount}
            className="input input-bordered input-xs w-full flex-1 text-center"
            readOnly
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
            className="input input-bordered input-xs w-full text-center font-medium"
          />
        </div>
      </div>

      {/* Helper Section */}
      <div className="flex flex-col md:flex-row gap-2 justify-between items-center my-6">
        <div className="font-semibold">Helper</div>
        <div>{instantService.per_day_helper_rate || 600}/day</div>
        <div className="flex items-center w-[180px]">
          <button className="w-[50px] font-semibold" onClick={decrementHelperDay}>
            -
          </button>
          <input
            type="number"
            value={helperDayCount}
            className="input input-bordered input-xs w-full flex-1 text-center"
            readOnly
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
            className="input input-bordered input-xs w-full text-center font-medium"
          />
        </div>
      </div>

      {/* Overtime Section */}
      <hr className="my-10" />
      <div>
        <h3 className="text-sm md:font-base font-semibold">Over Time</h3>
        <p className="text-sm md:text-base">After 5 PM, overtime charges will apply per hour.</p>

        {/* Mason Overtime */}
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center my-6">
          <div className="font-semibold">Mason</div>
          <div>{instantService.overtime_meason_rate || 200}/hour</div>
          <div className="flex items-center w-[180px]">
            <button className="w-[50px] font-semibold" onClick={decrementMasonOvertime}>
              -
            </button>
            <input
              type="number"
              value={MasonOvertimeCount}
              className="input input-bordered input-xs w-full flex-1 text-center"
              readOnly
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
              className="input input-bordered input-xs w-full text-center font-medium"
            />
          </div>
        </div>

        {/* Helper Overtime */}
        <div className="flex flex-col md:flex-row gap-2 justify-between items-center my-6">
          <div className="font-semibold">Helper</div>
          <div>{instantService.overtime_helper_rate || 150}/hour</div>
          <div className="flex items-center w-[180px]">
            <button className="w-[50px] font-semibold" onClick={decrementHelperOvertime}>
              -
            </button>
            <input
              type="number"
              value={helperOvertimeCount}
              className="input input-bordered input-xs w-full flex-1 text-center"
              readOnly
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
  );
};

export default DayService;

//OLD CODE
// import { useDayRateStore } from "../../../store/day-service-store";
// import { InstantService } from "../../../types";

// const DayService = () => {
//   const {
//     MasonDayCount,
//     helperDayCount,
//     totalMasonDayRate,
//     incrementMasonDay,
//     decrementMasonDay,
//     totalHelperDayRate,
//     incrementHelperDay,
//     decrementHelperDay,
//     MasonOvertimeCount,
//     helperOvertimeCount,
//     totalMasonOvertimeRate,
//     totalHelperOvertimeRate,
//     incrementMasonOvertime,
//     decrementMasonOvertime,
//     incrementHelperOvertime,
//     decrementHelperOvertime,
//   } = useDayRateStore();

//   const prices = localStorage.getItem("day-prices");
//   let instantService: InstantService;
//   if (prices) {
//     instantService = JSON.parse(prices);
//   }

//   return (
//     <div className="mt-8 border p-4 rounded-md">
//       <div className="flex justify-between items-center my-6">
//         <div className="font-semibold">Mason</div>
//         <div>{instantService.per_day_meason_rate || 800}/day</div>
//         <div className="flex items-center w-[180px]">
//           <button className="w-[50px] font-semibold" onClick={decrementMasonDay}>
//             -
//           </button>
//           <input
//             type="number"
//             value={MasonDayCount}
//             className="input input-bordered input-xs w-full flex-1 text-center"
//           />
//           <button className="w-[50px] font-semibold" onClick={incrementMasonDay}>
//             +
//           </button>
//         </div>
//         <div className="w-[120px]">
//           <input
//             type="number"
//             readOnly
//             value={totalMasonDayRate}
//             className="input input-bordered input-xs w-full text-center  font-medium"
//           />
//         </div>
//       </div>
//       <div className="flex justify-between items-center my-6">
//         <div className="font-semibold">Helper</div>
//         <div>{instantService.per_day_helper_rate || 600}/day</div>
//         <div className="flex items-center w-[180px]">
//           <button className="w-[50px] font-semibold" onClick={decrementHelperDay}>
//             -
//           </button>
//           <input
//             type="number"
//             value={helperDayCount}
//             className="input input-bordered input-xs w-full flex-1 text-center"
//           />
//           <button className="w-[50px] font-semibold" onClick={incrementHelperDay}>
//             +
//           </button>
//         </div>
//         <div className="w-[120px]">
//           <input
//             type="number"
//             value={totalHelperDayRate}
//             readOnly
//             className="input input-bordered input-xs w-full text-center  font-medium"
//           />
//         </div>
//       </div>
//       <div>
//         <hr className="my-10" />
//         <div>
//           <h3 className="font-semibold">Over Time</h3>
//           <p>After 5 pm if you want these messo helpers to work overtime then then per hours rs will e chared.</p>
//         </div>
//         <div className="flex justify-between items-center my-6">
//           <div className="font-semibold">Mason</div>
//           <div>{instantService.overtime_meason_rate || 200}/day</div>
//           <div className="flex items-center w-[180px]">
//             <button className="w-[50px] font-semibold" onClick={decrementMasonOvertime}>
//               -
//             </button>
//             <input
//               type="number"
//               value={MasonOvertimeCount}
//               className="input input-bordered input-xs w-full flex-1 text-center"
//             />
//             <button className="w-[50px] font-semibold" onClick={incrementMasonOvertime}>
//               +
//             </button>
//           </div>
//           <div className="w-[120px]">
//             <input
//               type="number"
//               readOnly
//               value={totalMasonOvertimeRate}
//               className="input input-bordered input-xs w-full text-center  font-medium"
//             />
//           </div>
//         </div>
//         <div className="flex justify-between items-center my-6">
//           <div className="font-semibold">Helper</div>
//           <div>{instantService.overtime_helper_rate || 150}/day</div>
//           <div className="flex items-center w-[180px]">
//             <button className="w-[50px] font-semibold" onClick={decrementHelperOvertime}>
//               -
//             </button>
//             <input
//               type="number"
//               value={helperOvertimeCount}
//               className="input input-bordered input-xs w-full flex-1 text-center"
//             />
//             <button className="w-[50px] font-semibold" onClick={incrementHelperOvertime}>
//               +
//             </button>
//           </div>
//           <div className="w-[120px]">
//             <input
//               type="number"
//               value={totalHelperOvertimeRate}
//               readOnly
//               className="input input-bordered input-xs w-full text-center font-medium"
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DayService;
