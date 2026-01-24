import type { Metadata } from "next";
import "./globals.css";

// Metadata for the root (fallback)
export const metadata: Metadata = {
  title: "Lingo Chat Demo",
  description: "Redirecting...",
};

/**
 * Root Layout.
 * Strictly checks that this is only used for the root route (which redirects).
 * For the actual app, the nested [lang] layout takes over.
 * Note: Next.js requires a root layout with html/body.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
