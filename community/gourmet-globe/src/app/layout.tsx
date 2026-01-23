import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
import AppLocaleSwitcher from "@/components/common/app-locale-switcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GourmetGlobe - AI-Powered Multi-lingual Recipes",
  description: "Explore world-class recipes in your native language with GourmetGlobe.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
      <html>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-[family-name:var(--font-geist-sans)] antialiased`}
        >
          <div className="flex flex-col gap-8 items-center min-h-screen py-8 px-4 max-w-5xl mx-auto">
            {children}
          </div>
          <AppLocaleSwitcher />
        </body>
      </html>
    </LingoProvider>
  );
}
