import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Building2, CreditCard, Lock, Smartphone, Wallet } from "lucide-react";

import Modal from "./modal";
import { API_URL, RAZORPAY_KEY_ID } from "../../react-query/constants";
import { useAuthStore } from "../../store/auth-store";
import { useVerifyPayment } from "../../react-query/auth-booked-service-api";
import { BookedService } from "../../react-query/booking-type";

const formatAmount = (value: number) => `₹${new Intl.NumberFormat("en-IN").format(Math.round(value || 0))}`;

/**
 * Razorpay groups its methods under these keys; picking one just preselects the
 * matching block in the checkout rather than bypassing it.
 */
const METHODS = [
  { key: "upi", label: "UPI", hint: "GPay · PhonePe · Paytm", icon: Smartphone },
  { key: "card", label: "Debit / Credit Card", hint: "Visa, Mastercard, RuPay", icon: CreditCard },
  { key: "netbanking", label: "Net Banking", hint: "All major banks", icon: Building2 },
  { key: "wallet", label: "Wallets", hint: "Paytm, Freecharge & more", icon: Wallet },
] as const;

const Row = ({ label, value, strong }: { label: string; value: string; strong?: boolean }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-[11px] font-semibold text-[#63739a]">{label}</span>
    <span className={`text-[12px] ${strong ? "font-extrabold text-[#0b3fc4]" : "font-bold text-[#0f1e57]"}`}>
      {value}
    </span>
  </div>
);

const PaymentModal = ({
  booking,
  onClose,
  onPaid,
}: {
  booking: BookedService;
  onClose: () => void;
  onPaid: () => void;
}) => {
  const { user, token } = useAuthStore();
  const verifyPayment = useVerifyPayment(token ?? "");
  const [method, setMethod] = useState<(typeof METHODS)[number]["key"]>("upi");
  const [isPaying, setIsPaying] = useState(false);

  // From the API's billing block, not from `transaction_id` — that holds a
  // single reference, so a booking paid in two parts would read as unpaid.
  const total = booking.billing?.total_amount ?? Number(booking.total_amount || 0);
  const paid = booking.billing?.amount_paid ?? (booking.transaction_id ? total : 0);
  const due = booking.billing?.amount_due ?? total - paid;

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  const readError = (error: unknown, fallback: string) => {
    if (!axios.isAxiosError(error)) return (error as Error)?.message || fallback;

    const data = error.response?.data as { message?: string; errors?: Record<string, string[]> } | undefined;
    return (data?.errors ? Object.values(data.errors)[0]?.[0] : undefined) ?? data?.message ?? fallback;
  };

  /**
   * Same three-step flow as checkout: the server opens the order for the
   * booking's own recorded amount, then verifies the signature before marking
   * it paid. The `due` figure below is display only.
   */
  const pay = async () => {
    if (!window.Razorpay) {
      toast.error("Payment gateway failed to load. Please refresh and try again.");
      return;
    }

    setIsPaying(true);

    let order;
    try {
      const { data } = await axios.post(
        `${API_URL}/payment/create-order`,
        // No amount sent: the server charges the full outstanding balance,
        // so the figure is never taken from the browser.
        { booking_id: booking.id },
        authHeaders
      );

      if (!data?.success || !data?.order_id) throw new Error(data?.message || "Could not start payment");
      order = data;
    } catch (error) {
      console.error("Could not start payment:", error);
      toast.error(readError(error, "Could not start payment."));
      setIsPaying(false);
      return;
    }

    const razorpay = new window.Razorpay({
      key: order.key || RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency || "INR",
      order_id: order.order_id,
      name: "Dehatwala",
      description: `${booking.service_title} · DW-${booking.id}`,
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          // Goes through the mutation so the bookings list is refreshed as soon
          // as the server confirms; the modal closing is not enough on its own.
          const data = await verifyPayment.mutateAsync({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (!data?.success) throw new Error(data?.message || "Payment verification failed");

          toast.success("Payment successful.");
          onPaid();
        } catch (error) {
          console.error("Payment verification failed:", error);
          toast.error(readError(error, "Payment verification failed."));
        } finally {
          setIsPaying(false);
        }
      },
      modal: { ondismiss: () => setIsPaying(false) },
      prefill: { name: user?.name ?? "", contact: user?.mobile_no ?? "" },
      theme: { color: "#0b3fc4" },
    });

    razorpay.open();
  };

  return (
    <Modal
      title="Payment"
      subtitle={`DW-${booking.id} · ${booking.service_title}`}
      onClose={onClose}
      footer={
        <button
          type="button"
          onClick={pay}
          disabled={isPaying || due <= 0}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Lock size={13} aria-hidden="true" />
          {isPaying ? "Processing…" : `Pay ${formatAmount(due)}`}
        </button>
      }
    >
      <div className="divide-y divide-[#eef2f9] rounded-xl border border-[#eef2f9] px-3">
        <Row label="Total Amount" value={formatAmount(total)} />
        <Row label="Paid Amount" value={formatAmount(paid)} />
        <Row label="Pending Amount" value={formatAmount(due)} strong />
      </div>

      <fieldset className="mt-4">
        <legend className="text-[11px] font-extrabold text-[#0f1e57]">Select Payment Method</legend>

        <div className="mt-2 space-y-2">
          {METHODS.map(({ key, label, hint, icon: Icon }) => (
            <label
              key={key}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3.5 py-3 transition ${
                method === key ? "border-[#0b3fc4] bg-[#f1f6ff]" : "border-[#dce7fb] bg-white hover:bg-[#f8fbff]"
              }`}
            >
              <input
                type="radio"
                name="payment-method"
                value={key}
                checked={method === key}
                onChange={() => setMethod(key)}
                className="size-4 accent-[#0b3fc4]"
              />
              <Icon size={17} className="shrink-0 text-[#0b3fc4]" aria-hidden="true" />
              <span className="min-w-0">
                <span className="block text-[12px] font-extrabold text-[#0f1e57]">{label}</span>
                <span className="block text-[10px] font-semibold text-[#8fa2c8]">{hint}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-[#8fa2c8]">
        <Lock size={11} aria-hidden="true" /> Secured by Razorpay · your card details never reach our servers
      </p>
    </Modal>
  );
};

export default PaymentModal;
