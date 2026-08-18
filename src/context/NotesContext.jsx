import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { notesService } from '../services/notesService';
import { folderService } from '../services/folderService';
import { tagService } from '../services/tagService';

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentNote, setCurrentNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewModeState] = useState(() => localStorage.getItem('notesweb_viewMode') || 'grid');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [filterTab, setFilterTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const setViewMode = (mode) => {
    setViewModeState(mode);
    localStorage.setItem('notesweb_viewMode', mode);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [notesRes, foldersRes, tagsRes] = await Promise.all([
          notesService.getNotes({ isDeleted: false }).catch(() => []),
          folderService.getFolders().catch(() => []),
          tagService.getTags().catch(() => []),
        ]);
        setNotes(notesRes);
        setFolders(foldersRes);
        setTags(tagsRes);
      } catch (err) {
        setError(err.message || 'Failed to fetch data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const refreshNotes = async () => {
    try {
      const allNotes = await notesService.getNotes({ isDeleted: undefined, isArchived: undefined });
      setNotes(allNotes);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchNote = async (id) => {
    try {
      const data = await notesService.getNote(id);
      setCurrentNote(data);
      return data;
    } catch (err) {
      setError(err.message);
      return null;
    }
  };

  const createNote = async (data) => {
    try {
      const newNote = await notesService.createNote(data);
      setNotes((prev) => [newNote, ...prev]);
      return newNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateNote = async (id, data) => {
    try {
      const updatedNote = await notesService.updateNote(id, data);
      setNotes((prev) => prev.map((n) => (n.id === id ? updatedNote : n)));
      if (currentNote?.id === id) setCurrentNote(updatedNote);
      return updatedNote;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const deleteNote = async (id) => {
    try {
      await notesService.deleteNote(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, isDeleted: true, deletedAt: new Date().toISOString() } : n)));
    } catch (err) {
      setError(err.message);
    }
  };

  const permanentlyDeleteNote = async (id) => {
    try {
      await notesService.permanentlyDeleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleFavorite = async (id) => {
    try {
      const note = notes.find((n) => n.id === id);
      if (!note) return;
      const updatedNote = await notesService.updateNote(id, { isFavorite: !note.isFavorite });
      setNotes((prev) => prev.map((n) => (n.id === id ? updatedNote : n)));
      if (currentNote?.id === id) setCurrentNote(updatedNote);
    } catch (err) {
      setError(err.message);
    }
  };

  const archiveNote = async (id) => {
    try {
      const updatedNote = await notesService.archiveNote(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? updatedNote : n)));
    } catch (err) {
      setError(err.message);
    }
  };

  const restoreNote = async (id) => {
    try {
      const updatedNote = await notesService.restoreNote(id);
      setNotes((prev) => prev.map((n) => (n.id === id ? updatedNote : n)));
    } catch (err) {
      setError(err.message);
    }
  };

  const emptyTrash = async () => {
    try {
      const trashed = notes.filter((n) => n.isDeleted);
      for (const note of trashed) {
        await notesService.permanentlyDeleteNote(note.id);
      }
      setNotes((prev) => prev.filter((n) => !n.isDeleted));
    } catch (err) {
      setError(err.message);
    }
  };

  // Folders
  const fetchFolders = async () => {
    const data = await folderService.getFolders();
    setFolders(data);
  };

  const createFolder = async (data) => {
    const newFolder = await folderService.createFolder(data);
    setFolders((prev) => [...prev, newFolder]);
    return newFolder;
  };

  const updateFolder = async (id, data) => {
    const updated = await folderService.updateFolder(id, data);
    setFolders((prev) => prev.map((f) => (f.id === id ? updated : f)));
    return updated;
  };

  const deleteFolder = async (id) => {
    await folderService.deleteFolder(id);
    setFolders((prev) => prev.filter((f) => f.id !== id));
  };

  // Tags
  const fetchTags = async () => {
    const data = await tagService.getTags();
    setTags(data);
  };

  const createTag = async (data) => {
    const newTag = await tagService.createTag(data);
    setTags((prev) => [...prev, newTag]);
    return newTag;
  };

  const deleteTag = async (id) => {
    await tagService.deleteTag(id);
    setTags((prev) => prev.filter((t) => t.id !== id));
  };

  // Computed values
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    if (filterTab === 'all') {
      result = result.filter((n) => !n.isDeleted && !n.isArchived);
    } else if (filterTab === 'favorites') {
      result = result.filter((n) => n.isFavorite && !n.isDeleted && !n.isArchived);
    } else if (filterTab === 'archived') {
      result = result.filter((n) => n.isArchived && !n.isDeleted);
    } else if (filterTab === 'recent') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      result = result.filter((n) => !n.isDeleted && !n.isArchived && new Date(n.updatedAt) >= sevenDaysAgo);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((n) =>
        n.title?.toLowerCase().includes(q) ||
        n.content?.toLowerCase().includes(q) ||
        n.tags?.some((t) => t.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'updatedAt') return new Date(b.updatedAt) - new Date(a.updatedAt);
      if (sortBy === 'createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      return 0;
    });

    return result;
  }, [notes, filterTab, searchQuery, sortBy]);

  const favoriteNotes = useMemo(() => notes.filter((n) => n.isFavorite && !n.isDeleted && !n.isArchived), [notes]);
  const archivedNotes = useMemo(() => notes.filter((n) => n.isArchived && !n.isDeleted), [notes]);
  const trashedNotes = useMemo(() => notes.filter((n) => n.isDeleted), [notes]);
  const recentNotes = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return notes.filter((n) => !n.isDeleted && !n.isArchived && new Date(n.updatedAt) >= sevenDaysAgo);
  }, [notes]);

  const getNotesByFolder = (folderId) => notes.filter((n) => n.folderId === folderId && !n.isDeleted);
  const getNotesByTag = (tagName) => notes.filter((n) => n.tags?.includes(tagName) && !n.isDeleted);
  const getNotesCount = () => notes.filter((n) => !n.isDeleted && !n.isArchived).length;
  const getFolderNotesCount = (folderId) => getNotesByFolder(folderId).filter((n) => !n.isArchived).length;

  return (
    <NotesContext.Provider
      value={{
        notes,
        folders,
        tags,
        currentNote,
        setCurrentNote,
        isLoading,
        error,
        viewMode,
        sortBy,
        filterTab,
        searchQuery,
        refreshNotes,
        fetchNote,
        createNote,
        updateNote,
        deleteNote,
        permanentlyDeleteNote,
        toggleFavorite,
        archiveNote,
        restoreNote,
        emptyTrash,
        setViewMode,
        setSortBy,
        setFilterTab,
        setSearchQuery,
        fetchFolders,
        createFolder,
        updateFolder,
        deleteFolder,
        fetchTags,
        createTag,
        deleteTag,
        filteredNotes,
        favoriteNotes,
        archivedNotes,
        trashedNotes,
        recentNotes,
        getNotesByFolder,
        getNotesByTag,
        getNotesCount,
        getFolderNotesCount,
      }}
    >
      {children}
    </NotesContext.Provider>
  );
};

export const useNotes = () => {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
};
