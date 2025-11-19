import { create } from 'zustand';

export const translations = {
    fr: {
        common: {
            add: 'Ajouter',
            delete: 'Supprimer',
            cancel: 'Annuler',
            save: 'Enregistrer',
            edit: 'Modifier',
            confirm: 'Confirmer',
        },
        layout: {
            title: 'MealPlanner',
            nav: {
                home: 'Accueil',
                planner: 'Planning',
                shopping: 'Courses',
                recipes: 'Recettes',
            },
            footer: 'MealPlanner',
        },
        home: {
            welcome: 'Bienvenue sur MealPlanner',
            subtitle: 'Votre assistant pour planifier vos repas et générer vos courses simplement.',
            start: {
                title: 'Commencer',
                desc: 'Les fonctionnalités de planning sont disponibles via le menu.',
            }
        },
        planner: {
            title: 'Mon Planning',
            weekOf: 'Semaine du',
            prevWeek: 'Semaine précédente',
            nextWeek: 'Semaine suivante',
            meals: {
                lunch: 'Midi',
                dinner: 'Soir',
            },
            actions: {
                addMealPrompt: 'Entrez le nom du repas :',
                defaultRecipe: 'Recette',
                generateShoppingList: 'Générer la liste de courses',
            }
        },
        shopping: {
            title: 'Liste de Courses',
            generate: 'Générer',
            generateConfirm: 'Cela va ajouter les ingrédients des menus de la semaine à votre liste. Continuer ?',
            clear: 'Vider la liste',
            clearConfirm: 'Voulez-vous vraiment vider la liste ?',
            empty: 'Votre liste est vide.',
            addItemPlaceholder: 'Ajouter un article...',
        },
        recipes: {
            title: 'Mes Recettes',
            add: 'Nouvelle Recette',
            empty: 'Aucune recette pour le moment.',
            time: 'Temps',
            servings: 'Pers.',
            ingredients: 'Ingrédients',
            steps: 'Étapes',
            form: {
                titlePlaceholder: 'Nom de la recette',
                prepTime: 'Temps de préparation (min)',
                servings: 'Nombre de personnes',
                addIngredient: 'Ajouter un ingrédient',
                addStep: 'Ajouter une étape',
                stepPlaceholder: 'Description de l\'étape...',
            }
        },
        products: {
            title: 'Mes Ingrédients',
            add: 'Nouvel Ingrédient',
            empty: 'Aucun ingrédient créé.',
            form: {
                namePlaceholder: 'Nom de l\'ingrédient (ex: Farine)',
                unitPlaceholder: 'Unité par défaut',
            }
        }
    }
};

export type Language = keyof typeof translations;


interface LanguageState {
    language: Language;
    setLanguage: (lang: Language) => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
    language: 'fr',
    setLanguage: (lang) => set({ language: lang }),
}));

export const useTranslation = () => {
    const { language, setLanguage } = useLanguageStore();
    return { t: translations[language], language, setLanguage };
};
