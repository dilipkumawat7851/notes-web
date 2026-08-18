import { mockNotes } from '../data/mockData';

// In-memory store
let notes = [...mockNotes];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const notesService = {
  getNotes: async (filters = {}) => {
    await delay();
    let filtered = [...notes];
    
    // Filter by isDeleted
    if (filters.isDeleted !== undefined) {
      filtered = filtered.filter(n => n.isDeleted === filters.isDeleted);
    } else {
      // By default, don't show deleted notes
      filtered = filtered.filter(n => !n.isDeleted);
    }
    
    // Filter by isArchived
    if (filters.isArchived !== undefined) {
      filtered = filtered.filter(n => n.isArchived === filters.isArchived);
    } else if (filters.isDeleted === undefined || !filters.isDeleted) {
      // By default, don't show archived notes unless explicitly requested or viewing trash
      filtered = filtered.filter(n => !n.isArchived);
    }

    // Filter by favorite
    if (filters.isFavorite) {
      filtered = filtered.filter(n => n.isFavorite);
    }

    // Filter by folder
    if (filters.folderId) {
      filtered = filtered.filter(n => n.folderId === filters.folderId);
    }

    // Filter by tag
    if (filters.tagId) {
      filtered = filtered.filter(n => n.tags.includes(filters.tagId));
    }

    // Search query
    if (filters.query) {
      const q = filters.query.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(q) || 
        n.content.toLowerCase().includes(q)
      );
    }

    // Sort
    if (filters.sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
    } else {
      // Default: newest first
      filtered.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    return filtered;
  },

  getNote: async (id) => {
    await delay();
    const note = notes.find(n => n.id === id);
    if (!note) throw new Error('Note not found');
    return { ...note };
  },

  createNote: async (data) => {
    await delay();
    const newNote = {
      id: `n-${Date.now()}`,
      title: data.title || 'Untitled Note',
      content: data.content || '',
      tags: data.tags || [],
      folderId: data.folderId || null,
      isFavorite: data.isFavorite || false,
      isArchived: false,
      isDeleted: false,
      color: data.color || 'default',
      reminderAt: data.reminderAt || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    notes = [newNote, ...notes];
    return { ...newNote };
  },

  updateNote: async (id, data) => {
    await delay();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    const updatedNote = {
      ...notes[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    notes[index] = updatedNote;
    return { ...updatedNote };
  },

  deleteNote: async (id) => {
    await delay();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    notes[index] = {
      ...notes[index],
      isDeleted: true,
      updatedAt: new Date().toISOString(),
    };
    return { ...notes[index] };
  },

  permanentlyDeleteNote: async (id) => {
    await delay();
    notes = notes.filter(n => n.id !== id);
    return true;
  },

  favoriteNote: async (id) => {
    await delay();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    notes[index] = {
      ...notes[index],
      isFavorite: !notes[index].isFavorite,
      updatedAt: new Date().toISOString(),
    };
    return { ...notes[index] };
  },

  archiveNote: async (id) => {
    await delay();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    notes[index] = {
      ...notes[index],
      isArchived: true,
      isDeleted: false,
      updatedAt: new Date().toISOString(),
    };
    return { ...notes[index] };
  },

  restoreNote: async (id) => {
    await delay();
    const index = notes.findIndex(n => n.id === id);
    if (index === -1) throw new Error('Note not found');
    
    notes[index] = {
      ...notes[index],
      isDeleted: false,
      isArchived: false,
      updatedAt: new Date().toISOString(),
    };
    return { ...notes[index] };
  },

  searchNotes: async (query) => {
    await delay(400);
    if (!query) return [];
    const q = query.toLowerCase();
    return notes.filter(n => 
      !n.isDeleted && 
      (n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q))
    ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }
};

export default notesService;
