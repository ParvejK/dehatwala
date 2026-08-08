import { useState } from "react";
import toast from "react-hot-toast";
import { AlertTriangle, ShieldCheck } from "lucide-react";

import Modal from "./modal";
import { useAuthStore } from "../../store/auth-store";
import {
  accountErrorMessage,
  useChangeMobile,
  useDeleteAccount,
  useRequestMobileOtp,
  useUpdateProfile,
} from "../../react-query/account-api";

const inputClass =
  "mt-1.5 min-h-11 w-full rounded-xl border border-[#d8e4f8] bg-white px-4 text-[12px] font-medium text-[#0f1e57] outline-none transition placeholder:font-normal placeholder:text-[#9badd0] focus:border-[#0b3fc4] focus:ring-4 focus:ring-blue-100";

const labelClass = "block text-[11px] font-extrabold text-[#0f1e57]";

const ErrorLine = ({ message }: { message: string }) =>
  message ? (
    <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[11px] font-bold text-red-700">
      {message}
    </p>
  ) : null;

/** Name and optional email. The mobile number has its own flow. */
export const EditProfileModal = ({ onClose }: { onClose: () => void }) => {
  const { user, token, setUserData } = useAuthStore();
  const updateProfile = useUpdateProfile(token ?? "");

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [error, setError] = useState("");

  const submit = async () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setError("");

    try {
      const data = await updateProfile.mutateAsync({ name: name.trim(), email: email.trim() });
      // Keep the header, sidebar and this page in step without a reload.
      setUserData({ ...user, ...data.user }, token ?? "");
      toast.success("Profile updated.");
      onClose();
    } catch (submitError) {
      setError(accountErrorMessage(submitError, "We could not update your profile."));
    }
  };

  return (
    <Modal
      title="Edit Profile"
      onClose={onClose}
      footer={
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={updateProfile.isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-4 text-[12px] font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff] disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={updateProfile.isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateProfile.isPending ? "Saving…" : "Save Changes"}
          </button>
        </div>
      }
    >
      <label htmlFor="profile-name" className={labelClass}>
        Name
      </label>
      <input
        id="profile-name"
        value={name}
        maxLength={255}
        onChange={(event) => {
          setName(event.target.value);
          setError("");
        }}
        placeholder="Your full name"
        className={inputClass}
      />

      <label htmlFor="profile-email" className={`${labelClass} mt-3`}>
        Email Address <span className="font-semibold text-[#8fa2c8]">(Optional)</span>
      </label>
      <input
        id="profile-email"
        type="email"
        value={email}
        maxLength={255}
        onChange={(event) => {
          setEmail(event.target.value);
          setError("");
        }}
        placeholder="you@example.com"
        className={inputClass}
      />

      <p className="mt-3 text-[11px] leading-5 text-[#8fa2c8]">
        Your mobile number is your login and is changed separately.
      </p>

      <ErrorLine message={error} />
    </Modal>
  );
};

