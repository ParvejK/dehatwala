import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import { useBookingStore } from "../../store/booking-store";
import axios from "axios";
import { API_URL } from "../../react-query/constants";
import { useState } from "react";

const LogoutButton = () => {
  const navigate = useNavigate();
  const clearUserData = useAuthStore((state) => state.clearUserData);
  const resetBooking = useBookingStore((state) => state.resetBooking);
  const [isLoading, setIsLoading] = useState(false);
  const { token } = useAuthStore();

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await axios.post(
        `${API_URL}/logout`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      // A failed call must not strand the user in a signed-in state, so the
      // local session is cleared either way.
      console.error("Logout failed:", error);
    } finally {
      clearUserData();
      localStorage.removeItem("auth-storage");
      // The persisted booking carries the previous customer's saved address id;
      // leaving it behind would attach it to whoever signs in next.
      resetBooking();

      navigate("/sign-in");
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus-visible:ring-4 focus-visible:ring-red-100 disabled:cursor-not-allowed disabled:text-slate-400"
    >
      <LogOut size={17} aria-hidden="true" />
      {isLoading ? "Logging out…" : "Logout"}
    </button>
  );
};

export default LogoutButton;
