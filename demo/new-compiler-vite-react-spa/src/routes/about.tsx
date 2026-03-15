"use i18n";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <main className="flex grow w-full flex-col items-center gap-4 py-32 px-16 bg-white dark:bg-black sm:items-start text-gray-100">
      <h1 className="text-4xl font-bold mb-4">About Lingo.dev</h1>
      <p className="mb-4">
        This is a demo application showcasing the Lingo.dev compiler for
        automatic translations in React applications.
      </p>
      <div className="space-y-4 max-w-2xl">
        <section>
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc list-inside space-y-2">
            <li>Automatic extraction of translatable text from JSX</li>
            <li>Build-time transformation with zero runtime overhead</li>
            <li>Support for multiple bundlers (Vite, Webpack, Next.js)</li>
            <li>Hash-based translation system for stable identifiers</li>
            <li>Server and client component support</li>
          </ul>
        </section>
        <section>
          <h2 className="text-2xl font-semibold mb-2">How It Works</h2>
          <p className="mb-2">
            The compiler analyzes your React components at build time and
            automatically extracts all translatable strings. It then generates
            translations using your configured translation provider.
          </p>
          <p>
            Simply add the "use i18n" directive at the top of your component
            files, and the compiler handles the rest!
          </p>
        </section>
      </div>
    </main>
  );
}
