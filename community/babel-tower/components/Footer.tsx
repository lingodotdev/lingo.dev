"use client";

import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-12 px-8 md:px-12 lg:px-16 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="max-w-6xl mx-auto"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-gray-400">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>for the</span>
            <a
              href="https://github.com/lingodotdev/lingo.dev/issues/1761"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Lingo.dev Community Campaign
            </a>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Lingo.dev
            </a>
            <a
              href="https://github.com/lingodotdev/lingo.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://reddit.com/r/lingodotdev"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Reddit
            </a>
            <a
              href="https://lingo.dev/go/discord"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Discord
            </a>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            This demo showcases the Lingo.dev Compiler — zero-config i18n for React apps.
            <br />
            Every piece of text on this page is translated automatically at build time.
          </p>
        </div>
      </motion.div>
    </footer>
  );
}
