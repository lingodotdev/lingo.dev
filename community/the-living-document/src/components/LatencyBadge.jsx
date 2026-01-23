import React from 'react';
import { Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const cn = (...classes) => classes.filter(Boolean).join(' ');

export function LatencyBadge({ latency, isTranslating, fastMode }) {
    return (
        <div className="flex items-center gap-2 text-xs font-medium">
            <AnimatePresence mode="wait">
                {isTranslating ? (
                    <motion.div
                        key="translating"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className={cn(
                            "flex items-center gap-1.5",
                            fastMode ? "text-pastel-blue" : "text-pastel-pink"
                        )}
                    >
                        <Sparkles className="w-3 h-3 animate-pulse" />
                        <span>{fastMode ? 'Turbo Translating...' : 'Contextualizing...'}</span>
                    </motion.div>
                ) : latency > 0 ? (
                    <motion.div
                        key="latency"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={cn(
                            "px-3 py-1 rounded-full border flex items-center gap-2",
                            fastMode
                                ? "bg-pastel-blue/10 border-pastel-blue/20 text-pastel-blue font-bold"
                                : "bg-white/5 border-white/10 text-white/40"
                        )}
                    >
                        {fastMode && <Zap className="w-3 h-3" />}
                        <span>{latency}ms</span>
                        <span className="opacity-40 font-normal">({fastMode ? 'Fast' : 'Quality'})</span>
                    </motion.div>
                ) : null}
            </AnimatePresence>
        </div>
    );
}

