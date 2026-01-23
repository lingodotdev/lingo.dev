import React from 'react';
import { Search } from 'lucide-react';
import { cn } from '../../lib/utils'; // Fixed path

export function SearchInput({ className, ...props }) {
    return (
        <div className={cn("relative", className)}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <input
                type="search"
                className="flex h-12 w-full rounded-full border border-slate-200 bg-white px-11 py-3 text-base ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm"
                placeholder="Search for symptoms (e.g., 'snake bite', 'chest pain')..."
                {...props}
            />
        </div>
    );
}
