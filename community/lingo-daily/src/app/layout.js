import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { LingoProvider } from "@lingo.dev/compiler/react/next";
import { ThemeProvider } from "next-themes";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Lingo Daily - News in Every Language",
  description:
    "A modern news dashboard showcasing Lingo.dev's powerful localization features",
};

export default function RootLayout({ children }) {
  return (
    // <LingoProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
    // </LingoProvider>
  );
}
