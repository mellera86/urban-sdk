"use client";

import { ErrorBoundary } from "@components/ErrorBoundary";
import { QueryClientProvider } from "@providers/QueryClientProvider";
import type { ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider>
      <ErrorBoundary>{children}</ErrorBoundary>
    </QueryClientProvider>
  );
}

export { Providers };
