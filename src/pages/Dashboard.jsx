import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Sparkles, Code, Layers, Palette, MoreHorizontal, Send } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { useDebounce } from '../hooks/useDebounce';
import { timeAgo, classNames } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { notes, isLoading } = useNotes();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredNotes = useMemo(() => {
    let result = [...notes].filter(n => !n.isDeleted && !n.isArchived);

    // Apply search
    if (debouncedSearch) {
      const lowerQuery = debouncedSearch.toLowerCase();
      result = result.filter(
        n => (n.title && n.title.toLowerCase().includes(lowerQuery)) ||
             (n.content && n.content.toLowerCase().includes(lowerQuery))
      );
    }

    // Sort by recent
    result.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    return result;
  }, [notes, debouncedSearch]);

  const tabs = ['All', 'Recents', 'Created by Me', 'Folders', 'Unsorted'];

  const actionCards = [
    { icon: Plus, label: 'Create a Blank File', onClick: () => navigate('/notes/new') },
    { icon: Sparkles, label: 'Generate an AI Diagram', onClick: () => {} },
    { icon: Code, label: 'Connect Eraser MCP', onClick: () => {} },
    { icon: Layers, label: 'Create a Template', onClick: () => {} },
    { icon: Palette, label: 'Create a Custom Style', onClick: () => {} },
  ];

  return (
    <div className="flex flex-col h-full bg-[#111111] text-slate-200">
      {/* Top Header / Tab Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-4 border-b border-[#2D2D2D]">
        
        {/* Tabs */}
        <div className="flex items-center gap-1 mb-4 md:mb-0 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={classNames(
                "px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors",
                activeTab === tab 
                  ? "bg-[#222222] text-white" 
                  : "text-slate-400 hover:text-slate-200 hover:bg-[#1A1A1A]"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-12 py-1.5 bg-[#1A1A1A] border border-[#2D2D2D] hover:border-[#404040] rounded-md focus:outline-none focus:border-[#404040] text-sm text-slate-200 placeholder-slate-500 transition-colors"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-[10px] text-slate-500 font-medium">Ctrl K</span>
            </div>
          </div>
          
          <div className="flex items-center -space-x-2">
            <div className="w-7 h-7 rounded-full bg-purple-600 flex items-center justify-center text-xs font-medium border border-[#111111] z-10 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.name ? user.name[0].toUpperCase() : 'D'
              )}
            </div>
            <div className="w-7 h-7 rounded-full bg-slate-600 border border-[#111111] z-0"></div>
            <div className="w-7 h-7 rounded-full bg-slate-400 border border-[#111111] -z-10"></div>
          </div>
          
          <button className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            <Send className="w-3.5 h-3.5 -rotate-45 mb-0.5" />
            Invite
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6">
        
        {/* Action Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
          {actionCards.map((card, idx) => (
            <button
              key={idx}
              onClick={card.onClick}
              className="flex flex-col items-center justify-center gap-3 p-6 bg-transparent border border-[#2D2D2D] hover:bg-[#1A1A1A] rounded-xl transition-colors group h-32"
            >
              <card.icon className="w-6 h-6 text-slate-400 group-hover:text-slate-200 transition-colors" strokeWidth={1.5} />
              <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">{card.label}</span>
            </button>
          ))}
        </div>

        {/* List View */}
        <div className="w-full">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-[#2D2D2D]">
            <div className="col-span-5 md:col-span-4">NAME</div>
            <div className="hidden md:block col-span-2">LOCATION</div>
            <div className="col-span-3 md:col-span-2">CREATED</div>
            <div className="hidden md:block col-span-2">EDITED</div>
            <div className="hidden lg:block col-span-1 text-center">COMMENTS</div>
            <div className="col-span-4 md:col-span-1 text-right md:text-left">AUTHOR</div>
          </div>

          {/* Table Body */}
          {isLoading ? (
            <div className="py-8 text-center text-slate-500">Loading...</div>
          ) : filteredNotes.length === 0 ? (
            <div className="py-8 text-center text-slate-500">No files found.</div>
          ) : (
            <div className="divide-y divide-[#2D2D2D]/50">
              {filteredNotes.map(note => (
                <div 
                  key={note.id}
                  onClick={() => navigate(`/notes/${note.id}`)}
                  className="grid grid-cols-12 gap-4 px-4 py-3.5 items-center hover:bg-[#1A1A1A] cursor-pointer transition-colors group"
                >
                  <div className="col-span-5 md:col-span-4 font-medium text-slate-200 group-hover:text-white truncate">
                    {note.title || "Untitled File"}
                  </div>
                  <div className="hidden md:block col-span-2 text-sm text-slate-500 truncate">
                    {note.folder || "—"}
                  </div>
                  <div className="col-span-3 md:col-span-2 text-sm text-slate-400">
                    {timeAgo(note.createdAt)}
                  </div>
                  <div className="hidden md:block col-span-2 text-sm text-slate-400">
                    {timeAgo(note.updatedAt)}
                  </div>
                  <div className="hidden lg:block col-span-1 text-sm text-slate-500 text-center">
                    0
                  </div>
                  <div className="col-span-4 md:col-span-1 flex justify-end md:justify-between items-center">
                    <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-[10px] font-medium text-white overflow-hidden">
                      {user?.avatar ? (
                        <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                      ) : (
                        user?.name ? user.name[0].toUpperCase() : 'D'
                      )}
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-slate-300 transition-opacity">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
