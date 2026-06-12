"use client";
import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';
export default function ProfilePage({ params }: { params: { accused_id: string } }) {
  const { t } = useLanguage();
  return (
    <Layout>
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-start border-b pb-6 mb-6">
          <div>
            <h2 className="text-3xl font-bold text-navy">{params.accused_id} {t("Profile")}</h2>
            <p className="text-gray-500 mt-1">{t("Status: Known Offender")}</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-black text-red-600">88.5</div>
            <p className="text-sm font-semibold">{t("RISK SCORE")}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="font-bold text-lg mb-2">Behavioral Summary</h3>
            <p className="text-gray-700">Detailed AI generated summary using Qdrant profiles...</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-2">Associated FIRs</h3>
            <ul className="list-disc pl-5 text-gray-700">
              <li>FIR/2023/5012</li>
              <li>FIR/2022/1105</li>
            </ul>
          </div>
        </div>
      </div>
    </Layout>
  );
}
