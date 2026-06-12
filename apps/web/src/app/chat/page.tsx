"use client";
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import VoiceCapture from '@/components/VoiceCapture';
import { Send, Languages, Paperclip, ChevronDown, CheckCircle2 } from 'lucide-react';
import jsPDF from 'jspdf';
import { useLanguage } from '@/contexts/LanguageContext';

interface Message {
  role: string;
  content: string;
  citations?: string[];
  sources_used?: string[];
  evidence_chain?: string[];
}

export default function ChatPage() {
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: t('Hello, Investigator. I am the NEXUS-KSP AI. How can I assist you with your case today?') }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleTranscription = (text: string, lang: string) => {
    setInput(text);
    if (lang === 'kn') {
      setLanguage('Kannada');
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    setLoading(true);

    // Mock response after 2 seconds
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: t('Based on the analysis, I found 3 linked cases. The primary accused is currently flagged as HIGH risk. [FIR-8821]'),
        citations: ['FIR-8821', 'ACC-991'],
        sources_used: ['sql', 'graph'],
        evidence_chain: [t('Analyzed network'), t('Queried financial DB')]
      }]);
      setLoading(false);
    }, 2000);
  };

  const exportToPdf = () => {
    const doc = new jsPDF();
    doc.setFont("times", "normal");
    doc.setFontSize(14);
    doc.text("NEXUS-KSP AI Analysis Report", 15, 20);
    doc.setFontSize(10);
    doc.text(`Session ID: 1993-29X | Date: ${new Date().toLocaleDateString()}`, 15, 30);
    
    let yPos = 45;
    
    messages.forEach((msg, idx) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      doc.setFont("times", "bold");
      doc.text(msg.role === 'user' ? 'INVESTIGATOR:' : 'NEXUS AI:', 15, yPos);
      yPos += 7;
      
      doc.setFont("times", "normal");
      const splitText = doc.splitTextToSize(msg.content, 180);
      doc.text(splitText, 15, yPos);
      yPos += (splitText.length * 6) + 10;
    });
    
    doc.save("NEXUS_Chat_Transcript.pdf");
  };

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)] bg-white dark:bg-navy-dark rounded-xl shadow-lg border border-gray-200 dark:border-navy-light overflow-hidden">
        {/* Header */}
        <div className="bg-navy p-4 flex justify-between items-center text-white">
          <div>
            <h2 className="text-lg font-bold text-gold">{t("NEXUS AI Analyst")}</h2>
            <p className="text-xs text-gray-300">{t("Session ID: 1993-29X")}</p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 bg-navy-light px-3 py-1.5 rounded text-sm hover:bg-opacity-80 transition-all">
              <Languages size={16} /> {language}
            </button>
            <button onClick={exportToPdf} className="flex items-center gap-2 bg-navy-light px-3 py-1.5 rounded text-sm hover:bg-opacity-80 transition-all">
              {t("Export PDF")}
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-navy text-white rounded-br-none' : 'bg-gray-100 dark:bg-navy-light text-navy-dark dark:text-white rounded-bl-none shadow-sm'}`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                
                {/* Citations & Evidence Panel */}
                {msg.role === 'assistant' && msg.citations && (
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <details className="cursor-pointer group">
                      <summary className="text-xs font-semibold text-gold flex items-center gap-1">
                        {t("View Sources & Evidence")} <ChevronDown size={14} className="group-open:rotate-180 transition-transform"/>
                      </summary>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-300 space-y-2">
                        <p><strong>{t("Sources:")}</strong> {msg.sources_used?.join(', ')}</p>
                        <p><strong>{t("Citations:")}</strong> {msg.citations?.join(', ')}</p>
                        <div>
                          <strong>{t("Evidence Chain:")}</strong>
                          <ul className="list-disc ml-4 mt-1">
                            {msg.evidence_chain?.map((step, i) => (
                              <li key={i} className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> {step}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </details>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-navy-light p-4 rounded-2xl rounded-bl-none text-sm text-gray-500 flex items-center gap-2 animate-pulse">
                <div className="w-2 h-2 bg-gold rounded-full"></div>
                <div className="w-2 h-2 bg-gold rounded-full delay-75"></div>
                <div className="w-2 h-2 bg-gold rounded-full delay-150"></div>
                <span>{t("Analyzing across databases...")}</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-50 dark:bg-[#060c1d] border-t border-gray-200 dark:border-navy-light">
          <div className="flex items-center gap-3 bg-white dark:bg-navy rounded-full p-2 border border-gray-300 dark:border-gray-700 shadow-sm focus-within:ring-2 ring-gold transition-all">
            <button className="p-2 text-gray-400 hover:text-gold transition-colors">
              <Paperclip size={20} />
            </button>
            <input 
              type="text" 
              className="flex-1 bg-transparent border-none focus:outline-none text-navy-dark dark:text-white px-2 placeholder-gray-400"
              placeholder={t("Ask about cases, offenders, hotspots...")} 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <VoiceCapture onTranscription={handleTranscription} />
            <button onClick={handleSend} className="p-3 bg-gold hover:bg-gold-dark text-white rounded-full transition-colors shadow-md">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
