import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { LingoProvider } from "@lingo.dev/compiler/react"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DevFolio Global",
  description: "A multilingual developer portfolio built with Lingo.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LingoProvider>
          {children}
        </LingoProvider>
      </body>
    </html>
  );
}