import React from 'react';
import { Star, MoreVertical } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotes } from '../../hooks/useNotes';
import { useToast } from '../../hooks/useToast';
import { timeAgo, stripHtml, truncateText, classNames } from '../../utils/helpers';

export const NoteCard = ({ note }) => {
  const navigate = useNavigate();
  const { toggleFavorite, deleteNote, archiveNote } = useNotes();
  const toast = useToast();

  const colorStyles = {
    blue: 'border-l-blue-500',
    green: 'border-l-green-500',
    yellow: 'border-l-yellow-500',
    purple: 'border-l-purple-500',
    red: 'border-l-red-500',
    orange: 'border-l-orange-500',
    slate: 'border-l-slate-400',
  };

  const borderColor = colorStyles[note.color] || colorStyles.slate;

  const handleCardClick = () => {
    navigate(`/notes/${note.id}`);
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavorite(note.id);
  };

  const handleAction = (e, action) => {
    e.stopPropagation();
    if (action === 'delete') {
      deleteNote(note.id);
      toast.success('Note moved to trash');
    } else if (action === 'archive') {
      archiveNote(note.id);
      toast.success('Note archived');
    } else if (action === 'edit') {
      navigate(`/notes/${note.id}`);
    }
  };

  const plainContent = stripHtml(note.content);
  const truncatedContent = truncateText(plainContent, 80);

  return (
    <div 
      onClick={handleCardClick}
      className={classNames(
        "bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 cursor-pointer overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-md border-l-4 group flex flex-col h-full",
        borderColor
      )}
    >
      <div className="p-4 flex flex-col h-full">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate flex-1" title={note.title || "Untitled"}>
            {note.title || "Untitled Note"}
          </h3>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              onClick={handleFavoriteClick}
              className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-yellow-500 transition-colors"
            >
              <Star className={classNames("w-4 h-4", note.isFavorite ? "fill-yellow-400 text-yellow-400" : "")} />
            </button>
            <div className="relative group/dropdown">
              <button 
                onClick={(e) => e.stopPropagation()} 
                className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              {/* Dropdown Menu - Simple implementation for now */}
              <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg rounded-md py-1 w-32 hidden group-hover/dropdown:block z-10">
                <button onClick={(e) => handleAction(e, 'edit')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">Edit</button>
                <button onClick={(e) => handleAction(e, 'archive')} className="w-full text-left px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200">Archive</button>
                <button onClick={(e) => handleAction(e, 'delete')} className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400">Delete</button>
              </div>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 flex-1">
          {truncatedContent || "No content"}
        </p>

        <div className="mt-auto">
          {note.tags && note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {note.tags.slice(0, 3).map(tag => (
                <span key={tag} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">
                  {tag}
                </span>
              ))}
              {note.tags.length > 3 && (
                <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs rounded-full">
                  +{note.tags.length - 3}
                </span>
              )}
            </div>
          )}
          
          <div className="text-xs text-slate-400 dark:text-slate-500 flex justify-between items-center">
            <span>{timeAgo(note.updatedAt)}</span>
            {note.folder && <span className="truncate max-w-[100px]">{note.folder}</span>}
          </div>
        </div>
      </div>
    </div>
  );
};
