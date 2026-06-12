"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Globe, ShieldAlert, Terminal, Activity, Wifi, Lock } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function CyberPage() {
  const { t } = useLanguage();
  const [logs, setLogs] = useState<string[]>([]);
  const [threatCount, setThreatCount] = useState(1402);

  useEffect(() => {
    // Simulate incoming cyber logs
    const interval = setInterval(() => {
      const ips = ['192.168.1.1', '10.0.0.1', '172.16.254.1', '8.8.8.8', '45.33.32.156', '185.199.108.153'];
      const actions = ['BRUTE_FORCE_ATTACK', 'DDOS_NODE_DETECTED', 'SQL_INJECTION_ATTEMPT', 'UNAUTHORIZED_ACCESS_BLOCKED', 'DARK_WEB_CHATTER_SPIKE'];
      const regions = ['BENGALURU', 'MOSCOW', 'BEIJING', 'NEW YORK', 'LONDON', 'DUBAI'];
      
      const newLog = `[${new Date().toISOString()}] SRC: ${ips[Math.floor(Math.random() * ips.length)]} -> DST: ${regions[Math.floor(Math.random() * regions.length)]} | THREAT: ${actions[Math.floor(Math.random() * actions.length)]}`;
      
      setLogs(prev => [newLog, ...prev].slice(0, 50));
      setThreatCount(prev => prev + Math.floor(Math.random() * 5));
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
        <header className="flex justify-between items-center bg-black p-6 rounded-xl shadow-sm border border-red-900 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-red-500 flex items-center gap-3">
              <Globe className="text-red-500 animate-pulse" size={32} />
              {t("Global Cyber-Threat Operations")}
            </h1>
            <p className="text-red-900 mt-1 font-mono">{t("LIVE OSINT & DARK WEB MONITORING (CLASSIFIED)")}</p>
          </div>
          <div className="flex gap-6 text-red-500 font-mono text-sm border border-red-900 p-3 rounded bg-red-950/20">
            <div className="flex flex-col items-center">
              <span className="opacity-70">{t("BLOCKED THREATS")}</span>
              <span className="text-xl font-bold">{threatCount.toLocaleString()}</span>
            </div>
            <div className="w-px bg-red-900"></div>
            <div className="flex flex-col items-center">
              <span className="opacity-70">{t("DEFCON LEVEL")}</span>
              <span className="text-xl font-bold text-yellow-500">3</span>
            </div>
            <div className="w-px bg-red-900"></div>
            <div className="flex flex-col items-center">
              <span className="opacity-70">{t("NODE STATUS")}</span>
              <span className="text-xl font-bold text-green-500 flex items-center gap-1"><Lock size={14}/> {t("SECURE")}</span>
            </div>
          </div>
        </header>

        <div className="flex gap-6 h-full min-h-[500px]">
          {/* Main Visualizer */}
          <div className="flex-[2] bg-black rounded-xl border border-red-900 p-0 overflow-hidden relative font-mono text-red-500 shadow-[0_0_50px_rgba(255,0,0,0.1)]">
            
            {/* World Map Overlay (CSS Matrix Grid Simulator) */}
            <div className="absolute inset-0 z-0 opacity-30 bg-[linear-gradient(rgba(255,0,0,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,0.2)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <Globe size={800} strokeWidth={0.5} className="animate-[spin_120s_linear_infinite]" />
            </div>

            {/* Simulated attack vectors (CSS animations) */}
            <div className="absolute inset-0 z-10 overflow-hidden pointer-events-none">
              <div className="absolute top-[30%] left-[20%] w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              <div className="absolute top-[50%] left-[70%] w-2 h-2 bg-yellow-500 rounded-full animate-ping" style={{animationDelay: '0.3s'}}></div>
              <div className="absolute top-[70%] left-[40%] w-2 h-2 bg-red-500 rounded-full animate-ping" style={{animationDelay: '0.7s'}}></div>
              <div className="absolute top-[40%] left-[50%] w-4 h-4 bg-red-600 rounded-full animate-pulse shadow-[0_0_20px_rgba(255,0,0,1)]"></div>
              
              {/* Beams */}
              <svg className="absolute inset-0 w-full h-full opacity-50">
                <line x1="20%" y1="30%" x2="50%" y2="40%" stroke="red" strokeWidth="2" className="animate-pulse" />
                <line x1="70%" y1="50%" x2="50%" y2="40%" stroke="yellow" strokeWidth="1" className="animate-pulse" style={{animationDelay: '0.2s'}} />
                <line x1="40%" y1="70%" x2="50%" y2="40%" stroke="red" strokeWidth="2" className="animate-pulse" style={{animationDelay: '0.5s'}} />
              </svg>
            </div>

            <div className="absolute bottom-6 left-6 z-20 bg-black/80 border border-red-900 p-4 rounded backdrop-blur-md">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Wifi size={16}/> {t("SENSOR ARRAY 04")}</h3>
              <p className="text-xs opacity-70 mb-1">{t("MONITORING BENGALURU METRO GRID")}</p>
              <div className="h-16 w-48 border-b border-l border-red-900 flex items-end justify-between px-1 gap-1">
                {Array.from({length: 12}).map((_, i) => (
                  <div key={i} className="w-full bg-red-500 animate-pulse" style={{height: `${Math.random() * 100}%`, animationDelay: `${i * 0.1}s`}}></div>
                ))}
              </div>
            </div>

          </div>

          {/* Terminal Sidebar */}
          <div className="flex-1 bg-black rounded-xl border border-red-900 p-4 overflow-hidden relative font-mono text-[10px] sm:text-xs text-red-500 flex flex-col">
            <h2 className="font-bold border-b border-red-900 pb-2 mb-4 flex items-center gap-2"><Terminal size={16}/> {t("LIVE THREAT LOG")}</h2>
            <div className="flex-1 overflow-y-auto space-y-2 opacity-80" style={{ textShadow: '0 0 5px rgba(255,0,0,0.5)' }}>
              {logs.map((log, i) => (
                <div key={i} className={`pb-1 border-b border-red-900/30 ${i === 0 ? 'text-white bg-red-900/40 p-1' : ''}`}>
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
