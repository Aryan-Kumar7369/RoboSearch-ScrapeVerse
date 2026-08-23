import { Layers, Zap } from 'lucide-react';
import { formatINR } from '@/lib/formatters';

export default function BomOptimizer({ bomResult }) {
  if (!bomResult) return null;

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 z-30">
      <div className="bg-slate-900/90 border border-cyan-500/40 backdrop-blur-xl rounded-xl p-4 shadow-2xl text-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-cyan-950 border border-cyan-800 rounded-lg text-cyan-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm">BOM Optimization Engine</h4>
            <p className="text-xs text-slate-400">
              Split across {bomResult.split.uniqueVendorsCount} stores vs single vendor bundle
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-slate-400">Split-Vendor Optimal</div>
            <div className="text-base font-bold font-mono text-emerald-400">
              {formatINR(bomResult.split.total)}
              <span className="text-[10px] text-slate-400 block">incl. {formatINR(bomResult.split.shipping)} shipping</span>
            </div>
          </div>

          {bomResult.consolidated && (
            <div className="text-right border-l border-slate-800 pl-6">
              <div className="text-xs text-slate-400">Single Store ({bomResult.consolidated.vendorName})</div>
              <div className="text-base font-bold font-mono text-slate-300">
                {formatINR(bomResult.consolidated.totalCost)}
              </div>
            </div>
          )}

          {bomResult.savings > 0 && (
            <div className="bg-emerald-950/60 border border-emerald-800/80 px-3 py-1.5 rounded-lg text-emerald-300 text-xs flex items-center gap-1.5">
              <Zap className="w-4 h-4 fill-emerald-400" />
              Save {formatINR(bomResult.savings)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}