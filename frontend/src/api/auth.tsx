/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { persist, PersistStorage } from "zustand/middleware";

interface AuthState {
    role: string | null;
    setRole: (role: string | null) => void;
    clearRole: () => void;
}

const sessionStorageHandler: PersistStorage<any> = {
    getItem: (key) => {
        const storedValue = sessionStorage.getItem(key);
        return storedValue ? JSON.parse(storedValue) : null;
    },
    setItem: (key, value) => {
        sessionStorage.setItem(key, JSON.stringify(value));
    },
    removeItem: (key) => {
        sessionStorage.removeItem(key);
    },
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            role: null,
            setRole: (role: string | null) => set({ role }),
            clearRole: () => set({ role: null }),
        }),
        {
            name: "auth-storage", // Stores in localStorage (default)
            storage: sessionStorageHandler
        }
    )
);
