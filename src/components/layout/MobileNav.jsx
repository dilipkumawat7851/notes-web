import React from 'react';
import { NavLink } from 'react-router-dom';
import { FileText, Star, Plus, FolderClosed, Settings } from 'lucide-react';

export default function MobileNav() {
  const activeClass = "flex flex-col items-center justify-center w-full h-full text-blue-600 dark:text-blue-400";
  const inactiveClass = "flex flex-col items-center justify-center w-full h-full text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100";

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111111] border-t border-[#2D2D2D] pb-safe">
      <div className="flex items-center justify-around h-16">
        <NavLink to="/" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <FileText className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Home</span>
        </NavLink>
        
        <NavLink to="/favorites" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Star className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Favorites</span>
        </NavLink>
        
        <div className="flex flex-col items-center justify-center w-full h-full">
          <NavLink 
            to="/notes/new" 
            className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 text-white rounded-full shadow-lg shadow-blue-500/30 transform -translate-y-2 transition-transform active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </NavLink>
        </div>
        
        <NavLink to="/folders" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <FolderClosed className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Folders</span>
        </NavLink>
        
        <NavLink to="/settings" className={({ isActive }) => isActive ? activeClass : inactiveClass}>
          <Settings className="w-5 h-5 mb-1" />
          <span className="text-[10px] font-medium">Settings</span>
        </NavLink>
      </div>
    </nav>
  );
}
