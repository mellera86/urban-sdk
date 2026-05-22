"use client";

import {
  QueryClient,
  QueryClientProvider as TanstackQueryClientProvider,
} from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

function QueryClientProvider({ children }: { children: ReactNode }) {
  return (
    <TanstackQueryClientProvider client={queryClient}>
      {children}
    </TanstackQueryClientProvider>
  );
}

export { QueryClientProvider };
