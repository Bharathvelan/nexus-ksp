"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Camera, AlertTriangle, Shield, Eye, Settings, Video } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SurveillancePage() {
  const { t } = useLanguage();
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    // Randomly generate security alerts for the CCTV feeds
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setAlerts(prev => [{
          id: Date.now(),
          feed: `CAM-0${Math.floor(Math.random() * 4) + 1}`,
          type: Math.random() > 0.5 ? 'UNAUTHORIZED ACCESS' : 'CONCEALED WEAPON DETECTED',
          time: new Date().toLocaleTimeString()
        }, ...prev].slice(0, 5));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-4">
        <header className="flex justify-between items-center bg-black p-4 rounded-xl shadow-sm border border-gray-800 shrink-0">
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              <Eye className="text-blue-500" size={28} />
              {t("Real-Time AI Surveillance")}
            </h1>
            <p className="text-gray-500 text-sm mt-1">{t("Automated Object Tracking & Anomaly Detection")}</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-blue-900/20 border border-blue-900 text-blue-500 px-4 py-2 rounded flex items-center gap-2 font-mono text-sm font-bold">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              {t("SYSTEM ACTIVE")}
            </div>
            <button className="p-2 border border-gray-700 text-gray-400 rounded hover:bg-gray-800 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </header>

        <div className="flex gap-4 flex-1 h-full min-h-[500px]">
          {/* Camera Grid */}
          <div className="flex-[3] grid grid-cols-2 grid-rows-2 gap-4">
            {[1, 2, 3, 4].map(cam => (
              <div key={cam} className="bg-gray-900 rounded-xl overflow-hidden relative border border-gray-800 group">
                <div className="absolute top-2 left-2 z-20 text-white font-mono text-xs flex items-center gap-2 bg-black/50 px-2 py-1 rounded">
                  <Video size={14} className="text-red-500" /> CAM-0{cam} : SECTOR {cam}
                </div>
                
                {/* Fake CCTV Noise Background */}
                <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')]"></div>

                {/* Simulated AI Bounding Boxes */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                  <div className={`absolute border-2 ${Math.random() > 0.8 ? 'border-red-500 shadow-[0_0_10px_red]' : 'border-blue-500'} w-24 h-48 rounded-sm animate-[pulse_${5+cam}s_ease-in-out_infinite]`} style={{ top: `${20 + cam*10}%`, left: `${10 + cam*15}%` }}>
                    <div className="absolute -top-5 left-0 bg-black/70 text-[8px] text-white px-1">PERSON {Math.floor(Math.random() * 99)}%</div>
                  </div>
                  
                  <div className={`absolute border-2 border-green-500 w-48 h-32 rounded-sm animate-[pulse_${7-cam}s_ease-in-out_infinite_reverse]`} style={{ top: `${50 - cam*5}%`, left: `${60 - cam*10}%` }}>
                    <div className="absolute -top-5 left-0 bg-black/70 text-[8px] text-white px-1">VEHICLE {Math.floor(Math.random() * 99)}%</div>
                  </div>
                </div>

                {/* Scanline effect */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none z-0"></div>
              </div>
            ))}
          </div>

          {/* AI Alert Log */}
          <div className="flex-1 bg-black rounded-xl border border-gray-800 p-4 font-mono text-sm flex flex-col">
            <h2 className="text-white font-bold border-b border-gray-800 pb-2 mb-4 flex items-center gap-2">
              <AlertTriangle className="text-yellow-500" size={18} /> {t("ANOMALY DETECTIONS")}
            </h2>
            <div className="space-y-3 overflow-y-auto">
              {alerts.length === 0 ? (
                <div className="text-gray-600 text-center mt-10">{t("Monitoring feeds...")}</div>
              ) : (
                alerts.map(alert => (
                  <div key={alert.id} className="bg-red-950/30 border border-red-900/50 rounded p-3 text-red-500 animate-in fade-in slide-in-from-right">
                    <div className="flex justify-between text-xs opacity-70 mb-1">
                      <span>{alert.feed}</span>
                      <span>{alert.time}</span>
                    </div>
                    <div className="font-bold">{alert.type}</div>
                    <button className="mt-2 text-xs bg-red-900/50 hover:bg-red-900 px-2 py-1 rounded w-full transition-colors text-white font-bold">{t("DISPATCH UNIT")}</button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
