"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30 seconds - data becomes stale after 30 seconds
      cacheTime: 5 * 60 * 1000, // 5 minutes - keep in cache for 5 minutes
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: true, // Refetch when window gains focus
      refetchOnReconnect: true, // Refetch when network reconnects
    },
    mutations: {
      retry: 1, // Retry failed mutations once
    },
  },
});

export default function CustomQueryClientProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
