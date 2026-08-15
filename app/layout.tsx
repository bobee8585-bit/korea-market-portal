import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Korea Market Portal",
  description: "Global intelligence for Korea's public markets and industrial ecosystems.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
