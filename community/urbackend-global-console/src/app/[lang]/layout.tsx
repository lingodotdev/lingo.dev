import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "urBackend Global Console",
  description: "Developer Dashboard powered by Lingo.dev",
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang } = await params;
  return (
    <html lang={lang} className="dark">
      <body className={`${inter.className} min-h-screen bg-[#000000] text-[#EDEDED]`}>
        <div className="flex min-h-screen">
          <Sidebar />
          <div className="flex-1 ml-[260px] flex flex-col min-h-screen">
            <Header />
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
