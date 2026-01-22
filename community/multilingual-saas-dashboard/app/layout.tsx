import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { LanguageProvider } from "@/i18n";
import { ThemeProvider } from "@/hooks";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Multilingual SaaS Dashboard",
  description: "A production-style multilingual SaaS dashboard demo using Lingo.dev",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <LanguageProvider>{children}</LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
