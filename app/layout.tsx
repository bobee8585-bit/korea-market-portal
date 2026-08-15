import type { Metadata } from "next";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"),
  title: {
    default: "Korea Market Portal",
    template: "%s | Korea Market Portal",
  },
  description: "Global intelligence for Korea's public markets and industrial ecosystems.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale}>
      <body>{children}</body>
    </html>
  );
}
