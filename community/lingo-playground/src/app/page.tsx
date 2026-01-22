"use client";

import { PlaygroundHeader } from "@/components/playground/PlaygroundHeader";
import { AdaptiveButton } from "@/components/playground/AdaptiveButton";
import { AdaptiveCard } from "@/components/playground/AdaptiveCard";
import { AdaptiveModal } from "@/components/playground/AdaptiveModal";
import { LingoInsights } from "@/components/playground/LingoInsights";
import { WelcomeOverlay } from "@/components/playground/WelcomeOverlay";
import { motion } from "framer-motion";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } as const }
};

export default function Home() {
  return (
    <main className="min-h-screen p-8 md:p-12 max-w-7xl mx-auto space-y-8">
      <WelcomeOverlay />
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.2 }}
      >
        <PlaygroundHeader />
      </motion.div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {/* Left Col: Visual Components */}
        <div className="space-y-6 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div variants={item} className="h-full"><AdaptiveButton /></motion.div>
                <motion.div variants={item} className="h-full"><AdaptiveModal /></motion.div>
            </div>
            
            <motion.div variants={item}><AdaptiveCard /></motion.div>
        </div>

        {/* Right Col: Insights & Data */}
        <div className="space-y-6">
           <motion.div variants={item}><LingoInsights /></motion.div>
           
           <motion.div variants={item} className="p-6 bg-indigo-50 dark:bg-slate-800/50 border border-indigo-100 dark:border-slate-700 rounded-2xl text-indigo-900 dark:text-indigo-200">
             <h3 className="font-bold mb-2">Why this matters</h3>
             <p className="text-sm leading-relaxed opacity-80 mb-2">
               Localization isn&#39;t just translation. It&#39;s about spatial design. 
               German often expands text by 35%, while Japanese contracts horizontally 
               but needs vertical breathing room.
             </p>
             <p className="text-sm leading-relaxed opacity-80">
               <strong>RTL (Right-to-Left):</strong> Arabic and functional layout mirroring 
               is a critical stress test for flexbox logic.
             </p>
           </motion.div>
        </div>
      </motion.div>
    </main>
  );
}
