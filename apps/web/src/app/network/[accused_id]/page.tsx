"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Network as NetIcon, IndianRupee, AlertCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function NetworkPage({ params }: { params: { accused_id: string } }) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('co-offenders');

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-white rounded-xl shadow p-6">
        <header className="flex justify-between items-end mb-6 border-b pb-4">
          <div>
            <h2 className="text-3xl font-bold text-navy">{t("Network Graph")}: {params.accused_id}</h2>
            <p className="text-gray-500 mt-1">{t("Multi-hop linkage analysis using Neo4j")}</p>
          </div>
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('co-offenders')}
              className={`px-4 py-2 flex items-center gap-2 rounded-md font-medium transition-all ${activeTab === 'co-offenders' ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-navy'}`}
            >
              <NetIcon size={18} /> {t("Co-offender Network")}
            </button>
            <button 
              onClick={() => setActiveTab('financial')}
              className={`px-4 py-2 flex items-center gap-2 rounded-md font-medium transition-all ${activeTab === 'financial' ? 'bg-white shadow text-navy' : 'text-gray-500 hover:text-navy'}`}
            >
              <IndianRupee size={18} /> {t("Financial Money Trail")}
            </button>
          </div>
        </header>

        <div className="flex-1 flex gap-6">
          {/* Graph View */}
          <div className="flex-1 bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center relative overflow-hidden">
            {activeTab === 'co-offenders' ? (
               <div className="text-center">
                 <NetIcon size={48} className="mx-auto text-gray-300 mb-2" />
                 <p className="text-gray-500 font-medium">Vis.js Force-Directed Graph loading...</p>
                 <p className="text-xs text-gray-400 mt-1">Fetching GDS Louvain communities</p>
               </div>
            ) : (
               <div className="text-center w-full h-full relative">
                 {/* Mock UI for Financial Network */}
                 <div className="absolute inset-0 bg-slate-900 opacity-[0.02]"></div>
                 <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-blue-100 rounded-full border-2 border-blue-500 flex items-center justify-center transform -translate-y-1/2 shadow-lg">👤</div>
                 <div className="absolute top-1/2 left-1/2 w-12 h-12 bg-red-100 rounded border-2 border-red-500 flex items-center justify-center transform -translate-y-1/2 -translate-x-1/2 shadow-lg animate-pulse">🏦</div>
                 <div className="absolute top-1/2 right-1/4 w-12 h-12 bg-gray-100 rounded border-2 border-gray-500 flex items-center justify-center transform -translate-y-1/2 shadow-lg">🏢</div>
                 
                 {/* Edges */}
                 <svg className="absolute inset-0 w-full h-full pointer-events-none">
                   <line x1="25%" y1="50%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="4" className="animate-[dash_2s_linear_infinite]" strokeDasharray="10, 5" />
                   <line x1="50%" y1="50%" x2="75%" y2="50%" stroke="#9ca3af" strokeWidth="2" />
                 </svg>
                 
                 <div className="absolute bottom-4 left-0 right-0 text-center">
                   <p className="text-gray-500 font-medium bg-white inline-block px-4 py-1 rounded-full shadow-sm border">Vis.js Timeline Animated Flows</p>
                 </div>
               </div>
            )}
          </div>

          {/* Side Panel for Financial Insights */}
          {activeTab === 'financial' && (
            <div className="w-80 space-y-4 flex flex-col">
              <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                <h3 className="font-bold text-red-800 flex items-center gap-2 mb-2"><AlertCircle size={18} /> Layering Detected</h3>
                <p className="text-sm text-red-700">A 3-hop transaction sequence originating from {params.accused_id} ending in a suspected shell corporation.</p>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-navy mb-3">Trail Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-gray-500">Total Suspicious</span><span className="font-semibold text-red-600">₹5,00,000</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Terminal Sink</span><span className="font-semibold">Shell Corp XYZ</span></div>
                </div>
              </div>
              <div className="bg-white border border-gray-200 p-4 rounded-lg shadow-sm flex-1">
                <h3 className="font-bold text-navy mb-3">Recommended Actions</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex gap-2"><span className="text-gold">•</span> Freeze Acct 9918 (High Risk)</li>
                  <li className="flex gap-2"><span className="text-gold">•</span> Issue notice to Shell Corp XYZ</li>
                </ul>
                <button className="w-full mt-4 bg-navy hover:bg-navy-light text-white py-2 rounded font-medium transition-colors">Generate Subpoena PDF</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
