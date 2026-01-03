import { IndianRupee } from "lucide-react";
import { useDayRateStore } from "../../store/day-service-store";
import { useHourRateStore } from "../../store/hour-service-store";
import { useSearchParams } from "react-router-dom";

interface CouponProps {
  couponDayPrice?: number;
  couponHourPrice?: number;
  couponDiscountedAmount?: number;
  isCOD?: boolean;
  codChargeAmount?: number;
}

const CartPrices = ({
  couponDayPrice,
  couponHourPrice,
  couponDiscountedAmount,
  isCOD,
  codChargeAmount,
}: CouponProps) => {
  const {
    totalMasonDayRate,
    totalHelperDayRate,
    totalMasonOvertimeRate,
    totalHelperOvertimeRate,
    totalDayPrice,
    MasonDayCount,
    helperDayCount,
  } = useDayRateStore();
  const { totalHelperHourRate, totalHourPrice, totalMasonHourRate, MasonHourCount, helperHourCount } =
    useHourRateStore();

  const [searchParams] = useSearchParams();
  const day = searchParams.get("service");

  // Get tip price from local storage
  const dayRateStoreData = JSON.parse(localStorage.getItem("day-rate-store") || "{}");
  const hourRateStoreData = JSON.parse(localStorage.getItem("hour-rate-store") || "{}");

  const tip = day === "day" ? dayRateStoreData?.state?.tipValue ?? 0 : hourRateStoreData?.state?.tipValue ?? 0;

  return (
    <div>
      <h3 className="font-semibold">Billing Overview</h3>
      {day === "day" ? (
        <div className="text-right divide-y">
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Mason
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">Quantity({`${MasonDayCount}`})</p>
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {totalMasonDayRate}
              </strong>
            </div>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Helper
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">Quantity({`${helperDayCount}`})</p>
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {totalHelperDayRate}
              </strong>
            </div>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Mason Overtime
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> {totalMasonOvertimeRate}
            </strong>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Helper Overtime
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> {totalHelperOvertimeRate}
            </strong>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Pick & drop services free
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> <s>500</s>
            </strong>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Tip:
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> {tip}
            </strong>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Platform fee
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> <s>20</s>
            </strong>
          </p>
          {isCOD && (
            <p className="flex justify-between items-center text-base gap-4 py-4">
              Offline service charge
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {codChargeAmount.toFixed(2)}
              </strong>
            </p>
          )}
          {couponDiscountedAmount > 0 && (
            <p className="flex justify-between items-center text-base gap-4 py-4">
              Coupon Discount:
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {couponDiscountedAmount}
              </strong>
            </p>
          )}

          <p className="flex justify-between items-center text-base font-medium gap-4 py-6">
            Total:
            <strong className="flex items-center gap-1 text-sm">
              <IndianRupee size={14} /> {totalDayPrice}
            </strong>
          </p>

          {couponDayPrice > 0 && (
            <p className="flex justify-between items-center text-base font-medium gap-4 py-6">
              Grand Total:
              <strong className="flex items-center gap-1 text-primary">
                <IndianRupee size={14} /> {couponDayPrice.toFixed(2)}
              </strong>
            </p>
          )}
        </div>
      ) : (
        <div className="text-right divide-y">
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Mason
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">Quantity({`${MasonHourCount}`})</p>
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {totalMasonHourRate}
              </strong>
            </div>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Helper
            <div className="flex items-center gap-4">
              <p className="text-sm text-gray-700">Quantity({`${helperHourCount}`})</p>
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {totalHelperHourRate}
              </strong>
            </div>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Pick & drop services free
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> <s>500</s>
            </strong>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Tip
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> {tip}
            </strong>
          </p>
          <p className="flex justify-between items-center text-base gap-4 py-4">
            Platform fee
            <strong className="flex items-center gap-1">
              <IndianRupee size={14} /> <s>20</s>
            </strong>
          </p>
          {isCOD && (
            <p className="flex justify-between items-center text-base gap-4 py-4">
              Offline service charge
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {codChargeAmount.toFixed(2)}
              </strong>
            </p>
          )}
          {couponDiscountedAmount > 0 && (
            <p className="flex justify-between items-center text-base gap-4 py-4">
              Coupon Discount:
              <strong className="flex items-center gap-1">
                <IndianRupee size={14} /> {couponDiscountedAmount}
              </strong>
            </p>
          )}
          <p className="flex justify-between items-center text-base font-medium gap-4 py-6">
            Total
            <strong className="flex items-center gap-1 text-sm">
              <IndianRupee size={14} /> {totalHourPrice}
            </strong>
          </p>
          {couponHourPrice > 0 && (
            <p className="flex justify-between items-center text-base font-medium gap-4 py-6">
              Grand Total:
              <strong className="flex items-center gap-1 text-primary">
                <IndianRupee size={14} /> {couponHourPrice.toFixed(2)}
              </strong>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CartPrices;
