"use client";
import React from 'react';
import Layout from '@/components/Layout';
import { ThumbsUp, ThumbsDown, MessageSquare, RefreshCw } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

export default function FeedbackAdmin() {
  const pieData = [
    { name: 'Missing Info', value: 45 },
    { name: 'Hallucination', value: 20 },
    { name: 'Bad Kannada', value: 15 },
    { name: 'Irrelevant', value: 20 },
  ];
  const COLORS = ['#f97316', '#ef4444', '#eab308', '#3b82f6'];

  return (
    <Layout>
      <div className="space-y-6">
        <header className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-navy">RLHF Feedback Analytics</h1>
            <p className="text-gray-500">Monitor model satisfaction and fine-tuning triggers</p>
          </div>
          <button className="bg-navy text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-navy-light">
            <RefreshCw size={18} /> Trigger DPO Fine-tune
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-green-100 p-4 rounded-full text-green-600"><ThumbsUp size={24}/></div>
            <div>
              <p className="text-gray-500 text-sm">Satisfaction Rate</p>
              <h2 className="text-2xl font-bold text-navy">92.4%</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-red-100 p-4 rounded-full text-red-600"><ThumbsDown size={24}/></div>
            <div>
              <p className="text-gray-500 text-sm">Negative Feedback</p>
              <h2 className="text-2xl font-bold text-navy">142 instances</h2>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
            <div className="bg-blue-100 p-4 rounded-full text-blue-600"><MessageSquare size={24}/></div>
            <div>
              <p className="text-gray-500 text-sm">Corrections Logged</p>
              <h2 className="text-2xl font-bold text-navy">89 pairs</h2>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[300px]">
            <h3 className="font-bold text-navy mb-4">Failure Mode Distribution</h3>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 overflow-y-auto h-[300px]">
            <h3 className="font-bold text-navy mb-4">Recent Corrections</h3>
            <div className="space-y-4">
              {[1,2,3].map(i => (
                <div key={i} className="border-b pb-4">
                  <p className="text-sm text-gray-500"><strong>Query:</strong> Show hotspots in Mysore</p>
                  <p className="text-sm text-red-500 mt-1 line-through">AI: Mysore has 0 hotspots.</p>
                  <p className="text-sm text-green-600 mt-1">User Corrected: Mysore currently has emerging hotspots in Kuvempunagar.</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
