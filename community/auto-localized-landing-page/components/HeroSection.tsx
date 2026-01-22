import type { LandingPageContent } from "@/lib/types";

interface HeroSectionProps {
  content: LandingPageContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section className="bg-neutral-900 rounded-lg p-8 text-center">
      {/* Product badge */}
      <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-white/80 text-xs font-medium mb-4">
        {content.productName || "Your Product"}
      </div>

      {/* Headline */}
      <h1 className="text-2xl font-semibold text-white mb-3">
        {content.headline || "Your Headline Here"}
      </h1>

      {/* Subheadline */}
      <p className="text-neutral-400 text-sm mb-6 max-w-md mx-auto">
        {content.subheadline || "Your subheadline will appear here."}
      </p>

      {/* CTA Button */}
      <button className="px-5 py-2 bg-white text-neutral-900 text-sm font-medium rounded-lg">
        {content.ctaText || "Get Started"}
      </button>
    </section>
  );
}
