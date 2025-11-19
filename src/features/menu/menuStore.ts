import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuEntry } from '../../types';

interface MenuState {
    entries: MenuEntry[];
    addEntry: (entry: Omit<MenuEntry, 'id'>) => void;
    removeEntry: (id: string) => void;
    updateEntry: (id: string, updates: Partial<MenuEntry>) => void;
    getEntriesForDate: (date: string) => MenuEntry[];
}

export const useMenuStore = create<MenuState>()(
    persist(
        (set, get) => ({
            entries: [],
            addEntry: (entry) => set((state) => ({
                entries: [...state.entries, { ...entry, id: crypto.randomUUID() }]
            })),
            removeEntry: (id) => set((state) => ({
                entries: state.entries.filter((e) => e.id !== id)
            })),
            updateEntry: (id, updates) => set((state) => ({
                entries: state.entries.map((e) => (e.id === id ? { ...e, ...updates } : e))
            })),
            getEntriesForDate: (date) => {
                return get().entries.filter((e) => e.date === date);
            }
        }),
        {
            name: 'meal-planner-storage',
        }
    )
);
