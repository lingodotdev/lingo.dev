import { handler } from "tailwindcss-animate";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

const HeroSection = () => {
    


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-hero" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-glow animate-pulse-glow" />
      
      {/* Floating Elements */}
      <div className="absolute top-1/3 left-[15%] w-20 h-20 rounded-full bg-primary/10 blur-xl animate-float" />
      <div className="absolute top-1/2 right-[20%] w-32 h-32 rounded-full bg-accent/10 blur-xl animate-float-delayed" />
      
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">AI-Powered Blog Localization</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6 animate-fade-in-up">
            Translate Your Blog to{" "}
            <span className="text-gradient">Any Language</span>
            {" "}in Seconds
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Reach global audiences effortlessly. Our AI preserves your unique voice, 
            tone, and SEO while adapting content for any market.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <Button variant="hero" size="xl" onClick={()=>{
                handler(); 

            }}>
              Start Localizing Free
              <ArrowRight className="w-5 h-5" />
            </Button>
        
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-xl mx-auto mt-16 animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">50+</div>
              <div className="text-sm text-muted-foreground mt-1">Languages</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">10M+</div>
              <div className="text-sm text-muted-foreground mt-1">Words Translated</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gradient">99%</div>
              <div className="text-sm text-muted-foreground mt-1">Accuracy Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
