"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Microscope, Droplet, Activity, AlertCircle, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AutopsyPage() {
  const { t } = useLanguage();
  const [injecting, setInjecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [anomalies, setAnomalies] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);
  
  // Nanobot positions
  const [nanobots, setNanobots] = useState<{ id: number, x: number, y: number, r: number }[]>([]);

  const startAnalysis = () => {
    setInjecting(true);
    setProgress(0);
    setAnomalies([]);
    setComplete(false);

    // Initialize nanobots
    setNanobots(Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: Math.random() * 360
    })));

    const events = [
      { time: 15, msg: "Erythrocyte mutation detected" },
      { time: 40, msg: "Synthetic protein chain discovered" },
      { time: 65, msg: "Neurotoxin signature: CYBER-VENOM-7" },
      { time: 85, msg: "Tracing molecular origin..." }
    ];

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 1;
      setProgress(currentProgress);

      events.forEach(e => {
        if (currentProgress === e.time) {
          setAnomalies(prev => [...prev, e.msg]);
        }
      });

      // Move nanobots
      setNanobots(prev => prev.map(bot => ({
        ...bot,
        x: (bot.x + Math.cos(bot.r) * 2 + 100) % 100,
        y: (bot.y + Math.sin(bot.r) * 2 + 100) % 100,
        r: bot.r + (Math.random() - 0.5)
      })));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setInjecting(false);
        setComplete(true);
      }
    }, 100);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-zinc-950 overflow-hidden relative flex flex-col font-mono text-fuchsia-500 rounded-xl border border-fuchsia-900/50">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.05)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none z-0"></div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6 border-b border-fuchsia-900/50 bg-black/60 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Microscope size={40} className="text-fuchsia-500" />
            <div>
              <h1 className="text-3xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-purple-600">
                {t("CELLULAR AUTOPSY")}
              </h1>
              <p className="text-xs tracking-[0.5em] text-fuchsia-700">{t("NANOBOT SWARM DIAGNOSTICS")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="text-[10px] text-fuchsia-600">{t("SUBJECT ID")}</div>
              <div className="font-bold text-sm">VK-992-ALPHA</div>
            </div>
            <button 
              onClick={startAnalysis}
              disabled={injecting || complete}
              className={`px-6 py-2 border ${injecting ? 'border-fuchsia-900 text-fuchsia-900' : 'border-fuchsia-500 text-fuchsia-400 hover:bg-fuchsia-900/40'} font-bold tracking-widest transition-colors rounded`}
            >
              {t("INJECT SWARM")}
            </button>
          </div>
        </header>

        <div className="flex-1 relative z-10 flex p-6 gap-6">
          
          {/* Main Visualizer */}
          <div className="flex-[3] relative border border-fuchsia-900/50 bg-black/50 overflow-hidden rounded-lg flex items-center justify-center">
            
            {/* Bloodstream Simulation */}
            <div className={`absolute inset-0 transition-opacity duration-1000 ${injecting || complete ? 'opacity-100' : 'opacity-10'}`}>
              <div className="absolute inset-0 bg-red-950/20 mix-blend-screen"></div>
              
              {/* Red blood cells */}
              <div className="absolute inset-0 animate-[pulse_4s_ease-in-out_infinite]">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div 
                    key={`rbc-${i}`} 
                    className="absolute rounded-full border-4 border-red-900/40 bg-red-800/20 shadow-[inset_0_0_10px_rgba(220,38,38,0.5)]"
                    style={{
                      width: `${Math.random() * 40 + 40}px`,
                      height: `${Math.random() * 40 + 40}px`,
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      transform: `scale(${Math.random() * 0.5 + 0.5})`,
                      animation: `float ${Math.random() * 10 + 10}s linear infinite`
                    }}
                  />
                ))}
              </div>

              {/* Nanobots */}
              {nanobots.map(bot => (
                <div 
                  key={`bot-${bot.id}`}
                  className="absolute w-2 h-2 bg-fuchsia-400 rounded-sm shadow-[0_0_10px_fuchsia] transition-all duration-100"
                  style={{
                    left: `${bot.x}%`,
                    top: `${bot.y}%`,
                    transform: `rotate(${bot.r}rad)`
                  }}
                >
                  {/* Scanner beam */}
                  <div className="absolute -left-4 -top-4 w-10 h-10 border border-fuchsia-500/30 rounded-full animate-ping"></div>
                </div>
              ))}
            </div>

            {/* Overlay Grid & Targeting */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(217,70,239,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(217,70,239,0.1)_1px,transparent_1px)] bg-[size:100px_100px] pointer-events-none mix-blend-overlay"></div>
            
            {!injecting && !complete && (
              <div className="text-center text-fuchsia-800/50 flex flex-col items-center">
                <Droplet size={100} className="mb-4" />
                <h2 className="text-2xl tracking-[0.5em] font-black">{t("AWAITING INJECTION")}</h2>
              </div>
            )}

            {complete && (
              <div className="absolute z-20 flex flex-col items-center animate-in zoom-in duration-500 bg-black/80 p-8 border-2 border-red-500 rounded-xl shadow-[0_0_50px_rgba(239,68,68,0.3)]">
                <ShieldAlert size={80} className="text-red-500 mb-4 animate-pulse" />
                <h2 className="text-3xl font-black text-red-500 tracking-widest mb-2">{t("SYNTHETIC PATHOGEN DETECTED")}</h2>
                <p className="text-red-400 tracking-widest text-sm">{t("CAUSE OF DEATH: NANO-TOXICITY")}</p>
              </div>
            )}
          </div>

          {/* Right Panel: Telemetry */}
          <div className="flex-[1] flex flex-col gap-6">
            
            <div className="border border-fuchsia-900/50 bg-black/40 p-4 rounded-lg flex flex-col">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4 text-fuchsia-600 border-b border-fuchsia-900/50 pb-2 flex items-center gap-2">
                <Activity size={14} /> {t("SWARM TELEMETRY")}
              </h3>
              
              <div className="space-y-4 text-sm mb-6">
                <div className="flex justify-between">
                  <span className="text-fuchsia-800">{t("ACTIVE BOTS")}</span>
                  <span className="font-bold">{injecting || complete ? '50,000' : '0'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fuchsia-800">{t("COVERAGE")}</span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fuchsia-800">{t("CELLULAR INTEGRITY")}</span>
                  <span className={`font-bold ${complete ? 'text-red-500' : 'text-fuchsia-400'}`}>
                    {complete ? t("COMPROMISED") : t("NOMINAL")}
                  </span>
                </div>
              </div>

              <div className="w-full h-2 bg-fuchsia-950 rounded overflow-hidden">
                <div className="h-full bg-fuchsia-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
              </div>
            </div>

            <div className="flex-1 border border-fuchsia-900/50 bg-black/40 p-4 rounded-lg flex flex-col">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-4 text-fuchsia-600 border-b border-fuchsia-900/50 pb-2 flex items-center gap-2">
                <AlertCircle size={14} /> {t("ANOMALY LOG")}
              </h3>
              
              <div className="flex-1 space-y-3 overflow-y-auto pr-2 custom-scrollbar text-xs">
                {anomalies.map((anomaly, i) => (
                  <div key={i} className="flex gap-2 animate-in slide-in-from-right duration-300">
                    <span className="text-red-500 shrink-0">[{progress}s]</span>
                    <span className="text-fuchsia-300">{anomaly}</span>
                  </div>
                ))}
                {injecting && (
                  <div className="text-fuchsia-700 animate-pulse mt-2">Scanning molecular bonds...</div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* Global Keyframes for floats */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes float {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
            100% { transform: translateY(0) rotate(360deg); }
          }
        `}} />
      </div>
    </Layout>
  );
}
