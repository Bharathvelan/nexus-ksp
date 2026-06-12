"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { BrainCircuit, Activity, HeartPulse, UserSquare, ShieldAlert } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function InterrogationSimulator() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<{role: string, text: string}[]>([]);
  const [input, setInput] = useState('');
  const [stressLevel, setStressLevel] = useState(30);
  const [deceptionProb, setDeceptionProb] = useState(15);
  const [isTyping, setIsTyping] = useState(false);
  
  // Real-time chart data mock
  const [chartData, setChartData] = useState<number[]>(Array(20).fill(30));

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData(prev => {
        const newData = [...prev.slice(1)];
        // Add random jitter based on current stress
        const jitter = (Math.random() - 0.5) * (stressLevel / 5);
        newData.push(Math.max(0, Math.min(100, stressLevel + jitter)));
        return newData;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [stressLevel]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', text: input }]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('http://localhost:8000/interrogate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspect_id: 'ACC-8091', question: input, stress_level: stressLevel })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { role: 'suspect', text: data.response }]);
      setDeceptionProb(data.deception_probability);
      setStressLevel(prev => Math.max(0, Math.min(100, prev + data.stress_delta)));
      setIsTyping(false);
    } catch (e) {
      console.error(e);
      setIsTyping(false);
    }
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
        <header className="flex justify-between items-center bg-black p-6 rounded-xl shadow-sm border border-red-900 shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-red-500 flex items-center gap-3">
              <BrainCircuit className="text-red-500" size={32} />
              {t("AI Suspect Interrogation Simulator")}
            </h1>
            <p className="text-red-900 mt-1 font-mono">{t("PSYCHOLOGICAL AVATAR MODULE: ACC-8091 (Ravi Kumar)")}</p>
          </div>
          <div className="flex items-center gap-4 text-red-500 font-mono border border-red-900 p-2 rounded">
            <UserSquare size={24} />
            <div>
              <div className="font-bold">{t("AVATAR STATUS")}</div>
              <div className="text-xs text-red-700">{t("AGGRESSION THRESHOLD: HIGH")}</div>
            </div>
          </div>
        </header>

        <div className="flex gap-6 h-full min-h-[500px]">
          {/* Interrogation Chat */}
          <div className="flex-[2] bg-gray-950 rounded-xl border border-red-900 p-6 flex flex-col relative font-mono shadow-[inset_0_0_50px_rgba(255,0,0,0.05)]">
            <h2 className="text-red-500 font-bold mb-4 border-b border-red-900 pb-2">{t("INTERROGATION TRANSCRIPT")}</h2>
            
            <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
              {messages.length === 0 && (
                <div className="text-center text-red-900 mt-20 opacity-50">
                  <ShieldAlert size={60} className="mx-auto mb-4" />
                  <p>{t("INITIATE QUESTIONING SEQUENCE")}</p>
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] p-3 rounded border ${msg.role === 'user' ? 'bg-red-950/40 border-red-900 text-red-200' : 'bg-black border-red-500/50 text-red-400 shadow-[0_0_10px_rgba(255,0,0,0.2)]'}`}>
                    <div className="text-[10px] opacity-50 mb-1">{msg.role === 'user' ? t("INVESTIGATOR") : t("SUSPECT AVATAR")}</div>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-black border-red-500/50 text-red-500 p-3 rounded animate-pulse text-sm">
                    {t("Analyzing psychological parameters...")}
                  </div>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type your question..."
                className="flex-1 bg-black border border-red-900 text-red-500 p-3 rounded outline-none focus:border-red-500 transition-colors"
              />
              <button 
                onClick={handleSend}
                className="bg-red-900/50 hover:bg-red-900 text-red-200 px-6 font-bold rounded transition-colors border border-red-900"
              >
                {t("INTERROGATE")}
              </button>
            </div>
          </div>

          {/* Polygraph / Stress Monitor */}
          <div className="flex-1 bg-black rounded-xl border border-red-900 p-6 flex flex-col font-mono relative overflow-hidden">
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(255,0,0,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,0,0,1)_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none"></div>

            <h2 className="text-red-500 font-bold mb-6 border-b border-red-900 pb-2 flex items-center gap-2 relative z-10">
              <Activity size={18} /> {t("BIOMETRIC TELEMETRY")}
            </h2>

            <div className="space-y-8 relative z-10">
              {/* Stress Level */}
              <div>
                <div className="flex justify-between text-red-500 mb-2">
                  <span className="flex items-center gap-2"><HeartPulse size={16}/> {t("CORTISOL / STRESS")}</span>
                  <span className="font-bold text-xl">{stressLevel}%</span>
                </div>
                <div className="w-full h-4 bg-red-950 rounded-full overflow-hidden border border-red-900">
                  <div 
                    className={`h-full transition-all duration-500 ${stressLevel > 75 ? 'bg-red-500 shadow-[0_0_10px_red]' : stressLevel > 40 ? 'bg-orange-500' : 'bg-green-500'}`}
                    style={{ width: `${stressLevel}%` }}
                  ></div>
                </div>
              </div>

              {/* Deception Probability */}
              <div>
                <div className="flex justify-between text-red-500 mb-2">
                  <span className="flex items-center gap-2"><BrainCircuit size={16}/> {t("DECEPTION PROBABILITY")}</span>
                  <span className="font-bold text-xl">{deceptionProb}%</span>
                </div>
                <div className="w-full h-4 bg-red-950 rounded-full overflow-hidden border border-red-900">
                  <div 
                    className={`h-full transition-all duration-500 bg-red-600 shadow-[0_0_10px_red]`}
                    style={{ width: `${deceptionProb}%` }}
                  ></div>
                </div>
              </div>

              {/* Live Waveform Simulation */}
              <div className="mt-12 h-40 border border-red-900 bg-red-950/20 rounded relative flex items-end p-2 gap-1">
                <div className="absolute top-2 left-2 text-[10px] text-red-700">{t("VOCAL TENSION FREQUENCY")}</div>
                {chartData.map((val, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-red-500 opacity-80"
                    style={{ height: `${val}%`, transition: 'height 0.2s ease-out' }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
