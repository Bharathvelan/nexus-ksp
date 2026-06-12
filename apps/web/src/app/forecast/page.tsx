"use client";
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Map, BarChart2 } from 'lucide-react';

export default function ForecastPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetching forecast data from backend
    setTimeout(() => {
      const mockData = Array.from({ length: 30 }, (_, i) => ({
        day: `Day ${i + 1}`,
        predicted: Math.floor(Math.random() * 20) + 30,
        lower_ci: Math.floor(Math.random() * 10) + 20,
        upper_ci: Math.floor(Math.random() * 10) + 50,
      }));
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Layout>
      <div className="space-y-6">
        <header>
          <h1 className="text-3xl font-bold text-navy dark:text-white">Predictive Hotspot Forecasting</h1>
          <p className="text-gray-500 dark:text-gray-400">LSTM-powered crime density projections for next 30 days</p>
        </header>

        {/* Controls */}
        <div className="flex gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
          <select className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5">
            <option>Bangalore Urban</option>
            <option>Mysore</option>
            <option>Hubli-Dharwad</option>
          </select>
          <select className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg p-2.5">
            <option>Two-Wheeler Theft</option>
            <option>Chain Snatching</option>
            <option>Burglary</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button className="px-4 py-1.5 rounded-md hover:bg-white font-medium">7 Days</button>
            <button className="px-4 py-1.5 rounded-md bg-white shadow-sm font-medium">30 Days</button>
            <button className="px-4 py-1.5 rounded-md hover:bg-white font-medium">90 Days</button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
              <BarChart2 size={20} className="text-gold" />
              Projected Crime Volume (with 95% Confidence Interval)
            </h3>
            <div className="h-[400px]">
              {loading ? (
                <div className="h-full flex items-center justify-center text-gray-400">Loading LSTM projections...</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                    <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                    <Tooltip />
                    {/* Confidence Band */}
                    <Area type="monotone" dataKey="upper_ci" stroke="none" fill="#ffedd5" fillOpacity={0.5} />
                    <Area type="monotone" dataKey="lower_ci" stroke="none" fill="#fff" fillOpacity={1} />
                    {/* Main Prediction */}
                    <Area type="monotone" dataKey="predicted" stroke="#f97316" strokeWidth={3} fill="none" />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Map and Explanations */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-[250px] flex flex-col">
              <h3 className="text-lg font-bold text-navy mb-4 flex items-center gap-2">
                <Map size={20} className="text-gold" /> Predicted Hotspots
              </h3>
              <div className="flex-1 bg-gray-50 rounded border border-dashed border-gray-300 flex items-center justify-center">
                <p className="text-sm text-gray-500">Choropleth Map rendering...</p>
              </div>
            </div>

            <div className="bg-orange-50 rounded-xl shadow-sm border border-orange-100 p-6">
              <h3 className="text-lg font-bold text-orange-800 mb-2 flex items-center gap-2">
                <AlertTriangle size={20} /> Why this prediction?
              </h3>
              <p className="text-sm text-orange-700 mb-4">SHAP Waterfall Analysis (Top Factors):</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-orange-900 font-medium">Historical Density</span>
                  <span className="text-orange-600">+0.45</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '80%'}}></div>
                </div>
                
                <div className="flex justify-between items-center text-sm mt-2">
                  <span className="text-orange-900 font-medium">Network Activity</span>
                  <span className="text-orange-600">+0.30</span>
                </div>
                <div className="w-full bg-orange-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
