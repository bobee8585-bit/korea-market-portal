import type { Metadata } from "next";
import "./globals.css";
import { defaultLocale } from "@/lib/i18n";
import { AdProviderScripts } from "@/components/monetization";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://korpulse.com"),
  title: {
    default: "KorPulse — Discover Korea's Industrial Power",
    template: "%s | KorPulse",
  },
  description: "Discover Korea's industrial power through verified companies, factories, ecosystems and history.",
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang={defaultLocale}>
      <body>
        <AdProviderScripts />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
