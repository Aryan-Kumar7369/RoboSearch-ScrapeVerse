import { Cpu, Terminal, Zap } from 'lucide-react';

export default function Navbar({ onOpenTerminal }) {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 shadow-glow-cyan">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              RoboSearch <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/50">IN</span>
            </h1>
            <p className="text-xs text-slate-400">Bright Data Scraper Studio Dashboard</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/50 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            4 Collectors Live
          </div>

          <button
            onClick={onOpenTerminal}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-950/40 hover:bg-indigo-900/50 border border-indigo-700/50 text-indigo-300 text-xs font-medium transition-all shadow-glow-indigo"
          >
            <Terminal className="w-4 h-4 text-indigo-400" />
            CLI Self-Healing
          </button>
        </div>
      </div>
    </header>
  );
}