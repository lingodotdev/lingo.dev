import type { LandingPageContent } from "@/lib/types";

interface FeaturesSectionProps {
  content: LandingPageContent;
}

export function FeaturesSection({ content }: FeaturesSectionProps) {
  return (
    <section className="py-6">
      <div className="grid grid-cols-3 gap-4">
        {content.features.map((feature, index) => (
          <div
            key={index}
            className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg"
          >
            <h3 className="text-sm font-medium text-neutral-900 mb-1">
              {feature.title || `Feature ${index + 1}`}
            </h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              {feature.description || "Feature description here."}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
