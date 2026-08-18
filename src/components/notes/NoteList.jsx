import React from 'react';
import { Star, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import { timeAgo, stripHtml, truncateText, classNames } from '../../utils/helpers';

export const NoteList = ({ notes = [] }) => {
  const navigate = useNavigate();
  const { toggleFavorite, deleteNote, archiveNote } = useNotes();

  if (!notes || notes.length === 0) {
    return null;
  }

  const handleRowClick = (id) => {
    navigate(`/notes/${id}`);
  };

  const handleFavoriteClick = (e, id) => {
    e.stopPropagation();
    toggleFavorite(id);
  };

  const handleAction = (e, action, id) => {
    e.stopPropagation();
    if (action === 'delete') {
      deleteNote(id);
    } else if (action === 'archive') {
      archiveNote(id);
    } else if (action === 'edit') {
      navigate(`/notes/${id}`);
    }
  };

  return (
    <div className="flex flex-col border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-white dark:bg-slate-800">
      {notes.map((note, index) => (
        <div 
          key={note.id}
          onClick={() => handleRowClick(note.id)}
          className={classNames(
            "group flex items-center p-3 sm:p-4 hover:bg-slate-50 dark:hover:bg-slate-750 cursor-pointer transition-colors",
            index !== notes.length - 1 ? "border-b border-slate-200 dark:border-slate-700" : ""
          )}
        >
          <div className="mr-3">
            <button 
              onClick={(e) => handleFavoriteClick(e, note.id)}
              className="p-1 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-yellow-500 transition-colors"
            >
              <Star className={classNames("w-4 h-4", note.isFavorite ? "fill-yellow-400 text-yellow-400" : "")} />
            </button>
          </div>
          
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate w-full sm:w-1/4 xl:w-1/5">
              {note.title || "Untitled"}
            </h3>
            
            <p className="text-sm text-slate-500 dark:text-slate-400 truncate flex-1">
              {truncateText(stripHtml(note.content), 120) || "No content"}
            </p>
          </div>
          
          <div className="hidden md:flex items-center gap-2 mx-4 w-32 shrink-0">
            {note.tags && note.tags.length > 0 && (
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full truncate max-w-full">
                {note.tags[0]}
                {note.tags.length > 1 && ` +${note.tags.length - 1}`}
              </span>
            )}
          </div>
          
          <div className="text-xs text-slate-400 whitespace-nowrap ml-2 mr-2 shrink-0 w-16 text-right">
            {timeAgo(note.updatedAt)}
          </div>
          
          <div className="relative group/dropdown ml-1 shrink-0">
            <button 
              onClick={(e) => e.stopPropagation()} 
              className="p-1.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md py-1 w-32 hidden group-hover/dropdown:block z-10">
              <button onClick={(e) => handleAction(e, 'edit', note.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">Edit</button>
              <button onClick={(e) => handleAction(e, 'archive', note.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">Archive</button>
              <button onClick={(e) => handleAction(e, 'delete', note.id)} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
