import { BadgeCheck, Bell, ChevronRight, Pencil, Smartphone, Trash2, UserRound } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { ChangeMobileModal, DeleteAccountModal, EditProfileModal } from "../../components/dashboard/account-modals";
import { formatMobile } from "../../components/dashboard/nav";
import ProfilePhoto from "../../components/dashboard/profile-photo";
import SectionHeader from "../../components/dashboard/section-header";
import {
  accountErrorMessage,
  NotificationKey,
  useNotificationPrefs,
  useUpdateNotifications,
} from "../../react-query/account-api";
import { useAuthStore } from "../../store/auth-store";

const APP_VERSION = "1.0.0";

/** Keys are the API's column names — no translation layer to drift out of step. */
const NOTIFICATIONS = [
  {
    key: "notify_booking_updates",
    title: "Booking Updates",
    copy: "Get notified about your booking status and workers.",
  },
  { key: "notify_payment_reminders", title: "Payment Reminders", copy: "Get reminders for pending payments." },
  {
    key: "notify_offers",
    title: "Offers & Updates",
    copy: "Receive offers, tips and important updates from Dehatwala.",
  },
] as const;

const Row = ({
  step,
  icon: Icon,
  title,
  action,
  children,
}: {
  step: number;
  icon: typeof UserRound;
  title: string;
  /** Corner control — a button, or a chevron for a whole-row action. */
  action?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="rounded-2xl border border-[#dce7fb] bg-white p-4 sm:p-5">
    <div className="flex items-center gap-3">
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-[#0b3fc4] text-[11px] font-extrabold text-white">
        {step}
      </span>
      <Icon size={17} className="shrink-0 text-[#0b3fc4]" aria-hidden="true" />
      <h2 className="text-[13px] font-extrabold text-[#0f1e57]">{title}</h2>
      {action && <div className="ml-auto shrink-0">{action}</div>}
    </div>
    <div className="mt-4">{children}</div>
  </section>
);

const DashboardSettings = () => {
  const { user, token } = useAuthStore();
  const { data: preferences, isLoading: isLoadingPrefs } = useNotificationPrefs(token ?? "");
  const updateNotifications = useUpdateNotifications(token ?? "");

  const [openDialog, setOpenDialog] = useState<"profile" | "mobile" | "delete" | null>(null);
  const close = () => setOpenDialog(null);

  const toggle = (key: NotificationKey) => {
    if (!preferences) return;

    updateNotifications.mutate(
      { [key]: !preferences[key] },
      {
        onError: (error) => toast.error(accountErrorMessage(error, "We could not save that. Please try again.")),
      },
    );
  };

  return (
    <div className="space-y-5">
      <SectionHeader
        title="Account Settings"
        description="Manage your personal details, notifications and account preferences.
"
      />

      {openDialog === "profile" && <EditProfileModal onClose={close} />}
      {openDialog === "mobile" && <ChangeMobileModal onClose={close} />}
      {openDialog === "delete" && <DeleteAccountModal onClose={close} />}

      <Row
        step={1}
        icon={UserRound}
        title="Personal Information"
        action={
          <button
            type="button"
            onClick={() => setOpenDialog("profile")}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-[#cfe0fb] bg-white px-3.5 text-[11px] font-extrabold text-[#0b3fc4] transition hover:bg-[#eef4ff]"
          >
            <Pencil size={12} aria-hidden="true" /> Edit Profile
          </button>
        }
      >
        <ProfilePhoto />

        <dl className="mt-5 grid gap-4 border-t border-[#eef2f9] pt-5 sm:grid-cols-2">
          <div>
            <dt className="text-[11px] font-semibold text-[#63739a]">Name</dt>
            <dd className="mt-0.5 text-[13px] font-extrabold text-[#0f1e57]">{user?.name || "—"}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-semibold text-[#63739a]">Mobile Number</dt>
            <dd className="mt-0.5 flex flex-wrap items-center gap-2 text-[13px] font-extrabold text-[#0f1e57]">
              {formatMobile(user?.mobile_no)}
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-extrabold text-emerald-700">
                <BadgeCheck size={11} aria-hidden="true" /> Verified
              </span>
            </dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="text-[11px] font-semibold text-[#63739a]">
              Email Address <span className="font-normal">(Optional)</span>
            </dt>
            <dd className="mt-0.5 text-[13px] font-extrabold text-[#0f1e57]">{user?.email || "Not added"}</dd>
          </div>
        </dl>
      </Row>

      <Row
        step={2}
        icon={Smartphone}
        title="Change Mobile Number"
        action={
          <button
            type="button"
            onClick={() => setOpenDialog("mobile")}
            aria-label="Change mobile number"
            className="grid size-8 place-items-center rounded-lg text-[#63739a] transition hover:bg-[#f1f6ff] hover:text-[#0b3fc4]"
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        }
      >
        <p className="text-[11px] leading-5 text-[#63739a]">
          Your mobile number is your login. Changing it needs a fresh OTP verification.
        </p>
      </Row>

      <Row step={3} icon={Bell} title="Notifications">
        <ul className="space-y-3">
          {NOTIFICATIONS.map(({ key, title, copy }) => (
            <li key={key} className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[12px] font-extrabold text-[#0f1e57]">{title}</p>
                <p className="mt-0.5 text-[11px] leading-5 text-[#63739a]">{copy}</p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={!!preferences?.[key]}
                aria-label={title}
                onClick={() => toggle(key)}
                disabled={isLoadingPrefs || !preferences}
                className={`relative h-6 w-11 shrink-0 rounded-full transition focus:outline-none focus-visible:ring-4 focus-visible:ring-blue-100 disabled:opacity-50 ${
                  preferences?.[key] ? "bg-[#0b3fc4]" : "bg-[#cdd8ee]"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute top-0.5 size-5 rounded-full bg-white shadow transition-all ${
                    preferences?.[key] ? "left-[1.375rem]" : "left-0.5"
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[10px] leading-4 text-[#8fa2c8]">
          {isLoadingPrefs ? "Loading your preferences…" : "Saved to your account."}
        </p>
      </Row>

      <Row
        step={4}
        icon={Trash2}
        title="Delete Account"
        action={
          <button
            type="button"
            onClick={() => setOpenDialog("delete")}
            aria-label="Delete account"
            className="grid size-8 place-items-center rounded-lg text-[#63739a] transition hover:bg-red-50 hover:text-red-600"
          >
            <ChevronRight size={17} aria-hidden="true" />
          </button>
        }
      >
        <p className="text-[11px] leading-5 text-[#63739a]">
          Once you delete your account, all your data will be permanently removed. This cannot be undone.
        </p>
      </Row>

      <p className="text-center text-[11px] text-[#8fa2c8]">
        Dehatwala v{APP_VERSION} &middot;{" "}
        <Link to="/privacy-policy" className="font-bold text-[#0b3fc4] hover:underline">
          Privacy Policy
        </Link>{" "}
        &middot;{" "}
        <Link to="/terms-and-conditions" className="font-bold text-[#0b3fc4] hover:underline">
          Terms &amp; Conditions
        </Link>
      </p>
    </div>
  );
};

export default DashboardSettings;
