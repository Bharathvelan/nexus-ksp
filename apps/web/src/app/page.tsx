"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Stub login
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-navy flex flex-col justify-center items-center p-4 relative overflow-hidden">
      {/* Background graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-gold blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500 blur-[120px]"></div>
      </div>

      <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-white/20 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-gold rounded-full flex items-center justify-center mb-4 shadow-lg shadow-gold/20">
            <ShieldAlert size={32} className="text-navy" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wider">NEXUS-KSP</h1>
          <p className="text-gray-300 text-sm mt-2 uppercase tracking-[0.2em]">State Crime Records Bureau</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Officer ID / Email</label>
            <input 
              type="text" 
              className="w-full bg-navy-dark/50 border border-navy-light text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
              placeholder="demo@ksp.gov.in"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input 
              type="password" 
              className="w-full bg-navy-dark/50 border border-navy-light text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-gold transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center text-gray-300 cursor-pointer">
              <input type="checkbox" className="mr-2 accent-gold" /> Remember me
            </label>
            <a href="#" className="text-gold hover:underline">Forgot password?</a>
          </div>
          <button type="submit" className="w-full bg-gradient-to-r from-gold to-gold-dark text-navy font-bold rounded-lg px-4 py-3 hover:shadow-lg hover:shadow-gold/30 transition-all transform hover:-translate-y-0.5">
            SECURE LOGIN
          </button>
        </form>

        <div className="mt-8 text-center text-xs text-gray-400">
          <p>Restricted Access. Authorized KSP Personnel Only.</p>
        </div>
      </div>
    </div>
  );
}
