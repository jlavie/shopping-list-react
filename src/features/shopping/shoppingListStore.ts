import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Ingredient } from '../../types';
import { useMenuStore } from '../menu/menuStore';
import { useRecipeStore } from '../recipes/recipeStore';

interface ShoppingListState {
    items: Ingredient[];
    addItem: (item: Omit<Ingredient, 'id' | 'checked'>) => void;
    removeItem: (id: string) => void;
    toggleItem: (id: string) => void;
    generateFromMenu: (startDate: string, endDate: string) => void;
    clearList: () => void;
}

export const useShoppingListStore = create<ShoppingListState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (item) => set((state) => {
                // Vérifier si l'item existe déjà (même nom et même unité)
                const existingItemIndex = state.items.findIndex(
                    (i) => i.name.toLowerCase() === item.name.toLowerCase() && i.unit === item.unit
                );

                if (existingItemIndex >= 0) {
                    // Mise à jour de la quantité
                    const newItems = [...state.items];
                    newItems[existingItemIndex] = {
                        ...newItems[existingItemIndex],
                        quantity: newItems[existingItemIndex].quantity + item.quantity
                    };
                    return { items: newItems };
                }

                // Nouvel item
                return {
                    items: [...state.items, { ...item, id: crypto.randomUUID(), checked: false }]
                };
            }),
            removeItem: (id) => set((state) => ({
                items: state.items.filter((i) => i.id !== id)
            })),
            toggleItem: (id) => set((state) => ({
                items: state.items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
            })),
            clearList: () => set({ items: [] }),
            generateFromMenu: (startDate, endDate) => {
                const menuEntries = useMenuStore.getState().entries.filter(
                    (e) => e.date >= startDate && e.date <= endDate
                );
                const recipeStore = useRecipeStore.getState();

                // 1. Récupérer les items actuels (non générés)
                let currentItems = get().items.filter((i) => !i.generated);

                const newItems: Ingredient[] = [];

                menuEntries.forEach((entry) => {
                    if (entry.recipeId) {
                        // Si c'est une recette liée, on récupère ses ingrédients
                        const recipe = recipeStore.getRecipe(entry.recipeId);
                        if (recipe && recipe.ingredients) {
                            recipe.ingredients.forEach(ing => {
                                newItems.push({
                                    id: crypto.randomUUID(),
                                    name: ing.name,
                                    quantity: ing.quantity, // Idéalement multiplier par le nb de personnes si on gérait ça
                                    unit: ing.unit,
                                    checked: false,
                                    generated: true
                                });
                            });
                        }
                    } else {
                        // Sinon, comportement par défaut (placeholder)
                        newItems.push({
                            id: crypto.randomUUID(),
                            name: `Ingrédient pour ${entry.customLabel || 'Recette'}`,
                            quantity: 1,
                            unit: 'unité',
                            checked: false,
                            generated: true
                        });
                    }
                });

                // On utilise la logique d'agrégation pour fusionner les nouveaux items avec les manuels restants
                const finalItems = [...currentItems];

                newItems.forEach(newItem => {
                    const existingIndex = finalItems.findIndex(
                        (i) => i.name.toLowerCase() === newItem.name.toLowerCase() && i.unit === newItem.unit
                    );

                    if (existingIndex >= 0) {
                        finalItems[existingIndex] = {
                            ...finalItems[existingIndex],
                            quantity: finalItems[existingIndex].quantity + newItem.quantity
                        };
                    } else {
                        finalItems.push(newItem);
                    }
                });

                set({ items: finalItems });
            }
        }),
        {
            name: 'shopping-list-storage',
        }
    )
);
