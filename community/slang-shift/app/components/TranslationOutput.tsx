'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Highlight {
    original: string;
    literal: string;
    localized: string;
    reason: string;
}

interface TranslationResult {
    literal: string;
    localized: string;
    highlights: Highlight[];
    explanation: string;
}

interface TranslationOutputProps {
    result: TranslationResult | null;
    isLoading: boolean;
    selectedTone: string;
}

function SkeletonLoader() {
    return (
        <div className="space-y-3">
            <div className="skeleton h-4 w-3/4" />
            <div className="skeleton h-4 w-full" />
            <div className="skeleton h-4 w-5/6" />
        </div>
    );
}

function HighlightedText({
    text,
    highlights
}: {
    text: string;
    highlights: Highlight[];
}) {
    if (!highlights.length) {
        return <span>{text}</span>;
    }

    // Simple highlight rendering - in production you'd want smarter matching
    let result = text;

    return (
        <span>
            {highlights.map((h, i) => {
                const parts = result.split(h.localized);
                if (parts.length > 1) {
                    return (
                        <span key={i}>
                            {parts[0]}
                            <span className="tooltip-container inline">
                                <span className="word-highlight">{h.localized}</span>
                                <span className="tooltip max-w-xs whitespace-normal">
                                    <strong className="text-[var(--accent-primary)]">{h.original}</strong>
                                    <span className="text-[var(--text-muted)]"> → </span>
                                    <span>{h.localized}</span>
                                    <br />
                                    <span className="text-[var(--text-secondary)] text-xs mt-1 block">{h.reason}</span>
                                </span>
                            </span>
                            {parts.slice(1).join(h.localized)}
                        </span>
                    );
                }
                return null;
            }).filter(Boolean)}
            {!highlights.some(h => text.includes(h.localized)) && text}
        </span>
    );
}

export default function TranslationOutput({ result, isLoading, selectedTone }: TranslationOutputProps) {
    const showLiteral = selectedTone !== 'literal';

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-display-md font-semibold">Translation</h3>
                {result && (
                    <motion.span
                        className="label label-accent"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        Localized
                    </motion.span>
                )}
            </div>

            <div className={`grid gap-4 ${showLiteral ? 'md:grid-cols-2' : 'grid-cols-1'}`}>
                {/* Literal Translation (shown for comparison when not in literal mode) */}
                {showLiteral && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4 }}
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <span className="label">Literal</span>
                            <span className="text-xs text-[var(--text-muted)]">What Google would give you</span>
                        </div>
                        <div className="output-panel literal">
                            <AnimatePresence mode="wait">
                                {isLoading ? (
                                    <motion.div
                                        key="loading"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                    >
                                        <SkeletonLoader />
                                    </motion.div>
                                ) : result ? (
                                    <motion.p
                                        key="content"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-body text-[var(--text-secondary)]"
                                    >
                                        {result.literal}
                                    </motion.p>
                                ) : (
                                    <motion.p
                                        key="empty"
                                        className="text-[var(--text-muted)] italic"
                                    >
                                        Literal translation will appear here...
                                    </motion.p>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}

                {/* Localized/Main Translation */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: showLiteral ? 0.1 : 0 }}
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="label label-accent">
                            {selectedTone === 'literal' ? 'Translation' : 'Culturally Adapted'}
                        </span>
                        {selectedTone !== 'literal' && (
                            <span className="text-xs text-[var(--accent-primary)]">✨ lingo.dev magic</span>
                        )}
                    </div>
                    <div className="output-panel localized">
                        <AnimatePresence mode="wait">
                            {isLoading ? (
                                <motion.div
                                    key="loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                >
                                    <SkeletonLoader />
                                </motion.div>
                            ) : result ? (
                                <motion.div
                                    key="content"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <p className="text-body-lg text-[var(--text-primary)]">
                                        <HighlightedText
                                            text={result.localized}
                                            highlights={result.highlights}
                                        />
                                    </p>
                                </motion.div>
                            ) : (
                                <motion.p
                                    key="empty"
                                    className="text-[var(--text-muted)] italic"
                                >
                                    Your culturally-adapted translation will appear here...
                                </motion.p>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </div>

            {/* Explanation Panel */}
            <AnimatePresence>
                {result?.explanation && selectedTone !== 'literal' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="glass-card p-4 mt-4">
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">🧠</span>
                                <div>
                                    <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                                        Why this translation?
                                    </h4>
                                    <p className="text-small text-[var(--text-secondary)]">
                                        {result.explanation}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
