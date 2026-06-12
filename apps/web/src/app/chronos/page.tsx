"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { History, Play, Pause, FastForward, Rewind, LocateFixed, Clock, Activity } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ChronosPage() {
  const { t } = useLanguage();
  const [playing, setPlaying] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);
  const [direction, setDirection] = useState(1);

  // Entities in the scene (simulated positions over 100 time frames)
  const entities = [
    { id: 'S1', color: 'bg-red-500', path: Array.from({length: 100}, (_, i) => ({ x: 20 + i*0.5, y: 80 - i*0.4 })) },
    { id: 'V1', color: 'bg-blue-500', path: Array.from({length: 100}, (_, i) => ({ x: 70 - i*0.2, y: 30 + i*0.1 })) },
    { id: 'W1', color: 'bg-yellow-500', path: Array.from({length: 100}, (_, i) => ({ x: i < 50 ? 20 + i*0.5 : 45 + (i-50)*0.8, y: i < 50 ? 80 - i*0.4 : 60 - (i-50)*0.2 })) } // Weapon drop
  ];

  React.useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setTimeIndex(prev => {
        let next = prev + direction;
        if (next >= 99) { setPlaying(false); return 99; }
        if (next <= 0) { setPlaying(false); return 0; }
        return next;
      });
    }, 50);
    return () => clearInterval(interval);
  }, [playing, direction]);

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] bg-zinc-950 overflow-hidden relative flex flex-col font-mono text-cyan-500 rounded-xl">
        
        <header className="relative z-10 flex justify-between items-center p-6 border-b border-cyan-900/50 bg-black/80 backdrop-blur-md">
          <div className="flex items-center gap-4">
            <History size={40} className="text-cyan-500" />
            <div>
              <h1 className="text-3xl font-black tracking-[0.3em] text-cyan-400">{t("CHRONOS MODULE")}</h1>
              <p className="text-xs tracking-[0.5em] text-cyan-700">{t("AMBIENT TEMPORAL RECONSTRUCTION")}</p>
            </div>
          </div>
          <div className="text-right text-xs text-cyan-600">
            <div>{t("SCENE LOCK: SECTOR 4")}</div>
            <div>{t("T-MINUS:")} -{100 - timeIndex} {t("SECONDS")}</div>
          </div>
        </header>

        <div className="flex-1 relative p-6 flex flex-col gap-6">
          
          {/* Main 3D Simulation View */}
          <div className="flex-1 border border-cyan-900/50 bg-black/60 rounded-xl relative overflow-hidden flex items-center justify-center">
            {/* Holographic Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" style={{ transform: 'perspective(1000px) rotateX(60deg) scale(2)', transformOrigin: 'top' }}></div>
            
            {/* Scene Container */}
            <div className="relative w-[80%] h-[80%] border border-cyan-500/30 bg-cyan-950/10">
              
              {/* Render Paths (Ghost Trails) */}
              {entities.map(e => (
                <svg key={`path-${e.id}`} className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                  <polyline 
                    points={e.path.slice(0, timeIndex + 1).map(p => `${p.x}%,${p.y}%`).join(' ')}
                    fill="none"
                    stroke={e.color.replace('bg-', '')}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
              ))}

              {/* Render Active Entities */}
              {entities.map(e => {
                const pos = e.path[timeIndex];
                return (
                  <div 
                    key={`ent-${e.id}`}
                    className={`absolute w-3 h-3 rounded-full ${e.color} shadow-[0_0_15px_currentColor] -ml-1.5 -mt-1.5 transition-all duration-75`}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                  >
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 text-[8px] bg-black/80 px-1 border border-cyan-900 rounded whitespace-nowrap">
                      {e.id}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scanning Laser */}
            {playing && <div className="absolute left-0 w-full h-1 bg-cyan-400 shadow-[0_0_20px_cyan] opacity-50 pointer-events-none animate-[scan_2s_linear_infinite]"></div>}
          </div>

          {/* Playback Controls */}
          <div className="h-32 border border-cyan-900/50 bg-black/80 p-6 rounded-xl flex items-center gap-8">
            
            <div className="flex gap-4">
              <button onClick={() => { setDirection(-2); setPlaying(true); }} className="p-3 bg-cyan-950 hover:bg-cyan-900 rounded-full text-cyan-500"><Rewind /></button>
              <button onClick={() => { setDirection(1); setPlaying(!playing); }} className="p-3 bg-cyan-500 hover:bg-cyan-400 rounded-full text-black">
                {playing && direction > 0 ? <Pause /> : <Play />}
              </button>
              <button onClick={() => { setDirection(2); setPlaying(true); }} className="p-3 bg-cyan-950 hover:bg-cyan-900 rounded-full text-cyan-500"><FastForward /></button>
            </div>

            <div className="flex-1 relative">
              <input 
                type="range" 
                min="0" max="99" 
                value={timeIndex} 
                onChange={(e) => { setPlaying(false); setTimeIndex(parseInt(e.target.value)); }}
                className="w-full h-2 bg-cyan-950 rounded-lg appearance-none cursor-pointer"
              />
              <div className="absolute top-6 left-0 text-xs text-cyan-600 flex justify-between w-full">
                <span>{t("T-MINUS 100s")}</span>
                <span className="text-cyan-400 font-bold">{t("CURRENT:")} {timeIndex}</span>
                <span>{t("EVENT START (0s)")}</span>
              </div>
            </div>

          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          @keyframes scan {
            0% { top: 0%; }
            100% { top: 100%; }
          }
        `}} />
      </div>
    </Layout>
  );
}
