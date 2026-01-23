import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Sparkles, Languages, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";

import axios from "axios";

import {Input} from "../component/ui/input"; 

import { Textarea } from "../component/ui/textarea";

const HeroSection = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [blogUrl, setBlogUrl] = useState("");
  const [loading, setLoading] = useState(false); 
  const [translatedContent, setTranslatedContent] = useState<any>(null)

const handleTranslate = async () => {
  try {
    setLoading(true)

     await axios.post("http://localhost:4000/content", {
      content_1: blogUrl,
    });


    const get = await axios.get("http://localhost:4000/translate-content");

    setTranslatedContent(get.data.content); 

    setIsDialogOpen(false);
    setBlogUrl("");
  } catch (err) {
    console.error("Translation failed:", err);
  } finally {
    setLoading(false)
  }
};


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

   {!translatedContent && (
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
            <Button variant="hero" size="xl" onClick={() => setIsDialogOpen(true)}>
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


   )}   
       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="glass border-primary/20 lg:max-w-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Languages className="w-5 h-5 text-primary" />
              Start Localizing
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Enter your blog post URL or paste your content to translate.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <div className="space-y-2">
              <label htmlFor="blog-input" className="text-sm font-medium text-foreground">
                 Content
              </label>
              <Textarea
                id="blog-input"
                placeholder="paste your content here..."
                value={blogUrl}
                onChange={(e) => setBlogUrl(e.target.value)}
                className="min-h-[120px] bg-background/50 border-primary/20 focus:border-primary resize-none"
              />
            </div>
            <Button 
              variant="hero" 
              className="w-full" 
              onClick={handleTranslate}
              disabled={!blogUrl.trim()}
            >
              <Globe className="w-4 h-4 mr-2" />
              {loading ? "Translating..." : "Translate"}
            </Button>
               <Button 
              variant="hero" 
              className="flex mx-auto" 
              onClick={handleTranslate}
              disabled={!blogUrl.trim()}
            >
              {/* <Globe className="w-4 h-4 mr-2" /> */}
              en
            </Button>
          </div>
        </DialogContent>
      </Dialog>

   {translatedContent && (
  <div className="mt-10 max-w-4xl mx-auto glass p-6 rounded-xl animate-fade-in">
    <h2 className="text-4xl font-semibold mb-4 text-gradient">
      Translated Content
    </h2>

    {Object.entries(translatedContent).map(([key, value]) => (
      <p key={key} className="text-muted-foreground text-3xl mb-3">
        {String(value)}
      </p>
    ))}
  </div>
)}
      
    </section>
  );
};

export default HeroSection;
