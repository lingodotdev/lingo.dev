import type { PageSection } from '@/app/lib/storage';
import { Zap, Shield, Sparkles, Star } from 'lucide-react';
import { useLingoContext } from '@lingo.dev/compiler/react';
import { useLingo, useLingoLocale } from 'lingo.dev/react-client';

const featureIcons = [Zap, Shield, Sparkles];

export default function SectionRenderer({ section }: { section: PageSection }) {
  // @ts-ignore - Assuming t exists on context or casting to any if mostly checking runtime
  const { t: translate } = useLingoContext()
  const { type, content } = section;

  switch (type) {
    case 'hero':
      return (
        <section className="relative py-24 px-6 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-chart-2/10 via-transparent to-chart-5/10" />
          <div className="relative max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-foreground leading-tight mb-6">
              {content.heading}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {content.subheading}
            </p>
            {content.buttonText && (
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity shadow-lg">
                {content.buttonText}
              </button>
            )}
          </div>
        </section>
      );

    case 'features': {
      const features = [
        { title: content.feature1Title, desc: content.feature1Desc },
        { title: content.feature2Title, desc: content.feature2Desc },
        { title: content.feature3Title, desc: content.feature3Desc },
      ].filter((f) => f.title);

      return (
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            {content.heading && (
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground text-center mb-12">
                {content.heading}
              </h2>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => {
                const Icon = featureIcons[i % featureIcons.length];
                return (
                  <div
                    key={i}
                    className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
                  >
                    <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-chart-2" />
                    </div>
                    <h3 className="text-lg font-semibold text-card-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      );
    }

    case 'text':
      return (
        <section className="py-16 px-6">
          <div className="max-w-3xl mx-auto">
            {content.heading && (
              <h2 className="text-3xl font-bold text-foreground mb-6">
                {content.heading}
              </h2>
            )}
            <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {content.body}
            </p>
          </div>
        </section>
      );

    case 'cta':
      return (
        <section className="py-20 px-6">
          <div className="max-w-3xl mx-auto text-center bg-primary/5 rounded-2xl p-12 border border-border">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              {translate(content.heading)}
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              {translate(content.description)}
            </p>
            {content.buttonText && (
              <button className="bg-primary text-primary-foreground px-8 py-3 rounded-lg text-lg font-semibold hover:opacity-90 transition-opacity">
                {translate(content.buttonText)}
              </button>
            )}
          </div>
        </section>
      );

    case 'testimonial':
      return (
        <section className="py-16 px-6">
          <div className="max-w-2xl mx-auto text-center">
            <Star className="h-8 w-8 text-chart-4 mx-auto mb-6" />
            <blockquote className="text-xl sm:text-2xl text-foreground italic leading-relaxed mb-6">
              &ldquo;{translate(content.quote)}&rdquo;
            </blockquote>
            <div>
              <p className="font-semibold text-foreground">{translate(content.author)}</p>
              <p className="text-sm text-muted-foreground">{translate(content.role)}</p>
            </div>
          </div>
        </section>
      );

    default:
      return null;
  }
}
