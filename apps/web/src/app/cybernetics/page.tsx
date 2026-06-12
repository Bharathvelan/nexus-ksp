"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Network, Activity, ShieldAlert, BrainCircuit, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CyberneticsPage() {
  const { t } = useLanguage();
  const [reprogramming, setReprogramming] = useState(false);
  const [progress, setProgress] = useState(0);
  const [traits, setTraits] = useState([
    { id: 't1', name: 'AMYGDALA HYPERACTIVITY (AGGRESSION)', active: true, overridden: false },
    { id: 't2', name: 'DOPAMINE DYSREGULATION (IMPULSIVITY)', active: true, overridden: false },
    { id: 't3', name: 'EMPATHY SUPPRESSION', active: true, overridden: false }
  ]);

  const initiateReprogram = () => {
    setReprogramming(true);
    setProgress(0);
    
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setProgress(current);

      if (current === 30) {
        setTraits(prev => prev.map(t => t.id === 't1' ? { ...t, active: false, overridden: true } : t));
      } else if (current === 60) {
        setTraits(prev => prev.map(t => t.id === 't2' ? { ...t, active: false, overridden: true } : t));
      } else if (current === 90) {
        setTraits(prev => prev.map(t => t.id === 't3' ? { ...t, active: false, overridden: true } : t));
      }

      if (current >= 100) {
        clearInterval(interval);
        setReprogramming(false);
      }
    }, 100);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-zinc-950 overflow-hidden relative flex flex-col font-mono text-slate-300 rounded-xl">
        
        {/* Clinical Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]"></div>

        <header className="relative z-10 flex justify-between items-center p-6 border-b border-slate-800 bg-black/90">
          <div className="flex items-center gap-4">
            <Network size={40} className="text-slate-100" />
            <div>
              <h1 className="text-3xl font-light tracking-[0.3em] text-white">{t("CYBERNETIC REHABILITATION")}</h1>
              <p className="text-xs tracking-[0.5em] text-slate-500">{t("NEURAL PATHWAY OVERWRITE PROTOCOL")}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500">{t("RECIDIVISM PROBABILITY")}</div>
            <div className={`text-xl font-bold ${progress === 100 ? 'text-green-500' : 'text-red-500'}`}>
              {progress === 100 ? '0.00%' : '94.2%'}
            </div>
          </div>
        </header>

        <div className="flex-1 relative z-10 flex p-6 gap-6">
          
          {/* Main Visualizer - Clinical Brain Map */}
          <div className="flex-[2] relative border border-slate-800 bg-black/50 rounded flex flex-col items-center justify-center">
            
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Abstract Brain Silhouette */}
              <BrainCircuit size={300} className={`text-slate-800 transition-all duration-1000 ${reprogramming ? 'text-blue-900/50 scale-[1.02]' : ''}`} strokeWidth={0.5} />
              
              {/* Neural Nodes */}
              <div className="absolute inset-0">
                {traits.map((trait, idx) => (
                  <div 
                    key={trait.id}
                    className="absolute w-4 h-4 rounded-full -ml-2 -mt-2 transition-colors duration-500"
                    style={{
                      left: `${30 + idx * 20}%`,
                      top: `${40 + (idx%2) * 20}%`,
                      backgroundColor: trait.overridden ? '#3b82f6' : '#ef4444',
                      boxShadow: `0 0 20px ${trait.overridden ? '#3b82f6' : '#ef4444'}`
                    }}
                  >
                    {reprogramming && !trait.overridden && (
                      <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-50"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {progress === 100 && (
              <div className="absolute bottom-10 flex flex-col items-center animate-in slide-in-from-bottom duration-500">
                <CheckCircle2 size={40} className="text-blue-500 mb-2" />
                <div className="text-blue-400 tracking-[0.3em] font-light">{t("SUBJECT REHABILITATED")}</div>
                <div className="text-slate-500 text-xs tracking-widest mt-1">{t("SOCIETAL REINTEGRATION APPROVED")}</div>
              </div>
            )}
          </div>

          {/* Right Panel: Overwrite Controls */}
          <div className="flex-[1] flex flex-col gap-6">
            
            <div className="border border-slate-800 bg-black/80 p-6 rounded flex-1 flex flex-col">
              <h3 className="text-xs tracking-[0.2em] mb-6 text-slate-500 border-b border-slate-800 pb-2">{t("TARGET PATHWAYS")}</h3>
              
              <div className="space-y-4 flex-1">
                {traits.map(trait => (
                  <div key={trait.id} className="p-4 border border-slate-800 bg-black">
                    <div className="text-xs text-slate-400 mb-2">{trait.name}</div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] px-2 py-1 ${trait.overridden ? 'bg-blue-900/30 text-blue-400 border border-blue-900' : 'bg-red-900/30 text-red-500 border border-red-900'}`}>
                        {trait.overridden ? t("SYNTHETIC OVERRIDE") : t("NATURAL (HOSTILE)")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <button 
                  onClick={initiateReprogram}
                  disabled={reprogramming || progress === 100}
                  className={`w-full py-4 border transition-colors tracking-widest text-sm ${
                    progress === 100 
                      ? 'border-blue-900 text-blue-900' 
                      : reprogramming 
                        ? 'border-blue-500 text-blue-500 animate-pulse'
                        : 'border-white text-white hover:bg-white hover:text-black'
                  }`}
                >
                  {reprogramming ? `${t("OVERWRITING [")}${progress}%]` : progress === 100 ? t("SEQUENCE COMPLETE") : t("COMMENCE NEURAL REWRITE")}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </Layout>
  );
}
