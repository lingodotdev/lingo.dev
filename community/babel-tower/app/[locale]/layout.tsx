import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { LingoProvider } from "@lingo.dev/compiler/react/next";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Babel Tower | One Codebase, Every Language",
  description: "Experience the magic of Lingo.dev Compiler - zero-config i18n for React apps",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  console.log("[DEBUG] LocaleLayout: locale from params =", locale);

  return (
    <LingoProvider initialLocale={locale}>
      <html lang={locale} suppressHydrationWarning>
        <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
          <div className="noise-overlay" />
          {children}
        </body>
      </html>
    </LingoProvider>
  );
}
