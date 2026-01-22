import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});


export const metadata: Metadata = {
  title: "AI Localization Debugger · Lingo.dev",
  description:
    "An AI-powered live localization debugger that analyzes code and translations in real time using Lingo.dev.",
  keywords: [
    "Lingo.dev",
    "localization",
    "i18n",
    "AI developer tools",
    "translation debugging",
    "Next.js",
  ],
  authors: [{ name: "Lingo.dev Community" }],
  applicationName: "AI Localization Debugger",
  themeColor: "#0f1115",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-background
          text-foreground
          min-h-screen
        `}
      >
   
        <div className="min-h-screen flex flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
