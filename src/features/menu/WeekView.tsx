import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Search } from 'lucide-react';
import { useMenuStore } from './menuStore';
import { useRecipeStore } from '../recipes/recipeStore';
import { getStartOfWeek, getWeekDays, formatDate, formatDayName } from '../../utils/dateUtils';
import type { MealType } from '../../types';
import { useTranslation } from '../../i18n';
import { Modal } from '../../components/Modal';

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
                customLabel: recipeName // On garde le nom pour l'affichage rapide
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
        <div>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--space-6)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                    <button onClick={handlePrevWeek} title={t.planner.prevWeek} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ChevronLeft size={24} />
                    </button>
                    <h2 style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)' }}>
                        {t.planner.weekOf} {startOfWeek.toLocaleDateString()}
                    </h2>
                    <button onClick={handleNextWeek} title={t.planner.nextWeek} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                        <ChevronRight size={24} />
                    </button>
                </div>

                <button
                    onClick={handleGenerateShoppingList}
                    style={{
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: 'var(--radius-md)',
                        padding: 'var(--space-2) var(--space-4)',
                        cursor: 'pointer',
                        fontWeight: 'var(--font-weight-medium)',
                        fontSize: 'var(--text-sm)'
                    }}
                >
                    {t.planner.actions.generateShoppingList}
                </button>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: 'var(--space-4)'
            }}>
                {weekDays.map((day) => {
                    const dateStr = formatDate(day);
                    const dayEntries = entries.filter(e => e.date === dateStr);

                    return (
                        <div key={dateStr} style={{
                            backgroundColor: 'var(--bg-card)',
                            borderRadius: 'var(--radius-md)',
                            padding: 'var(--space-4)',
                            boxShadow: 'var(--shadow-sm)',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{
                                textTransform: 'capitalize',
                                marginBottom: 'var(--space-4)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--primary)'
                            }}>
                                {formatDayName(day)}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
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
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                    <div style={{ position: 'relative' }}>
                        <Search size={20} style={{ position: 'absolute', left: 'var(--space-3)', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Rechercher une recette ou saisir un plat..."
                            autoFocus
                            style={{
                                width: '100%',
                                padding: 'var(--space-3) var(--space-3) var(--space-3) var(--space-10)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-color)',
                                fontSize: 'var(--text-base)'
                            }}
                        />
                    </div>

                    {/* Liste des recettes filtrées */}
                    <div style={{ maxHeight: '300px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                        {filteredRecipes.length > 0 ? (
                            filteredRecipes.map(recipe => (
                                <button
                                    key={recipe.id}
                                    onClick={() => handleSelectRecipe(recipe.id, recipe.title)}
                                    style={{
                                        textAlign: 'left',
                                        padding: 'var(--space-3)',
                                        backgroundColor: 'var(--bg-main)',
                                        border: '1px solid var(--border-color)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 'var(--font-weight-medium)' }}>{recipe.title}</div>
                                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--text-muted)' }}>
                                        {recipe.prepTime} min • {recipe.ingredients.length} ingrédients
                                    </div>
                                </button>
                            ))
                        ) : (
                            searchTerm && (
                                <button
                                    onClick={handleManualAdd}
                                    style={{
                                        textAlign: 'left',
                                        padding: 'var(--space-3)',
                                        backgroundColor: 'var(--primary-light)',
                                        color: 'var(--primary-dark)',
                                        border: '1px dashed var(--primary)',
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Ajouter "{searchTerm}" comme plat manuel
                                </button>
                            )
                        )}

                        {filteredRecipes.length === 0 && !searchTerm && (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 'var(--space-4)' }}>
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
    // ... (Reste inchangé, mais je le réécris pour être sûr)
    return (
        <div style={{
            backgroundColor: 'var(--color-slate-50)',
            padding: 'var(--space-3)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--color-slate-300)'
        }}>
            <div style={{
                fontSize: 'var(--text-xs)',
                color: 'var(--text-muted)',
                marginBottom: 'var(--space-1)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
            }}>
                {label}
            </div>

            {entry ? (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 'var(--font-weight-medium)' }}>
                        {entry.customLabel || defaultRecipeText}
                    </span>
                    <button
                        onClick={() => onRemove(entry.id)}
                        style={{
                            color: 'var(--color-danger-500)',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 'var(--space-1)'
                        }}
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ) : (
                <button
                    onClick={onAdd}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--space-1)',
                        color: 'var(--primary)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: 'var(--text-sm)',
                        padding: 0
                    }}
                >
                    <Plus size={16} />
                    <span>{addText}</span>
                </button>
            )}
        </div>
    );
};
