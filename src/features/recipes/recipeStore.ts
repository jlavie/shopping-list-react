import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Recipe } from '../../types';

interface RecipeState {
    recipes: Recipe[];
    addRecipe: (recipe: Omit<Recipe, 'id'>) => void;
    updateRecipe: (id: string, recipe: Partial<Recipe>) => void;
    removeRecipe: (id: string) => void;
    getRecipe: (id: string) => Recipe | undefined;
}

export const useRecipeStore = create<RecipeState>()(
    persist(
        (set, get) => ({
            recipes: [],
            addRecipe: (recipe) => set((state) => ({
                recipes: [...state.recipes, { ...recipe, id: crypto.randomUUID() }]
            })),
            updateRecipe: (id, updatedRecipe) => set((state) => ({
                recipes: state.recipes.map((r) => (r.id === id ? { ...r, ...updatedRecipe } : r))
            })),
            removeRecipe: (id) => set((state) => ({
                recipes: state.recipes.filter((r) => r.id !== id)
            })),
            getRecipe: (id) => get().recipes.find((r) => r.id === id),
        }),
        {
            name: 'recipe-storage',
        }
    )
);
