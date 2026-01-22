import type { LandingPageContent } from "@/lib/types";
import { HeroSection } from "./HeroSection";
import { FeaturesSection } from "./FeaturesSection";
import { CTASection } from "./CTASection";

interface PreviewProps {
  content: LandingPageContent | null;
}

export function Preview({ content }: PreviewProps) {
  if (!content) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="text-center">
          <div className="text-3xl mb-3">🌐</div>
          <h3 className="text-sm font-medium text-neutral-900 mb-1">
            Preview Your Landing Page
          </h3>
          <p className="text-xs text-neutral-500 max-w-[200px]">
            Fill out the form and click generate to see translations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <HeroSection content={content} />
      <FeaturesSection content={content} />
      <CTASection content={content} />
    </div>
  );
}
