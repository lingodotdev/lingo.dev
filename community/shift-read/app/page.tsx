"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setError("Please enter a URL");
      return;
    }

    if (!trimmedUrl.startsWith("https://")) {
      setError("Please enter a valid HTTPS URL");
      return;
    }

    setError("");
    const encoded = encodeURIComponent(trimmedUrl);
    router.push(`/read/${encoded}`);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center">
      <header className="max-w-lg absolute top-0 right-0 p-4 z-10">
        <ThemeToggle />
      </header>

      <main className="max-w-lg flex flex-col gap-8 items-center justify-center p-4">
        <div className="w-full space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight">Shift and Read</h1>
          <p className="text-xl text-muted-foreground">
            Read any blog on the internet in your language
          </p>
          <p className="text-md text-muted-foreground">
            Paste url below or append{" "}
            <span className="font-semibold">shift-read.vercel.app/read/</span>{" "}
            in front of any blog to enable read and translate.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 w-full">
          <div className="space-y-2">
            <label htmlFor="article-url" className="sr-only">
              Article URL
            </label>
            <input
              id="article-url"
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              placeholder="https://example.com/article"
              className="w-full h-14 px-4 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
            {error && (
              <p className="text-sm text-destructive text-left">{error}</p>
            )}
          </div>

          <Button type="submit" size="sm" className="w-full h-10 text-base">
            Extract & Read
          </Button>
        </form>
      </main>
    </div>
  );
}
