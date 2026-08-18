import { mockFolders } from '../data/mockData';

let folders = [...mockFolders];

const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const folderService = {
  getFolders: async () => {
    await delay();
    return [...folders].sort((a, b) => a.name.localeCompare(b.name));
  },

  getFolder: async (id) => {
    await delay();
    const folder = folders.find(f => f.id === id);
    if (!folder) throw new Error('Folder not found');
    return { ...folder };
  },

  createFolder: async (data) => {
    await delay();
    const newFolder = {
      id: `f-${Date.now()}`,
      name: data.name || 'New Folder',
      color: data.color || '#3B82F6',
      createdAt: new Date().toISOString(),
    };
    folders = [...folders, newFolder];
    return { ...newFolder };
  },

  updateFolder: async (id, data) => {
    await delay();
    const index = folders.findIndex(f => f.id === id);
    if (index === -1) throw new Error('Folder not found');
    
    folders[index] = {
      ...folders[index],
      ...data,
    };
    return { ...folders[index] };
  },

  deleteFolder: async (id) => {
    await delay();
    folders = folders.filter(f => f.id !== id);
    return true;
  }
};

export default folderService;
