import { Geist } from "next/font/google";
import { LingoProvider, loadDictionary } from "lingo.dev/react/rsc";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable}`}>
        <LingoProvider loadDictionary={(locale) => loadDictionary(locale)}>
          {children}
        </LingoProvider>
      </body>
    </html>
  );
}
