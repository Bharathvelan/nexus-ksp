"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import dynamic from 'next/dynamic';
import { Crosshair, Map, Navigation2, Activity, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

// Dynamically import the map to avoid SSR window issues
const SpatialMap = dynamic(() => import('@/components/SpatialMap'), {
  ssr: false,
  loading: () => <div className="h-full w-full bg-navy-dark animate-pulse rounded-xl flex items-center justify-center text-white font-mono">INITIALIZING SPATIAL ENGINE...</div>
});

export default function DispatchPage() {
  const { t } = useLanguage();
  const [hotspots, setHotspots] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8001/predict/spatial')
      .then(res => res.json())
      .then(data => setHotspots(data.hotspots || []))
      .catch(err => console.error(err));
  }, []);

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-3">
              <Map className="text-gold" size={32} />
              {t("Predictive Spatial Dispatch")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t("Real-time DBSCAN Hotspot Clustering & Dynamic Patrol Routing")}</p>
          </div>
          <div className="flex gap-4">
            <button className="bg-navy hover:bg-navy-light dark:bg-navy-light dark:hover:bg-navy-light/80 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-colors">
              <Activity size={18} /> {t("Update Matrix")}
            </button>
            <button className="bg-gold hover:bg-gold-dark text-navy px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold transition-colors shadow-sm">
              <Navigation2 size={18} /> {t("Auto-Dispatch Units")}
            </button>
          </div>
        </header>

        <div className="flex gap-6 h-full min-h-[500px]">
          {/* Map Area */}
          <div className="flex-1 bg-white dark:bg-navy rounded-xl shadow-sm border border-gray-100 dark:border-navy-light p-2 overflow-hidden relative">
            {/* Overlay UI elements can go here if needed */}
            <div className="absolute top-6 left-6 z-[400] bg-navy/90 backdrop-blur-sm border border-navy-light p-4 rounded-lg text-white shadow-xl max-w-xs">
              <h3 className="font-bold flex items-center gap-2 mb-2"><Crosshair className="text-red-400" size={16}/> {t("AI Target Overlay")}</h3>
              <p className="text-xs text-gray-300">{t("Displaying predicted crime geometries for Bangalore Central. Evaluated via Python Pattern Engine.")}</p>
            </div>
            
            <SpatialMap />
          </div>

          {/* Sidebar */}
          <div className="w-80 flex flex-col gap-6 shrink-0 overflow-y-auto">
            <div className="bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light flex-1">
              <h2 className="font-bold text-lg text-navy dark:text-white border-b dark:border-navy-light pb-3 mb-4 flex items-center gap-2">
                <ShieldAlert size={18} className="text-gold"/> {t("Active AI Hotspots")}
              </h2>
              
              <div className="space-y-4">
                {hotspots.map((spot, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-navy-dark rounded-lg border dark:border-navy-light relative overflow-hidden group cursor-pointer hover:border-gold transition-colors">
                    <div className={`absolute top-0 left-0 w-1 h-full ${spot.risk_score > 90 ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-mono text-xs font-bold text-gray-500">{spot.id}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-bold ${spot.risk_score > 90 ? 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' : 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400'}`}>
                        {spot.risk_score} {t("RISK")}
                      </span>
                    </div>
                    <p className="text-sm text-navy dark:text-gray-200 font-medium mb-3">
                      {spot.description}
                    </p>
                    <button className="w-full text-xs font-bold bg-navy dark:bg-navy-light text-white py-2 rounded hover:bg-gold hover:text-navy transition-colors">
                      {t("DISPATCH UNIT")}
                    </button>
                  </div>
                ))}
                
                {hotspots.length === 0 && (
                  <div className="text-sm text-gray-500 text-center py-8">{t("Fetching spatial matrix...")}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
