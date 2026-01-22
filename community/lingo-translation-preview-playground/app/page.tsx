"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { TextInput } from "@/components/TextInput";
import { LanguageSelector } from "@/components/LanguageSelector";
import { PreviewGrid } from "@/components/PreviewGrid";
import { Button } from "@/components/ui/button";
import { translateText } from "@/lib/lingo";

export default function Home() {
  const { theme, setTheme } = useTheme();

  const [text, setText] = useState("");
  const [languages, setLanguages] = useState<string[]>(["fr", "es", "de"]);
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  const handleTranslate = async () => {
    if (!text.trim() || languages.length === 0) return;

    setLoading(true);
    setTranslations({});
    setError(null);

    try {
      const result = await translateText(text, languages);
      setTranslations(result);
    } catch (e: any) {
      setError(
        e?.message ?? "Failed to translate. Check your API key and try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-12 transition-colors">
      <div className="absolute right-4 top-4">
        <Button variant="secondary" size="icon" onClick={toggleTheme}>
          {theme === "dark" ? <Sun /> : <Moon />}
        </Button>
      </div>

      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-extrabold sm:text-4xl">
            Lingo Translation Preview <br />
            Playground
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Preview how text adapts to multiple languages.
          </p>
        </div>

        <section className="bg-card rounded-xl border p-6 space-y-6">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <TextInput value={text} onChange={setText} disabled={loading} />
            </div>

            <div className="space-y-6">
              <LanguageSelector
                selectedLanguages={languages}
                onChange={setLanguages}
                disabled={loading}
              />

              <Button
                size="lg"
                className="w-full"
                disabled={loading || !text.trim()}
                onClick={handleTranslate}
              >
                {loading ? "Translating…" : "Generate Previews"}
              </Button>
            </div>
          </div>
        </section>

        {error && (
          <div className="border border-destructive/50 bg-destructive/15 p-4 rounded-md text-destructive">
            <p className="text-sm font-medium">Translation Error</p>
            <p className="text-sm mt-1">{error}</p>
          </div>
        )}

        <PreviewGrid
          originalText={text}
          translations={translations}
          isLoading={loading}
          selectedLanguages={languages}
        />

        <footer className="py-8 text-center text-sm text-muted-foreground">
          Powered by{" "}
          <a
            href="https://lingo.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Lingo.dev
          </a>
        </footer>
      </div>
    </main>
  );
}
