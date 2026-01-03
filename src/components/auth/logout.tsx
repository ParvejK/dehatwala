import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/auth-store";
import axios from "axios";
import { API_URL } from "../../react-query/constants";
import { useState } from "react";

const LogoutButton = () => {
  const navigate = useNavigate();
  const clearUserData = useAuthStore((state) => state.clearUserData);
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
      clearUserData();
      localStorage.removeItem("auth-storage");

      navigate("/sign-in");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`px-4 py-2 text-center text-white rounded-md focus:outline-none focus:ring-2 ${
        isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600 focus:ring-red-300"
      }`}
    >
      {isLoading ? "Logging out..." : "Logout"}
    </button>
  );
};

export default LogoutButton;
