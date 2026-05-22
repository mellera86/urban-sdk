"use client";

import { QueryClientProvider } from "@providers/QueryClientProvider";
import type { ReactNode } from "react";

function Providers({ children }: { children: ReactNode }) {
  return <QueryClientProvider>{children}</QueryClientProvider>;
}

export { Providers };
