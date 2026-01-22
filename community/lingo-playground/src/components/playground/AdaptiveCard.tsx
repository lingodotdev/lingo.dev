"use client";

import { useI18n } from "@/lib/I18nContext";
import { motion, AnimatePresence } from "framer-motion";

export function AdaptiveCard() {
  const { t, locale } = useI18n();

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 transition-colors h-full">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-slate-900 dark:text-white">Content Density & RTL</h3>
        <span className="text-xs font-mono text-slate-400">Card Component</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={locale}
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           exit={{ opacity: 0, scale: 0.95 }}
           transition={{ duration: 0.2 }}
           className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col gap-3 max-w-[320px] shadow-sm ml-0"
           layout
        >
        <div className="flex justify-between items-start">
             <div className="h-10 w-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
             </div>
             <motion.span 
                layout
                className="px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full whitespace-nowrap"
             >
                {t.components.card.status}
             </motion.span>
        </div>
        <div>
            <motion.h4 layout className="font-bold text-slate-900 dark:text-white text-lg">{t.components.card.title}</motion.h4>
            <motion.p layout className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed">
                {t.components.card.description}
            </motion.p>
        </div>

        {/* New Formatting Section */}
        <div className="flex items-center justify-between py-2 border-t border-b border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-500">
             <span>{t.formatting.label}</span>
             <div className={`text-${t.meta.dir === 'rtl' ? 'left' : 'right'} flex flex-col items-end`}>
                <span className="font-mono text-slate-900 dark:text-slate-200">{t.formatting.date}</span>
                <span className="font-bold text-indigo-600 dark:text-indigo-400">{t.formatting.price}</span>
             </div>
        </div>

        <div className="pt-2 flex gap-2 w-full">
            <button className="flex-1 px-3 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md text-sm text-slate-700 dark:text-slate-200 font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                {t.actions.cancel}
            </button>
            <button className="flex-1 px-3 py-2 bg-indigo-600 rounded-md text-sm text-white font-medium hover:bg-indigo-700 transition-colors">
                {t.actions.save}
            </button>
        </div>
      </motion.div>
      </AnimatePresence>
    </div>
  );
}
