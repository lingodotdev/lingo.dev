import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import StarField from "@/components/StarField";
import "../globals.css";
import { getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Galactic Archives",
  description: "Interstellar Knowledge Base powered by Lingo.dev Universal Translator",
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
            <StarField />
            <main className="relative z-10 min-h-screen flex flex-col p-8">
                <header className="mb-12 border-b border-glass-border pb-6 flex justify-between items-center glass-panel p-6 rounded-2xl">
                    <div>
                        <h1 className="text-4xl font-bold tracking-tight neon-text">GALACTIC ARCHIVES</h1>
                        <p className="text-sm text-cyan-200 opacity-70 mt-1 uppercase tracking-widest">Universal Translator Active</p>
                    </div>
                    <div className="flex gap-4">
                    <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22c55e]"></div>
                    <span className="text-xs font-mono uppercase text-green-400">System Online</span>
                    </div>
                </header>
                {children}
            </main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
