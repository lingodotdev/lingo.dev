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
  description: "Explore world-class recipes in your native language with GourmetGlobe. Powered by Lingo.dev.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased bg-white dark:bg-black text-zinc-900 dark:text-zinc-100 transition-colors duration-300`}
        >
          <div className="relative min-h-screen">
            <main className="pb-24">
              {children}
            </main>
            <AppLocaleSwitcher />
          </div>
        </body>
      </html>
    </LingoProvider>
  );
}
