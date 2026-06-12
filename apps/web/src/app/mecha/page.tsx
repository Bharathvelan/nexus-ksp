"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Shield, Crosshair, ChevronDown, Rocket, ShieldAlert, AlertOctagon } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MechaPage() {
  const { t } = useLanguage();
  const [deployed, setDeployed] = useState(false);
  const [status, setStatus] = useState(t("STANDBY"));

  const initiateDrop = () => {
    setDeployed(true);
    setStatus(t("ORBITAL DROP INITIATED"));
    
    setTimeout(() => setStatus(t("ATMOSPHERIC RE-ENTRY")), 2000);
    setTimeout(() => setStatus(t("IMPACT IMMINENT")), 4000);
    setTimeout(() => setStatus(t("TOUCHDOWN: HEAVY MECHA ONLINE")), 5000);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-zinc-950 overflow-hidden relative flex flex-col font-mono text-emerald-500 rounded-xl">
        
        {/* Background Visuals */}
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542385151-efd9000785a0?q=80&w=2089&auto=format&fit=crop')] bg-cover bg-center opacity-10 mix-blend-luminosity"></div>
        <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.8)_50%)] bg-[length:100%_4px] pointer-events-none"></div>

        <header className="relative z-10 flex justify-between items-center p-6 border-b border-emerald-900/50 bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Shield size={40} className="text-emerald-500" />
            <div>
              <h1 className="text-3xl font-black tracking-[0.3em] text-emerald-400">{t("HEAVY MECHA DISPATCH")}</h1>
              <p className="text-xs tracking-[0.5em] text-emerald-700">{t("AUTONOMOUS RIOT CONTROL DIVISION")}</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-xl font-bold tracking-widest ${deployed ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>{status}</div>
          </div>
        </header>

        <div className="flex-1 relative z-10 flex p-6 gap-6">
          
          {/* Loadout Panel */}
          <div className="flex-[1] flex flex-col gap-6">
            <div className="border border-emerald-900/50 bg-black/60 p-6 rounded-lg flex-1">
              <h3 className="text-xs font-bold tracking-[0.2em] mb-6 text-emerald-600 border-b border-emerald-900/50 pb-2">{t("CHASSIS CONFIGURATION")}</h3>
              
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] text-emerald-700 mb-1">{t("ARMOR RATING")}</div>
                  <div className="font-bold">{t("CLASS-4 TITANIUM ALLOY")}</div>
                  <div className="h-1 bg-emerald-950 mt-1"><div className="h-full bg-emerald-500 w-full"></div></div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-700 mb-1">{t("PRIMARY WEAPON")}</div>
                  <div className="font-bold text-orange-500">{t("NON-LETHAL SONIC DISRUPTOR")}</div>
                </div>
                <div>
                  <div className="text-[10px] text-emerald-700 mb-1">{t("SECONDARY")}</div>
                  <div className="font-bold text-cyan-500">{t("KINETIC FOAM LAUNCHER")}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Visual - The Drop Sequence */}
          <div className="flex-[2] relative border border-emerald-900/50 bg-black/80 overflow-hidden rounded-lg flex flex-col items-center justify-center">
            
            {deployed ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center animate-in zoom-in duration-500">
                <div className={`relative w-64 h-64 border-4 ${status.includes("TOUCHDOWN") ? 'border-emerald-500' : 'border-red-500'} rounded-full flex items-center justify-center mb-8 ${!status.includes("TOUCHDOWN") && 'animate-ping'}`}>
                  <ShieldAlert size={100} className={`${status.includes("TOUCHDOWN") ? 'text-emerald-500' : 'text-red-500'}`} />
                  {/* Targeting Reticle */}
                  <div className="absolute inset-0 border border-emerald-500/50 animate-[spin_4s_linear_infinite]"></div>
                  <div className="absolute inset-0 border border-emerald-500/50 animate-[spin_3s_linear_infinite_reverse]" style={{ transform: 'rotate(45deg)' }}></div>
                </div>
                
                {status.includes(t("TOUCHDOWN").split(":")[0]) || status.includes("TOUCHDOWN") ? (
                  <div className="text-center animate-bounce">
                    <h2 className="text-4xl font-black text-emerald-400 tracking-widest mb-2">{t("MECHA DEPLOYED")}</h2>
                    <p className="text-emerald-600 tracking-widest">{t("SECTOR SECURED. AWAITING COMMANDS.")}</p>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="text-center">
                <AlertOctagon size={120} className="text-emerald-900 mx-auto mb-8" />
                <button 
                  onClick={initiateDrop}
                  className="px-12 py-4 border-2 border-red-500 bg-red-950/30 text-red-500 hover:bg-red-500 hover:text-black font-black tracking-[0.3em] text-xl transition-colors rounded shadow-[0_0_30px_rgba(239,68,68,0.3)]"
                >
                  <Rocket className="inline mr-3" /> {t("AUTHORIZE ORBITAL DROP")}
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
