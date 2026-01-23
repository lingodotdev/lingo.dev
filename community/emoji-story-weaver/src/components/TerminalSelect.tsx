import React from 'react';

interface TerminalSelectProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    options: { value: string; label: string }[];
}

export const TerminalSelect: React.FC<TerminalSelectProps> = ({
    label,
    value,
    onChange,
    options,
}) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-foreground-muted text-sm">
                <span className="text-success">$</span> {label}
            </label>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-3 rounded text-sm cursor-pointer"
            >
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
