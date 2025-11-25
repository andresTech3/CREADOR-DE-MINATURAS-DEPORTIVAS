import React from 'react';
import { Trophy, Flame } from 'lucide-react';

export const HeroHeader: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-blue-900 to-slate-900 border-b border-slate-700 p-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-yellow-500 rounded-lg shadow-lg shadow-yellow-500/20">
            <Trophy className="w-8 h-8 text-black" />
        </div>
        <div>
          <h1 className="text-3xl font-bold uppercase tracking-widest text-white display-font leading-none">
            Futbol<span className="text-yellow-400">VS</span>Gen
          </h1>
          <p className="text-slate-400 text-xs tracking-wider uppercase">Next-Gen Match Covers</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700">
        <Flame className="w-4 h-4 text-orange-500" />
        <span className="text-xs font-medium text-slate-300">Powered by Gemini Pro</span>
      </div>
    </div>
  );
};