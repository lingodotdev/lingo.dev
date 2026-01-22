import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SlangShift | Internet Slang Translator",
  description: "Transform internet slang into culturally-adapted translations. Localization is not translation. Built for the lingo.dev hackathon.",
  keywords: ["translation", "localization", "slang", "internet culture", "lingo.dev", "Gen-Z", "cultural adaptation"],
  authors: [{ name: "SlangShift" }],
  openGraph: {
    title: "SlangShift | Internet Slang Translator",
    description: "Because 'this slaps' shouldn't translate to 'esto abofetea'. Experience real localization.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SlangShift | Internet Slang Translator",
    description: "Because 'this slaps' shouldn't translate to 'esto abofetea'. Experience real localization.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
