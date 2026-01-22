import React from "react";

interface ProviderBadgeProps {
    provider: "lingo" | "gemini" | "huggingface" | "none" | string;
    showDescription?: boolean;
    size?: "sm" | "md" | "lg";
}

const PROVIDER_CONFIG = {
    lingo: {
        label: "✨ Lingo.dev",
        description: "Best quality translations",
        className: "provider-lingo",
    },
    gemini: {
        label: "🚀 Gemini",
        description: "Fast & capable AI",
        className: "provider-gemini",
    },
    huggingface: {
        label: "🤗 HuggingFace",
        description: "Free community models",
        className: "provider-huggingface",
    },
    none: {
        label: "⚠️ No Provider",
        description: "Configure API keys",
        className: "",
    },
};

export function ProviderBadge({
    provider,
    showDescription = false,
    size = "md",
}: ProviderBadgeProps) {
    const config =
        PROVIDER_CONFIG[provider as keyof typeof PROVIDER_CONFIG] ||
        PROVIDER_CONFIG.none;

    const sizeStyles = {
        sm: { fontSize: "0.65rem", padding: "0.125rem 0.375rem" },
        md: { fontSize: "0.75rem", padding: "0.25rem 0.5rem" },
        lg: { fontSize: "0.875rem", padding: "0.375rem 0.75rem" },
    };

    return (
        <span
            className={`provider-badge ${config.className}`}
            style={sizeStyles[size]}
        >
            <span>{config.label}</span>
            {showDescription && (
                <span
                    style={{ opacity: 0.7, fontSize: "0.9em", marginLeft: "0.25rem" }}
                >
                    — {config.description}
                </span>
            )}
        </span>
    );
}

interface TranslationBadgeProps {
    source: "TM" | "LIVE" | "SAME_LANG" | string;
}

const BADGE_CONFIG = {
    TM: {
        label: "TM",
        tooltip: "From Translation Memory cache",
        className: "badge-tm",
    },
    LIVE: {
        label: "Translated",
        tooltip: "Live translation via API",
        className: "badge-live",
    },
    SAME_LANG: {
        label: "Original",
        tooltip: "No translation needed",
        className: "",
    },
};

export function TranslationBadge({ source }: TranslationBadgeProps) {
    const config = BADGE_CONFIG[source as keyof typeof BADGE_CONFIG];
    if (!config) return null;

    return (
        <span
            className={`badge ${config.className} tooltip`}
            data-tooltip={config.tooltip}
        >
            {config.label}
        </span>
    );
}

interface LanguageBadgeProps {
    code: string;
}

export function LanguageBadge({ code }: LanguageBadgeProps) {
    return (
        <span
            style={{
                fontSize: "0.75rem",
                color: "var(--color-text-muted)",
                padding: "0.125rem 0.375rem",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "4px",
            }}
        >
            {code.toUpperCase()}
        </span>
    );
}
