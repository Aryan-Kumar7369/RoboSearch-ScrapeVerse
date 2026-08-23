'use client';

import { useState } from 'react';
import componentsData from '@data/components.json';
import Navbar from '@/components/Navbar';
import StatsOverview from '@/components/StatsOverview';
import ProductCard from '@/components/ProductCard';
import BomOptimizer from '@/components/BomOptimizer';
import PipelineModal from '@/components/PipelineModal';
import { calculateBOMOptimization } from '@/lib/bomCalculator';
import { RefreshCw } from 'lucide-react';

export default function Home() {
  const [selectedIds, setSelectedIds] = useState(['esp32-nodemcu', 'mg996r-servo']);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSyncAll = async () => {
    setIsSyncing(true);
    try {
      await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ collectorId: 'all' })
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSyncing(false);
    }
  };

  const bomResult = calculateBOMOptimization(selectedIds, componentsData);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-32">
      <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-100">Robotics Component Arbitrage</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              Live price intelligence & automated Bill of Materials (BOM) optimizer.
            </p>
          </div>

          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-400 text-xs font-mono transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-cyan-400' : ''}`} />
            {isSyncing ? 'Syncing Collectors...' : 'Sync Scrapers'}
          </button>
        </div>

        {/* Stats Strip */}
        <StatsOverview totalComponents={componentsData.length} totalVendors={4} avgSavings={185} />

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {componentsData.map(item => (
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