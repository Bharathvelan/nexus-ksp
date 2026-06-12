"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Target, Clock, ShieldAlert, Zap, Hexagon, Crosshair } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SentinelPage() {
  const { t } = useLanguage();
  const [countdown, setCountdown] = useState(600); // 10 minutes
  const [probability, setProbability] = useState(45);
  const [intercepted, setIntercepted] = useState(false);

  useEffect(() => {
    if (intercepted) return;
    const interval = setInterval(() => {
      setCountdown(prev => Math.max(0, prev - 1));
      if (Math.random() > 0.6) {
        setProbability(prev => Math.min(99.9, prev + Math.random() * 2));
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [intercepted]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-black overflow-hidden relative flex flex-col font-mono text-cyan-500 rounded-xl">
        {/* Background Grid & Scanlines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-20"></div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6 border-b border-cyan-900/50 bg-black/50 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Hexagon size={40} className="text-cyan-500 animate-[spin_10s_linear_infinite]" />
            <div>
              <h1 className="text-3xl font-black tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
                {t("PROJECT SENTINEL")}
              </h1>
              <p className="text-xs tracking-[0.5em] text-cyan-700">{t("PRE-CRIME COGNITIVE PREDICTION MATRIX")}</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <div className="text-xs text-cyan-700">{t("SYSTEM STATUS")}</div>
              <div className="text-sm font-bold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                {t("NEURAL NET ONLINE")}
              </div>
            </div>
            <div className="border border-cyan-800 p-2 rounded text-center">
              <div className="text-[10px] text-cyan-600">{t("ACTIVE PRECOGS")}</div>
              <div className="font-bold">03</div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 relative z-10 flex p-6 gap-6">
          
          {/* Left Panel: Target Profile */}
          <div className="flex-[1] flex flex-col gap-6">
            <div className="flex-1 border border-cyan-900/50 bg-cyan-950/10 p-6 relative">
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-500"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-500"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-500"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-500"></div>
              
              <h2 className="text-sm tracking-[0.2em] mb-4 text-cyan-600 flex items-center gap-2">
                <Target size={16} /> {t("PREDICTED TARGET")}
              </h2>
              
              <div className="aspect-square bg-cyan-950/30 border border-cyan-800 mb-4 flex items-center justify-center relative overflow-hidden">
                <Crosshair size={100} className="text-cyan-900/50 absolute" />
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sentinel1" alt="Target" className="w-3/4 h-3/4 opacity-80 mix-blend-screen" />
                {/* Scanner effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-cyan-400 shadow-[0_0_10px_cyan] animate-[bounce_3s_infinite]"></div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between border-b border-cyan-900/30 pb-1">
                  <span className="text-cyan-700">{t("IDENTITY")}</span>
                  <span className="font-bold">{t("UNKNOWN_MALE_04")}</span>
                </div>
                <div className="flex justify-between border-b border-cyan-900/30 pb-1">
                  <span className="text-cyan-700">{t("VECTOR")}</span>
                  <span className="font-bold text-red-400">{t("CLASS-1 FELONY (VIOLENT)")}</span>
                </div>
                <div className="flex justify-between border-b border-cyan-900/30 pb-1">
                  <span className="text-cyan-700">{t("LOCATION")}</span>
                  <span className="font-bold">{t("SECTOR 7G, INDIRANAGAR")}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Center Panel: The Countdown */}
          <div className="flex-[2] flex flex-col items-center justify-center relative">
            {intercepted ? (
              <div className="text-center animate-in fade-in zoom-in duration-500">
                <ShieldAlert size={120} className="text-green-500 mx-auto mb-6 drop-shadow-[0_0_30px_rgba(34,197,94,0.5)]" />
                <h2 className="text-4xl font-black text-green-500 tracking-widest mb-2">{t("CRIME AVERTED")}</h2>
                <p className="text-green-700 tracking-widest">{t("INTERCEPT TEAM DEPLOYED")}</p>
              </div>
            ) : (
              <>
                <div className="text-[12rem] leading-none font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-400 to-cyan-900 drop-shadow-[0_0_20px_rgba(0,255,255,0.3)] tabular-nums">
                  {formatTime(countdown)}
                </div>
                <div className="text-2xl tracking-[0.5em] text-cyan-600 mb-12 flex items-center gap-4">
                  <Clock className="animate-pulse" /> {t("TIME TO EVENT")}
                </div>

                <div className="w-full max-w-md">
                  <div className="flex justify-between text-cyan-500 mb-2 tracking-widest">
                    <span>{t("PROBABILITY")}</span>
                    <span className="font-bold">{probability.toFixed(1)}%</span>
                  </div>
                  <div className="h-4 bg-cyan-950 rounded-full overflow-hidden border border-cyan-900">
                    <div 
                      className={`h-full transition-all duration-300 ${probability > 80 ? 'bg-red-500 shadow-[0_0_15px_red]' : 'bg-cyan-500 shadow-[0_0_15px_cyan]'}`}
                      style={{ width: `${probability}%` }}
                    ></div>
                  </div>
                </div>

                <button 
                  onClick={() => setIntercepted(true)}
                  className={`mt-16 px-12 py-4 rounded font-black tracking-[0.3em] text-xl border-2 transition-all duration-300 z-30 ${
                    probability > 80 
                      ? 'bg-red-600/20 border-red-500 text-red-500 hover:bg-red-600 hover:text-black shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse' 
                      : 'bg-cyan-600/20 border-cyan-500 text-cyan-500 hover:bg-cyan-500 hover:text-black'
                  }`}
                >
                  <Zap className="inline mr-2" />
                  {t("INITIATE INTERCEPT")}
                </button>
              </>
            )}
          </div>

          {/* Right Panel: Pre-Crime Metrics */}
          <div className="flex-[1] flex flex-col gap-6">
            <div className="flex-1 border border-cyan-900/50 bg-cyan-950/10 p-6 flex flex-col">
              <h2 className="text-sm tracking-[0.2em] mb-6 text-cyan-600 border-b border-cyan-900/50 pb-2">
                {t("COGNITIVE METRICS")}
              </h2>
              
              <div className="space-y-6 flex-1">
                {[
                  { label: t("DOPAMINE DELTA"), val: "+4.2σ", color: "text-red-400" },
                  { label: t("FINANCIAL STRESS"), val: t("CRITICAL"), color: "text-orange-400" },
                  { label: t("SOCIAL ISOLATION"), val: "88%", color: "text-cyan-400" },
                  { label: t("WEAPON PROXIMITY"), val: t("CONFIRMED"), color: "text-red-500" },
                ].map((m, i) => (
                  <div key={i} className="bg-black/50 border border-cyan-900 p-3 rounded">
                    <div className="text-[10px] text-cyan-700 mb-1">{m.label}</div>
                    <div className={`font-bold tracking-widest ${m.color}`}>{m.val}</div>
                  </div>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-cyan-900/50 text-[10px] text-cyan-800 text-center">
                {t("POWERED BY NEXUS PRE-CRIME ENGINE")}
              </div>
            </div>
          </div>

        </div>
      </div>
    </Layout>
  );
}
