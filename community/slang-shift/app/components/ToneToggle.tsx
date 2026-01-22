'use client';

import { motion } from 'framer-motion';

interface Tone {
    id: string;
    label: string;
    description: string;
    icon: string;
}

const TONES: Tone[] = [
    {
        id: 'literal',
        label: 'Literal',
        description: 'Word-for-word translation',
        icon: '📖'
    },
    {
        id: 'casual',
        label: 'Casual',
        description: 'Relaxed everyday speech',
        icon: '😊'
    },
    {
        id: 'genz',
        label: 'Gen-Z',
        description: 'Internet slang & vibes',
        icon: '💀'
    },
    {
        id: 'formal',
        label: 'Formal',
        description: 'Professional & polished',
        icon: '👔'
    },
];

interface ToneToggleProps {
    selected: string;
    onChange: (id: string) => void;
}

export default function ToneToggle({ selected, onChange }: ToneToggleProps) {
    return (
        <div>
            <label className="block text-small font-medium text-[var(--text-secondary)] mb-3">
                Translation Tone
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {TONES.map((tone) => (
                    <motion.button
                        key={tone.id}
                        onClick={() => onChange(tone.id)}
                        className={`
              relative p-3 rounded-xl text-left transition-all duration-200
              ${selected === tone.id
                                ? 'bg-[var(--accent-primary)] text-[var(--bg-primary)]'
                                : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                            }
            `}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        style={{
                            border: selected === tone.id
                                ? '1px solid var(--accent-primary)'
                                : '1px solid var(--border-subtle)'
                        }}
                    >
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{tone.icon}</span>
                            <span className="font-semibold text-sm">{tone.label}</span>
                        </div>
                        <p className={`text-xs ${selected === tone.id ? 'opacity-80' : 'opacity-60'}`}>
                            {tone.description}
                        </p>

                        {/* Active indicator */}
                        {selected === tone.id && (
                            <motion.div
                                layoutId="tone-indicator"
                                className="absolute inset-0 rounded-xl border-2 border-[var(--accent-primary)]"
                                style={{ pointerEvents: 'none' }}
                                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            />
                        )}
                    </motion.button>
                ))}
            </div>
        </div>
    );
}
