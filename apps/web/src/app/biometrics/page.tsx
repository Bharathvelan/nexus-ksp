"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { ScanFace, UserX, UserCheck, ShieldAlert, Cpu } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function BiometricsPage() {
  const { t } = useLanguage();
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const startScan = async () => {
    setIsScanning(true);
    setResult(null);
    try {
      const res = await fetch('http://localhost:8003/biometrics/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_hash: "dummy_hash" })
      });
      const data = await res.json();
      setTimeout(() => {
        setResult(data);
        setIsScanning(false);
      }, 4000); // 4 sec CSS animation
    } catch (e) {
      console.error(e);
      setIsScanning(false);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-3">
              <ScanFace className="text-indigo-500" size={32} />
              {t("Biometric Identification Terminal")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t("Cross-referencing facial landmarks against national criminal databases.")}</p>
          </div>
        </header>

        <div className="flex gap-6 h-full min-h-[500px]">
          <div className="flex-1 bg-black rounded-xl shadow-sm border border-gray-800 p-8 flex flex-col items-center justify-center relative overflow-hidden font-mono text-indigo-500">
            {/* HUD Elements */}
            <div className="absolute top-4 left-4 text-xs opacity-50">FACIAL_ID_ENGINE_v4.2</div>
            <div className="absolute top-4 right-4 text-xs opacity-50"><Cpu className="inline mr-1" size={12}/> CORE_SYS_ONLINE</div>

            {isScanning && (
              <div className="absolute inset-0 z-10 pointer-events-none">
                <div className="w-full h-1 bg-indigo-500/50 animate-[pulse_2s_linear_infinite] shadow-[0_0_20px_rgba(99,102,241,1)]"></div>
              </div>
            )}

            {!result && !isScanning && (
              <div className="text-center">
                <UserX size={120} className="text-indigo-900 mx-auto mb-6 opacity-80" />
                <h2 className="text-xl font-bold text-gray-400 mb-8 tracking-widest">AWAITING BIOMETRIC INPUT</h2>
                <button 
                  onClick={startScan}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-black tracking-widest px-8 py-4 rounded transition-all shadow-[0_0_15px_rgba(79,70,229,0.5)] border border-indigo-400"
                >
                  INITIALIZE UPLOAD & SCAN
                </button>
              </div>
            )}

            {isScanning && (
              <div className="text-center">
                <div className="relative w-64 h-64 mx-auto mb-8">
                  {/* Fake face placeholder silhouette */}
                  <div className="absolute inset-0 border-2 border-indigo-500/30 rounded-full flex items-center justify-center overflow-hidden">
                     <UserCheck size={160} className="text-indigo-500/20" />
                  </div>
                  {/* Facial Nodes */}
                  <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping"></div>
                  <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '0.2s'}}></div>
                  <div className="absolute bottom-1/3 left-1/2 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '0.4s'}}></div>
                  <div className="absolute top-1/2 right-1/3 w-2 h-2 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '0.1s'}}></div>
                  
                  {/* Targeting Reticle */}
                  <div className="absolute inset-0 border-4 border-dashed border-indigo-500 rounded-full animate-[spin_10s_linear_infinite] opacity-50"></div>
                </div>
                <h2 className="text-2xl font-bold tracking-widest text-indigo-400 mb-2">MAPPING LANDMARKS...</h2>
                <p className="text-sm text-indigo-300 opacity-80">Extracting 128 nodal points. Querying interpol database.</p>
              </div>
            )}

            {result && !isScanning && (
              <div className="flex flex-col items-center max-w-lg w-full bg-indigo-900/10 border border-indigo-500/50 rounded-xl p-8 backdrop-blur-sm">
                <ShieldAlert size={80} className="text-red-500 mb-6 animate-pulse" />
                <h2 className="text-3xl font-black text-red-400 tracking-widest mb-2">MATCH FOUND</h2>
                <div className="text-5xl font-black text-white mb-8">{result.match_percentage}%</div>

                <div className="w-full space-y-4 text-left border-t border-indigo-500/30 pt-6">
                  <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-indigo-300">SUBJECT NAME:</span>
                    <span className="text-white font-bold">{result.identity.name}</span>
                  </div>
                  <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-indigo-300">ACCUSED ID:</span>
                    <span className="text-white font-bold">{result.identity.accused_id}</span>
                  </div>
                  <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-indigo-300">KNOWN ALIASES:</span>
                    <span className="text-white font-bold">{result.identity.known_aliases.join(', ')}</span>
                  </div>
                  <div className="flex justify-between border-b border-indigo-500/20 pb-2">
                    <span className="text-indigo-300">RISK LEVEL:</span>
                    <span className="text-red-400 font-black">{result.identity.risk_level}</span>
                  </div>
                </div>

                <button onClick={() => setResult(null)} className="mt-8 text-xs underline text-indigo-400 hover:text-white">SCAN NEXT SUBJECT</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
