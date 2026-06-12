"use client";
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AlertsPage() {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-navy mb-6">{t("System Alerts")}</h2>
        <div className="space-y-4">
          <div className="p-4 border border-red-200 bg-red-50 rounded-lg">
            <h3 className="font-bold text-red-700">{t("HIGH PRIORITY: Repeat Offender Detected")}</h3>
            <p className="text-red-600 text-sm mt-1">{t("ACC-501 crossed district boundary into Bangalore Urban.")}</p>
          </div>
          <div className="p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <h3 className="font-bold text-orange-700">{t("Hotspot Emerging")}</h3>
            <p className="text-orange-600 text-sm mt-1">{t("Spike in chain snatching incidents in Jayanagar.")}</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
