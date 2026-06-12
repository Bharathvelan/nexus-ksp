"use client";
import React from 'react';
import Layout from '@/components/Layout';
import { Activity, AlertTriangle, FileText, Users, ArrowUpRight, Search, Map as MapIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const router = useRouter();
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy dark:text-white">{t("Command Center")}</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">{t("Karnataka State Police Intelligence Overview")}</p>
          </div>
          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/chat')}
              className="flex items-center gap-2 bg-gold hover:bg-gold-dark text-navy font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Search size={18} /> {t("New AI Query")}
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: t("Active FIRs (24h)"), value: "142", trend: "+12%", icon: FileText, color: "text-blue-500", bg: "bg-blue-100 dark:bg-blue-900/30" },
            { label: t("High Risk Accused"), value: "89", trend: "-5%", icon: Users, color: "text-red-500", bg: "bg-red-100 dark:bg-red-900/30" },
            { label: t("Emerging Hotspots"), value: "12", trend: "+2", icon: Activity, color: "text-orange-500", bg: "bg-orange-100 dark:bg-orange-900/30" },
            { label: t("Active Alerts"), value: "5", trend: t("Critical"), icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100 dark:bg-red-900/30" },
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-navy p-6 rounded-xl shadow-sm border border-gray-100 dark:border-navy-light flex items-center justify-between group hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                <div className="flex items-end gap-2 mt-2">
                  <h3 className="text-3xl font-bold text-navy dark:text-white">{stat.value}</h3>
                  <span className="text-sm font-semibold text-green-500 flex items-center mb-1">
                    <ArrowUpRight size={14} /> {stat.trend}
                  </span>
                </div>
              </div>
              <div className={`p-4 rounded-full ${stat.bg}`}>
                <stat.icon size={24} className={stat.color} />
              </div>
            </div>
          ))}
        </div>

        {/* Map & Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white dark:bg-navy rounded-xl shadow-sm border border-gray-100 dark:border-navy-light p-6 min-h-[400px] flex flex-col">
            <h3 className="text-lg font-bold text-navy dark:text-white mb-4">{t("Live Crime Heatmap")}</h3>
            <div className="flex-1 bg-gray-100 dark:bg-navy-dark rounded-lg flex items-center justify-center border border-dashed border-gray-300 dark:border-gray-700">
              {/* Stub for Deck.gl Map */}
              <div className="text-center">
                <MapIcon size={48} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">{t("Interactive Map Loading...")}</p>
                <p className="text-xs text-gray-400 mt-1">{t("WebGL Context initializing")}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-navy rounded-xl shadow-sm border border-gray-100 dark:border-navy-light p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-navy dark:text-white">{t("Recent Alerts")}</h3>
              <button className="text-sm text-gold hover:underline">{t("View All")}</button>
            </div>
            <div className="space-y-4">
              {[
                { time: "10 mins ago", title: t("Hotspot Emerging"), desc: t("Unusual spike in two-wheeler thefts in Indiranagar."), type: "warning" },
                { time: "1 hour ago", title: t("Repeat Offender Spotted"), desc: t("ACC-501 flagged near Yeshwanthpur station."), type: "critical" },
                { time: "3 hours ago", title: t("Syndicate Activity"), desc: t("3 members of SYN-12 arrested."), type: "info" }
              ].map((alert, i) => (
                <div key={i} className="p-4 rounded-lg border border-gray-100 dark:border-navy-light hover:bg-gray-50 dark:hover:bg-navy-light transition-colors cursor-pointer">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-semibold text-sm text-navy dark:text-white">{alert.title}</span>
                    <span className="text-xs text-gray-400">{alert.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-300">{alert.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
