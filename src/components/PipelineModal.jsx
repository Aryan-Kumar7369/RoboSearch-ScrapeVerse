import { useEffect, useState } from 'react';
import { X, Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';

export default function PipelineModal({ isOpen, onClose }) {
  const [logs, setLogs] = useState([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLogs([]);
      setRunning(true);
      const eventSource = new EventSource('/api/heal');

      eventSource.onmessage = (e) => {
        const data = JSON.parse(e.data);
        setLogs(prev => [...prev, data]);
      };

      eventSource.onerror = () => {
        setRunning(false);
        eventSource.close();
      };

      return () => eventSource.close();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
            <TerminalIcon className="w-4 h-4 text-indigo-400" />
            Bright Data Self-Healing Terminal Emulator
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-4 h-80 overflow-y-auto font-mono text-xs space-y-2 bg-slate-950/90 text-slate-300">
          {logs.map((item, idx) => (
            <div key={idx} className="flex gap-3 leading-relaxed">
              <span className="text-slate-400">[{item.timestamp}]</span>
              <span className={item.log.includes('[AI Healing]') ? 'text-amber-400' : item.log.includes('[Status]') ? 'text-emerald-400' : 'text-slate-200'}>
                {item.log}
              </span>
            </div>
          ))}
          {running && (
            <div className="flex items-center gap-2 text-cyan-400 animate-pulse mt-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Streaming scraper diagnostic logs...
            </div>
          )}
        </div>

        <div className="px-4 py-3 bg-slate-900/60 border-t border-slate-800 flex justify-between items-center text-xs">
          <span className="text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Selectors Repaired
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}