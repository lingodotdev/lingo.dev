"use client";

import { useI18n } from "@/lib/I18nContext";
import { motion, AnimatePresence } from "framer-motion";

export function AdaptiveButton() {
  const { t, locale } = useI18n();

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 transition-colors h-full">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-900 dark:text-white">Button Adaptability</h3>
        <span className="text-xs font-mono text-slate-400">Fixed vs Auto Width</span>
      </div>
      
      <div className="flex flex-col gap-8 py-4 flex-1 justify-center">
        {/* Fixed Width Example - Shows breaking/overflow */}
        <div className="space-y-3">
            <span className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2 py-1 rounded inline-block">Constraint: 100px width</span>
            <div className="w-[100px] border border-dashed border-red-200 dark:border-red-900/50 h-12 relative group flex items-center">
                 <motion.button 
                    key={locale} // Re-animate on locale change
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium h-10 w-full truncate px-3 rounded absolute top-1 left-0 shadow-sm"
                  >
                    {t.actions.confirm}
                </motion.button>
                <div className="absolute top-full text-[10px] text-red-500 hidden group-hover:block pt-1 whitespace-nowrap z-10">
                    Truncation happens in verbose locales
                </div>
            </div>
        </div>

        {/* Adaptive Example */}
        <div className="space-y-3">
            <span className="text-xs bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-2 py-1 rounded inline-block">Adaptive: Auto width</span>
            <div className="h-12 flex items-center">
                 <AnimatePresence mode="wait">
                 <motion.button 
                    key={`adaptive-${locale}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1, width: "auto" }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-6 py-2.5 rounded-lg shadow-md whitespace-nowrap block"
                    layout
                >
                    {t.actions.confirm}
                </motion.button>
                </AnimatePresence>
            </div>
        </div>
      </div>
    </div>
  );
}
