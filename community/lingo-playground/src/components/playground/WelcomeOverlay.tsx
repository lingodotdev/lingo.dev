"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useI18n } from "@/lib/I18nContext";

export function WelcomeOverlay() {
  const [isOpen, setIsOpen] = useState(true);
  const { t } = useI18n();

  // Prevent scrolling when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Auto-dismiss logic
  useEffect(() => {
    // Total animation time calculation:
    // Initial delay: 0.5s
    // Title words (5 words * 0.1s) = 0.5s
    // Subtitle words (~15 words * 0.05s) = 0.75s
    // Features fade in delayed
    // Reading time: ~3.5s
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 4500); 

    return () => clearTimeout(timer);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3
      }
    }
  };

  const wordAnimation = {
    hidden: { opacity: 0, y: 10, filter: "blur(5px)" },
    visible: { opacity: 1, y: 0, filter: "blur(0px)" }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  const titleWords = "Localization is more than words.".split(" ");
  const descWords = "Experience how UI components physically adapt to languages, cultural tones, and reading directions in real-time.".split(" ");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8 } }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.05, opacity: 0, filter: "blur(10px)", transition: { duration: 0.5 } }}
            className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 dark:border-slate-800"
          >
            {/* Decorative Header */}
            <div className="h-32 bg-indigo-600 relative overflow-hidden flex items-center justify-center">
               <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-indigo-400 rounded-full blur-3xl opacity-50"></div>
               <div className="absolute top-10 left-10 w-20 h-20 bg-pink-500 rounded-full blur-2xl opacity-40"></div>
               
               <motion.h2 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ duration: 0.8, ease: "easeOut" }}
                 className="text-3xl font-bold text-white relative z-10 tracking-tight"
               >
                 Lingo.dev
               </motion.h2>
            </div>

            <div className="p-8 space-y-6">
              <div className="space-y-4 text-center">
                <motion.h3 
                  className="text-xl font-semibold text-slate-900 dark:text-white flex flex-wrap justify-center gap-1.5"
                  variants={container}
                  initial="hidden"
                  animate="visible"
                >
                  {titleWords.map((word, i) => (
                    <motion.span key={i} variants={wordAnimation} className="inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.h3>
                
                <motion.p 
                    className="text-slate-600 dark:text-slate-400 leading-relaxed flex flex-wrap justify-center gap-1"
                    initial="hidden"
                    animate="visible"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: { opacity: 1, transition: { delayChildren: 1.0, staggerChildren: 0.02 } }
                    }}
                >
                   {descWords.map((word, i) => (
                    <motion.span key={i} variants={wordAnimation} className="inline-block">
                      {word}
                    </motion.span>
                  ))}
                </motion.p>
              </div>

              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.5, duration: 0.8 }}
              >
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                        ↔️
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Compare RTL & LTR Layouts</span>
                 </div>
                 <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                        📐
                    </span>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Observe Content Expansion</span>
                 </div>
              </motion.div>
              
              <motion.div 
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className="h-1 bg-indigo-600 rounded-full mx-auto opacity-20"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
