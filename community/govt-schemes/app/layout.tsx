import type { Metadata } from "next";
import { Jost } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/app/context/LanguageContext";
import { LingoProvider } from "@lingo.dev/compiler/react/next";

const jostSans = Jost({
  variable: "--font-jost-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "SchemeSaathi - Government Schemes for Indian Citizens",
  description:
    "Multilingual chatbot helping Indian citizens discover government schemes they are eligible for. Supports 24+ Indian languages.",
  keywords:
    "government schemes, India, multilingual, PM-KISAN, Ayushman Bharat, eligibility",
  authors: [{ name: "SchemeSaathi Team" }],
  openGraph: {
    title: "SchemeSaathi - Government Schemes for Indian Citizens",
    description: "Discover government schemes in your language.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LingoProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${jostSans.variable} font-sans`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LanguageProvider>{children}</LanguageProvider>
          </ThemeProvider>
        </body>
      </html>
    </LingoProvider>
  );
}
