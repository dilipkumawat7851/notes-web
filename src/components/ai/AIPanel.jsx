import React, { useState } from 'react';
import { Sparkles, X, SendHorizontal, Bot } from 'lucide-react';

export default function AIPanel({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hi! I am your NotesWeb AI assistant. How can I help you with your notes today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text) => {
    if (!text.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: text }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      let reply = "I'm a mock AI, but I can help you summarize, improve, or explain your notes!";
      if (text.toLowerCase().includes('summarize')) reply = "Here is a summary: This note discusses the importance of writing things down to free up mental space.";
      if (text.toLowerCase().includes('improve')) reply = "I suggest making the tone more professional and using stronger verbs.";
      
      setMessages(prev => [...prev, { role: 'ai', content: reply }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-[380px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-700 shadow-2xl transform transition-transform duration-300 z-40 flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
          <Sparkles className="w-5 h-5 text-indigo-500" />
          NotesWeb AI
        </div>
        <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'}`}>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-slate-100 dark:bg-slate-800 text-slate-500 rounded-2xl rounded-tl-sm px-4 py-2 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce"></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '150ms' }}></span>
              <span className="w-2 h-2 rounded-full bg-slate-400 animate-bounce" style={{ animationDelay: '300ms' }}></span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="flex gap-2 mb-3 overflow-x-auto pb-1 hide-scrollbar">
          <button onClick={() => handleSend('Summarize my current note')} className="whitespace-nowrap text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors">Summarize</button>
          <button onClick={() => handleSend('Improve my writing')} className="whitespace-nowrap text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors">Improve</button>
          <button onClick={() => handleSend('Explain this concept clearly')} className="whitespace-nowrap text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full transition-colors">Explain</button>
        </div>
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Ask AI anything..."
            className="w-full pl-4 pr-10 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button 
            onClick={() => handleSend(input)}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-600 disabled:text-slate-400 rounded-md hover:bg-indigo-50 dark:hover:bg-slate-700 transition-colors"
          >
            <SendHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
