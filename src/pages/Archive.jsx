import React from 'react';
import { Archive as ArchiveIcon, RotateCcw, Trash2 } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { NoteGrid } from '../components/notes/NoteGrid';
import { NoteList } from '../components/notes/NoteList';
import { useToast } from '../hooks/useToast';
import { classNames, stripHtml, truncateText, timeAgo } from '../utils/helpers';

export default function Archive() {
  const { notes, isLoading, restoreNote, unarchiveNote, deleteNote } = useNotes();
  const toast = useToast();

  const archivedNotes = notes.filter(n => n.isArchived && !n.isDeleted);

  // Quick custom card for archive to show different actions
  const ArchiveCard = ({ note }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full border-l-4 border-l-slate-400">
      <div className="p-4 flex flex-col h-full">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 truncate">
          {note.title || "Untitled Note"}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
          {truncateText(stripHtml(note.content), 80) || "No content"}
        </p>
        <div className="mt-auto">
          <div className="text-xs text-slate-400 dark:text-slate-500 mb-4">
            Archived {timeAgo(note.updatedAt)}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { (restoreNote || unarchiveNote)(note.id); toast.success('Note restored'); }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Restore
            </button>
            <button 
              onClick={() => { deleteNote(note.id); toast.success('Moved to trash'); }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-md text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Trash
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-2 bg-slate-200 dark:bg-slate-700 rounded-lg">
          <ArchiveIcon className="w-6 h-6 text-slate-700 dark:text-slate-300" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Archive</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Notes you've put away</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : archivedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <ArchiveIcon className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Archive is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Archived notes will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {archivedNotes.map(note => (
            <ArchiveCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </div>
  );
}
