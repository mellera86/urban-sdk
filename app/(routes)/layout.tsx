import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Providers } from "@providers/Providers";
import "../styles/globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: "Urban SDK App",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col p-2 bg-blue-100">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
