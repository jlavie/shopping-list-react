import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Search } from 'lucide-react';
import { useMenuStore } from './menuStore';
import { useRecipeStore } from '../recipes/recipeStore';
import { getStartOfWeek, getWeekDays, formatDate, formatDayName } from '../../utils/dateUtils';
import type { MealType } from '../../types';
import { useTranslation } from '../../i18n';
import { Modal } from '../../components/Modal';
import './WeekView.css';

export const WeekView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const { entries, addEntry, removeEntry } = useMenuStore();
    const { recipes } = useRecipeStore();
    const { t } = useTranslation();

    // État pour la modale d'ajout
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<{ date: string; type: MealType } | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const startOfWeek = getStartOfWeek(currentDate);
    const weekDays = getWeekDays(startOfWeek);

    const handlePrevWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() - 7);
        setCurrentDate(newDate);
    };

    const handleNextWeek = () => {
        const newDate = new Date(currentDate);
        newDate.setDate(newDate.getDate() + 7);
        setCurrentDate(newDate);
    };

    const openAddModal = (date: string, mealType: MealType) => {
        setSelectedSlot({ date, type: mealType });
        setSearchTerm('');
        setIsModalOpen(true);
    };

    const handleSelectRecipe = (recipeId: string, recipeName: string) => {
        if (selectedSlot) {
            addEntry({
                date: selectedSlot.date,
                mealType: selectedSlot.type,
                recipeId: recipeId,
                customLabel: recipeName
            });
            setIsModalOpen(false);
        }
    };

    const handleManualAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedSlot && searchTerm.trim()) {
            addEntry({
                date: selectedSlot.date,
                mealType: selectedSlot.type,
                customLabel: searchTerm.trim()
            });
            setIsModalOpen(false);
        }
    };

    const handleGenerateShoppingList = () => {
        if (confirm(t.shopping.generateConfirm)) {
            const start = getStartOfWeek(new Date());
            const end = new Date(start);
            end.setDate(end.getDate() + 6);

            import('../shopping/shoppingListStore').then(({ useShoppingListStore }) => {
                useShoppingListStore.getState().generateFromMenu(formatDate(start), formatDate(end));
                window.location.href = '/shopping';
            });
        }
    };

    const filteredRecipes = recipes.filter(r =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="week-view">
            <div className="week-view__header">
                <div className="week-view__controls">
                    <button onClick={handlePrevWeek} title={t.planner.prevWeek} className="week-view__nav-btn">
                        <ChevronLeft size={24} />
                    </button>
                    <h2 className="week-view__title">
                        {t.planner.weekOf} {startOfWeek.toLocaleDateString()}
                    </h2>
                    <button onClick={handleNextWeek} title={t.planner.nextWeek} className="week-view__nav-btn">
                        <ChevronRight size={24} />
                    </button>
                </div>

                <button
                    onClick={handleGenerateShoppingList}
                    className="week-view__generate-btn"
                >
                    {t.planner.actions.generateShoppingList}
                </button>
            </div>

            <div className="week-view__grid">
                {weekDays.map((day) => {
                    const dateStr = formatDate(day);
                    const dayEntries = entries.filter(e => e.date === dateStr);

                    return (
                        <div key={dateStr} className="week-view__day-card">
                            <h3 className="week-view__day-title">
                                {formatDayName(day)}
                            </h3>

                            <div className="week-view__slots">
                                {/* Midi */}
                                <MealSlot
                                    label={t.planner.meals.lunch}
                                    entry={dayEntries.find(e => e.mealType === 'lunch')}
                                    onAdd={() => openAddModal(dateStr, 'lunch')}
                                    onRemove={(id) => removeEntry(id)}
                                    addText={t.common.add}
                                    defaultRecipeText={t.planner.actions.defaultRecipe}
                                />

                                {/* Soir */}
                                <MealSlot
                                    label={t.planner.meals.dinner}
                                    entry={dayEntries.find(e => e.mealType === 'dinner')}
                                    onAdd={() => openAddModal(dateStr, 'dinner')}
                                    onRemove={(id) => removeEntry(id)}
                                    addText={t.common.add}
                                    defaultRecipeText={t.planner.actions.defaultRecipe}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={t.planner.actions.addMealPrompt}
            >
                <div className="week-view__modal-content">
                    <div className="week-view__search-container">
                        <Search size={20} className="week-view__search-icon" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher une recette ou saisir un plat..."
                            autoFocus
                            className="week-view__search-input"
                        />
                    </div>

                    {/* Liste des recettes filtrées */}
                    <div className="week-view__recipe-list">
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => handleSelectRecipe(recipe.id, recipe.title)}
                                    className="week-view__recipe-item"
                                >
                                    <div className="week-view__recipe-title">{recipe.title}</div>
                                    <div className="week-view__recipe-meta">
                                        {recipe.prepTime} min • {recipe.ingredients.length} ingrédients
                                    </div>
                                </button>
                            ))
                        ) : (
                            searchTerm && (
                                <button
                                    onClick={handleManualAdd}
                                    className="week-view__manual-add-btn"
                                >
                                    Ajouter "{searchTerm}" comme plat manuel
                                </button>
                            )
                        )}

                        {filteredRecipes.length === 0 && !searchTerm && (
                            <p className="week-view__empty-state">
                                Commencez à taper pour chercher une recette ou ajouter un plat.
                            </p>
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
};

interface MealSlotProps {
    label: string;
    entry?: { id: string; customLabel?: string; recipeId?: string };
    onAdd: () => void;
    onRemove: (id: string) => void;
    addText: string;
    defaultRecipeText: string;
}

const MealSlot: React.FC<MealSlotProps> = ({ label, entry, onAdd, onRemove, addText, defaultRecipeText }) => {
    return (
        <div className="meal-slot">
            <div className="meal-slot__label">
                {label}
            </div>

            {entry ? (
                <div className="meal-slot__content">
                    <span className="meal-slot__text">
                        {entry.customLabel || defaultRecipeText}
                    </span>
                    <button
                        onClick={() => onRemove(entry.id)}
                        className="meal-slot__remove-btn"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={onAdd}
                    className="meal-slot__add-btn"
                >
                    <Plus size={16} />
                    <span>{addText}</span>
                </button>
            )}
        </div>
    );
};
