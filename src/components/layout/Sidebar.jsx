import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutGrid, Lock, Archive, FolderClosed, 
  Sparkles, Palette, Code, Bot, Plus, ChevronDown, X,
  LogOut, Settings as SettingsIcon
} from 'lucide-react';
import { useNotes } from '../../context/NotesContext';
import { useAuth } from '../../context/AuthContext';
import { classNames } from '../../utils/helpers';

export default function Sidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { folders, createFolder } = useNotes();
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const handleNewNote = () => {
    navigate('/notes/new');
    if (onClose) onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const activeClassName = "flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium transition-colors bg-[#2D2D2D]/50 text-white";
  const inactiveClassName = "flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] hover:text-white transition-colors group";

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-50
        h-screen w-64 flex flex-col
        bg-[#111111] text-slate-200
        border-r border-[#2D2D2D]
        transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="relative m-2">
          <div 
            className="flex items-center justify-between h-14 px-4 rounded-md hover:bg-[#1A1A1A] cursor-pointer transition-colors"
            onClick={() => setShowDropdown(!showDropdown)}
          >
            <div className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="w-6 h-6 object-contain rounded-md" />
              <span className="font-bold text-white text-sm">{user?.name || "Dilip"}'s Space</span>
              <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); onClose?.(); }}
              className="p-1 rounded-md text-slate-400 hover:text-white md:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dropdown Menu */}
          {showDropdown && (
            <div className="absolute top-full left-2 right-2 mt-1 bg-[#1A1A1A] border border-[#2D2D2D] rounded-lg shadow-xl overflow-hidden z-50">
              <div className="p-3 border-b border-[#2D2D2D]">
                <p className="text-xs text-slate-400 font-medium mb-1">Signed in as</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      user?.name?.[0]?.toUpperCase() || "D"
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-white font-bold">{user?.name || "Dilip Kumawat"}</p>
                    <p className="text-xs text-slate-500">{user?.email || "dilip@example.com"}</p>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => { setShowDropdown(false); navigate('/settings'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-300 hover:bg-[#2D2D2D] hover:text-white transition-colors"
              >
                <SettingsIcon className="w-4 h-4" />
                Settings
              </button>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-[#2D2D2D] hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log Out
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-2 space-y-6">
          
          {/* Main Navigation */}
          <nav className="space-y-0.5">
            <NavLink to="/" className={({ isActive }) => isActive ? activeClassName : inactiveClassName} onClick={onClose}>
              <div className="flex items-center gap-3">
                <LayoutGrid className="w-4 h-4" />
                <span>All Files</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden group-hover:block">A</span>
            </NavLink>
            
            <NavLink to="/private" className={({ isActive }) => isActive ? activeClassName : inactiveClassName} onClick={onClose}>
              <div className="flex items-center gap-3">
                <Lock className="w-4 h-4" />
                <span>Private Files</span>
              </div>
              <span className="text-[9px] font-bold px-1.5 py-0.5 bg-[#222222] text-slate-300 rounded uppercase tracking-wider border border-[#2D2D2D]">UPGRADE</span>
            </NavLink>
            
            <NavLink to="/archive" className={({ isActive }) => isActive ? activeClassName : inactiveClassName} onClick={onClose}>
              <div className="flex items-center gap-3">
                <Archive className="w-4 h-4" />
                <span>Archive</span>
              </div>
              <span className="text-[10px] text-slate-500 font-medium hidden group-hover:block">F</span>
            </NavLink>
          </nav>

          {/* Folders Section */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-3 py-2 group">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider group-hover:text-slate-300 transition-colors">
                TEAM FOLDERS
              </span>
              <button 
                onClick={async () => {
                  const name = window.prompt("New folder name:");
                  if (name) {
                    await createFolder({ name, color: '#3B82F6' });
                  }
                }}
                className="text-slate-500 hover:text-white transition-all cursor-pointer"
                title="New Folder"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {folders.map((folder) => (
              <NavLink
                key={folder.id}
                to={`/folders/${folder.id}`}
                onClick={onClose}
                className={({ isActive }) => isActive ? activeClassName : inactiveClassName}
              >
                <div className="flex items-center gap-3">
                  <FolderClosed className="w-4 h-4 text-slate-500" />
                  <span className="truncate max-w-[140px]">{folder.name}</span>
                </div>
              </NavLink>
            ))}
          </div>
        </div>

        {/* Bottom Section */}
        <div className="p-3 space-y-0.5 shrink-0">
          <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] hover:text-white transition-colors group">
            <div className="flex items-center gap-3">
              <Sparkles className="w-4 h-4" />
              <span>AI Presets</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden group-hover:block">T</span>
          </button>
          
          <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] hover:text-white transition-colors group">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4" />
              <span>Custom Styles</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden group-hover:block">S</span>
          </button>
          
          <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] hover:text-white transition-colors group">
            <div className="flex items-center gap-3">
              <Code className="w-4 h-4" />
              <span>MCP</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden group-hover:block">C</span>
          </button>
          
          <button className="w-full flex items-center justify-between px-3 py-1.5 rounded-md text-sm font-medium text-slate-300 hover:bg-[#1A1A1A] hover:text-white transition-colors group">
            <div className="flex items-center gap-3">
              <Bot className="w-4 h-4" />
              <span>Eraserbot</span>
              <span className="text-[9px] font-bold px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded uppercase tracking-wider ml-1">BETA</span>
            </div>
            <span className="text-[10px] text-slate-500 font-medium hidden group-hover:block">R</span>
          </button>
          
          <div className="pt-3 pb-1 mt-1 border-t border-[#2D2D2D]">
            <button 
              onClick={handleNewNote}
              className="w-full flex items-center justify-between bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
            >
              <span>New File</span>
              <span className="text-[10px] text-blue-200 font-medium opacity-80">Alt N</span>
            </button>
          </div>
        </div>
      </aside>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #2D2D2D;
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #404040;
        }
      `}</style>
    </>
  );
}
