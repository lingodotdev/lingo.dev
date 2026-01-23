import { Button } from "./ui/button";
import { ArrowRight, Globe } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-card border border-border rounded-3xl" />
            <div className="absolute inset-0 bg-gradient-glow" />
            
            {/* Floating Globe */}
            <div className="absolute -right-20 -top-20 w-64 h-64 opacity-10">
              <Globe className="w-full h-full text-primary" />
            </div>

            <div className="relative z-10 text-center">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                Ready to Reach a{" "}
                <span className="text-gradient">Global Audience</span>?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                Join thousands of content creators who are expanding their reach 
                with AI-powered localization. Start free, no credit card required.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Button>
                <Button variant="heroOutline" size="xl">
                  Schedule Demo
                </Button>
              </div>

              {/* Trust Badges */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>5,000 words free</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