/** Two steps: send a code to the new number, then confirm it. */
export const ChangeMobileModal = ({ onClose }: { onClose: () => void }) => {
  const { user, token, setUserData } = useAuthStore();
  const requestOtp = useRequestMobileOtp(token ?? "");
  const changeMobile = useChangeMobile(token ?? "");

  const [step, setStep] = useState<"number" | "otp">("number");
  const [mobileNo, setMobileNo] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async () => {
    if (!/^\d{10}$/.test(mobileNo)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }

    setError("");

    try {
      const data = await requestOtp.mutateAsync(mobileNo);
      setStep("otp");
      // Dev only: no SMS gateway is wired, so the code comes back in the body.
      toast.success(data.otp ? `OTP sent: ${data.otp}` : "OTP sent.");
    } catch (requestError) {
      setError(accountErrorMessage(requestError, "We could not send the OTP."));
    }
  };

  const confirm = async () => {
    if (!otp.trim()) {
      setError("Enter the OTP.");
      return;
    }

    setError("");

    try {
      const data = await changeMobile.mutateAsync({ mobileNo, otp: otp.trim() });
      setUserData({ ...user, ...data.user }, token ?? "");
      toast.success("Mobile number updated.");
      onClose();
    } catch (confirmError) {
      setError(accountErrorMessage(confirmError, "We could not change your mobile number."));
    }
  };

  const isBusy = requestOtp.isPending || changeMobile.isPending;

  return (
    <Modal
      title="Change Mobile Number"
      subtitle={step === "otp" ? `Code sent to +91 ${mobileNo}` : undefined}
      onClose={onClose}
      footer={
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={step === "otp" ? () => setStep("number") : onClose}
            disabled={isBusy}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-4 text-[12px] font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff] disabled:opacity-60"
          >
            {step === "otp" ? "Back" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={step === "otp" ? confirm : sendOtp}
            disabled={isBusy}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-[#0b3fc4] px-4 text-[12px] font-extrabold text-white transition hover:bg-[#0932a0] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isBusy ? "Please wait…" : step === "otp" ? "Confirm Change" : "Send OTP"}
          </button>
        </div>
      }
    >
      <p className="flex items-start gap-2 rounded-xl bg-[#f8fbff] px-3.5 py-2.5 text-[11px] leading-5 text-[#63739a]">
        <ShieldCheck size={14} className="mt-px shrink-0 text-[#0b3fc4]" aria-hidden="true" />
        Current number: <strong className="font-extrabold text-[#0f1e57]">+91 {user?.mobile_no}</strong>
      </p>

      {step === "number" ? (
        <>
          <label htmlFor="new-mobile" className={`${labelClass} mt-4`}>
            New mobile number
          </label>
          <input
            id="new-mobile"
            inputMode="numeric"
            maxLength={10}
            value={mobileNo}
            onChange={(event) => {
              setMobileNo(event.target.value.replace(/\D/g, ""));
              setError("");
            }}
            placeholder="10-digit number"
            className={inputClass}
          />
        </>
      ) : (
        <>
          <label htmlFor="mobile-otp" className={`${labelClass} mt-4`}>
            Enter OTP
          </label>
          <input
            id="mobile-otp"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(event) => {
              setOtp(event.target.value.replace(/\D/g, ""));
              setError("");
            }}
            placeholder="6-digit code"
            className={`${inputClass} tracking-[0.4em]`}
          />
          <button
            type="button"
            onClick={sendOtp}
            disabled={isBusy}
            className="mt-2 text-[11px] font-extrabold text-[#0b3fc4] hover:underline disabled:opacity-60"
          >
            Resend OTP
          </button>
        </>
      )}

      <ErrorLine message={error} />
    </Modal>
  );
};

/** Closing the account. Typed confirmation, because it cannot be undone. */
export const DeleteAccountModal = ({ onClose }: { onClose: () => void }) => {
  const { token, clearUserData } = useAuthStore();
  const deleteAccount = useDeleteAccount(token ?? "");

  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");

  const submit = async () => {
    setError("");

    try {
      await deleteAccount.mutateAsync();
      clearUserData();
      localStorage.removeItem("auth-storage");
      toast.success("Your account has been closed.");
      // Full reload rather than a route change, so no cached query outlives it.
      window.location.href = "/";
    } catch (submitError) {
      // The API refuses while bookings are active or money is owed, and says why.
      setError(accountErrorMessage(submitError, "We could not close your account."));
    }
  };

  return (
    <Modal
      title="Delete Account"
      onClose={onClose}
      footer={
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={deleteAccount.isPending}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg border border-[#dce7fb] bg-white px-4 text-[12px] font-extrabold text-[#40517b] transition hover:bg-[#f1f6ff] disabled:opacity-60"
          >
            Keep my account
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={deleteAccount.isPending || confirmText.trim().toUpperCase() !== "DELETE"}
            className="inline-flex min-h-11 flex-1 items-center justify-center rounded-lg bg-red-600 px-4 text-[12px] font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleteAccount.isPending ? "Closing…" : "Delete Account"}
          </button>
        </div>
      }
    >
      <span className="mx-auto grid size-12 place-items-center rounded-full bg-red-50 text-red-600">
        <AlertTriangle size={22} aria-hidden="true" />
      </span>

      <p className="mt-4 text-center text-[12px] leading-6 text-[#63739a]">
        This permanently closes your account and signs you out everywhere. Your past bookings are kept for our records,
        but you will not be able to sign in again.
      </p>

      <label htmlFor="delete-confirm" className={`${labelClass} mt-4`}>
        Type <span className="text-red-600">DELETE</span> to confirm
      </label>
      <input
        id="delete-confirm"
        value={confirmText}
        onChange={(event) => {
          setConfirmText(event.target.value);
          setError("");
        }}
        placeholder="DELETE"
        className={inputClass}
      />

      <ErrorLine message={error} />
    </Modal>
  );
};
