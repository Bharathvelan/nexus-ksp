"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Dna, Fingerprint, Activity, Beaker, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DNAPage() {
  const { t } = useLanguage();
  const [sequencing, setSequencing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [markers, setMarkers] = useState<string[]>([]);
  const [complete, setComplete] = useState(false);

  const startSequence = () => {
    setSequencing(true);
    setProgress(0);
    setMarkers([]);
    setComplete(false);

    const steps = [
      t("Isolating Genetic Material"),
      t("Quantum PCR Amplification"),
      t("Mapping Chromosome 15 (Eye Color)"),
      t("Analyzing Melanin Genotypes"),
      t("Synthesizing Craniofacial Structure"),
      t("Rendering 3D Phenotype")
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps.length) * 100);
      setMarkers(prev => [...prev, steps[currentStep - 1]]);

      if (currentStep >= steps.length) {
        clearInterval(interval);
        setSequencing(false);
        setComplete(true);
      }
    }, 1500);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-black overflow-hidden relative flex flex-col font-mono text-emerald-500 rounded-xl">
        {/* Background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>

        <header className="relative z-10 flex justify-between items-center p-6 border-b border-emerald-900/50 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Dna size={40} className="text-emerald-500" />
            <div>
              <h1 className="text-3xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                {t("QUANTUM PHENOTYPER")}
              </h1>
              <p className="text-xs tracking-[0.5em] text-emerald-700">{t("DNA TO FACIAL RECONSTRUCTION ALGORITHM")}</p>
            </div>
          </div>
          <div className="border border-emerald-800 p-2 rounded text-center">
            <div className="text-[10px] text-emerald-600">{t("SYSTEM COHERENCE")}</div>
            <div className="font-bold">99.9%</div>
          </div>
        </header>

        <div className="flex-1 relative z-10 flex p-6 gap-6">
          
          {/* Left Panel: Sequencing Log */}
          <div className="flex-[1] border border-emerald-900/50 bg-emerald-950/10 p-6 flex flex-col">
            <h2 className="text-sm tracking-[0.2em] mb-6 text-emerald-600 border-b border-emerald-900/50 pb-2 flex items-center gap-2">
              <Activity size={16} /> {t("QUANTUM DECODING LOG")}
            </h2>
            
            <div className="flex-1 space-y-4">
              {markers.map((marker, i) => (
                <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left duration-300">
                  <CheckCircle2 size={16} className="text-emerald-400" />
                  <span className="text-emerald-200">{marker}</span>
                </div>
              ))}
              {sequencing && (
                <div className="flex items-center gap-3 opacity-50 animate-pulse">
                  <Activity size={16} className="text-emerald-400" />
                  <span className="text-emerald-200">{t("Processing...")}</span>
                </div>
              )}
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs text-emerald-600 mb-1">
                <span>{t("SYNTHESIS PROGRESS")}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-1 bg-emerald-950 rounded overflow-hidden">
                <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          </div>

          {/* Center Panel: The Visualizer */}
          <div className="flex-[2] flex flex-col items-center justify-center relative border border-emerald-900/50 bg-emerald-950/5">
            {!sequencing && !complete ? (
              <div className="text-center">
                <Beaker size={80} className="text-emerald-900 mx-auto mb-6" />
                <button 
                  onClick={startSequence}
                  className="px-8 py-3 bg-emerald-900/30 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-black transition-colors rounded tracking-widest font-bold"
                >
                  {t("INSERT SAMPLE & SEQUENCE")}
                </button>
              </div>
            ) : (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                {/* Simulated CSS 3D DNA Helix background effect */}
                <div className={`absolute flex flex-col gap-4 opacity-20 ${sequencing ? 'animate-[spin_2s_linear_infinite]' : ''}`}>
                  {[...Array(12)].map((_, i) => (
                    <div key={i} className="flex items-center gap-16" style={{ transform: `rotate(${i * 30}deg)` }}>
                      <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-[0_0_15px_#10b981]"></div>
                      <div className="w-32 h-[2px] bg-emerald-500/50"></div>
                      <div className="w-4 h-4 rounded-full bg-teal-500 shadow-[0_0_15px_#14b8a6]"></div>
                    </div>
                  ))}
                </div>

                {complete && (
                  <div className="relative z-20 animate-in zoom-in duration-1000 text-center">
                    <div className="w-64 h-64 border-2 border-emerald-500 bg-emerald-950/50 relative overflow-hidden flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] mx-auto">
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.2)_1px,transparent_1px)] bg-[size:10px_10px] z-10 pointer-events-none"></div>
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=PhenotypeX" alt="Generated Face" className="w-full h-full opacity-90 mix-blend-screen relative z-0" />
                    </div>
                    <h2 className="text-2xl font-black text-emerald-400 tracking-widest mb-2">{t("SYNTHESIS COMPLETE")}</h2>
                    <p className="text-emerald-600">{t("CONFIDENCE: 92.4% MATCH")}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Panel: Extracted Traits */}
          <div className="flex-[1] border border-emerald-900/50 bg-emerald-950/10 p-6 flex flex-col">
            <h2 className="text-sm tracking-[0.2em] mb-6 text-emerald-600 border-b border-emerald-900/50 pb-2 flex items-center gap-2">
              <Fingerprint size={16} /> {t("PHENOTYPIC TRAITS")}
            </h2>

            <div className="space-y-4">
              {[
                { label: t("EYE COLOR"), val: complete ? t("BROWN") : "---", gene: "HERC2/OCA2" },
                { label: t("HAIR COLOR"), val: complete ? t("BLACK") : "---", gene: "MC1R" },
                { label: t("SKIN TONE"), val: complete ? t("TYPE IV (MODERATE BROWN)") : "---", gene: "SLC24A5" },
                { label: t("FACIAL MORPHOLOGY"), val: complete ? t("BROAD/ANGULAR") : "---", gene: "PAX3/PRDM16" }
              ].map((t, i) => (
                <div key={i} className="bg-black/50 border border-emerald-900/50 p-3 rounded">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-[10px] text-emerald-600">{t.label}</span>
                    <span className="text-[8px] text-emerald-800">{t.gene}</span>
                  </div>
                  <div className={`font-bold ${complete ? 'text-emerald-400 animate-pulse' : 'text-emerald-900'}`}>
                    {t.val}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
