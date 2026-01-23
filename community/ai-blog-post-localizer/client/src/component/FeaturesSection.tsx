import { Globe, Zap, Shield, Languages, FileText, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Languages,
    title: "50+ Languages",
    description: "Translate your content into over 50 languages with native-level fluency and cultural adaptation.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Process entire blog posts in seconds, not hours. Scale your content production instantly.",
  },
  {
    icon: Shield,
    title: "Brand Voice Preserved",
    description: "Our AI learns your unique writing style and maintains consistency across all translations.",
  },
  {
    icon: TrendingUp,
    title: "SEO Optimized",
    description: "Keywords and meta data are intelligently adapted for each target market's search behavior.",
  },
  {
    icon: FileText,
    title: "Format Retention",
    description: "Headers, links, images, and formatting are preserved perfectly in every translation.",
  },
  {
    icon: Globe,
    title: "Cultural Adaptation",
    description: "Beyond translation—we adapt idioms, references, and context for local audiences.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Everything You Need to{" "}
            <span className="text-gradient">Go Global</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Powerful features designed for content creators who want to expand their reach worldwide.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group p-6 rounded-2xl bg-gradient-card border border-border hover:border-primary/30 transition-all duration-300 hover:shadow-glow"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
