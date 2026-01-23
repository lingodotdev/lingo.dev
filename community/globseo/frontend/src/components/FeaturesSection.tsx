import { Globe, Zap, BarChart3, Sparkles, FileCode2, Share2 } from 'lucide-react';

export function FeaturesSection() {
  const features = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Optimize your content for 60+ languages and reach audiences worldwide'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Generate metadata in seconds using state-of-the-art AI models'
    },
    {
      icon: BarChart3,
      title: 'Metadata Quality Score',
      description: 'Real-time analysis and scoring of your SEO metadata quality'
    },
    {
      icon: Sparkles,
      title: 'Smart Rewrite Suggestions',
      description: 'AI-powered suggestions to improve your titles and descriptions'
    },
    {
      icon: FileCode2,
      title: 'Schema Generator',
      description: 'Automatic JSON-LD structured data generation for better search visibility'
    },
    {
      icon: Share2,
      title: 'Multilingual Social Card Preview',
      description: 'Preview how your content appears across Twitter, Facebook, and LinkedIn'
    }
  ];

  return (
    <section id="features" className="features-section">
      <div className="features-container">
        <div className="features-header">
          <h2 className="features-title">
            Why <span className="brand">GlobSEO</span>?
          </h2>
          <p className="features-subtitle">
            Everything you need to scale your content globally
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="icon-wrap">
                {/* Icon sizing via props */}
                <feature.icon size={24} color="#a3ff12" />
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Background grid pattern */}
      <div className="bg-grid-overlay">
        <div
          className="bg-grid-pattern"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(163, 255, 18, 0.1) 1px, transparent 1px),\n            linear-gradient(to bottom, rgba(163, 255, 18, 0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Local styles for this section only (no Tailwind) */}
      <style>{`
        .features-section {
          position: relative;
          overflow: hidden;
          padding-top: 2rem;
          padding-bottom: 2rem;
        }
        .features-container {
          max-width: 1400px;
          margin: 0 auto;
          padding-left: 24px;
          padding-right: 24px;
        }
        .features-header { text-align: center; margin-bottom: 4rem; }
        .features-title {
          font-size: 1.875rem; /* 30px */
          line-height: 1.2;
          margin: 0 0 1rem 0;
          letter-spacing: -0.01em;
          color: #fff;
        }
        @media (min-width: 768px) { .features-title { font-size: 2.25rem; /* 36px */ } }
        .brand { color: #a3ff12; }
        .features-subtitle {
          color: rgba(255,255,255,0.5);
          max-width: 42rem; /* ~672px */
          margin: 0 auto;
        }

        .features-grid {
          display: grid;
          gap: 24px;
          grid-template-columns: 1fr;
        }
        @media (min-width: 768px) {
          .features-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (min-width: 1024px) {
          .features-grid { grid-template-columns: repeat(4, 1fr); }
          /* Center 5th and 6th cards */
          .feature-card:nth-child(5) { grid-column: 2; }
          .feature-card:nth-child(6) { grid-column: 3; }
        }

        .feature-card {
          background: #141414;
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 24px;
          transition: border-color 200ms ease;
        }
        .feature-card:hover { border-color: rgba(163,255,18,0.5); }
        .icon-wrap {
          width: 48px; height: 48px;
          border-radius: 12px;
          background: rgba(163,255,18,0.1);
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 16px;
          transition: background-color 200ms ease;
        }
        .feature-card:hover .icon-wrap { background: rgba(163,255,18,0.2); }
        .feature-title { font-size: 1.125rem; color: rgba(255,255,255,0.9); margin: 0 0 8px 0; }
        .feature-desc { font-size: 0.9rem; color: rgba(255,255,255,0.5); line-height: 1.6; margin: 0; }

        .bg-grid-overlay { position: absolute; inset: 0; pointer-events: none; opacity: 0.1; }
        .bg-grid-pattern { position: absolute; inset: 0; }
      `}</style>
    </section>
  );
}
