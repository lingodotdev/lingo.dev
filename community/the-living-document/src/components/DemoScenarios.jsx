import React from 'react';
import { Sparkles, Terminal, MessageSquare, Smile, Coffee, Zap } from 'lucide-react';

const SCENARIO_CATEGORIES = [
    {
        id: 'nuance',
        label: 'Emotional Nuance',
        icon: Coffee,
        prompts: [
            'The coffee was decent, but the conversation was intoxicating.',
            'She spoke with a silence that was louder than words.',
            'The nostalgia was bittersweet, like a forgotten melody.'
        ],
        color: 'hover:border-pastel-purple/50',
        description: 'Observe how literal meanings shift into social and emotional contexts.'
    },
    {
        id: 'idioms',
        label: 'Cultural Idioms',
        icon: Zap,
        prompts: [
            "We're not just reinventing the wheel; we're launching it into orbit.",
            "That's the best thing since sliced bread, honestly.",
            "Let's not beat around the bush and get straight to the point."
        ],
        color: 'hover:border-pastel-pink/50',
        description: 'Watch idioms adapt naturally instead of being translated word-for-word.'
    },
    {
        id: 'technical',
        label: 'Technical Context',
        icon: Terminal,
        prompts: [
            'To initialize the hook, use `const { data } = useSWR("/api/user")` inside your React component.',
            'Ensure the `API_KEY` is set in your `.env` file before running `npm run dev`.',
            'The `LingoDotDevEngine` handles batching and optimization automatically.'
        ],
        color: 'hover:border-pastel-blue/50',
        description: 'Technical code blocks remain preserved while natural language is translated.'
    },
    {
        id: 'casual',
        label: 'Casual Slang',
        icon: MessageSquare,
        prompts: [
            "That presentation was straight fire! You really crushed it.",
            "I'm feeling a bit under the weather today, might need to take a rain check.",
            "No cap, this is the best translation tool I've ever used."
        ],
        color: 'hover:border-pastel-green/50',
        description: 'Testing how modern slang and informal expressions are handled.'
    }
];

export function DemoScenarios({ onSelect }) {
    const handleSelect = (category) => {
        const randomPrompt = category.prompts[Math.floor(Math.random() * category.prompts.length)];
        onSelect(randomPrompt);
    };

    return (
        <div className="flex flex-col items-center gap-6 mt-12 w-full max-w-4xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-white/20 mb-2">
                Click a category to test randomized prompts
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {SCENARIO_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    return (
                        <button
                            key={category.id}
                            onClick={() => handleSelect(category)}
                            className={`flex flex-col gap-3 p-5 rounded-2xl border border-white/5 bg-white/[0.02] text-left transition-all hover:bg-white/5 hover:scale-[1.02] active:scale-[0.98] group ${category.color}`}
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                                    <Icon className="w-4 h-4 text-pastel-pink" />
                                </div>
                                <span className="font-semibold text-white/80 group-hover:text-white">{category.label}</span>
                            </div>
                            <div className="text-[10px] text-pastel-blue font-bold uppercase tracking-tight opacity-50 group-hover:opacity-100 transition-opacity">
                                {category.description}
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
