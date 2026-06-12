"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FileText, Download, Bot, Stamp } from 'lucide-react';
import jsPDF from 'jspdf';
import { useLanguage } from '@/contexts/LanguageContext';

export default function LegalDrafterPage() {
  const { t } = useLanguage();
  const [suspectId, setSuspectId] = useState('ACC-8091');
  const [caseType, setCaseType] = useState('Financial Fraud & Money Laundering');
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftedText, setDraftedText] = useState('');

  const generateDraft = async () => {
    setIsDrafting(true);
    setDraftedText('');
    try {
      const res = await fetch('http://localhost:8000/draft/warrant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suspect_id: suspectId, case_type: caseType })
      });
      const data = await res.json();
      
      // Simulate streaming text effect
      const fullText = data.draft_text;
      let currentIndex = 0;
      
      const interval = setInterval(() => {
        setDraftedText(fullText.slice(0, currentIndex));
        currentIndex += 5;
        if (currentIndex > fullText.length) {
          clearInterval(interval);
          setDraftedText(fullText);
          setIsDrafting(false);
        }
      }, 20);

    } catch (e) {
      console.error(e);
      setIsDrafting(false);
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(12);
    
    // Split text to fit page width
    const splitText = doc.splitTextToSize(draftedText, 180);
    doc.text(splitText, 15, 20);
    doc.save(`Warrant_${suspectId}.pdf`);
  };

  return (
    <Layout>
      <div className="h-[calc(100vh-2rem)] flex flex-col space-y-6">
        <header className="flex justify-between items-center bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light shrink-0">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white flex items-center gap-3">
              <Stamp className="text-gold" size={32} />
              {t("Automated LLM Legal Drafter")}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t("One-click generation of court-ready Warrants and Subpoenas via AI.")}</p>
          </div>
        </header>

        <div className="flex gap-6 h-full min-h-[500px]">
          {/* Controls */}
          <div className="w-96 bg-white dark:bg-navy rounded-xl shadow-sm border border-gray-100 dark:border-navy-light p-6 flex flex-col space-y-6">
            <h2 className="font-bold border-b pb-2 flex items-center gap-2"><Bot size={18}/> {t("Draft Parameters")}</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t("Target Suspect ID")}</label>
                <input 
                  type="text" 
                  value={suspectId}
                  onChange={e => setSuspectId(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-navy-dark border border-gray-200 dark:border-navy-light rounded p-3 text-navy dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm text-gray-500 mb-1">{t("Case Type / Allegation")}</label>
                <input 
                  type="text" 
                  value={caseType}
                  onChange={e => setCaseType(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-navy-dark border border-gray-200 dark:border-navy-light rounded p-3 text-navy dark:text-white"
                />
              </div>
              
              <button 
                onClick={generateDraft}
                disabled={isDrafting}
                className="w-full bg-navy hover:bg-navy-light dark:bg-gold dark:hover:bg-gold-dark dark:text-navy text-white font-bold py-4 rounded-lg mt-4 transition-colors disabled:opacity-50"
              >
                {isDrafting ? t("LLM DRAFTING...") : t("GENERATE WARRANT")}
              </button>
            </div>
            
            {draftedText && !isDrafting && (
              <button 
                onClick={downloadPDF}
                className="w-full border-2 border-gold text-gold font-bold py-4 rounded-lg hover:bg-gold/10 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={20}/> {t("EXPORT TO PDF")}
              </button>
            )}
          </div>

          {/* Document Preview */}
          <div className="flex-1 bg-[#fdfbf7] dark:bg-gray-200 rounded-xl shadow-inner border border-gray-300 p-12 overflow-y-auto font-serif text-black relative">
            {!draftedText && !isDrafting && (
              <div className="absolute inset-0 flex items-center justify-center opacity-20 flex-col">
                <FileText size={120} className="mb-4" />
                <h2 className="text-2xl font-bold">{t("AWAITING AI DRAFT")}</h2>
              </div>
            )}
            <div className="whitespace-pre-wrap leading-relaxed text-lg max-w-2xl mx-auto">
              {draftedText}
              {isDrafting && <span className="inline-block w-2 h-5 bg-black animate-pulse ml-1 align-middle"></span>}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
