import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "medi-lingo | Medical Report Explainer",
  description:
    "Understand your medical reports in any language. AI-powered analysis with Lingo.dev translation.",
  keywords: [
    "medical report",
    "health",
    "translation",
    "AI",
    "lingo.dev",
    "multilingual",
  ],
  authors: [{ name: "Lingo.dev Community" }],
  openGraph: {
    title: "medi-lingo | Medical Report Explainer",
    description:
      "Understand your medical reports in any language. AI-powered analysis with Lingo.dev translation.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
