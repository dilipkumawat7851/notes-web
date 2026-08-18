import React from 'react';
import { Lock, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Private() {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center h-full bg-[#111111] text-slate-200 p-6">
      <div className="w-16 h-16 bg-[#1A1A1A] border border-[#2D2D2D] rounded-2xl flex items-center justify-center mb-6">
        <Lock className="w-8 h-8 text-blue-500" />
      </div>
      
      <h1 className="text-3xl font-bold text-white mb-3 text-center">Private Files</h1>
      <p className="text-slate-400 max-w-md text-center mb-8">
        Keep your most sensitive notes securely locked away. Private files require an additional layer of authentication and are not visible to team members.
      </p>

      <div className="bg-[#1A1A1A] border border-[#2D2D2D] rounded-xl p-8 max-w-md w-full text-center">
        <div className="inline-flex items-center justify-center px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-blue-500/20">
          Pro Feature
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Upgrade to Pro</h2>
        <p className="text-sm text-slate-400 mb-6">
          Unlock private folders, unlimited AI generations, and advanced styling.
        </p>
        
        <button className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors">
          <Zap className="w-4 h-4 fill-current" />
          Upgrade Now
        </button>
        <button 
          onClick={() => navigate('/')}
          className="w-full mt-3 text-sm text-slate-400 hover:text-white transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}
