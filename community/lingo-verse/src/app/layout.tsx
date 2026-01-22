import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lingo Verse | Global Translation Explorer",
  description:
    "An interactive translation playground powered by Lingo.dev SDK - explore how your words travel across the globe",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=Noto+Sans+JP:wght@400;500&family=Noto+Sans+Arabic:wght@400;500&family=Noto+Sans+SC:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* Twemoji for cross-platform emoji support (Windows flag emojis) */}
        <link
          href="https://cdn.jsdelivr.net/npm/twemoji-colr-font@14.0.2/twemoji.min.css"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased" style={{ fontFamily: "'Twemoji', 'Outfit', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}
