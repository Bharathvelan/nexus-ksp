"use client";
import React from 'react';
import Link from 'next/link';
import { Home, MessageSquare, Network, Map as MapIcon, UserSquare, Bell, Settings, Target, Fingerprint, ScanFace, Stamp, Globe, Eye, Database, BrainCircuit, Crosshair, Dna, Satellite, Microscope, Cpu, Brain, History, ShieldAlert, Network as CyberNet } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const Sidebar = () => {
  const { t, language, setLanguage } = useLanguage();

  return (
    <aside className="w-64 bg-navy text-white min-h-screen p-4 flex flex-col border-r border-navy-light">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gold">{t('NEXUS-KSP')}</h1>
        <p className="text-xs text-gray-400">{t('Intelligence Platform')}</p>
      </div>
      <nav className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-2 pb-4">
        <Link href="/dashboard" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors">
          <Home size={20} /> {t('Dashboard')}
        </Link>
        <Link href="/chat" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors">
          <MessageSquare size={20} /> {t('Chat & Query')}
        </Link>
        <Link href="/network/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors">
          <Network size={20} /> {t('Network Graph')}
        </Link>
        <Link href="/dispatch" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors">
          <MapIcon size={20} /> {t('Spatial Dispatch')}
        </Link>
        <Link href="/profiles/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors">
          <UserSquare size={20} /> {t('Offender Profiles')}
        </Link>
        <Link href="/alerts" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors">
          <Bell size={20} /> {t('Alerts')}
        </Link>
        <Link href="/forensics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-cyan-400 font-bold">
          <Fingerprint size={20} /> {t('Digital Forensics')}
        </Link>
        <Link href="/biometrics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-indigo-400 font-bold">
          <ScanFace size={20} /> {t('Biometric Terminal')}
        </Link>
        <Link href="/tactical" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-red-400 font-bold">
          <Target size={20} /> {t('Tactical Drone HUD')}
        </Link>
        <Link href="/cyber" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-red-500 font-bold">
          <Globe size={20} /> {t('Cyber Operations')}
        </Link>
        <Link href="/surveillance" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-blue-500 font-bold">
          <Eye size={20} /> {t('Live Surveillance')}
        </Link>
        <Link href="/sentinel" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-cyan-400 font-bold tracking-widest">
          <Crosshair size={20} /> {t('SENTINEL PRE-CRIME')}
        </Link>
        <Link href="/dna" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-emerald-400 font-bold">
          <Dna size={20} /> {t('Quantum Phenotyper')}
        </Link>
        <Link href="/autopsy" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-fuchsia-500 font-bold">
          <Microscope size={20} /> {t('Cellular Autopsy')}
        </Link>
        <Link href="/orbital" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-orange-500 font-bold">
          <Satellite size={20} /> {t('Orbital Command')}
        </Link>
        <Link href="/grid" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-yellow-500 font-bold">
          <Cpu size={20} /> {t('Smart Grid C2')}
        </Link>
        <Link href="/memory" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-purple-400 font-bold tracking-widest">
          <Brain size={20} /> {t('Neural Extractor')}
        </Link>
        <Link href="/chronos" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-cyan-500 font-bold">
          <History size={20} /> {t('Chronos Reconstruction')}
        </Link>
        <Link href="/mecha" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-emerald-500 font-bold">
          <ShieldAlert size={20} /> {t('Mecha Dispatch')}
        </Link>
        <Link href="/cybernetics" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-slate-300 font-bold tracking-[0.2em]">
          <CyberNet size={20} /> {t('Cybernetic Rehab')}
        </Link>
        <Link href="/vault" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-purple-500 font-bold">
          <Database size={20} /> {t('Blockchain Vault')}
        </Link>
        <Link href="/interrogation" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-red-500 font-bold">
          <BrainCircuit size={20} /> {t('Interrogation AI')}
        </Link>
        <Link href="/legal" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors text-gold font-bold">
          <Stamp size={20} /> {t('Legal Drafter')}
        </Link>
        <Link href="/admin/policies" className="flex items-center gap-3 p-3 rounded-lg hover:bg-navy-light transition-colors border-t border-navy-light mt-4 pt-4 text-gold">
          <Settings size={20} /> {t('Admin Control')}
        </Link>
      </nav>

      {/* Language Toggle */}
      <div className="mt-4 pt-4 border-t border-navy-light flex flex-col gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-widest">{t('Language')}</span>
        <div className="flex bg-navy-dark rounded-lg overflow-hidden border border-navy-light">
          <button 
            onClick={() => setLanguage('en')}
            className={`flex-1 py-2 text-xs font-bold transition-colors ${language === 'en' ? 'bg-gold text-navy' : 'text-gray-400 hover:bg-navy-light'}`}
          >
            {t('English')}
          </button>
          <button 
            onClick={() => setLanguage('kn')}
            className={`flex-1 py-2 text-xs font-bold transition-colors ${language === 'kn' ? 'bg-gold text-navy' : 'text-gray-400 hover:bg-navy-light'}`}
          >
            {t('Kannada')}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-50 min-h-screen dark:bg-navy-dark">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto h-screen custom-scrollbar">
        {children}
      </main>
    </div>
  );
}
