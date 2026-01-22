"use client";

import { useState, useEffect } from "react";

export type Provider = "lingo" | "gemini" | "huggingface" | "none";

interface ProviderInfo {
    provider: Provider;
    available: boolean;
    redactionEnabled: boolean;
    supportedLanguages: string[];
}

export function useTranslationProvider() {
    const [providerInfo, setProviderInfo] = useState<ProviderInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch("/api/translate")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch provider info");
                return res.json();
            })
            .then((data) => {
                setProviderInfo(data);
                setIsLoading(false);
            })
            .catch((err) => {
                setError(err);
                setIsLoading(false);
            });
    }, []);

    return { providerInfo, isLoading, error };
}

interface TranslateOptions {
    text: string;
    targetLang: string;
    sourceLang?: string;
    skipCache?: boolean;
}

interface TranslationResult {
    translation: string;
    source: "TM" | "LIVE" | "SAME_LANG";
    provider: string;
    latencyMs: number;
    cached: boolean;
}

export function useTranslation() {
    const [isTranslating, setIsTranslating] = useState(false);

    const translate = async (
        options: TranslateOptions,
    ): Promise<TranslationResult | null> => {
        setIsTranslating(true);
        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    text: options.text,
                    sourceLang: options.sourceLang || "auto",
                    targetLang: options.targetLang,
                    skipCache: options.skipCache || false,
                }),
            });

            if (!response.ok) {
                throw new Error("Translation failed");
            }

            const data = await response.json();
            if (data.success) {
                return {
                    translation: data.translation,
                    source: data.source,
                    provider: data.provider,
                    latencyMs: data.latencyMs,
                    cached: data.cached,
                };
            }
            return null;
        } catch (error) {
            console.error("Translation error:", error);
            return null;
        } finally {
            setIsTranslating(false);
        }
    };

    return { translate, isTranslating };
}
