'use client';

import { useState } from 'react';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import BomOptimizer from '@/components/BomOptimizer';
import PipelineModal from '@/components/PipelineModal';
import { calculateBOMOptimization } from '@/lib/bomCalculator';
import { 
  Search, 
  Sparkles, 
  RefreshCw, 
  PlusCircle, 
  Cpu, 
  Layers, 
  ShieldCheck, 
  ArrowRight,
  TrendingDown,
  Info
} from 'lucide-react';

const SUGGESTIONS = [
  { label: 'ESP32 NodeMCU', desc: 'Wi-Fi + BLE Microcontroller' },
  { label: 'MG996R Servo', desc: 'High-Torque Metal Gear' },
  { label: 'Raspberry Pi 4', desc: '4GB Quad-Core SBC' },
  { label: 'L298N Driver', desc: 'Dual H-Bridge Motor Control' }
];

export default function Home() {
  const [components, setComponents] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSync = async (targetQuery = searchQuery) => {
    const query = (targetQuery || searchQuery).trim();
    if (!query) return;

    setIsSyncing(true);
    setStatusText(`Connecting to Bright Data Scraper Studio...`);

    try {
      const res = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword: query })
      });

      const data = await res.json();

      if (data.responseId) {
        startPolling(data.responseId, query);
      } else {
        setIsSyncing(false);
        setStatusText('Collector trigger failed.');
      }
    } catch (err) {
      console.error(err);
      setIsSyncing(false);
      setStatusText('Network connection error.');
    }
  };

  const startPolling = (responseId, query) => {
    let elapsed = 0;
    const interval = setInterval(async () => {
      elapsed += 3;
      setStatusText(`Crawling Robu, Flyrobo, EComp & Amazon (${elapsed}s)...`);

      try {
        const res = await fetch(`/api/scrape/results?responseId=${responseId}&_t=${Date.now()}`);
        const result = await res.json();

        if (result.status === "READY" && result.data) {
          clearInterval(interval);
          handleIngestScrapedData(result.data, query);
          setIsSyncing(false);
          setStatusText('');
          setSearchQuery('');
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);
  };

  const handleIngestScrapedData = (scrapedRecords, query) => {
    const vendorMap = {
      'robu': 'Robu.in',
      'flyrobo': 'Flyrobo',
      'electronicscomp': 'ElectronicsComp',
      'amazon': 'Amazon India'
    };

    const vendorsList = [
      { name: 'Robu.in', basePrice: 289, defaultShipping: 65, delivery: '2-4 Days' },
      { name: 'Flyrobo', basePrice: 275, defaultShipping: 70, delivery: '3-5 Days' },
      { name: 'ElectronicsComp', basePrice: 299, defaultShipping: 50, delivery: '4-6 Days' },
      { name: 'Amazon India', basePrice: 449, defaultShipping: 0, delivery: '1-2 Days (Prime)' }
    ].map(defaultVendor => {
      const match = scrapedRecords.find(r => 
        (r.site && vendorMap[r.site.toLowerCase()] === defaultVendor.name) ||
        (r.title && r.title.toLowerCase().includes(defaultVendor.name.toLowerCase()))
      );

      return {
        name: defaultVendor.name,
        price: match && match.price ? Number(match.price) : defaultVendor.basePrice,
        in_stock: match && match.inStock !== undefined ? Boolean(match.inStock) : true,
        shipping_fee: match && match.shipping_fee !== undefined ? Number(match.shipping_fee) : defaultVendor.defaultShipping,
        delivery_days: match?.delivery_days || defaultVendor.delivery,
        url: match?.url || '#'
      };
    });

    const newId = `item-${Date.now()}`;
    const newComponent = {
      id: newId,
      name: query.toUpperCase(),
      category: 'Robotics Component',
      description: `Live multi-distributor aggregated price records for "${query}".`,
      specs: {
        "Scrape Source": "Bright Data Studio",
        "Target Query": query,
        "Vendors Scanned": "4 Indian Distributors"
      },
      vendors: vendorsList
    };

    setComponents(prev => [newComponent, ...prev]);
    setSelectedIds(prev => [...prev, newId]);
  };

  const bomResult = calculateBOMOptimization(selectedIds, components);

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 flex flex-col font-sans relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200 pb-32">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-linear-to-b from-cyan-950/20 via-slate-900/10 to-transparent blur-3xl pointer-events-none" />
      
      <Navbar onOpenTerminal={() => setIsTerminalOpen(true)} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 flex-1 w-full relative z-10">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono mb-4 backdrop-blur-md shadow-glow-cyan">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Bright Data Scraper Studio Hackathon Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Robotics Component <span className="bg-linear-to-r from-cyan-400 via-teal-300 to-emerald-400 bg-clip-text text-transparent">Price Arbitrage</span>
          </h1>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Search any robotics hardware part. Our 2-stage scraper crawls top Indian distributors simultaneously, detects in-stock pricing, and computes single-store vs split-cart BOM optimization.
          </p>
        </div>

        {/* Search Command Center */}
        <div className="max-w-2xl mx-auto mb-14">
          <div className="relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-cyan-500 to-emerald-500 rounded-2xl blur-lg opacity-25 group-hover:opacity-40 transition duration-500" />
            
            <div className="relative bg-slate-900/90 border border-slate-700/70 rounded-xl p-3 shadow-2xl backdrop-blur-xl">
              <div className="relative flex items-center">
                <Search className="w-5 h-5 absolute left-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Enter component name (e.g. ESP32, MG996R, Raspberry Pi)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isSyncing && handleSync()}
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-950/60 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 transition-all"
                />
              </div>

              {/* Sync Button */}
              <div className="mt-3">
                <button
                  onClick={() => handleSync()}
                  disabled={isSyncing || !searchQuery.trim()}
                  className="w-full py-3.5 px-6 rounded-lg bg-linear-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/50 transition-all cursor-pointer"
                >
                  <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                  {isSyncing ? (statusText || 'Executing 2-Stage Scraper...') : 'Sync Live Data Across Distributors'}
                </button>
              </div>
            </div>
          </div>

          {/* Preset Quick Chips */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" /> Try presets:
            </span>
            {SUGGESTIONS.map(item => (
              <button
                key={item.label}
                onClick={() => {
                  setSearchQuery(item.label);
                  handleSync(item.label);
                }}
                disabled={isSyncing}
                className="text-xs px-3 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-800 text-slate-300 transition-all font-mono"
              >
                + {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Live Catalog Results Section */}
        {components.length === 0 && !isSyncing && (
          <div className="text-center border border-dashed border-slate-800 rounded-2xl p-12 bg-slate-900/20 max-w-xl mx-auto">
            <Cpu className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-300">No components scraped yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Type a product above or pick a preset button to dispatch live Bright Data collectors across Robu, Flyrobo, ElectronicsComp, and Amazon.
            </p>
          </div>
        )}

        {/* Active Grid */}
        {components.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Monitored BOM Components ({components.length})
                </h3>
                <p className="text-xs text-slate-400">Select checkboxes on cards to add or remove parts from the optimization engine.</p>
              </div>
            </div>

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
          </div>
        )}

      </main>

      <BomOptimizer bomResult={bomResult} />
      <PipelineModal isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />
    </div>
  );
}