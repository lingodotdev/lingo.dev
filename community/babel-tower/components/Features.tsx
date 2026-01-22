"use client";

import { motion } from "framer-motion";
import { Zap, Code2, Layers, Sparkles, Clock, Shield } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  index: number;
  children: React.ReactNode;
}

function FeatureCard({ icon: Icon, index, children }: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="glass rounded-2xl p-6 hover:bg-white/5 transition-colors group"
    >
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center mb-4 group-hover:glow-purple transition-shadow">
        <Icon className="w-6 h-6 text-purple-400" />
      </div>
      {children}
    </motion.div>
  );
}

export function Features() {
  return (
    <section className="py-32 px-8 md:px-12 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="gradient-text">The Magic</span> Behind the Scenes
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Traditional i18n libraries require you to wrap every string. The Lingo.dev Compiler
            does it all automatically at build time.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard icon={Zap} index={0}>
            <h3 className="text-xl font-semibold text-white mb-2">Zero Runtime Overhead</h3>
            <p className="text-gray-400">Translations happen at build time. Your app stays lightning fast with no extra JavaScript.</p>
          </FeatureCard>

          <FeatureCard icon={Code2} index={1}>
            <h3 className="text-xl font-semibold text-white mb-2">No Code Changes</h3>
            <p className="text-gray-400">Keep your components clean. No t() functions, no translation keys, no clutter.</p>
          </FeatureCard>

          <FeatureCard icon={Layers} index={2}>
            <h3 className="text-xl font-semibold text-white mb-2">Build-Time Magic</h3>
            <p className="text-gray-400">The compiler detects translatable text in JSX and generates translations automatically.</p>
          </FeatureCard>

          <FeatureCard icon={Sparkles} index={3}>
            <h3 className="text-xl font-semibold text-white mb-2">AI-Powered</h3>
            <p className="text-gray-400">Leverages advanced language models for natural, context-aware translations.</p>
          </FeatureCard>

          <FeatureCard icon={Clock} index={4}>
            <h3 className="text-xl font-semibold text-white mb-2">Instant Setup</h3>
            <p className="text-gray-400">Add one config file, run the build, and your app speaks every language.</p>
          </FeatureCard>

          <FeatureCard icon={Shield} index={5}>
            <h3 className="text-xl font-semibold text-white mb-2">Type-Safe</h3>
            <p className="text-gray-400">Full TypeScript support with zero configuration. Your IDE just works.</p>
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
