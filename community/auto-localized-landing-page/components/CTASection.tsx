import type { LandingPageContent } from "@/lib/types";

interface CTASectionProps {
  content: LandingPageContent;
}

export function CTASection({ content }: CTASectionProps) {
  return (
    <section className="py-6">
      <div className="text-center p-6 bg-neutral-100 border border-neutral-200 rounded-lg">
        <h2 className="text-lg font-medium text-neutral-900 mb-2">
          Ready to try {content.productName || "our product"}?
        </h2>
        <p className="text-sm text-neutral-500 mb-4">
          Get started today and see the difference.
        </p>
        <button className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg">
          {content.ctaText || "Get Started"}
        </button>
      </div>
    </section>
  );
}
