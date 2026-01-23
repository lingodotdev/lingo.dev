import React, { useState, useMemo } from 'react';
import { SearchInput } from '../components/features/SearchInput';
import { EmergencyCard } from '../components/features/EmergencyCard';
import emergenciesData from '../data/emergencies.json';
import { Badge } from '../components/ui/badge';

export default function SearchPage() {
    const [query, setQuery] = useState('');
    const allEmergencies = Object.values(emergenciesData);

    const filteredEmergencies = useMemo(() => {
        if (!query) return allEmergencies;
        const lowerQuery = query.toLowerCase();
        return allEmergencies.filter(e =>
            e.title.toLowerCase().includes(lowerQuery) ||
            e.symptoms?.some(s => s.toLowerCase().includes(lowerQuery)) ||
            e.overview?.toLowerCase().includes(lowerQuery)
        );
    }, [query, allEmergencies]);

    const popularTags = ["Snake Bite", "Heart Attack", "Burns", "Choking"];

    return (
        <div className="container px-4 mx-auto py-8 space-y-8">
            <div className="max-w-xl mx-auto space-y-4">
                <h1 className="text-3xl font-bold text-center text-slate-900">Find Emergency Guide</h1>
                <SearchInput
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="shadow-md"
                    autoFocus
                />
                <div className="flex flex-wrap justify-center gap-2">
                    <span className="text-xs text-slate-500 py-1">Popular:</span>
                    {popularTags.map(tag => (
                        <Badge
                            key={tag}
                            variant="secondary"
                            className="cursor-pointer hover:bg-slate-200"
                            onClick={() => setQuery(tag)}
                        >
                            {tag}
                        </Badge>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmergencies.length > 0 ? (
                    filteredEmergencies.map(emergency => (
                        <EmergencyCard key={emergency.slug} emergency={emergency} />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No emergencies found for "{query}". Try checking categories.
                    </div>
                )}
            </div>
        </div>
    );
}
