"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Satellite, Navigation, Crosshair, Radar, ThermometerSun, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function OrbitalPage() {
  const { t } = useLanguage();
  const [zoom, setZoom] = useState(1);
  const [tracking, setTracking] = useState(false);
  const [coords, setCoords] = useState({ lat: 12.9716, lng: 77.5946 });

  useEffect(() => {
    if (!tracking) return;
    const interval = setInterval(() => {
      setCoords(prev => ({
        lat: prev.lat + (Math.random() - 0.5) * 0.001,
        lng: prev.lng + (Math.random() - 0.5) * 0.001
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, [tracking]);

  const handleEngage = () => {
    setTracking(true);
    let currentZoom = 1;
    const zoomInterval = setInterval(() => {
      currentZoom += 0.5;
      setZoom(currentZoom);
      if (currentZoom >= 10) {
        clearInterval(zoomInterval);
      }
    }, 100);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-black overflow-hidden relative flex flex-col font-mono text-orange-500 rounded-xl border border-orange-900">
        
        {/* Header */}
        <header className="relative z-20 flex justify-between items-center p-4 bg-black/80 backdrop-blur border-b border-orange-900">
          <div className="flex items-center gap-3">
            <Satellite size={32} className="text-orange-500" />
            <div>
              <h1 className="text-xl font-black tracking-[0.2em] text-orange-500">{t("ORBITAL COMMAND")}</h1>
              <p className="text-[10px] tracking-widest text-orange-700">{t("LEO SATELLITE UPLINK: SAT-V IND-01")}</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="text-right text-[10px] text-orange-600">
              <div>{t("ALTITUDE: 400KM")}</div>
              <div>{t("VELOCITY: 7.66 KM/S")}</div>
            </div>
            <button 
              onClick={handleEngage}
              disabled={tracking}
              className={`px-6 py-2 border ${tracking ? 'border-orange-900 text-orange-900' : 'border-orange-500 text-orange-500 hover:bg-orange-900/30'} font-bold tracking-widest transition-colors`}
            >
              {t("ENGAGE TARGET LOCK")}
            </button>
          </div>
        </header>

        {/* The Viewport */}
        <div className="flex-1 relative overflow-hidden flex items-center justify-center">
          
          {/* Simulated Satellite Map */}
          <div 
            className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/e8/Bengaluru_Landsat_8.jpg')] bg-cover bg-center transition-transform duration-[2000ms] ease-out opacity-40 mix-blend-screen"
            style={{ transform: `scale(${zoom})`, filter: zoom >= 10 ? 'invert(1) hue-rotate(180deg) contrast(2)' : 'none' }}
          ></div>

          {/* Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.1)_1px,transparent_1px)] bg-[size:50px_50px] pointer-events-none z-10"></div>
          
          {/* Target Reticle */}
          {tracking && (
            <div className="absolute z-20 flex flex-col items-center justify-center animate-in zoom-in duration-1000">
              <Crosshair size={200} className="text-red-500 animate-[spin_10s_linear_infinite]" strokeWidth={1} />
              
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full animate-pulse shadow-[0_0_20px_red]"></div>
              
              <div className="absolute -right-32 bg-black/80 border border-red-900 p-2 text-[10px] text-red-500 w-32">
                <div>{t("TRK: ACTIVE")}</div>
                <div>{t("LAT:")} {coords.lat.toFixed(4)}</div>
                <div>{t("LNG:")} {coords.lng.toFixed(4)}</div>
                <div className="text-orange-500 mt-1 flex items-center gap-1"><ThermometerSun size={10}/> {t("THERMAL ON")}</div>
              </div>
            </div>
          )}

          {/* Radar Sweep */}
          <div className="absolute inset-0 border-4 border-orange-900/30 rounded-full w-[800px] h-[800px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
            <div className="w-1/2 h-1/2 border-r-2 border-orange-500/50 absolute top-0 right-0 origin-bottom-left animate-[spin_4s_linear_infinite]"></div>
          </div>
        </div>

        {/* Footer Telemetry */}
        <footer className="relative z-20 flex justify-between p-4 bg-black/80 border-t border-orange-900 text-[10px]">
          <div className="flex gap-6">
            <span className="flex items-center gap-2"><Navigation size={12}/> {t("GYRO: STABLE")}</span>
            <span className="flex items-center gap-2 text-red-500 animate-pulse"><AlertTriangle size={12}/> {t("HIGH VALUE TARGET")}</span>
          </div>
          <div>{t("ISRO COMMAND LINK: ENCRYPTED")}</div>
        </footer>
      </div>
    </Layout>
  );
}
