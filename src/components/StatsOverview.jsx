import { Activity, Store, TrendingDown, Cpu } from 'lucide-react';
import { formatINR } from '@/lib/formatters';

export default function StatsOverview({ totalComponents, totalVendors = 4, avgSavings = 185 }) {
  const stats = [
    {
      label: "Active Collectors",
      value: "4 / 4",
      sub: "Robu, Flyrobo, EComp, Amzn",
      icon: Cpu,
      color: "text-cyan-400",
      border: "border-cyan-500/30",
      bg: "bg-cyan-950/30"
    },
    {
      label: "Stores Tracked",
      value: totalVendors,
      sub: "Indian Robotics Distributors",
      icon: Store,
      color: "text-indigo-400",
      border: "border-indigo-500/30",
      bg: "bg-indigo-950/30"
    },
    {
      label: "Catalog Monitored",
      value: totalComponents,
      sub: "Critical BOM Microcontrollers & Servos",
      icon: Activity,
      color: "text-emerald-400",
      border: "border-emerald-500/30",
      bg: "bg-emerald-950/30"
    },
    {
      label: "Avg BOM Savings",
      value: `~${formatINR(avgSavings)}`,
      sub: "Optimized Split Arbitrage",
      icon: TrendingDown,
      color: "text-amber-400",
      border: "border-amber-500/30",
      bg: "bg-amber-950/30"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <div
            key={idx}
            className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">{stat.label}</span>
              <div className={`p-2 rounded-lg border ${stat.border} ${stat.bg} ${stat.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3">
              <div className="text-xl font-bold font-mono text-slate-100">{stat.value}</div>
              <div className="text-[11px] text-slate-500 truncate mt-0.5">{stat.sub}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}