"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Crosshair, Radio, Video, Battery, Compass, AlertTriangle, Target, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TacticalPage() {
  const { t } = useLanguage();
  const [telemetry, setTelemetry] = useState({
    alt: 450,
    speed: 120,
    heading: 85,
    lat: 12.971600,
    lng: 77.594600,
  });

  const [targetLock, setTargetLock] = useState(false);

  useEffect(() => {
    // Simulate real-time drone telemetry
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        alt: prev.alt + (Math.random() * 2 - 1),
        speed: prev.speed + (Math.random() * 4 - 2),
        heading: (prev.heading + (Math.random() * 2 - 1)) % 360,
        lat: prev.lat + (Math.random() * 0.0001 - 0.00005),
        lng: prev.lng + (Math.random() * 0.0001 - 0.00005),
      }));
    }, 500);

    setTimeout(() => {
      setTargetLock(true);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative font-mono">
        
        {/* CRT Scanline Effect Overlay */}
        <div className="pointer-events-none absolute inset-0 z-50 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>
        
        {/* Vignette */}
        <div className="pointer-events-none absolute inset-0 z-40 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>

        {/* Simulated Thermal/Night Vision Map Background */}
        <div className="absolute inset-0 z-0 bg-[#021008] overflow-hidden flex items-center justify-center">
          <div className="w-[200%] h-[200%] border-[rgba(0,255,100,0.1)] border-[1px] bg-[linear-gradient(rgba(0,255,100,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,100,0.05)_1px,transparent_1px)] bg-[size:50px_50px] animate-[spin_120s_linear_infinite]"></div>
          
          {/* Mock Radar Ping */}
          <div className="absolute w-[800px] h-[800px] border border-green-500/20 rounded-full animate-ping" style={{animationDuration: '4s'}}></div>
          <div className="absolute w-[400px] h-[400px] border border-green-500/30 rounded-full animate-ping" style={{animationDuration: '4s', animationDelay: '1s'}}></div>
        </div>

        {/* Top HUD Bar */}
        <div className="absolute top-0 left-0 right-0 p-6 z-30 flex justify-between items-start text-green-500">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Video className="animate-pulse text-red-500" size={20} />
              <span className="font-bold tracking-widest">{t("DRONE-01 : LIVE REC")}</span>
            </div>
            <div className="text-sm opacity-80 flex items-center gap-2">
              <Battery size={16} /> {t("BATT")} 84% - {t("EST")} 45m
            </div>
            <div className="text-sm opacity-80 flex items-center gap-2">
              <Radio size={16} /> {t("SIGNAL: STRONG")} (AES-256)
            </div>
          </div>
          
          <div className="text-right space-y-1">
            <div className="text-xl font-bold tracking-wider text-green-400">{t("KSP AERIAL COMMAND")}</div>
            <div className="text-sm opacity-80">{t("LAT:")} {telemetry.lat.toFixed(6)} N</div>
            <div className="text-sm opacity-80">{t("LNG:")} {telemetry.lng.toFixed(6)} E</div>
            <div className="text-sm opacity-80 text-gold mt-2">{t("SYS TIME:")} {new Date().toISOString()}</div>
          </div>
        </div>

        {/* Center Crosshair & Target Lock */}
        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="relative flex items-center justify-center">
            {/* Main Crosshair */}
            <Crosshair size={400} className="text-green-500/20 font-thin absolute" strokeWidth={0.5} />
            
            {/* Target Box */}
            <div className={`absolute w-40 h-40 border-2 transition-all duration-1000 ${targetLock ? 'border-red-500 scale-100' : 'border-green-500/50 scale-150 opacity-0'}`}>
              <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-inherit"></div>
              <div className="absolute -top-2 -right-2 w-6 h-6 border-t-4 border-r-4 border-inherit"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-4 border-l-4 border-inherit"></div>
              <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-inherit"></div>
              
              {targetLock && (
                <div className="absolute -right-40 top-0 w-36">
                  <div className="text-red-500 text-sm font-bold animate-pulse bg-black/80 border border-red-900 p-2 mb-1">{t("LOCK ACQUIRED")}</div>
                  <div className="text-green-400 text-xs bg-black/80 border border-green-900 p-1 mb-1">{t("VEHICLE MATCH:")} 94%</div>
                  <div className="text-green-400 text-xs bg-black/80 border border-green-900 p-1">{t("PL:")} KA-01-HC-4321</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom HUD Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-30 flex justify-between items-end text-green-500">
          <div className="w-64 space-y-2 bg-black/50 p-4 rounded border border-green-500/20">
            <div className="flex justify-between text-xs font-bold">
              <span>{t("ALTITUDE")}</span>
              <span>{telemetry.alt.toFixed(1)} m</span>
            </div>
            <div className="h-2 bg-green-900/50 w-full overflow-hidden mb-4">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(telemetry.alt/1000)*100}%` }}></div>
            </div>
            
            <div className="flex justify-between text-xs font-bold">
              <span>{t("AIRSPEED")}</span>
              <span>{telemetry.speed.toFixed(1)} km/h</span>
            </div>
            <div className="h-2 bg-green-900/50 w-full overflow-hidden">
              <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${(telemetry.speed/200)*100}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 bg-black/50 p-4 rounded-full border border-green-500/20">
            <Compass size={64} className="text-green-400" style={{ transform: `rotate(${telemetry.heading}deg)`, transition: 'transform 0.5s ease-out' }}/>
            <div className="text-sm font-bold tracking-widest text-gold bg-black px-2 py-1 rounded">{t("HDG")} {telemetry.heading.toFixed(0)}°</div>
          </div>

          <div className="w-80 space-y-3">
            <div className="border border-green-500/30 bg-black/80 p-4 rounded shadow-lg">
              <div className="flex items-center gap-2 mb-3 text-gold font-bold border-b border-green-900 pb-2">
                <Activity size={16}/> {t("TACTICAL FEEDBACK")}
              </div>
              {targetLock ? (
                <div className="text-red-400 text-sm font-semibold leading-relaxed animate-pulse">
                  {t("Target isolated within DBSCAN hotspot radius. Engaging auto-tracking mode. Ground units notified.")}
                </div>
              ) : (
                <div className="text-green-400 opacity-80 text-sm leading-relaxed">
                  {t("Scanning designated coordinates... Grid search active. Pattern Engine nominal.")}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </Layout>
  );
}
