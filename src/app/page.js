'use client';

import { useState } from 'react';
import componentsData from '@data/components.json';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import BomOptimizer from '@/components/BomOptimizer';
import PipelineModal from '@/components/PipelineModal';
import { calculateBOMOptimization } from '@/lib/bomCalculator';

export default function Home() {
  const [selectedIds, setSelectedIds] = useState(['esp32-nodemcu', 'mg996r-servo']);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const bomResult = calculateBOMOptimization(selectedIds, componentsData);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans pb-32">
      <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex-1 w-full">
        <div className="mb-8">
          <h2 className="text-2xl font-bold tracking-tight text-slate-100">Robotics Component Arbitrage</h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time price intelligence across Robu.in, Flyrobo, ElectronicsComp, and Amazon India.
          </p>
        </div>

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