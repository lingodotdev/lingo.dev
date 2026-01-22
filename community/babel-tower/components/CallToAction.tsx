"use client";

import { motion } from "framer-motion";
import { ArrowRight, Github, BookOpen } from "lucide-react";

export function CallToAction() {
  return (
    <section className="py-32 px-8 md:px-12 lg:px-16 relative">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-full bg-gradient-to-b from-purple-600/10 via-cyan-600/5 to-transparent rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-4xl mx-auto text-center relative z-10"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-6">
          Ready to make your app
          <br />
          <span className="gradient-text">speak every language?</span>
        </h2>

        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
          Join thousands of developers who have already simplified their i18n workflow.
          Get started in less than 5 minutes.
        </p>

        <div className="flex flex-wrap gap-4 justify-center mb-12">
          <a
            href="https://lingo.dev/compiler"
            target="_blank"
            rel="noopener noreferrer"
            className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full font-semibold text-white hover:opacity-90 transition-opacity glow-purple flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
          <a
            href="https://github.com/lingodotdev/lingo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 glass rounded-full font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <Github className="w-5 h-5" />
            Star on GitHub
          </a>
          <a
            href="https://lingo.dev/docs"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 glass rounded-full font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
          >
            <BookOpen className="w-5 h-5" />
            Read the Docs
          </a>
        </div>

        <div className="glass rounded-2xl p-8 max-w-xl mx-auto">
          <p className="text-gray-400 mb-4">Quick start with Next.js:</p>
          <div className="bg-black/50 rounded-xl p-4 font-mono text-sm text-left overflow-x-auto">
            <code className="text-green-400">npm install @lingo.dev/compiler</code>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
