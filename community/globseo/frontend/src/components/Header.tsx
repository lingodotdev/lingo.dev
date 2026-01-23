import { Github, Globe } from "lucide-react";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <header className="border-b border-white/10 bg-[#0a0a0a] sticky top-0 z-50 backdrop-blur-sm">
      <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => scrollToSection("hero")}
          >
            <div className="w-6 h-6 bg-[#a3ff12] rounded-sm flex items-center justify-center">
              <Globe className="w-4 h-4 text-black" />
            </div>
            <span className="text-white">GlobSEO</span>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5 cursor-pointer"
              onClick={() => scrollToSection("try-it-now")}
            >
              Get started
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/5 gap-2 cursor-pointer"
              onClick={() => scrollToSection("features")}
            >
              Features
              <Badge className="bg-[#a3ff12] text-black text-xs px-1.5 py-0 h-5">
                AI
              </Badge>
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            className="text-white/60 hover:text-white hover:bg-white/5 gap-2 cursor-pointer"
          >
            <Github className="w-4 h-4" />
            <a
              className="text-sm"
              href="https://github.com/crypticsaiyan/GlobSEO"
            >
              Github
            </a>
          </Button>
        </div>
      </div>
    </header>
  );
}
