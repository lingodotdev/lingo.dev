"use client";

import { useState, useTransition } from "react";
import { recognizeText, translateText } from "./actions/translate";

type Note = {
  id: string;
  original: string;
  translated: string;
  detectedLang: string;
};

export default function HomePage() {
  const [text, setText] = useState("");
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [lang, setLang] = useState("en");
  const [notes, setNotes] = useState<Note[]>([]);
  const [isPending, startTransition] = useTransition();

  const languages = ["en", "hi", "fr", "es"];

  const handleChange = (e: any) => {
    setLang(e.target.value);
  };

  const handleSubmit = () => {
    if (!text.trim()) return;

    startTransition(async () => {
      const detectedLang = await recognizeText(text);
      const result = await translateText(text, detectedLang, lang);

      setNotes((prev) => [
        {
          id: crypto.randomUUID(),
          original: text,
          translated: result,
          detectedLang: detectedLang,
        },
        ...prev,
      ]);

      setText("");
    });
  };

  const filteredNotes =
    query === ""
      ? notes
      : notes.filter(
          (note) =>
            note.translated.toLowerCase().includes(query.toLowerCase()) ||
            note.original.toLowerCase().includes(query.toLowerCase()),
        );

  const querySearch = () => {
    setQuery(searchQuery.trim());
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-950">
      <div className="max-w-2xl mx-auto p-6 space-y-8 text-slate-900 dark:text-slate-100">
        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">
            Auto-Localized Notes
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Write in any language. Read in your own.
          </p>
        </header>

        {/* Search */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-4 shadow-sm space-y-3">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Search notes
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search translated text…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              onClick={querySearch}
              className="rounded-md border dark:border-slate-700 px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:hover:bg-slate-800 disabled:opacity-50"
            >
              Search
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-4 shadow-sm space-y-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
            New note
          </label>

          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Write in any language…"
            className="w-full rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />

          <div className="flex items-center justify-between gap-3">
            <select
              value={lang}
              onChange={handleChange}
              className="rounded-md border bg-white dark:bg-slate-800 dark:border-slate-700 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {languages.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>

            <button
              onClick={handleSubmit}
              disabled={isPending}
              className="rounded-md bg-black dark:bg-white px-5 py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-900 dark:hover:bg-gray-200 disabled:opacity-60"
            >
              {isPending ? "Translating…" : "Add note"}
            </button>
          </div>
        </div>

        {/* Notes */}
        <section className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border bg-white dark:bg-slate-900 dark:border-slate-700 p-5 shadow-sm space-y-3"
            >
              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Original ({note.detectedLang})
                </p>
                <p className="text-sm whitespace-pre-wrap">{note.original}</p>
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Translated ({lang})
                </p>
                <p className="text-sm whitespace-pre-wrap">{note.translated}</p>
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
