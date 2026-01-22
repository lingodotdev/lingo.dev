"use client";

import { useI18n } from "@/lib/I18nContext";
import { motion, AnimatePresence } from "framer-motion";

export function AdaptiveModal() {
  const { t, locale } = useI18n();

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4 relative overflow-hidden transition-colors h-full">
      <div className="flex justify-between items-center relative z-10">
        <h3 className="font-semibold text-slate-900 dark:text-white">Modal Sizing</h3>
        <span className="text-xs font-mono text-slate-400">Vertical Expansion</span>
      </div>

        {/* Modal Backend Simulation */}
      <div className="bg-slate-50 dark:bg-slate-950 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg flex-1 min-h-[300px] flex items-center justify-center p-4">
        
        {/* The Modal */}
        <AnimatePresence mode="popLayout">
        <motion.div 
            key={locale}
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: "spring", bounce: 0.5, duration: 0.4 }}
            className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-full w-[280px] p-4 flex flex-col gap-3"
        >
            <div className={`h-8 w-8 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center text-red-500`}>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </div>
            
            <div>
                <motion.h5 layout className="font-bold text-slate-900 dark:text-white text-sm">{t.components.modal.title}</motion.h5>
                <motion.p layout className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-relaxed">
                    {t.components.modal.body}
                </motion.p>
            </div>

            <div className="flex flex-col-reverse gap-2 mt-1">
                <button className="w-full py-2 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-xs font-medium text-slate-700 dark:text-slate-200">
                    {t.actions.cancel}
                </button>
                <button className="w-full py-2 px-3 bg-red-600 rounded-md text-xs font-medium text-white shadow-sm ring-1 ring-red-600 ring-offset-1">
                    {t.components.modal.cta}
                </button>
            </div>
        </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
