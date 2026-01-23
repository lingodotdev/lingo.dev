import { Terminal, Github, ExternalLink } from "lucide-react";

export function Header() {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-black border-b border-gray-900/50">
      <div className="flex items-center gap-3">
        {/* Logo with glow effect */}
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full" />
          <Terminal className="w-5 h-5 text-emerald-500 relative" />
        </div>
        <span className="font-bold text-white tracking-tight text-lg">
          Lingo<span className="text-emerald-400">Pad</span>
        </span>
        <span className="text-[9px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full uppercase tracking-widest">
          Beta
        </span>
      </div>

      <div className="flex items-center gap-1">
        <a
          href="https://lingo.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-900/50"
        >
          <span>Lingo.dev SDK</span>
          <ExternalLink className="w-3 h-3 opacity-50" />
        </a>
        <a
          href="https://github.com/lingodotdev/lingo.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-white transition-colors px-3 py-2 rounded-lg hover:bg-gray-900/50"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
