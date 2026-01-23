import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Languages, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { diff_match_patch } from 'diff-match-patch';

const dmp = new diff_match_patch();

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function EditorPanel({
    content,
    onChange,
    language,
    onLanguageChange,
    languages,
    onOpenModal,
    isLastEdited,
    isUpdating,
    isTranslating,
    progress,
    placeholder = "Start typing...",
    accentColor = "pink"
}) {
    const editorRef = useRef(null);
    const prevContentRef = useRef(content);
    const [diffHtml, setDiffHtml] = React.useState(null);

    // Sync content and handle diff highlighting
    useEffect(() => {
        if (editorRef.current) {
            if (content !== editorRef.current.innerText) {
                // If content changed from outside (translation or scenario), sync it
                // But only show diff highlights if this wasn't the panel being typed in
                if (!isLastEdited) {
                    const diffs = dmp.diff_main(prevContentRef.current, content);
                    dmp.diff_cleanupSemantic(diffs);

                    // Convert diffs to HTML with highlights
                    const html = diffs.map(([type, text]) => {
                        if (type === 1) { // Insertion (new text)
                            return `<span class="bg-pastel-green/20 text-pastel-green rounded-sm px-0.5 animate-highlight-fade">${text}</span>`;
                        }
                        if (type === -1) return ''; // Deletion (don't show)
                        return text; // Unchanged
                    }).join('');

                    setDiffHtml(html);

                    // Clear highlight after 2 seconds
                    const timer = setTimeout(() => {
                        setDiffHtml(null);
                    }, 2000);

                    // Cleanup timer
                    editorRef.current.innerText = content;
                    return () => clearTimeout(timer);
                } else {
                    // Just update contents without highlights if it's the active editor
                    editorRef.current.innerText = content;
                }
            }
        }
        prevContentRef.current = content;
    }, [content, isLastEdited]);

    const handleInput = (e) => {
        const text = e.target.innerText;
        onChange(text);
    };

    const borderColors = {
        pink: 'border-pastel-pink/20 focus-within:border-pastel-pink/40',
        blue: 'border-pastel-blue/20 focus-within:border-pastel-blue/40',
        purple: 'border-pastel-purple/20 focus-within:border-pastel-purple/40',
        green: 'border-pastel-green/20 focus-within:border-pastel-green/40',
    };

    const iconColors = {
        pink: 'text-pastel-pink',
        blue: 'text-pastel-blue',
        purple: 'text-pastel-purple',
        green: 'text-pastel-green',
    };

    return (
        <div className={cn(
            "flex flex-col h-full min-h-[400px] border rounded-3xl bg-[#141414] overflow-hidden group transition-all duration-500",
            borderColors[accentColor]
        )}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/5 bg-white/[0.01]">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/5">
                        <Languages className={cn("w-4 h-4", iconColors[accentColor])} />
                    </div>
                    <div className="relative group/select">
                        <select
                            value={language}
                            onChange={(e) => {
                                if (e.target.value === 'ADD_NEW') {
                                    onOpenModal();
                                } else {
                                    onLanguageChange(e.target.value);
                                }
                            }}
                            className="bg-transparent text-sm font-extrabold tracking-tight focus:outline-none cursor-pointer appearance-none pr-8 relative z-10"
                        >
                            {languages.map((lang) => (
                                <option key={lang.value} value={lang.value} className="bg-[#1a1a1a]">
                                    {lang.label}
                                </option>
                            ))}
                            <option value="ADD_NEW" className="bg-[#1a1a1a] text-pastel-pink font-bold">
                                + Custom...
                            </option>
                        </select>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {isTranslating && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-2 text-[10px] text-pastel-pink font-bold uppercase tracking-widest"
                        >
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Translating
                        </motion.div>
                    )}
                    {isLastEdited && (
                        <span className="text-[10px] uppercase tracking-wider text-white/30 font-bold flex items-center gap-2">
                            <motion.span
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="w-1.5 h-1.5 rounded-full bg-pastel-pink shadow-[0_0_8px_rgba(255,182,193,0.5)]"
                            />
                            Editing
                        </span>
                    )}
                </div>
            </div>

            {/* Progress Bar */}
            <AnimatePresence>
                {isTranslating && (
                    <motion.div
                        initial={{ scaleX: 0, opacity: 0 }}
                        animate={{ scaleX: 1, opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-1 bg-white/5 relative z-20"
                    >
                        <motion.div
                            className={cn(
                                "h-full transition-all duration-300",
                                accentColor === 'pink' ? 'bg-pastel-pink' :
                                    accentColor === 'blue' ? 'bg-pastel-blue' :
                                        accentColor === 'purple' ? 'bg-pastel-purple' : 'bg-pastel-green'
                            )}
                            animate={{ width: `${progress}%` }}
                            transition={{ type: 'spring', damping: 20, stiffness: 100 }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Editor Area */}
            <motion.div
                className="relative flex-1 p-6"
                animate={isUpdating ? { scale: [1, 1.02, 1] } : {}}
                transition={{ duration: 0.4 }}
            >
                <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleInput}
                    className={cn(
                        "w-full h-full min-h-[300px] bg-transparent outline-none text-xl leading-relaxed text-white/90 whitespace-pre-wrap transition-all duration-300 font-medium",
                        isUpdating && "opacity-80"
                    )}
                    spellCheck="false"
                />

                {/* Diff Overlay (Visible only when setDiffHtml is active) */}
                <AnimatePresence>
                    {diffHtml && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 p-6 pointer-events-none text-xl leading-relaxed text-white/90 whitespace-pre-wrap select-none font-medium"
                            dangerouslySetInnerHTML={{ __html: diffHtml }}
                        />
                    )}
                </AnimatePresence>

                {!content && (
                    <div className="absolute top-6 left-6 pointer-events-none text-white/20 text-lg italic">
                        {placeholder}
                    </div>
                )}
            </motion.div>
        </div>
    );
}
