import React, { useState } from 'react';
import { Folder, Plus, MoreVertical, Edit2, Trash2 } from 'lucide-react';
import { useNotes } from '../hooks/useNotes';
import { useToast } from '../hooks/useToast';
import { getFolderColor, getInitials } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

export default function Folders() {
  const { notes, folders = [], addFolder, deleteFolder, renameFolder, createFolder, updateFolder } = useNotes();
  const toast = useToast();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [editingFolder, setEditingFolder] = useState(null);

  // Mock folder data generation if backend doesn't provide folders explicitly
  // In a real app, folders should be a distinct entity in state/db
  const uniqueFolders = folders.length > 0 ? folders : 
    Array.from(new Set(notes.filter(n => n.folderId || n.folder).map(n => n.folderId || n.folder)))
    .map(name => ({ id: name, name }));

  const handleSaveFolder = () => {
    if (!newFolderName.trim()) return;
    
    if (editingFolder) {
      if (updateFolder) updateFolder(editingFolder.id, { name: newFolderName });
      else if (renameFolder) renameFolder(editingFolder.id, newFolderName);
      toast.success('Folder renamed');
    } else {
      if (createFolder) createFolder({ name: newFolderName });
      else if (addFolder) addFolder({ name: newFolderName });
      toast.success('Folder created');
    }
    setShowModal(false);
    setNewFolderName('');
    setEditingFolder(null);
  };

  const handleFolderClick = (folderName) => {
    // Navigate to filtered view or a specific folder page
    // For now we'll just log or navigate to a hypothetical route
    navigate(`/?folder=${encodeURIComponent(folderName)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
            <Folder className="w-6 h-6 text-blue-600 dark:text-blue-500" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Folders</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Organize your notes into workspaces</p>
          </div>
        </div>
        
        <button 
          onClick={() => { setEditingFolder(null); setNewFolderName(''); setShowModal(true); }}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus className="w-5 h-5" />
          <span>New Folder</span>
        </button>
      </div>

      {uniqueFolders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Folder className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">No folders yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
            Create a folder to organize your notes by project or topic.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uniqueFolders.map((folder, idx) => {
            const count = notes.filter(n => n.folderId === folder.id && !n.isDeleted).length;
            const colorClass = getFolderColor(idx);
            
            return (
              <div 
                key={folder.id || folder.name}
                onClick={() => handleFolderClick(folder.id || folder.name)}
                className="bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all cursor-pointer group flex flex-col items-center text-center"
              >
                <div className="w-full flex justify-end mb-2">
                  <div className="relative group/menu">
                    <button onClick={(e) => e.stopPropagation()} className="p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                    <div className="absolute right-0 top-full mt-1 w-32 bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 rounded-md py-1 hidden group-hover/menu:block z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setEditingFolder(folder); setNewFolderName(folder.name); setShowModal(true); }}
                        className="w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-2"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Rename
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); if(deleteFolder) deleteFolder(folder.id); }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Delete
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold mb-4 ${colorClass}`}>
                  {getInitials(folder.name)}
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1 truncate w-full">{folder.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">{count} note{count !== 1 ? 's' : ''}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 max-w-sm w-full shadow-xl">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
              {editingFolder ? 'Rename Folder' : 'Create Folder'}
            </h3>
            <input 
              type="text" 
              autoFocus
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Folder Name"
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-slate-900 dark:text-white mb-6"
              onKeyDown={(e) => { if(e.key === 'Enter') handleSaveFolder(); }}
            />
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveFolder}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                disabled={!newFolderName.trim()}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
