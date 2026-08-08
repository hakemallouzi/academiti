import type { Metadata } from "next";
import { Outfit, Syne } from "next/font/google";
import { AmbientBackground } from "@/frontend/components/AmbientBackground";
import { SiteFooter } from "@/frontend/components/SiteFooter";
import { SiteHeader } from "@/frontend/components/SiteHeader";
import "./globals.css";

const display = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Lingora — Learn languages. Earn certificates.",
    template: "%s · Lingora",
  },
  description:
    "Online language courses with text lessons, voice narration, and verifiable certificates.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} h-full`}>
      <body className="glass-page-bg flex min-h-full flex-col antialiased text-[var(--foreground)]">
        <AmbientBackground />
        <SiteHeader />
        <main className="relative z-0 flex-1 pt-[4.75rem]">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
