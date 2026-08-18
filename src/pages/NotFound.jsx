import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 px-4 text-center">
      <h1 className="text-9xl font-black text-slate-200 dark:text-slate-800 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-2">Page not found</h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link 
        to="/" 
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
      >
        <Home className="w-5 h-5" />
        Go Home
      </Link>
    </div>
  );
}
