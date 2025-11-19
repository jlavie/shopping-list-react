export type MealType = 'lunch' | 'dinner';

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
    unit: string;
    category?: string;
    checked: boolean;
    generated?: boolean;
}

export interface Recipe {
    id: string;
    title: string;
    ingredients: Ingredient[];
    steps?: string[];
    prepTime?: number; // en minutes
    servings?: number;
}

export interface MenuEntry {
    id: string;
    date: string; // ISO string YYYY-MM-DD
    mealType: MealType;
    recipeId?: string;
    customLabel?: string; // Pour un repas sans recette liée (ex: "Resto")
}
