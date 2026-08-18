import React from 'react';
import { Sparkles, Wand2, HelpCircle, Bot } from 'lucide-react';

export default function AIActions({ onSummarize, onImprove, onExplain, onAskAI }) {
  return (
    <div className="flex flex-wrap items-center gap-2 py-2">
      <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-2 flex items-center gap-1">
        <Bot className="w-3.5 h-3.5" /> AI Actions
      </span>
      <button 
        onClick={onSummarize}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-300 dark:hover:bg-indigo-900/50 rounded-md transition-colors"
      >
        <Sparkles className="w-3.5 h-3.5" /> Summarize
      </button>
      <button 
        onClick={onImprove}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md transition-colors"
      >
        <Wand2 className="w-3.5 h-3.5" /> Improve Writing
      </button>
      <button 
        onClick={onExplain}
        className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 rounded-md transition-colors"
      >
        <HelpCircle className="w-3.5 h-3.5" /> Explain
      </button>
    </div>
  );
}
