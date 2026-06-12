"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Fingerprint, AudioWaveform, FileAudio, AlertTriangle, CheckCircle2, MicVocal } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function DeepfakeForensics() {
  const { t } = useLanguage();
  const [analyzing, setAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<null | 'HUMAN' | 'SYNTHETIC'>(null);
  const [confidence, setConfidence] = useState(0);

  // Mock waveform heights
  const [waveform, setWaveform] = useState<number[]>(Array(40).fill(10));

  useEffect(() => {
    const interval = setInterval(() => {
      setWaveform(prev => {
        if (!analyzing) return Array(40).fill(10);
        return [...prev.slice(1), Math.random() * 80 + 10];
      });
    }, 100);
    return () => clearInterval(interval);
  }, [analyzing]);

  const handleAnalyze = () => {
    setAnalyzing(true);
    setProgress(0);
    setResult(null);

    const duration = 4000;
    const steps = 100;
    const intervalTime = duration / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      setProgress(currentStep);
      
      if (currentStep >= steps) {
        clearInterval(interval);
        setAnalyzing(false);
        setResult('SYNTHETIC');
        setConfidence(98.4);
      }
    }, intervalTime);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-3">
              <AudioWaveform className="text-orange-500" size={32} />
              {t("Deepfake Forensics Engine")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t("Real-Time Synthetic Audio & Voice Cloning Detection")}</p>
          </div>
        </header>

        <div className="flex gap-6 h-full min-h-[500px]">
          
          <div className="flex-[2] bg-white dark:bg-navy-dark rounded-xl shadow-sm border border-gray-200 dark:border-navy-light p-8 flex flex-col items-center justify-center relative overflow-hidden">
            
            <div className="w-full max-w-2xl bg-gray-50 dark:bg-navy p-8 rounded-xl border border-gray-200 dark:border-navy-light text-center relative z-10">
              <FileAudio size={64} className="text-orange-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-navy dark:text-white mb-2">TARGET.WAV (Intercepted Call)</h2>
              <p className="text-gray-500 mb-8">Duration: 00:02:14 | Bitrate: 128kbps | Source: Wiretap-B</p>

              {/* Waveform Visualization */}
              <div className="h-32 bg-gray-200 dark:bg-navy-dark rounded-lg flex items-center gap-1 p-4 mb-8 overflow-hidden relative">
                {waveform.map((h, i) => (
                  <div key={i} className="flex-1 bg-orange-500 rounded-t-sm" style={{ height: `${h}%`, transition: 'height 0.1s linear' }}></div>
                ))}
                
                {analyzing && (
                  <div className="absolute top-0 bottom-0 w-4 bg-white/80 shadow-[0_0_20px_white] translate-x-full animate-pulse"></div>
                )}
              </div>

              {!analyzing && !result && (
                <button 
                  onClick={handleAnalyze}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-colors flex items-center gap-2 mx-auto"
                >
                  <Fingerprint size={20} /> INITIATE SPECTRAL ANALYSIS
                </button>
              )}

              {analyzing && (
                <div className="w-full">
                  <div className="flex justify-between text-sm text-gray-500 font-mono mb-2">
                    <span>ANALYZING VOCAL TRACT RESONANCE</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 dark:bg-navy-dark rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 transition-all duration-100" style={{ width: `${progress}%` }}></div>
                  </div>
                </div>
              )}

              {result && (
                <div className="animate-in zoom-in duration-300">
                  <div className="inline-flex items-center gap-3 bg-red-500/10 text-red-500 border border-red-500/30 px-6 py-4 rounded-xl mb-4">
                    <AlertTriangle size={32} />
                    <div className="text-left">
                      <div className="text-sm font-bold opacity-80">DETECTION RESULT</div>
                      <div className="text-2xl font-black">{result} MANIPULATION DETECTED</div>
                    </div>
                  </div>
                  <div className="text-gray-500 font-mono mt-2">
                    AI CLONE CONFIDENCE: <span className="font-bold text-red-500">{confidence}%</span>
                  </div>
                </div>
              )}
            </div>

            {/* Background decorative elements */}
            <MicVocal size={400} className="absolute -bottom-20 -right-20 text-gray-100 dark:text-navy/50 pointer-events-none" />
          </div>

          <div className="flex-[1] bg-white dark:bg-navy-dark rounded-xl shadow-sm border border-gray-200 dark:border-navy-light p-6 font-mono text-sm flex flex-col">
            <h3 className="font-bold text-orange-500 border-b border-gray-200 dark:border-navy-light pb-2 mb-4">FORENSIC LOGS</h3>
            
            <div className="space-y-4 text-gray-500 dark:text-gray-400 flex-1">
              {analyzing && progress > 10 && <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Pitch contour extracted</div>}
              {analyzing && progress > 30 && <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Glottal flow estimated</div>}
              {analyzing && progress > 50 && <div className="flex items-center gap-2"><CheckCircle2 size={14} className="text-green-500"/> Acoustic artifacts checked</div>}
              {analyzing && progress > 70 && <div className="flex items-center gap-2 text-red-500"><AlertTriangle size={14}/> Spectral mismatch detected at 1.2s</div>}
              {analyzing && progress > 85 && <div className="flex items-center gap-2 text-red-500"><AlertTriangle size={14}/> GAN-generated noise floor identified</div>}
            </div>

            <div className="border-t border-gray-200 dark:border-navy-light pt-4 text-xs opacity-50">
              NEXUS-KSP SPECTRAL ENGINE V2.4
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
