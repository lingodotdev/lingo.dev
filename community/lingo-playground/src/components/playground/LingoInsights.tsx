"use client";

import { useI18n } from "@/lib/I18nContext";
import { motion } from "framer-motion";

export function LingoInsights() {
  const { t, locale } = useI18n();

  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-1 p-6 bg-white dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl flex flex-col gap-6 relative overflow-hidden transition-colors">
        {/* Background decorative blob - Made visible in light mode too for technical feel, or adjusted */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 blur-[80px] opacity-10 dark:opacity-30" />

      <div className="flex items-center gap-2 relative z-10">
        <div className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
        <span className="text-xs font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">Lingo.dev Engine</span>
      </div>

      <div className="space-y-6 relative z-10">
        <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Detected Tone</span>
            <motion.div 
                key={`${locale}-tone`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-light text-slate-900 dark:text-white"
            >
                {t.insights.tone}
            </motion.div>
        </div>

        <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block mb-1">Text Expansion Factor</span>
            <div className="flex items-end gap-2">
                 <motion.div 
                    key={`${locale}-length`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-2xl font-light text-slate-900 dark:text-white"
                 >
                    {t.insights.length.split(' ')[0]} 
                 </motion.div>
                 <span className="text-sm text-slate-500 dark:text-slate-400 mb-1">{t.insights.length.split(' ').slice(1).join(' ')}</span>
            </div>
            
             {/* Visual Bar */}
             <div className="h-1 bg-slate-200 dark:bg-slate-800 rounded-full mt-3 overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: locale === 'de-DE' ? '80%' : locale === 'es-MX' ? '70%' : locale === 'en-US' ? '50%' : '40%' }}
                    className={`h-full ${locale === 'de-DE' ? 'bg-orange-500' : 'bg-indigo-500'}`}
                />
             </div>
        </div>

        <div className="pt-4 border-t border-slate-800">
             <div className="flex justify-between text-sm text-slate-300">
                <span>Components</span>
                <span>3 Active</span>
             </div>
             <div className="flex justify-between text-sm text-slate-300 mt-2">
                <span>Direction</span>
                <span className="text-indigo-400 font-mono text-xs uppercase">{t.meta.dir}</span>
             </div>
        </div>
      </div>
    </div>
  );
}
