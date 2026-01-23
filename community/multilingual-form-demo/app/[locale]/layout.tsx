import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "../globals.css";
import { locales } from "../components/languageSwitcher/types";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale.code }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // ✅ Await params first
  const { locale } = await params;

  // Validate locale
  if (!locales.some((l) => l.code === locale)) {
    notFound();
  }

  // ✅ Get messages after validating locale
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
