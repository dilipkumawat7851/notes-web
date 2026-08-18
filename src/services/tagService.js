import { mockTags } from '../data/mockData';

let tags = [...mockTags];

const delay = (ms = 200) => new Promise(resolve => setTimeout(resolve, ms));

export const tagService = {
  getTags: async () => {
    await delay();
    return [...tags].sort((a, b) => a.name.localeCompare(b.name));
  },

  createTag: async (data) => {
    await delay();
    const newTag = {
      id: `t-${Date.now()}`,
      name: data.name,
      color: data.color || '#3B82F6',
    };
    tags = [...tags, newTag];
    return { ...newTag };
  },

  deleteTag: async (id) => {
    await delay();
    tags = tags.filter(t => t.id !== id);
    return true;
  }
};

export default tagService;
