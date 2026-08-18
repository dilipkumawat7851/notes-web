import React, { useState } from 'react';
import { Tag, Plus, X } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { useNavigate } from 'react-router-dom';

export default function Tags() {
  const { notes, createTag, deleteTag } = useNotes();
  const navigate = useNavigate();
  const [newTag, setNewTag] = useState('');

  // Extract unique tags and count
  const tagCounts = {};
  notes.forEach(note => {
    if (!note.isDeleted && note.tags) {
      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    }
  });

  const sortedTags = Object.entries(tagCounts).sort((a, b) => b[1] - a[1]);

  const handleTagClick = (tag) => {
    // Hypothetical navigation to filtered view
    navigate(`/?search=${encodeURIComponent(tag)}`);
  };

  const handleAddTag = (e) => {
    e.preventDefault();
    if (newTag.trim()) {
      if (createTag) createTag({ name: newTag.trim() });
      setNewTag('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <Tag className="w-6 h-6 text-purple-600 dark:text-purple-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Tags</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Organize across folders with labels</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 mb-8">
        <form onSubmit={handleAddTag} className="flex gap-3 max-w-md">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Create new tag..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm text-slate-900 dark:text-slate-100"
            />
          </div>
          <button 
            type="submit"
            disabled={!newTag.trim()}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-700 text-white rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add
          </button>
        </form>
      </div>

      {sortedTags.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Tag className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No tags yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Add tags to your notes to link related ideas together.
          </p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {sortedTags.map(([tag, count]) => (
            <div 
              key={tag}
              onClick={() => handleTagClick(tag)}
              className="group flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-purple-300 dark:hover:border-purple-700 px-4 py-2 rounded-lg cursor-pointer transition-all hover:shadow-sm"
            >
              <Tag className="w-4 h-4 text-slate-400 group-hover:text-purple-500" />
              <span className="font-medium text-slate-700 dark:text-slate-200">{tag}</span>
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-xs rounded-full">
                {count}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); if (deleteTag) deleteTag(tag); }}
                className="ml-2 p-1 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded opacity-0 group-hover:opacity-100 transition-all"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
