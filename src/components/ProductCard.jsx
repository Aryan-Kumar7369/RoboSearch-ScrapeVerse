import { useState } from 'react';
import { ExternalLink, CheckCircle2, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { formatINR } from '@/lib/formatters';

export default function ProductCard({ item, isSelected, onToggleSelect }) {
  const [showSpecs, setShowSpecs] = useState(false);
  const bestVendor = item.vendors
    .filter(v => v.in_stock)
    .reduce((prev, curr) => (curr.price < prev.price ? curr : prev), item.vendors[0]);

  return (
    <div className={`relative flex flex-col rounded-xl border transition-all ${
      isSelected ? 'border-cyan-500/80 bg-slate-900/90 shadow-glow-cyan' : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
    } backdrop-blur-md overflow-hidden`}>
      <div className="p-5 flex gap-4">
        <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg border border-slate-800 bg-slate-950" />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                {item.category}
              </span>
              <h3 className="text-sm font-semibold text-slate-100 mt-1 line-clamp-2">{item.name}</h3>
            </div>
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onToggleSelect(item.id)}
              className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-cyan-500 focus:ring-offset-slate-900 bg-slate-800 cursor-pointer mt-1"
            />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xs text-slate-400">Lowest:</span>
            <span className="text-lg font-bold text-emerald-400">{formatINR(bestVendor.price)}</span>
            <span className="text-xs text-slate-400">on {bestVendor.name}</span>
          </div>
        </div>
      </div>

      <div className="px-5 pb-3">
        <button
          onClick={() => setShowSpecs(!showSpecs)}
          className="w-full flex items-center justify-between py-1.5 text-xs text-slate-400 hover:text-slate-200 border-t border-slate-800/80 transition-colors"
        >
          <span>Hardware Specifications</span>
          {showSpecs ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showSpecs && (
          <div className="grid grid-cols-2 gap-2 py-2 text-[11px] font-mono text-slate-300 border-b border-slate-800">
            {Object.entries(item.specs).map(([k, v]) => (
              <div key={k} className="bg-slate-950/60 p-1.5 rounded border border-slate-800/50">
                <span className="text-slate-400 uppercase">{k.replace('_', ' ')}:</span> {v}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vendor Table */}
      <div className="border-t border-slate-800/80 bg-slate-950/40 divide-y divide-slate-800/50">
        {item.vendors.map((vendor) => (
          <div key={vendor.name} className="px-5 py-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {vendor.in_stock ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-rose-500" />
              )}
              <span className={vendor.in_stock ? 'text-slate-200' : 'text-slate-400'}>{vendor.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-mono text-slate-200">{formatINR(vendor.price)}</span>
              <a
                href={vendor.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-400 hover:text-cyan-400 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}