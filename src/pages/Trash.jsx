import React, { useState } from 'react';
import { Trash2, RotateCcw, AlertTriangle } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { useToast } from '../hooks/useToast';
import { timeAgo, stripHtml, truncateText } from '../utils/helpers';

export default function Trash() {
  const { notes, isLoading, restoreNote, deletePermanently, permanentlyDeleteNote, emptyTrash } = useNotes();
  const toast = useToast();
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null); // { type: 'empty' | 'single', id?: string }

  const trashedNotes = notes.filter(n => n.isDeleted);

  const handleEmptyTrash = () => {
    emptyTrash();
    setShowConfirm(false);
    toast.success('Trash emptied');
  };

  const handlePermanentDelete = (id) => {
    if (permanentlyDeleteNote) {
      permanentlyDeleteNote(id);
    } else if (deletePermanently) {
      deletePermanently(id);
    }
    setShowConfirm(false);
    toast.success('Note deleted permanently');
  };

  const executeConfirm = () => {
    if (confirmAction?.type === 'empty') {
      handleEmptyTrash();
    } else if (confirmAction?.type === 'single') {
      handlePermanentDelete(confirmAction.id);
    }
  };

  const TrashCard = ({ note }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col h-full">
      <div className="p-4 flex flex-col h-full opacity-70 hover:opacity-100 transition-opacity">
        <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 truncate">
          {note.title || "Untitled Note"}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
          {truncateText(stripHtml(note.content), 80) || "No content"}
        </p>
        <div className="mt-auto">
          <div className="text-xs text-red-500 mb-4">
            Deleted {timeAgo(note.updatedAt)}
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => { restoreNote(note.id); toast.success('Note restored'); }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md text-sm transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Restore
            </button>
            <button 
              onClick={() => { setConfirmAction({ type: 'single', id: note.id }); setShowConfirm(true); }}
              className="flex-1 flex items-center justify-center gap-1 py-1.5 px-3 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
            <Trash2 className="w-6 h-6 text-red-600 dark:text-red-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Trash</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Notes are kept here for 30 days</p>
          </div>
        </div>
        
        {trashedNotes.length > 0 && (
          <button 
            onClick={() => { setConfirmAction({ type: 'empty' }); setShowConfirm(true); }}
            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium px-4 py-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            Empty Trash
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-48 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : trashedNotes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Trash2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Trash is empty</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Deleted notes will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trashedNotes.map(note => (
            <TrashCard key={note.id} note={note} />
          ))}
        </div>
      )}

      {/* Basic Modal implementation */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 text-red-600 mb-4">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Confirm Deletion</h3>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {confirmAction?.type === 'empty' 
                ? "Are you sure you want to empty the trash? All notes will be permanently deleted and cannot be recovered."
                : "Are you sure you want to permanently delete this note? This action cannot be undone."}
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={executeConfirm}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
