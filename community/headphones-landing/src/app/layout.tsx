import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { TranslationProvider } from "@/components/TranslationContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "LingoBuds Pro - Wireless Translation Headphones",
  description: "Experience sound that speaks your language. Premium active noise cancellation meets instant translation technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased bg-stone-50 selection:bg-amber-100 selection:text-amber-900`}>
        <TranslationProvider>
          {children}
        </TranslationProvider>
      </body>
    </html>
  );
}
