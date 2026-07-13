"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState, createContext, useContext } from "react";
import { useAuthStore } from "@/lib/stores/auth-store";

type Theme = "light" | "dark";

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      })
  );

  // Force light mode on load
  useEffect(() => {
    document.documentElement.classList.remove("dark");
  }, []);

  const setTheme = (newTheme: Theme) => {
    // No-op, always light
  };

  const toggleTheme = () => {
    // No-op, always light
  };

  // Always re-validate session on app load to sync Zustand with Supabase cookies
  useEffect(() => {
    const { fetchCurrentUser } = useAuthStore.getState();
    fetchCurrentUser();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme: "light", toggleTheme, setTheme }}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </ThemeContext.Provider>
  );
}
