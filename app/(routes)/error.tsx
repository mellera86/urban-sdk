"use client";

import { ErrorFallback } from "@components/ErrorFallback";
import { useEffect } from "react";

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return <ErrorFallback onReset={reset} />;
}
