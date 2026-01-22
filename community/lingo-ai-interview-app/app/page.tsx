import { LocaleSwitcher } from "@lingo.dev/compiler/react";

export default function Home() {
  const interviewQuestions = [
    "Tell me about yourself.",
    "What are your greatest strengths?",
    "Why do you want to work here?",
    "Describe a challenging situation you faced and how you handled it.",
    "Where do you see yourself in five years?"
  ];

  return (
    <main className="flex min-h-screen flex-col items-center p-24 bg-white dark:bg-black text-black dark:text-white">
      <header className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex mb-12">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Lingo.dev AI Interview Demo
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <LocaleSwitcher
             locales={[
                { code: "en", label: "English" },
                { code: "es", label: "Español" },
                { code: "fr", label: "Français" },
                { code: "de", label: "Deutsch" },
                { code: "hi", label: "हिन्दी" },
                { code: "ja", label: "日本語" }
             ]}
             className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          />
        </div>
      </header>

      <div className="relative flex place-items-center mb-10">
        <h1 className="text-4xl font-bold">Interview Questions</h1>
      </div>

      <div className="grid text-center lg:max-w-5xl lg:w-full lg:grid-cols-1 lg:text-left gap-6">
        {interviewQuestions.map((q, i) => (
             <div key={i} className="group rounded-lg border border-gray-300 px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30">
               <h2 className={`mb-3 text-2xl font-semibold`}>
                 Question {i + 1}
               </h2>
               <p className={`m-0 max-w-[30ch] text-sm opacity-50 text-balance lg:max-w-full`}>
                 {q}
               </p>
             </div>
        ))}
      </div>
      
      <div className="mt-12 text-center text-sm opacity-50">
        <p>Select a language from the switcher above to translate these questions instantly.</p>
        <p className="mt-2 text-xs">(Powered by Lingo.dev SDK)</p>
      </div>
    </main>
  );
}
