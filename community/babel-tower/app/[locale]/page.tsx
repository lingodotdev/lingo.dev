import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { CodeShowcase } from "@/components/CodeShowcase";
import { LanguageGrid } from "@/components/LanguageGrid";
import { CallToAction } from "@/components/CallToAction";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return [
    { locale: "en" },
    { locale: "es" },
    { locale: "fr" },
    { locale: "de" },
    { locale: "ja" },
    { locale: "zh" },
    { locale: "ko" },
    { locale: "ar" },
    { locale: "hi" },
    { locale: "pt" },
    { locale: "ru" },
  ];
}

export default function LocalePage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
      <CodeShowcase />
      <LanguageGrid />
      <CallToAction />
      <Footer />
    </main>
  );
}
