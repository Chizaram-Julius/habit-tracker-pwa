import type { Metadata } from "next";
import "./globals.css";
import RegisterServiceWorker from "@/components/shared/RegisterServiceWorker";

export const metadata: Metadata = {
  title: "Habit Tracker",
  description: "A mobile-first Habit Tracker PWA",
  manifest: "/manifest.json",
};

export const viewport = {
  themeColor: "#4f46e5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
