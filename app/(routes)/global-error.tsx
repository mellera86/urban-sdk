"use client";

import { ErrorFallback } from "@components/ErrorFallback";
import { Geist } from "next/font/google";
import { useEffect } from "react";
import "../styles/globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error("Global error:", error);
  }, [error]);

  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-blue-100 p-2">
        <ErrorFallback onReset={reset} />
      </body>
    </html>
  );
}
