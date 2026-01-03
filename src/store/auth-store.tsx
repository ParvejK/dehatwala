import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: number;
  name: string;
  email: string | null;
  mobile_no: string;
  is_type: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUserData: (user: User, token: string) => void;
  clearUserData: () => void; // Optional: For logout functionality
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUserData: (user, token) => set({ user, token }),
      clearUserData: () => set({ user: null, token: null }),
    }),
    {
      name: "auth-storage", // Name of the key in localStorage
      partialize: (state) => ({ user: state.user, token: state.token }), // Persist only user and token
    }
  )
);
