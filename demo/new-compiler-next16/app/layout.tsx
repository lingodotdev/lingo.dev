import { ReactNode } from "react";

/**
 * Root layout - minimal wrapper
 * The actual locale-aware layout is in [locale]/layout.tsx
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return children;
}
