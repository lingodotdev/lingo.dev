"use i18n";
import { Heart, Github, Twitter, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10">
      <div className="absolute inset-0 gradient-mesh opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-violet-500 flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-white text-lg">AI Travel Planner</span>
                <span className="text-gray-500 text-xs block">
                  <>Lingo.dev Community Demo</>
                </span>
              </div>
            </div>
            <p className="text-gray-400 text-sm max-w-md mb-4">
              <>
                A showcase application demonstrating Lingo.dev's AI-powered
                internationalization. Plan trips in 6 languages with zero-config
                translation.
              </>
            </p>
            <div className="flex gap-3">
              <a
                href="https://github.com/lingodotdev/lingo.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/AINativeDev"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              <>Lingo.dev Features</>
            </h3>
            <ul className="space-y-2 text-sm text-gray-400">
              <li className="hover:text-white transition-colors cursor-default">
                <>Zero-config React translation</>
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                <>Build-time optimization</>
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                <>AI-powered translations</>
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                <>Multiple LLM providers</>
              </li>
              <li className="hover:text-white transition-colors cursor-default">
                <>ICU MessageFormat support</>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              <>Resources</>
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://lingo.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <>Lingo.dev Website</>
                </a>
              </li>
              <li>
                <a
                  href="https://lingo.dev/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <>Documentation</>
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/lingodotdev/lingo.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <>GitHub Repository</>
                </a>
              </li>
              <li>
                <a
                  href="https://lingo.dev/go/discord"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <>Join Discord</>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
            <p className="flex items-center gap-1">
              <>Made with</>
              <span className="animate-pulse">
                <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </span>
              <>for the Lingo.dev community</>
            </p>
            <p>
              © {new Date().getFullYear()} AI Travel Planner.{" "}
              <>Open source under MIT License.</>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
