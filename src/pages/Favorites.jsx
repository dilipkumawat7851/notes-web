import React from 'react';
import { Star } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { NoteGrid } from '../components/notes/NoteGrid';
import { NoteList } from '../components/notes/NoteList';
import { LayoutGrid, List } from 'lucide-react';
import { classNames } from '../utils/helpers';

export default function Favorites() {
  const { notes, isLoading, viewMode, setViewMode } = useNotes();

  const favoriteNotes = notes.filter(n => n.isFavorite && !n.isDeleted && !n.isArchived);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-500 fill-current" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Favorites</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Your favorite notes</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('grid')}
            className={classNames(
              "p-1.5 rounded-md transition-all",
              viewMode === 'grid' 
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
            title="Grid View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={classNames(
              "p-1.5 rounded-md transition-all",
              viewMode === 'list' 
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm" 
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-300"
            )}
            title="List View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : favoriteNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-yellow-50 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mb-4">
            <Star className="w-8 h-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No favorites yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Star a note to add it here for quick access.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        <NoteGrid notes={favoriteNotes} />
      ) : (
        <NoteList notes={favoriteNotes} />
      )}
    </div>
  );
}
