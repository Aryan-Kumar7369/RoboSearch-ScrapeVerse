import { Check, X, ExternalLink, Cpu, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { formatINR } from '@/lib/formatters';

export default function ProductCard({ item, isSelected, onToggleSelect }) {
  const [specsOpen, setSpecsOpen] = useState(false);

  const availableVendors = item.vendors.filter(v => v.in_stock);
  const lowestVendor = availableVendors.length > 0
    ? availableVendors.reduce((min, v) => v.price < min.price ? v : min)
    : null;

  return (
    <div className={`relative rounded-xl border transition-all duration-300 overflow-hidden bg-slate-900/60 backdrop-blur-md ${
      isSelected 
        ? 'border-cyan-500/80 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30' 
        : 'border-slate-800 hover:border-slate-700'
    }`}>
      
      {/* Top Header & Select Checkbox */}
      <div className="p-4 border-b border-slate-800/80 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-cyan-950/80 border border-cyan-800 text-[10px] font-mono uppercase tracking-wider text-cyan-300 mb-1.5">
            <Cpu className="w-3 h-3" /> {item.category || 'Component'}
          </div>
          <h4 className="font-bold text-sm text-slate-100 leading-snug line-clamp-2">{item.name}</h4>
          {lowestVendor && (
            <div className="text-xs text-emerald-400 font-mono mt-1">
              Lowest: <span className="font-bold">{formatINR(lowestVendor.price)}</span> on {lowestVendor.name}
            </div>
          )}
        </div>

        <button
          onClick={() => onToggleSelect(item.id)}
          className={`w-6 h-6 rounded-md flex items-center justify-center transition-all cursor-pointer ${
            isSelected 
              ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan' 
              : 'border border-slate-700 hover:border-slate-500 bg-slate-800/50'
          }`}
          title="Toggle BOM Inclusion"
        >
          {isSelected && <Check className="w-4 h-4 stroke-3" />}
        </button>
      </div>

      {/* Hardware Specs Toggle */}
      {item.specs && Object.keys(item.specs).length > 0 && (
        <div className="border-b border-slate-800/60">
          <button
            onClick={() => setSpecsOpen(!specsOpen)}
            className="w-full px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 hover:text-slate-200 transition-colors bg-slate-950/30"
          >
            <span>Hardware Specifications</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${specsOpen ? 'rotate-180' : ''}`} />
          </button>
          {specsOpen && (
            <div className="px-4 py-2.5 bg-slate-950/80 space-y-1 text-xs">
              {Object.entries(item.specs).map(([key, val]) => (
                <div key={key} className="flex justify-between text-slate-400">
                  <span>{key}</span>
                  <span className="font-mono text-slate-200">{val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Vendor Pricing List */}
      <div className="p-3 space-y-2">
        {item.vendors.map((vendor, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-2 rounded-lg text-xs font-mono transition-colors ${
              vendor.in_stock ? 'bg-slate-950/40 border border-slate-800/60' : 'bg-rose-950/10 border border-rose-950/30 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2">
              {vendor.in_stock ? (
                <div className="w-2 h-2 rounded-full bg-emerald-400" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-rose-500" />
              )}
              <span className="text-slate-300 font-sans">{vendor.name}</span>
            </div>

            <div className="flex items-center gap-3">
              <span className={vendor.in_stock ? 'text-slate-100 font-bold' : 'text-slate-500 line-through'}>
                {formatINR(vendor.price)}
              </span>
              <a
                href={vendor.url}
                target="_blank"
                rel="noreferrer"
                className="text-slate-500 hover:text-cyan-400 transition-colors p-0.5"
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