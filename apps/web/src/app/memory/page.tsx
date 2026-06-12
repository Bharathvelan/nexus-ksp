"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Brain, Download, AlertTriangle, Eye, HardDrive, Cpu, RadioTower } from 'lucide-react';

export default function MemoryPage() {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [corrupted, setCorrupted] = useState(false);
  const [fragments, setFragments] = useState<{ id: number; data: string; clean: boolean }[]>([]);

  const startDownload = () => {
    setDownloading(true);
    setProgress(0);
    setCorrupted(false);
    setFragments([]);

    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);

      // Simulate glitching
      if (Math.random() > 0.8) setCorrupted(true);
      else setCorrupted(false);

      // Generate fragments
      if (current % 10 === 0) {
        setFragments(prev => [...prev, {
          id: current,
          data: `MNM_BLOCK_${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`,
          clean: Math.random() > 0.3
        }]);
      }

      if (current >= 100) {
        clearInterval(interval);
        setDownloading(false);
        setCorrupted(false);
      }
    }, 100);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-zinc-950 overflow-hidden relative flex flex-col font-mono text-purple-500 rounded-xl">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.1)_0%,transparent_70%)] pointer-events-none"></div>
        {corrupted && (
          <div className="absolute inset-0 bg-red-900/10 mix-blend-color-burn pointer-events-none z-50 animate-pulse"></div>
        )}

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6 border-b border-purple-900/50 bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Brain size={40} className={`text-purple-500 ${downloading ? 'animate-pulse' : ''}`} />
            <div>
              <h1 className="text-3xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                NEURAL EXTRACTOR
              </h1>
              <p className="text-xs tracking-[0.5em] text-purple-700">BCI MEMORY DOWNLOAD INTERFACE</p>
            </div>
          </div>
          <div className="flex gap-6 text-right">
            <div>
              <div className="text-[10px] text-purple-600">SUBJECT CONNECTION</div>
              <div className="font-bold flex items-center gap-2">
                <RadioTower size={14}/> STABLE LINK
              </div>
            </div>
            <button 
              onClick={startDownload}
              disabled={downloading}
              className={`px-6 py-2 border ${downloading ? 'border-purple-900 text-purple-900' : 'border-purple-500 text-purple-400 hover:bg-purple-900/40'} font-bold tracking-widest transition-colors rounded flex items-center gap-2`}
            >
              <Download size={16}/> INITIATE DIVE
            </button>
          </div>
        </header>

        <div className="flex-1 relative z-10 flex p-6 gap-6">
          
          {/* Main Visualizer - The "Mind's Eye" */}
          <div className="flex-[2] relative border border-purple-900/50 bg-black/50 overflow-hidden rounded-lg flex flex-col items-center justify-center">
            
            {/* The visual cortex simulation */}
            <div className={`relative w-96 h-96 rounded-full border border-purple-500/30 flex items-center justify-center overflow-hidden transition-all duration-300 ${corrupted ? 'scale-[1.02] border-red-500/50 shadow-[0_0_50px_rgba(220,38,38,0.2)]' : 'shadow-[0_0_50px_rgba(168,85,247,0.1)]'}`}>
              
              {/* Concentric rings */}
              <div className={`absolute w-full h-full border border-purple-500/20 rounded-full ${downloading ? 'animate-[spin_10s_linear_infinite]' : ''}`}></div>
              <div className={`absolute w-3/4 h-3/4 border border-purple-500/20 rounded-full ${downloading ? 'animate-[spin_7s_linear_infinite_reverse]' : ''}`}></div>
              <div className={`absolute w-1/2 h-1/2 border border-purple-500/40 rounded-full ${downloading ? 'animate-[spin_4s_linear_infinite]' : ''}`}></div>
              
              {/* The "Eye" */}
              {downloading ? (
                <div className="relative z-10 w-32 h-32">
                  <div className={`absolute inset-0 bg-cover bg-center mix-blend-screen transition-opacity duration-100 ${corrupted ? 'opacity-100 invert sepia hue-rotate-[300deg] saturate-200' : 'opacity-70'}`} style={{ backgroundImage: `url('https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2070&auto=format&fit=crop')` }}></div>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(168,85,247,0.2)_1px,transparent_1px)] bg-[size:4px_4px] pointer-events-none"></div>
                </div>
              ) : (
                <Eye size={64} className="text-purple-900/50" />
              )}
            </div>

            {/* Cortical Warning */}
            {corrupted && (
              <div className="absolute bottom-10 flex items-center gap-3 text-red-500 bg-red-950/80 px-6 py-2 rounded-full border border-red-500/50 animate-bounce">
                <AlertTriangle size={20} />
                <span className="font-bold tracking-widest">COGNITIVE DISSONANCE DETECTED</span>
              </div>
            )}
          </div>

          {/* Right Panel: Extraction Stream */}
          <div className="flex-[1] flex flex-col gap-6">
            
            {/* Progress Monitor */}
            <div className="border border-purple-900/50 bg-black/40 p-6 rounded-lg">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4 text-purple-600 flex items-center gap-2">
                <HardDrive size={14} /> EXTRACTION PROGRESS
              </h3>
              <div className="text-4xl font-black text-purple-400 mb-2">{progress}%</div>
              <div className="h-2 bg-purple-950 rounded overflow-hidden">
                <div className={`h-full transition-all duration-100 ${corrupted ? 'bg-red-500' : 'bg-purple-500'}`} style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            {/* Fragment Logs */}
            <div className="flex-1 border border-purple-900/50 bg-black/40 p-6 rounded-lg flex flex-col">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4 text-purple-600 border-b border-purple-900/50 pb-2 flex items-center gap-2">
                <Cpu size={14} /> DECODED FRAGMENTS
              </h3>
              
              <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2">
                {fragments.map((f, i) => (
                  <div key={i} className={`flex justify-between p-2 text-xs border-l-2 bg-black/50 ${f.clean ? 'border-purple-500 text-purple-300' : 'border-red-500 text-red-400'}`}>
                    <span>{f.data}</span>
                    <span className="font-bold">{f.clean ? 'CLEAN' : 'CORRUPT'}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}
