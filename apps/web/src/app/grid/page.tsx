"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Cpu, Power, Zap, TrafficCone, ShieldAlert, Radio, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function GridPage() {
  const { t } = useLanguage();
  const [hacked, setHacked] = useState(false);
  const [sectors, setSectors] = useState([
    { id: 'S1', name: 'INDIRANAGAR JCT', type: 'TRAFFIC', status: 'NOMINAL', icon: TrafficCone },
    { id: 'S2', name: 'KORAMANGALA GRID', type: 'POWER', status: 'NOMINAL', icon: Zap },
    { id: 'S3', name: 'WHITEFIELD COMM', type: 'COMMS', status: 'NOMINAL', icon: Radio },
    { id: 'S4', name: 'MG ROAD SEC', type: 'TRAFFIC', status: 'NOMINAL', icon: TrafficCone },
    { id: 'S5', name: 'HEBBAL FLYOVER', type: 'TRAFFIC', status: 'NOMINAL', icon: TrafficCone },
    { id: 'S6', name: 'ELECTRONIC CITY', type: 'POWER', status: 'NOMINAL', icon: Zap }
  ]);

  const overloadSector = (id: string) => {
    setHacked(true);
    setSectors(prev => prev.map(s => 
      s.id === id ? { ...s, status: 'OVERRIDE_ACTIVE' } : s
    ));
  };

  const releaseGrid = () => {
    setHacked(false);
    setSectors(prev => prev.map(s => ({ ...s, status: 'NOMINAL' })));
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-black overflow-hidden relative flex flex-col font-mono text-yellow-500 rounded-xl">
        
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(234,179,8,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(234,179,8,0.05)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0"></div>

        {/* Header */}
        <header className="relative z-10 flex justify-between items-center p-6 border-b border-yellow-900/50 bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <Cpu size={40} className="text-yellow-500" />
            <div>
              <h1 className="text-3xl font-black tracking-[0.3em] text-yellow-500">
                {t("SMART GRID C2")}
              </h1>
              <p className="text-xs tracking-[0.5em] text-yellow-700">{t("CITY-WIDE INFRASTRUCTURE OVERRIDE")}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-right text-[10px] text-yellow-600">
              <div>{t("PROTOCOL: GHOST-NET")}</div>
              <div className={`font-bold ${hacked ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                {hacked ? t("ACTIVE OVERRIDE") : t("STANDBY")}
              </div>
            </div>
            {hacked && (
              <button 
                onClick={releaseGrid}
                className="px-6 py-2 bg-yellow-500 text-black font-black tracking-widest hover:bg-yellow-400 transition-colors flex items-center gap-2"
              >
                <Power size={16}/> {t("RELEASE GRID")}
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 relative z-10 p-6 flex flex-col items-center justify-center">
          
          {/* Main Interface */}
          <div className="w-full max-w-5xl bg-black/50 border border-yellow-900/50 p-8 rounded-xl backdrop-blur relative overflow-hidden">
            
            {/* Visual scanline */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-50 z-20"></div>

            <div className="text-center mb-12 relative z-30">
              {hacked ? (
                <div className="flex flex-col items-center text-red-500 animate-in zoom-in duration-300">
                  <ShieldAlert size={64} className="mb-4 animate-pulse" />
                  <h2 className="text-3xl font-black tracking-widest">{t("TACTICAL OVERRIDE ENGAGED")}</h2>
                  <p className="tracking-widest">{t("SMART INFRASTRUCTURE HIJACKED. SUSPECT CONTAINED.")}</p>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl font-black tracking-widest text-yellow-600">{t("SELECT SECTOR FOR OVERRIDE")}</h2>
                  <p className="text-xs tracking-widest text-yellow-800 mt-2">{t("WARNING: THIS ACTION MANIPULATES PHYSICAL CITY INFRASTRUCTURE")}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-3 gap-6 relative z-30">
              {sectors.map((sector) => {
                const isOverridden = sector.status === 'OVERRIDE_ACTIVE';
                const Icon = sector.icon;

                return (
                  <div 
                    key={sector.id}
                    className={`relative p-6 border-2 transition-all duration-300 cursor-pointer overflow-hidden ${
                      isOverridden 
                        ? 'border-red-500 bg-red-950/30' 
                        : 'border-yellow-900/50 bg-black hover:border-yellow-500 hover:bg-yellow-900/20'
                    }`}
                    onClick={() => !isOverridden && overloadSector(sector.id)}
                  >
                    {isOverridden && (
                      <div className="absolute inset-0 bg-red-500/10 flex items-center justify-center">
                        <div className="w-full h-1 bg-red-500 opacity-50 shadow-[0_0_20px_red]"></div>
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col items-center text-center">
                      <Icon 
                        size={40} 
                        className={`mb-4 ${isOverridden ? 'text-red-500 animate-bounce' : 'text-yellow-600'}`} 
                      />
                      <h3 className={`font-black tracking-widest mb-1 ${isOverridden ? 'text-red-400' : 'text-yellow-500'}`}>
                        {sector.name}
                      </h3>
                      <div className="flex justify-between w-full mt-4 text-[10px]">
                        <span className={isOverridden ? 'text-red-600' : 'text-yellow-700'}>{t("SYS:")} {sector.type}</span>
                        <span className={`font-bold ${isOverridden ? 'text-red-500 animate-pulse' : 'text-green-500'}`}>
                          {isOverridden ? t("HIJACKED") : t("SECURE")}
                        </span>
                      </div>
                    </div>

                    {isOverridden && (
                      <div className="absolute top-2 right-2 text-red-500 animate-pulse">
                        <AlertTriangle size={16} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

          </div>

          <div className="mt-8 text-center text-xs tracking-[0.5em] text-yellow-800">
            NEXUS SMART-CITY INTERFACE V4.2
          </div>
        </div>

      </div>
    </Layout>
  );
}
