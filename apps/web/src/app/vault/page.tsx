"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Database, Link as LinkIcon, FileCheck, Search, ShieldCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function VaultPage() {
  const { t } = useLanguage();
  const [blocks, setBlocks] = useState([
    { hash: '0x8f3c...1a2b', type: 'VOICE_NOTE', fir: 'FIR-204/2026', time: '10:45 AM', verified: true },
    { hash: '0x4d9e...c721', type: 'AR_SCAN', fir: 'FIR-204/2026', time: '09:12 AM', verified: true },
    { hash: '0x1a8f...9b33', type: 'WARRANT_PDF', fir: 'FIR-192/2026', time: 'Yesterday', verified: true },
    { hash: '0x7e2d...4f55', type: 'SUSPECT_PHOTO', fir: 'FIR-088/2026', time: 'Yesterday', verified: true }
  ]);

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-3">
              <Database className="text-purple-500" size={32} />
              {t("Blockchain Evidence Vault")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t("Cryptographic Immutable Ledger for Digital Evidence")}</p>
          </div>
        </header>

        <div className="flex gap-6 h-full min-h-[500px]">
          {/* Vault UI */}
          <div className="flex-[2] bg-white dark:bg-navy-dark rounded-xl shadow-sm border border-gray-200 dark:border-navy-light p-6 overflow-hidden flex flex-col relative">
            <div className="flex justify-between items-center mb-8 pb-4 border-b dark:border-navy-light">
              <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
                <LinkIcon size={20} className="text-purple-500"/> {t("Current Ledger")}
              </h2>
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-navy rounded px-3 py-2">
                <Search size={16} className="text-gray-400" />
                <input type="text" placeholder={t("Search Hash or FIR...")} className="bg-transparent border-none outline-none text-sm dark:text-white w-48" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 relative">
              {/* Connection Line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-purple-500/20 z-0"></div>

              {blocks.map((block, i) => (
                <div key={i} className="flex items-center gap-6 relative z-10 ml-2">
                  <div className="w-8 h-8 rounded-full bg-purple-500 flex items-center justify-center shadow-[0_0_10px_rgba(168,85,247,0.5)]">
                    <ShieldCheck size={16} className="text-white" />
                  </div>
                  <div className="flex-1 bg-gray-50 dark:bg-navy rounded-lg p-4 border border-gray-200 dark:border-navy-light flex justify-between items-center group hover:border-purple-500 transition-colors cursor-pointer">
                    <div>
                      <div className="text-xs text-purple-500 font-mono mb-1 flex items-center gap-2">
                        BLOCK HASH: {block.hash} {block.verified && <span className="bg-green-500/20 text-green-500 px-1 rounded text-[10px]">VERIFIED</span>}
                      </div>
                      <div className="font-bold dark:text-white">{block.type}</div>
                      <div className="text-sm text-gray-500">Linked to: {block.fir}</div>
                    </div>
                    <div className="text-sm text-gray-400 text-right">
                      <div>Timestamp</div>
                      <div>{block.time}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Node Status Panel */}
          <div className="flex-1 bg-gradient-to-b from-purple-900/10 to-transparent dark:from-purple-900/20 dark:to-transparent rounded-xl border border-purple-500/20 dark:border-purple-500/30 p-6 flex flex-col justify-center items-center text-center">
            <Database size={80} className="text-purple-500 mb-6 animate-pulse" />
            <h2 className="text-2xl font-bold text-navy dark:text-white mb-2">KSP HYPERLEDGER</h2>
            <p className="text-gray-500 mb-8">4/4 Validator Nodes Online</p>
            
            <div className="w-full space-y-3">
              {['Bengaluru HQ Node', 'Mysuru Datacenter', 'Mangaluru Node', 'Hubli Backup Node'].map((node, i) => (
                <div key={i} className="flex justify-between items-center bg-white dark:bg-navy p-3 rounded border border-gray-200 dark:border-navy-light">
                  <span className="text-sm font-medium text-navy dark:text-gray-300">{node}</span>
                  <span className="flex items-center gap-2 text-xs text-green-500 font-bold">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> SYNCED
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
