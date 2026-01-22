import LanguageSwitcher from "./components/LanguageSwitcher";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white font-sans selection:bg-blue-500 selection:text-white">
      <LanguageSwitcher />

      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4">
        <div className="mb-6 p-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500">
          <div className="bg-slate-900 rounded-full p-2">
            <span className="text-2xl">👨‍💻</span>
          </div>
        </div>
        <h1 className="text-6xl font-extrabold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
          Hello, I'm Alex.
        </h1>
        <p className="text-xl text-slate-400 max-w-2xl leading-relaxed">
          Building digital experiences that transcend borders.
          <br />
          <span className="text-slate-500 text-sm">(Try switching the language!)</span>
        </p>
      </section>

      {/* Skills Section */}
      <section className="py-20 px-4 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center border-b border-slate-700 pb-4">
          Technical Arsenal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 */}
          <div className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl hover:bg-slate-800 transition shadow-xl">
            <h3 className="font-bold text-xl mb-3 text-blue-400">Frontend</h3>
            <p className="text-slate-300">
              Crafting responsive, accessible interfaces with React, Next.js, and modern CSS architecture.
            </p>
          </div>
          {/* Card 2 */}
          <div className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl hover:bg-slate-800 transition shadow-xl">
            <h3 className="font-bold text-xl mb-3 text-purple-400">Backend</h3>
            <p className="text-slate-300">
              Scalable server-side solutions using Node.js, PostgreSQL, and edge computing.
            </p>
          </div>
          {/* Card 3 */}
          <div className="p-8 bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl hover:bg-slate-800 transition shadow-xl">
            <h3 className="font-bold text-xl mb-3 text-emerald-400">Global</h3>
            <p className="text-slate-300">
              Internationalization (i18n) at scale using Lingo.dev to reach users everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-4 text-center">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 max-w-4xl mx-auto shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 text-white">Let's Work Together</h2>
          <p className="text-blue-100 mb-8 max-w-xl mx-auto">
            I am currently open for new opportunities and open-source collaborations.
          </p>
          <button className="bg-white text-blue-900 font-bold px-8 py-4 rounded-full hover:shadow-lg hover:scale-105 transition transform">
            Get In Touch
          </button>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-600 text-sm">
        <p>Built for the Lingo.dev Community Showcase</p>
      </footer>
    </main>
  );
}