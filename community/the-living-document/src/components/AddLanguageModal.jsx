import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Globe, Check } from 'lucide-react';

export function AddLanguageModal({ isOpen, onClose, onAdd }) {
    const [name, setName] = useState('');
    const [code, setCode] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name && code) {
            onAdd(name, code);
            setName('');
            setCode('');
            onClose();
        }
    };

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md bg-[#1a1a1a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
                        <h3 className="text-lg font-semibold text-white/90 flex items-center gap-2">
                            <Globe className="w-5 h-5 text-pastel-blue" />
                            Add Custom Language
                        </h3>
                        <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/20 ml-1">Language Name</label>
                            <input
                                autoFocus
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g., Brazilian Portuguese"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-pastel-purple/50 transition-colors"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-widest text-white/20 ml-1">Locale Code (BCP-47)</label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                placeholder="e.g., pt-BR"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-pastel-pink/50 transition-colors"
                                required
                            />
                            <p className="text-[10px] text-white/30 ml-1 italic">
                                Examples: en-US, es-ES, zh-CN, hi-IN
                            </p>
                        </div>

                        <button
                            type="submit"
                            className="w-full mt-4 bg-white text-black font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Check className="w-5 h-5" />
                            Add Language
                        </button>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
