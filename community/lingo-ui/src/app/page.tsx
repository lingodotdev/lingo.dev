"use client";

import React from "react";
import { Translate, LanguageSwitcher, useLingo } from "@/lingo-ui";


const TranslationLoader = ({ isLoading }: { isLoading: boolean }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-gray-100">
      {/* This bar uses a simple CSS animation to move the gradient. 
         We add the style directly here to avoid needing tailwind.config.js changes.
      */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .loader-bar {
          animation: shimmer 1.5s infinite linear;
        }
      `}</style>
      <div className="loader-bar h-full w-full bg-gradient-to-r from-transparent via-indigo-600 to-transparent opacity-75"></div>
    </div>
  );
};

export default function Home() {
  const { isTranslating } = useLingo();

  return (
    <div className="relative min-h-screen bg-white text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Background Texture */}
      <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

      {/* Simple Top Loader */}
      <TranslationLoader isLoading={isTranslating} />

      {/* Sticky Header */}
      <nav className="sticky top-0 z-50 border-b border-gray-200/50 bg-white/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-600 to-violet-600 shadow-sm"></div>
            <span className="font-bold tracking-tight text-lg">LingoUI</span>
          </div>
          <LanguageSwitcher />
        </div>
      </nav>

      <main className="relative z-10 mx-auto max-w-5xl px-6 pt-20 pb-24">
        
        {/* Hero Section */}
        <section className="mb-24 text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-sm text-gray-500 hover:bg-white hover:shadow-sm transition-all cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
            <Translate>v1.0 is now live</Translate>
          </div>
          
          <h1 className="mx-auto max-w-4xl text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl">
            <Translate>Internationalization</Translate>{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
              <Translate>for everyone.</Translate>
            </span>
          </h1>
          
          <p className="mx-auto max-w-2xl text-xl text-gray-500 leading-relaxed">
            <Translate>
              Stop managing complex JSON files. Just wrap your text components and let the AI engine handle the localization instantly.
            </Translate>
          </p>
        </section>

        {/* Code Demo - Mac Window Style */}
        <section className="mx-auto mb-24 max-w-3xl transform transition-all hover:scale-[1.01] duration-500">
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
            {/* Window Controls */}
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50/50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
              <div className="h-3 w-3 rounded-full bg-green-400"></div>
              <div className="ml-auto text-xs font-medium text-gray-400 font-mono">page.tsx</div>
            </div>
            
            <div className="p-6 md:p-8 overflow-x-auto bg-[#FAFAFA]">
              <div className="font-mono text-sm leading-relaxed">
                <div className="table-row">
                  <span className="table-cell pr-6 text-right select-none text-gray-300">1</span>
                  <span className="table-cell">
                    <span className="text-purple-600">import</span> {"{"} Translate {"}"} <span className="text-purple-600">from</span> <span className="text-green-600">"lingo-ui"</span>;
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-6 text-right select-none text-gray-300">2</span>
                  <span className="table-cell">&nbsp;</span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-6 text-right select-none text-gray-300">3</span>
                  <span className="table-cell">
                    <span className="text-blue-600">export default</span> <span className="text-purple-600">function</span> <span className="text-yellow-600">Page</span>() {"{"}
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-6 text-right select-none text-gray-300">4</span>
                  <span className="table-cell">
                    &nbsp;&nbsp;<span className="text-purple-600">return</span> (
                  </span>
                </div>
                <div className="table-row bg-indigo-50/50">
                  <span className="table-cell pr-6 text-right select-none text-indigo-200 border-l-2 border-indigo-500">5</span>
                  <span className="table-cell">
                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;<span className="text-red-600">Translate</span>&gt;<span className="font-semibold text-gray-800">Hello World</span>&lt;/<span className="text-red-600">Translate</span>&gt;
                  </span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-6 text-right select-none text-gray-300">6</span>
                  <span className="table-cell">&nbsp;&nbsp;);</span>
                </div>
                <div className="table-row">
                  <span className="table-cell pr-6 text-right select-none text-gray-300">7</span>
                  <span className="table-cell">{"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Live Example */}
        <section className="relative overflow-hidden rounded-2xl bg-gray-900 p-8 md:p-12 text-white shadow-2xl">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-10 -ml-10 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="inline-block rounded-lg bg-indigo-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-300 mb-4 border border-indigo-500/30">
                <Translate>Live Preview</Translate>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-200">
                  <Translate>
                    "This entire block of text is being translated on the fly. 
                    Switch the language using the toggle in the top right corner.
                    LingoUI handles dynamic content updates without refreshing the page."
                  </Translate>
                </p>
              </div>
            </div>
            {/* Visual indicator of "AI" processing */}
            <div className="hidden md:flex h-24 w-24 rounded-full border border-white/10 bg-white/5 items-center justify-center backdrop-blur-md shadow-inner">
               <span className="text-4xl animate-pulse">✨</span>
            </div>
          </div>
        </section>

        <footer className="mt-24 border-t border-gray-100 pt-12 text-center">
          <p className="text-sm text-gray-500">
            <Translate>Built for the Lingo.dev Hackathon</Translate> &copy; 2024
          </p>
        </footer>
      </main>
    </div>
  );
}

// Simple Feature Card Component for cleanliness
function FeatureCard({ icon, title, desc }: { icon: string, title: string, desc: string }) {
  return (
    <div className="group rounded-xl border border-gray-100 bg-white p-6 transition-all hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-100/40">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50 text-xl transition-colors group-hover:bg-indigo-50 group-hover:text-indigo-600">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        <Translate>{title}</Translate>
      </h3>
      <p className="text-sm text-gray-500 leading-relaxed">
        <Translate>{desc}</Translate>
      </p>
    </div>
  );
}