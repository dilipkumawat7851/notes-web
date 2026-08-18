import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Search, Sun, Moon, Bell, User, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

export default function Navbar({ onMenuToggle }) {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const openCommandPalette = () => {
    window.dispatchEvent(new CustomEvent('open-command-palette'));
  };

  const getThemeIcon = () => {
    if (theme === 'system') return <Monitor className="w-5 h-5" />;
    if (resolvedTheme === 'dark') return <Sun className="w-5 h-5" />;
    return <Moon className="w-5 h-5" />;
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-14 px-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      {/* Left */}
      <div className="flex items-center">
        <button
          onClick={onMenuToggle}
          className="p-2 mr-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Center - Search */}
      <div className="flex-1 max-w-xl px-4 flex justify-end md:justify-center">
        <button
          onClick={openCommandPalette}
          className="flex items-center md:w-full md:max-w-md md:bg-slate-100 md:dark:bg-slate-800 rounded-lg md:px-3 py-1.5 md:border border-transparent md:hover:border-slate-300 md:dark:hover:border-slate-600 transition-colors group text-slate-500 md:text-slate-400"
        >
          <Search className="w-5 h-5 md:w-4 md:h-4 md:mr-2" />
          <span className="hidden md:inline text-sm flex-1 text-left">Search notes...</span>
          <kbd className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-white dark:bg-slate-900 text-slate-400 border border-slate-200 dark:border-slate-700">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1 md:gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Toggle theme"
        >
          {getThemeIcon()}
        </button>

        <button
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
        </button>

        <div className="relative ml-1">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900"
            aria-label="User menu"
          >
            {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
          </button>

          {showProfileMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 py-1 z-50">
                {user && (
                  <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-700">
                    <p className="text-sm font-medium text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                  </div>
                )}
                <button
                  onClick={() => { setShowProfileMenu(false); navigate('/settings'); }}
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Settings
                </button>
                <div className="border-t border-slate-200 dark:border-slate-700 my-1"></div>
                <button
                  onClick={() => { setShowProfileMenu(false); logout(); }}
                  className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
