import { Upload, Wand2, Download, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Upload,
    step: "01",
    title: "Upload Your Content",
    description: "Paste your blog post URL or upload your content directly. We support all major formats and CMS platforms.",
  },
  {
    icon: Wand2,
    step: "02",
    title: "Select Languages",
    description: "Choose from 50+ target languages. Our AI analyzes your content and prepares for culturally-aware translation.",
  },
  {
    icon: Download,
    step: "03",
    title: "Get Localized Content",
    description: "Receive professionally localized content ready to publish. Edit if needed, then export in your preferred format.",
  },
  {
    icon: CheckCircle2,
    step: "04",
    title: "Publish & Grow",
    description: "Publish your localized content and watch your global audience grow. Track performance with built-in analytics.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl -translate-y-1/2" />

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="text-gradient">Works</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            From upload to publish in four simple steps. No technical expertise required.
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.title} className="relative group">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-[2px] bg-gradient-to-r from-border to-transparent" />
              )}
              
              <div className="text-center">
                {/* Step Number */}
                <div className="text-5xl font-bold text-muted/30 mb-4">{step.step}</div>
                
                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-2xl glass flex items-center justify-center mb-6 group-hover:shadow-glow transition-all duration-300">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-3 text-foreground">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
