"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { BrainCircuit, Search, GitBranch, Download } from 'lucide-react';

export default function CaseIntelligencePage({ params }: { params: { fir_id: string } }) {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    // Mock fetching data from /auto-summary and /find-leads
    setTimeout(() => {
      setData({
        summary: "This case involves a series of coordinated two-wheeler thefts operating out of Indiranagar. The primary suspects are linked to syndicate SYN-12.",
        leads: [
            { entity: "ACC-501", score: 88, desc: "Co-offended in FIR-8821 with similar MO; phone pinged near crime scene." },
            { entity: "Shivaji Nagar Chop Shop", score: 75, desc: "Known drop-off point for SYN-12 stolen vehicles." }
        ],
        mo_matches: [
            { fir: "FIR-9923", score: 95, explanation: "Both cases involved breaking steering locks using a master key during 2AM-4AM." }
        ]
      });
    }, 1000);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex justify-between items-center bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-navy flex items-center gap-3">
              <BrainCircuit className="text-gold" size={32} />
              AI Intelligence Dossier
            </h1>
            <p className="text-gray-500 mt-1">Case Reference: {params.fir_id}</p>
          </div>
          <button className="bg-navy hover:bg-navy-light text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
            <Download size={18} /> Export Court-Ready PDF
          </button>
        </header>

        {!data ? (
          <div className="h-64 flex items-center justify-center text-gray-500 bg-white rounded-xl border border-gray-100">
            Synthesizing intelligence across databases...
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Executive Summary */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 col-span-2">
              <h3 className="font-bold text-navy mb-2 flex items-center gap-2"><Search size={18}/> Executive Summary</h3>
              <p className="text-gray-700 leading-relaxed bg-blue-50 p-4 rounded border border-blue-100">{data.summary}</p>
            </div>

            {/* AI Leads */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><GitBranch size={18}/> High-Priority Leads</h3>
              <div className="space-y-4">
                {data.leads.map((lead: any, i: number) => (
                  <div key={i} className="border border-gray-200 p-4 rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-navy">{lead.entity}</span>
                      <span className="text-xs bg-gold text-white px-2 py-1 rounded-full font-bold">{lead.score}% Match</span>
                    </div>
                    <p className="text-sm text-gray-600">{lead.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* MO Comparisons */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="font-bold text-navy mb-4 flex items-center gap-2"><BrainCircuit size={18}/> Modus Operandi (MO) Matches</h3>
              <div className="space-y-4">
                {data.mo_matches.map((mo: any, i: number) => (
                  <div key={i} className="border border-orange-200 p-4 rounded-lg bg-orange-50">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-orange-800">{mo.fir}</span>
                      <span className="text-xs bg-orange-500 text-white px-2 py-1 rounded-full font-bold">{mo.score}% Match</span>
                    </div>
                    <p className="text-sm text-orange-700">{mo.explanation}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </Layout>
  );
}
