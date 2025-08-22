import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type Book = {
  id: string;
  title: string;
  coverEmoji?: string;
  updatedAt: number;
  sourceCount: number;
  archived?: boolean;
};

export type Episode = { id: string; title: string; content: string; createdAt: number };
export type Material = { id: string; title: string; content: string; createdAt: number };
export type ChatMessage = { id: string; role: 'user'|'assistant'; content: string; ts: number };

export type SortOrder = 'newest'|'oldest'|'title-asc'|'title-desc';
export type ViewMode = 'grid'|'list';

export type UIState = {
  leftTab: 'manage'|'chat';
  rightTab: 'dict'|'material';
  rightSubTab: 'upload'|'chat';
};

export interface AppState {
  ui: UIState;
  activeSourceIds: string[];
  activeMaterialIds: string[];
  books: Book[];
  episodes: Episode[];
  materials: Material[];
  sortOrder: SortOrder;
  viewMode: ViewMode;
  query: string;

  setUI: (patch: Partial<UIState>) => void;
  setQuery: (q: string) => void;
  setSortOrder: (o: SortOrder) => void;
  setViewMode: (m: ViewMode) => void;

  ensureSeedBooks: () => void;
  addBook: (title: string) => Book;
  updateBook: (id: string, patch: Partial<Book>) => void;
  deleteBook: (id: string) => void;

  addEpisode: (title: string, content: string) => Episode;
  deleteEpisode: (id: string) => void;
  setActiveSources: (ids: string[]) => void;

  addMaterial: (title: string, content: string) => Material;
  deleteMaterial: (id: string) => void;
  setActiveMaterials: (ids: string[]) => void;
}

function generateSeedBooks(): Book[] {
  const now = Date.now();
  const days60 = 60 * 24 * 60 * 60 * 1000;
  const books: Book[] = [];
  for (let i = 0; i < 12; i++) {
    const updatedAt = now - Math.floor(Math.random() * days60);
    const sourceCount = 1 + Math.floor(Math.random() * 3);
    books.push({
      id: crypto.randomUUID?.() || `${now}-${i}`,
      title: `サンプルブック ${i + 1}`,
      coverEmoji: ['📘','📙','📗','📕','📒','📚'][i % 6],
      updatedAt,
      sourceCount,
    });
  }
  books.sort((a,b)=> b.updatedAt - a.updatedAt);
  return books;
}

export const useAppStore = create<AppState>()(persist((set, get) => ({
  ui: { leftTab: 'manage', rightTab: 'dict', rightSubTab: 'upload' },
  activeSourceIds: [],
  activeMaterialIds: [],
  books: [],
  episodes: [],
  materials: [],
  sortOrder: 'newest',
  viewMode: 'grid',
  query: '',

  setUI: (patch) => set(state => ({ ui: { ...state.ui, ...patch } })),
  setQuery: (q) => set({ query: q }),
  setSortOrder: (o) => set({ sortOrder: o }),
  setViewMode: (m) => set({ viewMode: m }),

  ensureSeedBooks: () => {
    const books = get().books;
    if (!books || books.length === 0) {
      set({ books: generateSeedBooks() });
    }
  },

  addBook: (title) => {
    const book: Book = {
      id: crypto.randomUUID?.() || String(Date.now()),
      title: title || '新しいブック',
      coverEmoji: '📘',
      updatedAt: Date.now(),
      sourceCount: 0,
    };
    set(state => ({ books: [book, ...state.books] }));
    return book;
  },

  updateBook: (id, patch) => set(state => ({
    books: state.books.map(b => b.id === id ? { ...b, ...patch, updatedAt: patch.updatedAt ?? Date.now() } : b)
  })),

  deleteBook: (id) => set(state => ({ books: state.books.filter(b => b.id !== id) })),

  addEpisode: (title, content) => {
    const e: Episode = { id: crypto.randomUUID?.() || String(Date.now()), title, content, createdAt: Date.now() };
    set(state => ({ episodes: [e, ...state.episodes] }));
    return e;
  },
  deleteEpisode: (id) => set(state => ({ episodes: state.episodes.filter(e=> e.id!==id) })),
  setActiveSources: (ids) => set({ activeSourceIds: ids }),

  addMaterial: (title, content) => {
    const m: Material = { id: crypto.randomUUID?.() || String(Date.now()), title, content, createdAt: Date.now() };
    set(state => ({ materials: [m, ...state.materials] }));
    return m;
  },
  deleteMaterial: (id) => set(state => ({ materials: state.materials.filter(m=> m.id!==id) })),
  setActiveMaterials: (ids) => set({ activeMaterialIds: ids }),

}), {
  name: 'app-store',
  storage: createJSONStorage(() => localStorage),
})); 