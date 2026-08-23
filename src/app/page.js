'use client';

import { useState } from 'react';
import initialComponents from '@data/components.json';
import Navbar from '@/components/Navbar';
import StatsOverview from '@/components/StatsOverview';
import ProductCard from '@/components/ProductCard';
import BomOptimizer from '@/components/BomOptimizer';
import PipelineModal from '@/components/PipelineModal';
import { calculateBOMOptimization } from '@/lib/bomCalculator';
import { RefreshCw, Search } from 'lucide-react';

export default function Home() {
  const [components, setComponents] = useState(initialComponents);
  const [selectedIds, setSelectedIds] = useState(['esp32-nodemcu', 'mg996r-servo']);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSyncScrapers = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryList: [
            { keyword: searchQuery || "ESP32 NodeMCU", site: "robu" },
            { keyword: searchQuery || "ESP32 NodeMCU", site: "flyrobo" },
            { keyword: searchQuery || "ESP32 NodeMCU", site: "electronicscomp" },
            { keyword: searchQuery || "ESP32 NodeMCU", site: "amazon" }
          ]
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsTerminalOpen(true);
      }
    } catch (err) {
      console.error("Scraper execution failed:", err);
    } finally {
      setIsSyncing(false);
    }
  };

  const bomResult = calculateBOMOptimization(selectedIds, components);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-32">
      <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {/* Search & Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Robotics Component Arbitrage</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Two-stage Bright Data Scraper Studio pipelines running live across Indian distributors.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search robot parts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-48 sm:w-64"
              />
            </div>
            <button
              onClick={handleSyncScrapers}
              disabled={isSyncing}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-cyan-950/60 border border-cyan-800/80 hover:bg-cyan-900/50 text-cyan-300 text-xs font-mono transition-all shadow-glow-cyan"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Dispatching...' : 'Sync Live Data'}
            </button>
          </div>
        </div>

        <StatsOverview totalComponents={components.length} totalVendors={4} avgSavings={185} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {components.map(item => (
            <ProductCard
              key={item.id}
              item={item}
              isSelected={selectedIds.includes(item.id)}
              onToggleSelect={toggleSelect}
            />
          ))}
        </div>
      </main>

      <BomOptimizer bomResult={bomResult} />
      <PipelineModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  );
}