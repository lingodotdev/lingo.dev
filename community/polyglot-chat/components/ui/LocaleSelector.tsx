import React from "react";
import { SUPPORTED_LOCALES } from "@/lib/locales";

interface LocaleSelectorProps {
    value: string;
    onChange: (locale: string) => void;
    label?: string;
}

export function LocaleSelector({
    value,
    onChange,
    label,
}: LocaleSelectorProps) {
    return (
        <div className="locale-selector">
            {label && (
                <label
                    style={{
                        fontSize: "0.75rem",
                        color: "var(--color-text-muted)",
                    }}
                >
                    {label}
                </label>
            )}
            <select
                className="locale-select"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            >
                {SUPPORTED_LOCALES.map((locale) => (
                    <option key={locale.code} value={locale.code}>
                        {locale.flag} {locale.nativeName}
                    </option>
                ))}
            </select>
        </div>
    );
}
